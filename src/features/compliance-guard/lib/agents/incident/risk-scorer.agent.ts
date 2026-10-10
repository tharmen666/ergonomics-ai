import type { Classification, HazardCategory, IncidentClass, Likelihood, ParsedIncident, RiskBand, RiskScore, Severity } from "@/lib/types";
import { clamp } from "@/lib/utils/core";
import { defineAgent } from "../core/agent";

export interface RiskScorerInput {
  classification: Classification;
  parsed: ParsedIncident;
  /** Similar incidents at the same site in the rolling window (drives likelihood). */
  recurrenceCount: number;
}

const CLASS_SEVERITY: Record<IncidentClass, Severity> = {
  near_miss: 2, unsafe_act: 2, unsafe_condition: 2, first_aid: 2, medical_treatment: 3,
  lost_time_injury: 4, property_damage: 2, environmental: 3, quality_nonconformance: 2,
  food_safety: 3, dangerous_occurrence: 5,
};

/** Near-misses are scored on *potential* severity — the core of a proactive NMI culture. */
const HAZARD_POTENTIAL: Partial<Record<HazardCategory, Severity>> = {
  vehicle_forklift: 5, electrical: 5, machinery: 4, fire: 5, violence_robbery: 4, chemical: 4, burn_scald: 3,
};

export function band(rating: number): RiskBand {
  if (rating >= 15) return "critical";
  if (rating >= 10) return "high";
  if (rating >= 5) return "medium";
  return "low";
}

/**
 * Deterministic 5×5 risk matrix. Intentionally NOT LLM-driven: risk ratings drive
 * statutory escalation and must be reproducible and auditable.
 */
export const riskScorerAgent = defineAgent<RiskScorerInput, RiskScore>({
  name: "risk_scorer",
  heuristic({ classification, parsed, recurrenceCount }) {
    const potential = Math.max(0, ...classification.hazards.map((h) => HAZARD_POTENTIAL[h] ?? 0));
    let severity = CLASS_SEVERITY[classification.incidentClass];
    if (["near_miss", "unsafe_act", "unsafe_condition"].includes(classification.incidentClass)) {
      severity = Math.max(severity, potential) as Severity;
    }
    if (classification.reportableToDEL) severity = Math.max(severity, 4) as Severity;
    if (parsed.injuries.length > 1) severity = clamp(severity + 1, 1, 5) as Severity;

    const likelihood = clamp(2 + Math.min(recurrenceCount, 3), 1, 5) as Likelihood;
    const rating = severity * likelihood;
    return {
      value: { severity, likelihood, rating, band: band(rating) },
      confidence: 0.95,
      note: `S${severity}×L${likelihood}=${rating} (recurrence ${recurrenceCount})`,
    };
  },
});
