import { z } from "zod";
import type { ClauseMapping, HazardCategory, IncidentClass, IngestSourceKind } from "@/lib/types";
import { CLAUSE_CATALOGUE, catalogueByKey } from "@/lib/compliance/clause-catalogue";
import { defineAgent } from "../core/agent";

export interface IsoMapperInput {
  text: string;
  incidentClass?: IncidentClass;
  hazards?: HazardCategory[];
  sourceKind?: IngestSourceKind;
  maxResults?: number;
}

const MappingSchema = z.object({
  mappings: z.array(z.object({
    key: z.string().describe("Must be one of the provided catalogue keys"),
    confidence: z.number().min(0).max(1),
    rationale: z.string().max(200),
  })).max(8),
});

const SYSTEM = `You are the ISO Clause Mapper agent of ComplianceGuard AI.
Map evidence to the MOST relevant clauses. You may ONLY choose keys from the supplied catalogue — never invent clauses.
Prefer specific SA statutory clauses alongside ISO clauses. Give a one-line rationale grounded in the evidence.`;

/** Pure scoring function — reused by SOP ingestion for fast bulk mapping. */
export function scoreClauses(input: IsoMapperInput): ClauseMapping[] {
  const lower = input.text.toLowerCase();
  const results: ClauseMapping[] = [];
  for (const c of CLAUSE_CATALOGUE) {
    const kwHits = c.keywords.filter((k) => lower.includes(k));
    let score = kwHits.length * 0.18;
    if (input.incidentClass && c.classes?.includes(input.incidentClass)) score += 0.35;
    if (input.hazards?.some((h) => c.hazards?.includes(h))) score += 0.35;
    if (input.sourceKind && c.sources?.includes(input.sourceKind)) score += 0.3;
    if (score < 0.3) continue;
    const reasons = [
      kwHits.length ? `mentions ${kwHits.slice(0, 3).join(", ")}` : "",
      input.incidentClass && c.classes?.includes(input.incidentClass) ? `class ${input.incidentClass}` : "",
      input.hazards?.some((h) => c.hazards?.includes(h)) ? "hazard match" : "",
      input.sourceKind && c.sources?.includes(input.sourceKind) ? `document type ${input.sourceKind}` : "",
    ].filter(Boolean);
    results.push({
      standard: c.standard, clause: c.clause, title: c.title,
      confidence: Math.min(0.95, score), rationale: reasons.join("; "),
    });
  }
  return results.sort((a, b) => b.confidence - a.confidence).slice(0, input.maxResults ?? 6);
}

export const isoMapperAgent = defineAgent<IsoMapperInput, ClauseMapping[]>({
  name: "iso_mapper",

  async llm(input, ctx) {
    const catalogue = CLAUSE_CATALOGUE.map((c) => `${c.key} | ${c.standard} ${c.clause} — ${c.title}`).join("\n");
    const out = await ctx.llm.generateJson({
      system: SYSTEM,
      schema: MappingSchema,
      prompt: `CATALOGUE:\n${catalogue}\n\nCONTEXT: class=${input.incidentClass ?? "-"} hazards=${input.hazards?.join(",") ?? "-"} source=${input.sourceKind ?? "-"}\n\nEVIDENCE:\n"""${input.text.slice(0, 6000)}"""`,
    });
    // Hard guardrail: drop anything not in the closed catalogue.
    const value = out.mappings.flatMap((m) => {
      const c = catalogueByKey.get(m.key);
      return c ? [{ standard: c.standard, clause: c.clause, title: c.title, confidence: m.confidence, rationale: m.rationale }] : [];
    }).slice(0, input.maxResults ?? 6);
    const avg = value.length ? value.reduce((s, v) => s + v.confidence, 0) / value.length : 0.3;
    return { value, confidence: avg, note: `${value.length} clauses (${out.mappings.length - value.length} rejected)` };
  },

  heuristic(input) {
    const value = scoreClauses(input);
    return { value, confidence: value.length ? 0.7 : 0.4, note: `${value.length} clauses by keyword/class match` };
  },
});
