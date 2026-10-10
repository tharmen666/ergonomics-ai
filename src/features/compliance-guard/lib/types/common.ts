/**
 * Shared primitives used across every ComplianceGuard AI module.
 * Keep this file dependency-free so it can be imported from edge, node and client bundles.
 */

/** Nominal/branded type helper — prevents mixing up IDs of different entities. */
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type TenantId = Brand<string, "TenantId">;
export type SiteId = Brand<string, "SiteId">;
export type UserId = Brand<string, "UserId">;
export type EmployeeId = Brand<string, "EmployeeId">;
export type DocumentId = Brand<string, "DocumentId">;
export type IncidentId = Brand<string, "IncidentId">;
export type CapaId = Brand<string, "CapaId">;
export type AgentRunId = Brand<string, "AgentRunId">;

/** ISO-8601 timestamp string (UTC). */
export type ISODateString = Brand<string, "ISODateString">;

/** Industry verticals we ship tuned taxonomies & SOP templates for. */
export type IndustryVertical =
  | "retail"
  | "wholesale"
  | "food_franchise"
  | "pharmacy"
  | "manufacturing"
  | "logistics"
  | "other";

/** South African provinces — used for DEL inspectorate routing. */
export type SAProvince =
  | "EC" | "FS" | "GP" | "KZN" | "LP" | "MP" | "NC" | "NW" | "WC";

export interface Tenant {
  id: TenantId;
  name: string;
  vertical: IndustryVertical;
  /** e.g. "Wimpy", "Mugg & Bean" — franchise group the tenant belongs to. */
  franchiseGroup?: string;
  /** Rolling retention window in months (default 36 = 3 years). */
  retentionMonths: number;
  createdAt: ISODateString;
}

export interface Site {
  id: SiteId;
  tenantId: TenantId;
  name: string;
  province: SAProvince;
  /** Headcount drives OHS Act s17 H&S representative requirements (1 rep per 50 employees). */
  headcount: number;
  vertical: IndustryVertical;
}

export type Role =
  | "owner"
  | "safety_officer"      // Human-in-the-loop validator (SHEQ)
  | "site_manager"
  | "general_manager"
  | "hs_representative"   // OHS Act s17 appointee
  | "employee"
  | "auditor";

/** Discriminated result type — agents and handlers never throw across module boundaries. */
export type Result<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export interface AppError {
  code:
    | "VALIDATION"
    | "UNSUPPORTED_FORMAT"
    | "PAYLOAD_TOO_LARGE"
    | "DUPLICATE"
    | "LLM_FAILURE"
    | "AGENT_FAILURE"
    | "NOT_FOUND"
    | "INTERNAL";
  message: string;
  details?: unknown;
}

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E extends AppError>(error: E): Result<never, E> => ({ ok: false, error });

/** 0..1 confidence score emitted by agents. Below the HITL threshold → human review. */
export type Confidence = number;
