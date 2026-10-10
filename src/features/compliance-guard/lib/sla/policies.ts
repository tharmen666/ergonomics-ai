import type { AgentNudge, Classification, IncidentId, ISODateString, RiskBand, SlaClock, SlaPolicy, SlaStage } from "@/lib/types";
import { addMinutes } from "@/lib/utils/core";

const H = 60;
const D = 24 * H;

/**
 * Pre-V&V SLA policies: realistic, measurable targets replace open-ended GM sign-off loops.
 * Tune per tenant; these defaults reflect SA retail/QSR operating realities.
 */
export const SLA_POLICIES: Record<RiskBand, SlaPolicy> = {
  critical: {
    band: "critical",
    targetsMinutes: { acknowledge: 15, contain: 1 * H, investigate: 24 * H, validate: 4 * H, capa_complete: 7 * D, verify_effectiveness: 30 * D },
    escalation: ["site_manager", "safety_officer", "general_manager", "owner"],
  },
  high: {
    band: "high",
    targetsMinutes: { acknowledge: 1 * H, contain: 4 * H, investigate: 72 * H, validate: 24 * H, capa_complete: 14 * D, verify_effectiveness: 60 * D },
    escalation: ["site_manager", "safety_officer", "general_manager"],
  },
  medium: {
    band: "medium",
    targetsMinutes: { acknowledge: 8 * H, contain: 24 * H, investigate: 7 * D, validate: 3 * D, capa_complete: 30 * D, verify_effectiveness: 90 * D },
    escalation: ["site_manager", "safety_officer"],
  },
  low: {
    // Low-risk items batch into the safety officer's 1–2× weekly review feed.
    band: "low",
    targetsMinutes: { acknowledge: 3 * D, contain: 3 * D, investigate: 14 * D, validate: 7 * D, capa_complete: 60 * D, verify_effectiveness: 90 * D },
    escalation: ["site_manager"],
  },
};

export interface SlaPlan {
  clocks: SlaClock[];
  nudges: AgentNudge[];
}

/** Builds the stage clocks and first-wave agent nudges for a freshly triaged incident. */
export function planSla(incidentId: IncidentId, band: RiskBand, classification: Classification, now: ISODateString): SlaPlan {
  const policy = SLA_POLICIES[band];
  const stages: SlaStage[] = ["acknowledge", "contain", "investigate", "validate", "capa_complete", "verify_effectiveness"];
  let cursor: string = now;
  const clocks = stages.map((stage) => {
    const startedAt = cursor as ISODateString;
    const dueAt = addMinutes(startedAt, policy.targetsMinutes[stage]);
    cursor = stage === "acknowledge" || stage === "contain" ? now : dueAt; // ack/contain run in parallel from t0
    return { incidentId, stage, startedAt, dueAt, breached: false, escalationLevel: 0 };
  });

  const nudges: AgentNudge[] = [{
    incidentId, toRole: policy.escalation[0], channel: band === "critical" || band === "high" ? "whatsapp" : "push",
    message: `${band.toUpperCase()} risk event logged. Acknowledge and confirm containment by ${new Date(clocks[1].dueAt).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}.`,
    dueAt: clocks[0].dueAt,
  }];
  if (classification.reportableToDEL) {
    nudges.push({
      incidentId, toRole: "safety_officer", channel: "sms",
      message: "OHS Act s24 reportable incident: notify the DEL Provincial Inspector immediately and submit Annexure 1 within 7 days. Preserve the scene.",
      dueAt: addMinutes(now, 60),
    });
  }
  if (classification.coidaClaimRequired) {
    nudges.push({
      incidentId, toRole: "safety_officer", channel: "email",
      message: "COIDA: submit Employer's Report of Accident (W.Cl.2) within 7 days via CompEasy.",
      dueAt: addMinutes(now, 7 * D),
    });
  }
  return { clocks, nudges };
}
