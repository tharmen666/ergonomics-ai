import type {
  AgentRun, ControlledDocument, DocumentChunk, DocumentId, HazardCategory, Incident, SiteId, TenantId,
} from "@/lib/types";

export interface ScoredChunk extends DocumentChunk {
  score: number;
}

/** Storage contract. Both Postgres and in-memory implementations satisfy it. */
export interface Repository {
  readonly kind: "postgres" | "memory";

  findDocumentByHash(tenantId: TenantId, contentHash: string): Promise<ControlledDocument | null>;
  /** Latest non-superseded doc matched by externalRef (preferred) or exact title. */
  findCurrentDocument(tenantId: TenantId, key: { externalRef?: string; title: string }): Promise<ControlledDocument | null>;
  /** Atomically supersedes `previousId` (if given) and inserts the new version + chunks. */
  saveDocumentVersion(doc: ControlledDocument, chunks: DocumentChunk[], previousId?: DocumentId): Promise<void>;
  listDocuments(tenantId: TenantId, limit?: number): Promise<ControlledDocument[]>;
  searchChunks(tenantId: TenantId, embedding: number[], k: number): Promise<ScoredChunk[]>;

  saveIncidents(incidents: Incident[]): Promise<void>;
  listIncidents(tenantId: TenantId, opts?: { limit?: number; hitlOnly?: boolean }): Promise<Incident[]>;
  /** Count of incidents at a site sharing a hazard since `sinceIso` — feeds risk likelihood. */
  countSimilarIncidents(tenantId: TenantId, siteId: SiteId, hazard: HazardCategory, sinceIso: string): Promise<number>;

  saveAgentRun(run: AgentRun, subjectId?: string): Promise<void>;

  /** Deletes incidents older than the rolling window. Returns rows purged. */
  purgeOutsideWindow(tenantId: TenantId, months: number): Promise<number>;
}
