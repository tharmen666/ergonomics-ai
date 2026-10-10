import type { ClauseMapping } from "./compliance";
import type { DocumentId, ISODateString, SiteId, TenantId, UserId } from "./common";

/** What the client plugged in. Drives which normaliser runs downstream. */
export type IngestSourceKind =
  | "sop"                // Standard Operating Procedure
  | "policy"
  | "work_instruction"
  | "risk_assessment"
  | "incident_log"       // historical incident / NMI register (CSV/XLSX export)
  | "audit_report"
  | "training_record"
  | "unknown";

export type SupportedMime =
  | "text/plain"
  | "text/markdown"
  | "text/csv"
  | "application/json"
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type IngestChannel = "upload" | "api_sync" | "email_drop" | "sharepoint" | "google_drive";

export interface IngestRequest {
  tenantId: TenantId;
  siteId?: SiteId;
  uploadedBy: UserId;
  channel: IngestChannel;
  fileName: string;
  mimeType: string;
  bytes: Uint8Array;
  /** Optional caller hint; the classifier will verify/override. */
  declaredKind?: IngestSourceKind;
  /** External system reference for idempotent API syncs. */
  externalRef?: string;
}

/** Document-control lifecycle (ISO 9001 7.5 / ISO 45001 7.5.3). */
export type DocumentStatus = "draft" | "in_review" | "approved" | "superseded" | "archived";

export interface ControlledDocument {
  id: DocumentId;
  tenantId: TenantId;
  siteId?: SiteId;
  title: string;
  kind: IngestSourceKind;
  /** Semantic version bumped when content hash changes for the same externalRef/title. */
  version: number;
  status: DocumentStatus;
  contentHash: string;
  sourceFileName: string;
  mimeType: SupportedMime;
  externalRef?: string;
  ownerId?: UserId;
  /** Next mandatory review date — SOPs default to 12 months. */
  reviewDueAt: ISODateString;
  clauseMappings: ClauseMapping[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface DocumentChunk {
  id: string;
  documentId: DocumentId;
  tenantId: TenantId;
  ordinal: number;
  /** Nearest heading path, e.g. ["4. Procedure", "4.2 Slicer cleaning"] */
  headingPath: string[];
  text: string;
  tokenEstimate: number;
  embedding?: number[];
}

/** Rows extracted from historical incident registers before normalisation. */
export type RawLogRow = Record<string, string>;

export interface IngestResult {
  document: ControlledDocument;
  chunkCount: number;
  /** For incident_log sources: how many historical rows were back-filled into the 3-year window. */
  backfilledIncidents: number;
  /** Rows dropped because they fall outside the rolling retention window. */
  droppedOutsideWindow: number;
  deduplicated: boolean;
  warnings: string[];
  timingsMs: Record<string, number>;
}
