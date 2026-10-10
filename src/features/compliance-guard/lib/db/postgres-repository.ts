import "server-only";
import { and, cosineDistance, count, desc, eq, gte, inArray, lt, ne, sql } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type {
  AgentRun, ControlledDocument, DocumentChunk, DocumentId, Incident, TenantId, SupportedMime,
  IngestSourceKind, ISODateString, SiteId, UserId, HazardCategory,
} from "@/lib/types";
import type { Repository, ScoredChunk } from "./repository";
import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;
type DocRow = typeof schema.documents.$inferSelect;
type IncidentRow = typeof schema.incidents.$inferSelect;

const toDoc = (r: DocRow): ControlledDocument => ({
  id: r.id as DocumentId,
  tenantId: r.tenantId as TenantId,
  siteId: (r.siteId ?? undefined) as SiteId | undefined,
  title: r.title,
  kind: r.kind as IngestSourceKind,
  version: r.version,
  status: r.status,
  contentHash: r.contentHash,
  sourceFileName: r.sourceFileName,
  mimeType: r.mimeType as SupportedMime,
  externalRef: r.externalRef ?? undefined,
  ownerId: (r.ownerId ?? undefined) as UserId | undefined,
  reviewDueAt: r.reviewDueAt as ISODateString,
  clauseMappings: r.clauseMappings,
  createdAt: r.createdAt as ISODateString,
  updatedAt: r.updatedAt as ISODateString,
});

const toIncident = (r: IncidentRow): Incident => ({
  id: r.id as Incident["id"],
  tenantId: r.tenantId as TenantId,
  siteId: r.siteId as SiteId,
  reportedBy: r.reportedBy as UserId,
  channel: r.channel as Incident["channel"],
  narrative: r.narrative,
  parsed: r.parsed,
  classification: r.classification,
  risk: r.risk,
  clauses: r.clauses,
  rca: r.rca,
  capas: r.capas,
  state: r.state,
  requiresHumanReview: r.requiresHumanReview,
  reviewReasons: r.reviewReasons,
  createdAt: r.createdAt as ISODateString,
  updatedAt: r.updatedAt as ISODateString,
});

export class PostgresRepository implements Repository {
  readonly kind = "postgres" as const;
  private readonly db: Db;

  constructor(url: string) {
    // `prepare: false` keeps us compatible with transaction-mode poolers (Supabase/Neon PgBouncer).
    const client = postgres(url, { max: 5, prepare: false, idle_timeout: 20 });
    this.db = drizzle(client, { schema });
  }

  async findDocumentByHash(tenantId: TenantId, hash: string) {
    const [row] = await this.db.select().from(schema.documents)
      .where(and(eq(schema.documents.tenantId, tenantId), eq(schema.documents.contentHash, hash))).limit(1);
    return row ? toDoc(row) : null;
  }

  async findCurrentDocument(tenantId: TenantId, key: { externalRef?: string; title: string }) {
    const match = key.externalRef
      ? eq(schema.documents.externalRef, key.externalRef)
      : eq(schema.documents.title, key.title);
    const [row] = await this.db.select().from(schema.documents)
      .where(and(eq(schema.documents.tenantId, tenantId), ne(schema.documents.status, "superseded"), match))
      .orderBy(desc(schema.documents.version)).limit(1);
    return row ? toDoc(row) : null;
  }

  async saveDocumentVersion(doc: ControlledDocument, chunks: DocumentChunk[], previousId?: DocumentId) {
    await this.db.transaction(async (tx) => {
      if (previousId) {
        await tx.update(schema.documents)
          .set({ status: "superseded", updatedAt: doc.createdAt })
          .where(eq(schema.documents.id, previousId));
      }
      await tx.insert(schema.documents).values({ ...doc, siteId: doc.siteId ?? null });
      // Batch insert in slices to stay under Postgres' 65k bind-parameter limit.
      for (let i = 0; i < chunks.length; i += 500) {
        await tx.insert(schema.documentChunks).values(chunks.slice(i, i + 500));
      }
    });
  }

  async listDocuments(tenantId: TenantId, limit = 50) {
    const rows = await this.db.select().from(schema.documents)
      .where(eq(schema.documents.tenantId, tenantId))
      .orderBy(desc(schema.documents.createdAt)).limit(limit);
    return rows.map(toDoc);
  }

  async searchChunks(tenantId: TenantId, embedding: number[], k: number): Promise<ScoredChunk[]> {
    const similarity = sql<number>`1 - (${cosineDistance(schema.documentChunks.embedding, embedding)})`;
    const rows = await this.db
      .select({ chunk: schema.documentChunks, score: similarity })
      .from(schema.documentChunks)
      .innerJoin(schema.documents, eq(schema.documents.id, schema.documentChunks.documentId))
      .where(and(eq(schema.documentChunks.tenantId, tenantId), ne(schema.documents.status, "superseded")))
      .orderBy(cosineDistance(schema.documentChunks.embedding, embedding))
      .limit(k);
    return rows.map(({ chunk, score }) => ({
      ...chunk,
      documentId: chunk.documentId as DocumentId,
      tenantId: chunk.tenantId as TenantId,
      embedding: chunk.embedding ?? undefined,
      score,
    }));
  }

  async saveIncidents(list: Incident[]) {
    if (list.length === 0) return;
    const rows = list.map((i) => ({
      id: i.id, tenantId: i.tenantId, siteId: i.siteId, reportedBy: i.reportedBy, channel: i.channel,
      narrative: i.narrative, incidentClass: i.classification.incidentClass,
      riskRating: i.risk.rating, riskBand: i.risk.band, state: i.state,
      requiresHumanReview: i.requiresHumanReview, reportableToDel: i.classification.reportableToDEL,
      confidence: Math.min(i.classification.confidence, i.rca.confidence),
      occurredAt: i.parsed.occurredAt, parsed: i.parsed, classification: i.classification, risk: i.risk,
      clauses: i.clauses, rca: i.rca, capas: i.capas, reviewReasons: i.reviewReasons,
      createdAt: i.createdAt, updatedAt: i.updatedAt,
    }));
    for (let i = 0; i < rows.length; i += 250) {
      await this.db.insert(schema.incidents).values(rows.slice(i, i + 250)).onConflictDoNothing();
    }
  }

  async listIncidents(tenantId: TenantId, opts: { limit?: number; hitlOnly?: boolean } = {}) {
    const where = opts.hitlOnly
      ? and(eq(schema.incidents.tenantId, tenantId), eq(schema.incidents.requiresHumanReview, true),
          inArray(schema.incidents.state, ["awaiting_validation", "triaged"]))
      : eq(schema.incidents.tenantId, tenantId);
    const rows = await this.db.select().from(schema.incidents).where(where)
      .orderBy(desc(schema.incidents.occurredAt)).limit(opts.limit ?? 100);
    return rows.map(toIncident);
  }

  async countSimilarIncidents(tenantId: TenantId, siteId: SiteId, hazard: HazardCategory, sinceIso: string) {
    const [row] = await this.db.select({ n: count() }).from(schema.incidents).where(and(
      eq(schema.incidents.tenantId, tenantId),
      eq(schema.incidents.siteId, siteId),
      gte(schema.incidents.occurredAt, sinceIso),
      sql`${schema.incidents.classification} -> 'hazards' ? ${hazard}`,
    ));
    return row?.n ?? 0;
  }

  async saveAgentRun(run: AgentRun, subjectId?: string) {
    await this.db.insert(schema.agentRuns).values({
      id: run.id, tenantId: run.tenantId, pipeline: run.pipeline, subjectId,
      traces: run.traces, totalMs: run.totalMs, createdAt: run.createdAt,
    });
  }

  async purgeOutsideWindow(tenantId: TenantId, months: number) {
    const res = await this.db.delete(schema.incidents).where(and(
      eq(schema.incidents.tenantId, tenantId),
      lt(schema.incidents.occurredAt, sql`now() - make_interval(months => ${months})`),
    )).returning({ id: schema.incidents.id });
    return res.length;
  }
}
