import { z } from "zod";
import type { CapaId, Classification, ControlLevel, CorrectiveAction, RiskScore, RootCauseAnalysis, ISODateString } from "@/lib/types";
import { newId } from "@/lib/utils/core";
import { defineAgent } from "../core/agent";
import { HAZARD_PLAYBOOKS } from "../knowledge/hazard-playbooks";

export interface CapaInput {
  classification: Classification;
  risk: RiskScore;
  rca: RootCauseAnalysis;
  now: ISODateString;
}

/** ISO 45001 8.1.2 hierarchy — lower index = more effective. */
export const CONTROL_ORDER: ControlLevel[] = ["elimination", "substitution", "engineering", "administrative", "ppe"];
const DUE_DAYS = { critical: 7, high: 14, medium: 30, low: 60 } as const;

const CapaSchema = z.object({
  actions: z.array(z.object({
    type: z.enum(["corrective", "preventive"]),
    description: z.string(),
    controlLevel: z.enum(["elimination", "substitution", "engineering", "administrative", "ppe"]),
    ownerRole: z.enum(["site_manager", "general_manager", "safety_officer", "maintenance", "hr"]),
    dueInDays: z.number().int().min(1).max(180),
    verification: z.string().describe("Measurable effectiveness criterion with a number and timeframe"),
  })).min(1).max(5),
  confidence: z.number().min(0).max(1),
});

const SYSTEM = `You are the CAPA Planner agent of ComplianceGuard AI.
Generate corrective & preventive actions that directly address the ROOT cause, ranked by the hierarchy of controls (ISO 45001 8.1.2).
Rules: at least one action must be above 'administrative'; PPE never stands alone; every action has a measurable verification criterion (number + timeframe) for the V&V stage; be practical for SA retail/QSR/pharmacy budgets.`;

const dueAt = (now: string, days: number) => new Date(new Date(now).getTime() + days * 86_400_000).toISOString() as ISODateString;

function rank(actions: CorrectiveAction[]): CorrectiveAction[] {
  return actions.sort((a, b) => CONTROL_ORDER.indexOf(a.controlLevel) - CONTROL_ORDER.indexOf(b.controlLevel));
}

export const capaPlannerAgent = defineAgent<CapaInput, CorrectiveAction[]>({
  name: "capa_planner",

  async llm({ classification, risk, rca, now }, ctx) {
    const out = await ctx.llm.generateJson({
      system: SYSTEM,
      schema: CapaSchema,
      prompt: `Risk: ${risk.band} (${risk.rating}); default first-action due within ${DUE_DAYS[risk.band]} days.
Hazards: ${classification.hazards.join(", ")}
Root cause: ${rca.rootCause}
Underlying: ${rca.underlyingCauses.join("; ")}
Fishbone: ${JSON.stringify(rca.fishbone)}`,
    });
    const actions = out.actions.map((a) => ({
      id: newId<CapaId>("capa"),
      type: a.type,
      description: a.description,
      controlLevel: a.controlLevel,
      ownerRole: a.ownerRole,
      dueAt: dueAt(now, a.dueInDays),
      verification: a.verification,
      status: "proposed" as const,
    }));
    return { value: rank(actions), confidence: out.confidence, note: `${actions.length} actions` };
  },

  heuristic({ classification, risk, now }) {
    const base = DUE_DAYS[risk.band];
    const seen = new Set<string>();
    const actions: CorrectiveAction[] = [];
    for (const h of classification.hazards) {
      for (const c of HAZARD_PLAYBOOKS[h].capas) {
        if (seen.has(c.description)) continue;
        seen.add(c.description);
        const order = CONTROL_ORDER.indexOf(c.controlLevel);
        actions.push({
          id: newId<CapaId>("capa"),
          type: order <= 2 ? "preventive" : "corrective",
          description: c.description,
          controlLevel: c.controlLevel,
          ownerRole: c.ownerRole,
          // Higher-order controls take longer to implement; admin/PPE fast-tracked as interim measures.
          dueAt: dueAt(now, order <= 2 ? base * 2 : base),
          verification: c.verification,
          status: "proposed",
        });
      }
    }
    return { value: rank(actions).slice(0, 5), confidence: 0.65, note: `${actions.length} playbook actions` };
  },
});
