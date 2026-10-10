import type { ISODateString, IncidentId, Role, SiteId, TenantId, UserId, EmployeeId } from "./common";
import type { RiskBand } from "./incident";

/* ───────────────────────── SLA / Pre-V&V escalation engine ───────────────────────── */

export type SlaStage =
  | "acknowledge"          // someone has seen it
  | "contain"              // immediate control in place
  | "investigate"          // RCA complete
  | "validate"             // HITL safety officer sign-off
  | "capa_complete"
  | "verify_effectiveness";

export interface SlaPolicy {
  band: RiskBand;
  /** Minutes allowed per stage before an escalation fires. */
  targetsMinutes: Record<SlaStage, number>;
  /** Ordered escalation ladder. */
  escalation: Role[];
}

export interface SlaClock {
  incidentId: IncidentId;
  stage: SlaStage;
  startedAt: ISODateString;
  dueAt: ISODateString;
  breached: boolean;
  escalationLevel: number;
}

export interface AgentNudge {
  incidentId: IncidentId;
  toRole: Role;
  toUserId?: UserId;
  channel: "push" | "whatsapp" | "email" | "sms";
  message: string;
  dueAt: ISODateString;
}

/* ─────────────────── Medicals & Mental Health Baseline ("Know your people") ─────────────────── */

export type FitnessStatus = "fit" | "fit_with_restrictions" | "temporarily_unfit" | "unfit" | "unknown";

export type ChronicRiskFactor =
  | "hypertension" | "diabetes" | "epilepsy" | "musculoskeletal" | "respiratory"
  | "hearing_loss" | "vision" | "cardiovascular" | "substance_use";

export interface MedicalBaseline {
  employeeId: EmployeeId;
  tenantId: TenantId;
  siteId: SiteId;
  fitness: FitnessStatus;
  restrictions: string[];
  /** Stored as coded flags only — clinical detail stays with the OMP (POPIA s26 special personal info). */
  riskFactors: ChronicRiskFactor[];
  lastMedicalAt?: ISODateString;
  nextMedicalDueAt?: ISODateString;
  /** Aggregated, consented wellbeing pulse 0..10 — never shown at individual level to line managers. */
  wellbeingPulse?: number;
  consentRecordedAt: ISODateString;
}
