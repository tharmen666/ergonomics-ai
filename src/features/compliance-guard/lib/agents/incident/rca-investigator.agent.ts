import { z } from "zod";
import type { CauseCategory, Classification, ParsedIncident, RiskScore, RootCauseAnalysis } from "@/lib/types";
import type { ScoredChunk } from "@/lib/db/repository";
import { defineAgent } from "../core/agent";
import { HAZARD_PLAYBOOKS } from "../knowledge/hazard-playbooks";

export interface RcaInput {
  parsed: ParsedIncident;
  classification: Classification;
  risk: RiskScore;
  /** Retrieved SOP chunks (RAG) — lets the RCA cite the client's own procedures. */
  sopContext: ScoredChunk[];
  /** Feedback from the critic agent on a previous attempt. */
  critique?: string[];
}

const CATS = ["people", "method", "machine", "material", "environment", "management"] as const satisfies readonly CauseCategory[];

const RcaSchema = z.object({
  whys: z.array(z.object({
    level: z.number().int().min(1).max(5),
    question: z.string(),
    answer: z.string(),
    evidence: z.array(z.string()).describe("Verbatim facts or SOP excerpts supporting this answer"),
  })).min(3).max(5),
  fishbone: z.object(Object.fromEntries(CATS.map((c) => [c, z.array(z.string()).max(5)])) as Record<CauseCategory, z.ZodArray<z.ZodString>>),
  immediateCause: z.string(),
  underlyingCauses: z.array(z.string()).max(5),
  rootCause: z.string().describe("A systemic, management-system level cause. Never 'worker carelessness'."),
  confidence: z.number().min(0).max(1),
});

const SYSTEM = `You are the RCA Investigator agent of ComplianceGuard AI, an expert SHEQ investigator (ISO 45001 10.2, ICAM/Just Culture).
Produce a 5-Whys chain plus a 6M Ishikawa analysis.
Rules:
1. Ground every "why" in supplied facts or SOP excerpts; cite them in "evidence". If unknown, say "Requires verification:" and lower confidence.
2. Drive past individual behaviour to SYSTEMIC causes (design, method, supervision, resourcing, document control). Blaming the worker is prohibited.
3. If the client's SOP is silent or contradicted, call that out explicitly — it's a document-control finding.
4. Consider South African context: load-shedding effects, staffing pressure, franchise brand standards, OHS Act duties.`;

export const rcaInvestigatorAgent = defineAgent<RcaInput, RootCauseAnalysis>({
  name: "rca_investigator",
  maxAttempts: 2,

  async llm({ parsed, classification, risk, sopContext, critique }, ctx) {
    const primary = HAZARD_PLAYBOOKS[classification.hazards[0]];
    const sop = sopContext.length
      ? sopContext.map((c, i) => `[SOP-${i + 1}] (${c.headingPath.join(" > ") || "untitled"}) ${c.text.slice(0, 700)}`).join("\n")
      : "No matching SOP found in the client's document library.";
    const out = await ctx.llm.generateJson({
      system: SYSTEM,
      schema: RcaSchema,
      temperature: 0.2,
      prompt: [
        `INCIDENT: ${classification.incidentClass} | hazards: ${classification.hazards.join(", ")} | risk ${risk.band} (${risk.rating})`,
        `FACTS:\n${parsed.facts.map((f, i) => `F${i + 1}. ${f}`).join("\n")}`,
        `EQUIPMENT: ${parsed.equipment.join(", ") || "n/a"} | IMMEDIATE ACTIONS: ${parsed.immediateActions.join("; ") || "none recorded"}`,
        `CLIENT SOP CONTEXT:\n${sop}`,
        `REFERENCE PATTERN (typical systemic chain for ${primary.hazard}, adapt don't copy):\n- ${primary.whyChain.join("\n- ")}`,
        critique?.length ? `CRITIC FEEDBACK ON PREVIOUS DRAFT — fix these:\n- ${critique.join("\n- ")}` : "",
      ].filter(Boolean).join("\n\n"),
    });
    const { confidence, ...rest } = out;
    return {
      value: { method: "5_whys+ishikawa", ...rest, blameFlagged: false, confidence },
      confidence,
      note: critique?.length ? "revised after critic feedback" : `grounded on ${sopContext.length} SOP chunks`,
    };
  },

  heuristic({ parsed, classification, sopContext }) {
    const hazards = classification.hazards;
    const primary = HAZARD_PLAYBOOKS[hazards[0]];
    const factsLower = parsed.facts.map((f) => f.toLowerCase());
    const evidenceFor = (keywords: string[]) =>
      parsed.facts.filter((_, i) => keywords.some((k) => factsLower[i].includes(k))).slice(0, 2);

    const immediateCause = parsed.summary;
    const whys = [
      { level: 1, question: "Why did the event occur?", answer: immediateCause, evidence: parsed.facts.slice(0, 1) },
      ...primary.whyChain.map((answer, i) => ({
        level: i + 2,
        question: `Why? (level ${i + 2})`,
        answer,
        evidence: i === 0 ? evidenceFor(primary.keywords) : [],
      })),
    ];

    const fishbone = Object.fromEntries(CATS.map((c) => [c, [] as string[]])) as Record<CauseCategory, string[]>;
    for (const h of hazards) {
      for (const [cat, causes] of Object.entries(HAZARD_PLAYBOOKS[h].fishbone)) {
        fishbone[cat as CauseCategory].push(...causes.filter((x) => !fishbone[cat as CauseCategory].includes(x)));
      }
    }
    if (factsLower.some((f) => /\b(new|first day|first week|trainee|temp)\b/.test(f))) {
      fishbone.people.unshift("Inexperienced / newly inducted worker — competence gap (ISO 45001 7.2)");
    }
    if (factsLower.some((f) => /load.?shedding|power (?:cut|outage)|generator/.test(f))) {
      fishbone.environment.unshift("Load-shedding / power interruption altered normal operating conditions");
    }
    if (sopContext.length === 0) {
      fishbone.management.unshift("No client SOP found covering this task — document-control gap");
    } else {
      fishbone.method.unshift(`Existing SOP "${sopContext[0].headingPath.join(" > ") || "procedure"}" did not prevent recurrence — review adequacy`);
    }

    return {
      value: {
        method: "5_whys+ishikawa",
        whys,
        fishbone,
        immediateCause,
        underlyingCauses: primary.whyChain.slice(1, 3),
        rootCause: primary.whyChain[primary.whyChain.length - 1],
        blameFlagged: false,
        confidence: 0,
      },
      confidence: hazards[0] === "other" ? 0.4 : 0.62,
      note: `playbook:${primary.hazard}${sopContext.length ? ` + ${sopContext.length} SOP refs` : ""}`,
    };
  },
});
