import type { AgentRunId, Confidence, ISODateString, TenantId } from "./common";

export type AgentName =
  | "intake_parser"
  | "classifier"
  | "risk_scorer"
  | "iso_mapper"
  | "rca_investigator"
  | "rca_critic"
  | "capa_planner"
  | "sla_router"
  | "sop_classifier"
  | "log_normalizer";

/** Per-agent execution trace — persisted for ISO 7.5 traceability & explainability. */
export interface AgentTrace {
  agent: AgentName;
  startedAt: ISODateString;
  durationMs: number;
  provider: string;          // "gemini" | "offline" | ...
  model?: string;
  confidence: Confidence;
  attempts: number;
  error?: string;
  /** Short human-readable reasoning summary (never raw chain-of-thought). */
  note?: string;
}

export interface AgentRun {
  id: AgentRunId;
  tenantId: TenantId;
  pipeline: "incident_to_rca" | "sop_ingest" | "historical_backfill";
  traces: AgentTrace[];
  totalMs: number;
  createdAt: ISODateString;
}
