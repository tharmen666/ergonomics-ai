import { z } from "zod";
import type { Classification, HazardCategory, IncidentClass, ParsedIncident } from "@/lib/types";
import { defineAgent } from "../core/agent";
import { HAZARD_PLAYBOOKS } from "../knowledge/hazard-playbooks";

export interface ClassifierInput {
  narrative: string;
  parsed: ParsedIncident;
}

const INCIDENT_CLASSES = [
  "near_miss", "unsafe_act", "unsafe_condition", "first_aid", "medical_treatment", "lost_time_injury",
  "property_damage", "environmental", "quality_nonconformance", "food_safety", "dangerous_occurrence",
] as const satisfies readonly IncidentClass[];

const HAZARDS = Object.keys(HAZARD_PLAYBOOKS) as [HazardCategory, ...HazardCategory[]];

const ClassificationSchema = z.object({
  incidentClass: z.enum(INCIDENT_CLASSES),
  hazards: z.array(z.enum(HAZARDS)).min(1).max(3),
  reportableToDEL: z.boolean(),
  coidaClaimRequired: z.boolean(),
  confidence: z.number().min(0).max(1),
});

const SYSTEM = `You are the Classifier agent of ComplianceGuard AI (South Africa).
Classify incidents per ISO 45001 and SA law:
- reportableToDEL = true if OHS Act s24 / General Administrative Regulation 8 applies (death, unconsciousness, loss of limb/part, hospitalisation, >14 days off, or a dangerous occurrence such as explosion, structural collapse, uncontrolled release).
- coidaClaimRequired = true for medical treatment or lost-time injuries (COIDA W.Cl.2).
- near_miss = no injury/damage but credible potential. Order hazards by relevance.`;

const SEVERE_RX = /\b(unconscious|amputat|fractur|broken bone|hospital(?:ised|ized)?|died|fatal|passed away|admitted)\b/;
const DANGEROUS_RX = /\b(explosion|exploded|collapse|gas leak|ammonia|uncontrolled release|structural failure)\b/;

export function detectHazards(text: string): HazardCategory[] {
  const lower = text.toLowerCase();
  const scored = Object.values(HAZARD_PLAYBOOKS)
    .map((p) => ({ h: p.hazard, s: p.keywords.reduce((n, k) => n + (lower.includes(k) ? 1 : 0), 0) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x) => x.h);
  return scored.length ? scored : ["other"];
}

export const classifierAgent = defineAgent<ClassifierInput, Classification>({
  name: "classifier",

  async llm({ narrative, parsed }, ctx) {
    const value = await ctx.llm.generateJson({
      system: SYSTEM,
      schema: ClassificationSchema,
      prompt: `Narrative:\n"""${narrative}"""\n\nExtracted:\n${JSON.stringify({ injuries: parsed.injuries, equipment: parsed.equipment, immediateActions: parsed.immediateActions })}`,
    });
    return { value, confidence: value.confidence };
  },

  heuristic({ narrative, parsed }) {
    const lower = narrative.toLowerCase();
    const hazards = detectHazards(lower);
    const injured = parsed.injuries.length > 0;
    const nearMiss = /\b(almost|nearly|could have|near miss|narrowly|close call)\b/.test(lower);

    let incidentClass: IncidentClass;
    if (DANGEROUS_RX.test(lower)) incidentClass = "dangerous_occurrence";
    else if (injured && (SEVERE_RX.test(lower) || /\b(booked off|days off|sick note|couldn'?t return)\b/.test(lower))) incidentClass = "lost_time_injury";
    else if (injured && /\b(doctor|clinic|stitches|x-ray|casualty|medical)\b/.test(lower)) incidentClass = "medical_treatment";
    else if (injured) incidentClass = "first_aid";
    else if (hazards.includes("biological") && /\b(food|fridge|freezer|temperature|allergen)\b/.test(lower)) incidentClass = "food_safety";
    else if (hazards.includes("product_quality")) incidentClass = "quality_nonconformance";
    else if (/\b(drain|stormwater|environment|soil)\b/.test(lower)) incidentClass = "environmental";
    else if (nearMiss) incidentClass = "near_miss";
    else if (/\b(damaged|broke|smashed|dented)\b/.test(lower)) incidentClass = "property_damage";
    else if (/\b(not wearing|ignored|bypassed|without (?:gloves|ppe)|running)\b/.test(lower)) incidentClass = "unsafe_act";
    else incidentClass = "unsafe_condition";

    const reportableToDEL = incidentClass === "dangerous_occurrence" || (injured && SEVERE_RX.test(lower));
    const coidaClaimRequired = incidentClass === "medical_treatment" || incidentClass === "lost_time_injury";

    return {
      value: { incidentClass, hazards, reportableToDEL, coidaClaimRequired, confidence: 0 },
      confidence: hazards[0] === "other" ? 0.45 : 0.72,
      note: `${incidentClass} / ${hazards.join(",")}`,
    };
  },
});
