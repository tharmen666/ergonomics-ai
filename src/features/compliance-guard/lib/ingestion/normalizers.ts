import { z } from "zod";
import type { IngestSourceKind, RawLogRow } from "@/lib/types";
import { defineAgent } from "../agents/core/agent";

/* ───────────────────────── CSV (RFC 4180-ish, streaming-friendly) ───────────────────────── */

export function parseCsv(text: string): RawLogRow[] {
  const rows: string[][] = [];
  let field = "", row: string[] = [], quoted = false;
  const delim = (text.split("\n", 1)[0].match(/;/g)?.length ?? 0) > (text.split("\n", 1)[0].match(/,/g)?.length ?? 0) ? ";" : ",";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === delim) { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...data] = rows.filter((r) => r.some((v) => v.trim()));
  if (!header) return [];
  const keys = header.map((h) => h.trim().toLowerCase());
  return data.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}

export function parseJsonRows(text: string): RawLogRow[] {
  const data: unknown = JSON.parse(text);
  const arr = Array.isArray(data) ? data : (data as { records?: unknown[]; incidents?: unknown[] }).records ?? (data as { incidents?: unknown[] }).incidents ?? [];
  return (arr as Record<string, unknown>[]).map((o) =>
    Object.fromEntries(Object.entries(o).map(([k, v]) => [k.toLowerCase(), v == null ? "" : String(v)])));
}

/* ───────────────────────── Column mapping (log normaliser) ───────────────────────── */

export interface ColumnMap {
  date?: string;
  description?: string;
  site?: string;
  type?: string;
  injury?: string;
  action?: string;
}

const CANDIDATES: Record<keyof ColumnMap, RegExp> = {
  date: /^(date|incident.?date|occurred|date.?of.?(incident|event)|event.?date|datum|timestamp)$/,
  description: /^(description|details|narrative|what.?happened|incident.?description|summary|comments?|beskrywing)$/,
  site: /^(site|store|branch|location|outlet|plant|winkel)$/,
  type: /^(type|category|incident.?type|classification|class)$/,
  injury: /^(injury|injuries|body.?part|nature.?of.?injury)$/,
  action: /^(action|corrective.?action|immediate.?action|actions.?taken)$/,
};

/** Deterministic header matcher — handles the messy exports SMEs actually have. */
export function mapColumns(rows: RawLogRow[]): ColumnMap {
  const headers = Object.keys(rows[0] ?? {});
  const map: ColumnMap = {};
  for (const [field, rx] of Object.entries(CANDIDATES) as [keyof ColumnMap, RegExp][]) {
    map[field] = headers.find((h) => rx.test(h.replace(/[_\s]+/g, " ").trim()));
  }
  if (!map.description && headers.length) {
    // Fallback: the column with the longest average text is almost always the narrative.
    const sample = rows.slice(0, 50);
    const avg = (h: string) => sample.reduce((s, r) => s + (r[h]?.length ?? 0), 0) / (sample.length || 1);
    map.description = headers.filter((h) => h !== map.date).sort((a, b) => avg(b) - avg(a))[0];
  }
  return map;
}

/** Parses SA-typical date formats: 2024-03-05, 05/03/2024 (dd/mm), 5 March 2024. */
export function parseLooseDate(v: string): string | null {
  if (!v) return null;
  const dmy = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})/);
  if (dmy) {
    const y = dmy[3].length === 2 ? 2000 + Number(dmy[3]) : Number(dmy[3]);
    const d = new Date(Date.UTC(y, Number(dmy[2]) - 1, Number(dmy[1]), 10));
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/* ───────────────────────── SOP source classifier agent ───────────────────────── */

export interface SourceClassifierInput {
  fileName: string;
  text: string;
  declaredKind?: IngestSourceKind;
  isTabular: boolean;
}

const KINDS = ["sop", "policy", "work_instruction", "risk_assessment", "incident_log", "audit_report", "training_record", "unknown"] as const;

const SIGNALS: Array<[IngestSourceKind, RegExp]> = [
  ["incident_log", /\b(incident|near.?miss|injury|accident)\b.*\b(date|register|log)\b|\bincident register\b/i],
  ["risk_assessment", /\b(risk assessment|hira|hazard identification|likelihood|severity|risk rating|ergonomic)\b/i],
  ["audit_report", /\b(audit (report|findings)|non-?conformit(y|ies)|auditor|observation)\b/i],
  ["training_record", /\b(training record|attendance register|competency|certificate of attendance)\b/i],
  ["work_instruction", /\b(work instruction|step \d|how to)\b/i],
  ["policy", /\b(policy statement|this policy|commitment|signed.*ceo|policy)\b/i],
  ["sop", /\b(standard operating procedure|sop|procedure|purpose|scope|responsibilit(y|ies))\b/i],
];

export const sourceClassifierAgent = defineAgent<SourceClassifierInput, IngestSourceKind>({
  name: "sop_classifier",

  async llm({ fileName, text, declaredKind }, ctx) {
    const out = await ctx.llm.generateJson({
      system: "Classify a compliance document uploaded to a South African SHEQ platform. Return the single best kind.",
      schema: z.object({ kind: z.enum(KINDS), confidence: z.number().min(0).max(1) }),
      prompt: `file: ${fileName}\ndeclared: ${declaredKind ?? "none"}\n---\n${text.slice(0, 3000)}`,
    });
    return { value: out.kind, confidence: out.confidence, note: out.kind };
  },

  heuristic({ fileName, text, declaredKind, isTabular }) {
    const head = `${fileName}\n${text.slice(0, 4000)}`;
    if (isTabular && /incident|near.?miss|injur|accident/i.test(head)) {
      return { value: "incident_log", confidence: 0.9, note: "tabular incident register" };
    }
    const hit = SIGNALS.find(([, rx]) => rx.test(head));
    if (hit) return { value: hit[0], confidence: declaredKind === hit[0] ? 0.9 : 0.72, note: `signal:${hit[0]}` };
    return { value: declaredKind ?? "unknown", confidence: declaredKind ? 0.6 : 0.3, note: "no strong signal" };
  },
});
