import {
  boolean, index, integer, jsonb, pgEnum, pgTable, real, text, timestamp, uniqueIndex, vector,
} from "drizzle-orm/pg-core";
import type {
  AgentTrace, ClauseMapping, Classification, CorrectiveAction, ParsedIncident, RiskScore, RootCauseAnalysis,
} from "@/lib/types";

/**
 * Design notes
 * - Hot query columns are first-class & indexed; rich agent output lives in JSONB
 *   (fast writes, schema-flexible as agents evolve).
 * - `occurred_at` is indexed per tenant for the 3-year rolling window purge, which
 *   in production should run via `pg_cron` or a Vercel Cron hitting /api/maintenance/purge.
 * - HNSW index on embeddings for sub-10ms ANN retrieval over SOP chunks.
 */
const EMBED_DIMS = 768;

export const documentStatus = pgEnum("document_status", ["draft", "in_review", "approved", "superseded", "archived"]);
export const workflowState = pgEnum("workflow_state", [
  "captured", "triaged", "investigating", "awaiting_validation", "capa_in_progress", "verifying", "closed",
]);

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  siteId: text("site_id"),
  title: text("title").notNull(),
  kind: text("kind").notNull(),
  version: integer("version").notNull().default(1),
  status: documentStatus("status").notNull().default("in_review"),
  contentHash: text("content_hash").notNull(),
  sourceFileName: text("source_file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  externalRef: text("external_ref"),
  ownerId: text("owner_id"),
  reviewDueAt: timestamp("review_due_at", { withTimezone: true, mode: "string" }).notNull(),
  clauseMappings: jsonb("clause_mappings").$type<ClauseMapping[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("documents_tenant_hash_uq").on(t.tenantId, t.contentHash),
  index("documents_tenant_title_idx").on(t.tenantId, t.title),
  index("documents_review_due_idx").on(t.tenantId, t.reviewDueAt),
]);

export const documentChunks = pgTable("document_chunks", {
  id: text("id").primaryKey(),
  documentId: text("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  tenantId: text("tenant_id").notNull(),
  ordinal: integer("ordinal").notNull(),
  headingPath: jsonb("heading_path").$type<string[]>().notNull().default([]),
  text: text("text").notNull(),
  tokenEstimate: integer("token_estimate").notNull(),
  embedding: vector("embedding", { dimensions: EMBED_DIMS }),
}, (t) => [
  index("chunks_doc_idx").on(t.documentId),
  index("chunks_embedding_hnsw").using("hnsw", t.embedding.op("vector_cosine_ops")),
]);

export const incidents = pgTable("incidents", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  siteId: text("site_id").notNull(),
  reportedBy: text("reported_by").notNull(),
  channel: text("channel").notNull(),
  narrative: text("narrative").notNull(),
  incidentClass: text("incident_class").notNull(),
  riskRating: integer("risk_rating").notNull(),
  riskBand: text("risk_band").notNull(),
  state: workflowState("state").notNull(),
  requiresHumanReview: boolean("requires_human_review").notNull(),
  reportableToDel: boolean("reportable_to_del").notNull().default(false),
  confidence: real("confidence").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true, mode: "string" }).notNull(),
  parsed: jsonb("parsed").$type<ParsedIncident>().notNull(),
  classification: jsonb("classification").$type<Classification>().notNull(),
  risk: jsonb("risk").$type<RiskScore>().notNull(),
  clauses: jsonb("clauses").$type<ClauseMapping[]>().notNull(),
  rca: jsonb("rca").$type<RootCauseAnalysis>().notNull(),
  capas: jsonb("capas").$type<CorrectiveAction[]>().notNull(),
  reviewReasons: jsonb("review_reasons").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
}, (t) => [
  index("incidents_tenant_occurred_idx").on(t.tenantId, t.occurredAt),
  index("incidents_hitl_queue_idx").on(t.tenantId, t.requiresHumanReview, t.state),
  index("incidents_site_band_idx").on(t.siteId, t.riskBand),
]);

export const agentRuns = pgTable("agent_runs", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  pipeline: text("pipeline").notNull(),
  subjectId: text("subject_id"),
  traces: jsonb("traces").$type<AgentTrace[]>().notNull(),
  totalMs: integer("total_ms").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
}, (t) => [index("agent_runs_tenant_idx").on(t.tenantId, t.createdAt)]);
