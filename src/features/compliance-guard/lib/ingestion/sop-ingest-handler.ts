import "server-only";
import type {
  AgentRunId, AppError, ControlledDocument, DocumentChunk, DocumentId, IngestRequest, IngestResult, IngestSourceKind,
  ISODateString, Result, SiteId, UserId,
} from "@/lib/types";
import type { Repository } from "@/lib/db/repository";
import type { LlmProvider } from "@/lib/llm/provider";
import type { AgentContext } from "@/lib/agents/core/agent";
import { isoMapperAgent } from "@/lib/agents/incident/iso-mapper.agent";
import { runIncidentToRca } from "@/lib/agents/pipelines/incident-to-rca";
import { addMonths, newId, nowIso, sha256Hex, stopwatch, withinRollingWindow } from "@/lib/utils/core";
import { detectMime } from "./detect";
import { extractText } from "./extract";
import { chunkDocument } from "./chunker";
import { mapColumns, parseCsv, parseJsonRows, parseLooseDate, sourceClassifierAgent } from "./normalizers";

export interface IngestDeps {
  repo: Repository;
  llm: LlmProvider;
  hitlThreshold: number;
  retentionMonths: number;
  maxBytes: number;
  /** Concurrency for historical back-fill. */
  backfillConcurrency?: number;
}

/** Review cadence per document type (ISO 7.5.2 — periodic review). */
const REVIEW_MONTHS: Partial<Record<IngestSourceKind, number>> = {
  sop: 12, work_instruction: 12, policy: 24, risk_assessment: 12,
};

const fail = (code: AppError["code"], message: string, details?: unknown): Result<never> =>
  ({ ok: false, error: { code, message, details } });

/** Bounded-concurrency map — keeps memory & CPU predictable on serverless. */
async function pMap<T, R>(items: T[], limit: number, fn: (t: T, i: number) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) { const i = next++; out[i] = await fn(items[i], i); }
  }));
  return out;
}

/**
 * Universal Plug-and-Play SOP / log connector.
 *
 *  validate ─▶ hash+dedupe ─▶ extract ─▶ classify ─┬─▶ [incident_log] normalise ─▶ 3-yr window ─▶ agent back-fill
 *                                                 └─▶ chunk ─▶ embed ∥ ISO-map ─▶ version (supersede) ─▶ persist
 *
 * Idempotent: identical content for a tenant returns the existing document (dedupe by SHA-256).
 */
export async function ingestDocument(req: IngestRequest, deps: IngestDeps): Promise<Result<IngestResult>> {
  const sw = stopwatch();
  const warnings: string[] = [];

  // ── 1. Validate ──
  if (req.bytes.byteLength === 0) return fail("VALIDATION", "Empty file");
  if (req.bytes.byteLength > deps.maxBytes) {
    return fail("PAYLOAD_TOO_LARGE", `File exceeds ${(deps.maxBytes / 1_048_576).toFixed(0)} MB limit`);
  }
  const mime = detectMime(req.bytes, req.fileName, req.mimeType);
  if (!mime) return fail("UNSUPPORTED_FORMAT", `Unsupported file type for "${req.fileName}". Use PDF, DOCX, CSV, JSON, TXT or MD.`);
  sw.lap("validate");

  // ── 2. Hash & dedupe ──
  const contentHash = await sha256Hex(req.bytes);
  const existing = await deps.repo.findDocumentByHash(req.tenantId, contentHash);
  sw.lap("dedupe");
  if (existing) {
    return {
      ok: true,
      value: {
        document: existing, chunkCount: 0, backfilledIncidents: 0, droppedOutsideWindow: 0,
        deduplicated: true, warnings: ["Identical content already ingested — returning existing version."],
        timingsMs: { ...sw.laps, total: sw.total() },
      },
    };
  }

  // ── 3. Extract ──
  let text: string;
  try {
    text = await extractText(req.bytes, mime);
  } catch (e) {
    return fail("UNSUPPORTED_FORMAT", "Could not extract text (file may be scanned/encrypted).", String(e));
  }
  if (text.length < 20) return fail("VALIDATION", "Document contains no extractable text. Scanned PDFs need OCR.");
  sw.lap("extract");

  // ── 4. Classify source ──
  const ctx: AgentContext = { tenantId: req.tenantId, llm: deps.llm, hitlThreshold: deps.hitlThreshold, traces: [] };
  const isTabular = mime === "text/csv" || mime === "application/json";
  const kind = (await sourceClassifierAgent.run({ fileName: req.fileName, text, declaredKind: req.declaredKind, isTabular }, ctx)).value;
  sw.lap("classify");

  const now = nowIso();
  const title = deriveTitle(req.fileName, text);
  let backfilledIncidents = 0;
  let droppedOutsideWindow = 0;

  // ── 5a. Historical incident logs → agent back-fill within the rolling window ──
  if (kind === "incident_log" && isTabular) {
    const rows = mime === "text/csv" ? parseCsv(text) : safeJsonRows(text, warnings);
    const cols = mapColumns(rows);
    if (!cols.description) warnings.push("No narrative column detected — rows skipped.");
    if (!cols.date) warnings.push("No date column detected — rows assumed current and kept.");

    const candidates = rows.flatMap((r) => {
      const narrative = [cols.type && r[cols.type], cols.description && r[cols.description], cols.injury && r[cols.injury] && `Injury: ${r[cols.injury]}`, cols.action && r[cols.action] && `Action taken: ${r[cols.action]}`]
        .filter(Boolean).join(". ");
      const occurredAt = (cols.date && parseLooseDate(r[cols.date])) || now;
      if (!narrative.trim()) return [];
      if (!withinRollingWindow(occurredAt, deps.retentionMonths)) { droppedOutsideWindow++; return []; }
      return [{ narrative, occurredAt, site: cols.site ? r[cols.site] : undefined }];
    });

    const results = await pMap(candidates, deps.backfillConcurrency ?? 8, (c) =>
      runIncidentToRca({
        tenantId: req.tenantId,
        siteId: (req.siteId ?? (c.site ? `site_${slug(c.site)}` : "site_unassigned")) as SiteId,
        reportedBy: req.uploadedBy,
        channel: "historical_import",
        narrative: c.narrative,
        occurredAt: c.occurredAt as ISODateString,
      }, { repo: deps.repo, llm: deps.llm, hitlThreshold: deps.hitlThreshold, historical: true, persist: false }));

    const incidents = results.flatMap((r) => (r.ok ? [r.value.incident] : []));
    const failed = results.length - incidents.length;
    if (failed) warnings.push(`${failed} row(s) failed agent processing.`);
    await deps.repo.saveIncidents(incidents); // single batched write
    backfilledIncidents = incidents.length;
    sw.lap("backfill");
  }

  // ── 5b. Chunk → embed ∥ ISO-map ──
  // Incident registers are stored as rows, not as retrievable SOP knowledge (keeps RAG clean).
  const drafts = kind === "incident_log" ? [] : chunkDocument(text);
  const [embeddings, clauses] = await Promise.all([
    deps.llm.embed(drafts.map((d) => [d.headingPath.join(" > "), d.text].filter(Boolean).join("\n"))).catch((e) => {
      warnings.push(`Embedding failed (${String(e).slice(0, 80)}); semantic search disabled for this doc.`);
      return [] as number[][];
    }),
    isoMapperAgent.run({ text: `${title}\n${text.slice(0, 8000)}`, sourceKind: kind, maxResults: 8 }, ctx),
  ]);
  sw.lap("embed_map");

  // ── 6. Document control: versioning & supersession ──
  const previous = await deps.repo.findCurrentDocument(req.tenantId, { externalRef: req.externalRef, title });
  const docId = newId<DocumentId>("doc");
  const document: ControlledDocument = {
    id: docId,
    tenantId: req.tenantId,
    siteId: req.siteId,
    title,
    kind,
    version: (previous?.version ?? 0) + 1,
    status: kind === "incident_log" ? "archived" : "in_review", // new SOP versions require HITL approval
    contentHash,
    sourceFileName: req.fileName,
    mimeType: mime,
    externalRef: req.externalRef,
    ownerId: req.uploadedBy as UserId,
    reviewDueAt: addMonths(now, REVIEW_MONTHS[kind] ?? 12),
    clauseMappings: clauses.value,
    createdAt: now,
    updatedAt: now,
  };
  const chunks: DocumentChunk[] = drafts.map((d, i) => ({
    id: `${docId}_c${d.ordinal}`,
    documentId: docId,
    tenantId: req.tenantId,
    ordinal: d.ordinal,
    headingPath: d.headingPath,
    text: d.text,
    tokenEstimate: d.tokenEstimate,
    embedding: embeddings[i]?.length ? embeddings[i] : undefined,
  }));

  await deps.repo.saveDocumentVersion(document, chunks, previous?.id);
  await deps.repo.saveAgentRun({
    id: newId<AgentRunId>("run"), tenantId: req.tenantId, pipeline: "sop_ingest", traces: ctx.traces,
    totalMs: sw.total(), createdAt: now,
  }, docId);
  sw.lap("persist");

  if (previous) warnings.push(`Superseded v${previous.version} of "${title}".`);

  return {
    ok: true,
    value: {
      document, chunkCount: chunks.length, backfilledIncidents, droppedOutsideWindow,
      deduplicated: false, warnings, timingsMs: { ...sw.laps, total: sw.total() },
    },
  };
}

function safeJsonRows(text: string, warnings: string[]) {
  try { return parseJsonRows(text); } catch { warnings.push("Malformed JSON — no rows parsed."); return []; }
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

function deriveTitle(fileName: string, text: string): string {
  const firstHeading = text.split("\n").find((l) => /^#\s+|^[A-Z][A-Za-z0-9 &/,-]{6,80}$/.test(l.trim()));
  return (firstHeading?.replace(/^#\s+/, "").trim() || fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ")).slice(0, 120);
}
