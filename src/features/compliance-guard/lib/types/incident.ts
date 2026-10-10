import type { ClauseMapping } from "./compliance";
import type {
  CapaId, Confidence, EmployeeId, IncidentId, ISODateString, SiteId, TenantId, UserId,
} from "./common";

export type IncidentClass =
  | "near_miss"            // NMI — no injury/damage, but could have
  | "unsafe_act"
  | "unsafe_condition"
  | "first_aid"
  | "medical_treatment"
  | "lost_time_injury"     // LTI — triggers COIDA W.Cl.2 within 7 days
  | "property_damage"
  | "environmental"
  | "quality_nonconformance"
  | "food_safety"
  | "dangerous_occurrence"; // OHS Act s24 reportable

export type HazardCategory =
  | "slip_trip_fall"
  | "manual_handling"      // ergonomics
  | "repetitive_strain"
  | "burn_scald"
  | "cut_laceration"
  | "electrical"
  | "chemical"
  | "fire"
  | "vehicle_forklift"
  | "machinery"
  | "violence_robbery"     // high relevance in SA retail/cash handling
  | "psychosocial"
  | "biological"
  | "product_quality"
  | "other";

export type Severity = 1 | 2 | 3 | 4 | 5;     // 1 insignificant → 5 catastrophic
export type Likelihood = 1 | 2 | 3 | 4 | 5;   // 1 rare → 5 almost certain

export type RiskBand = "low" | "medium" | "high" | "critical";

export interface RiskScore {
  severity: Severity;
  likelihood: Likelihood;
  /** severity × likelihood (1..25) */
  rating: number;
  band: RiskBand;
}

export type IntakeChannel = "voice" | "text" | "whatsapp" | "form" | "historical_import";

/** Raw capture — the only thing a frontline manager must supply. */
export interface IncidentIntake {
  tenantId: TenantId;
  siteId: SiteId;
  reportedBy: UserId;
  channel: IntakeChannel;
  /** Free text or speech-to-text transcript. */
  narrative: string;
  occurredAt?: ISODateString;
  /** Optional language hint (en, af, zu, xh...) — narratives are often mixed-language. */
  locale?: string;
  attachments?: Array<{ url: string; mimeType: string }>;
}

/** Structured extraction produced by the IntakeParser agent. */
export interface ParsedIncident {
  summary: string;
  occurredAt: ISODateString;
  location?: string;
  peopleInvolved: Array<{ role: string; employeeId?: EmployeeId; injured: boolean }>;
  injuries: Array<{ bodyPart: string; nature: string }>;
  equipment: string[];
  immediateActions: string[];
  /** Extracted verbatim facts — used later to ground RCA and avoid hallucination. */
  facts: string[];
}

export interface Classification {
  incidentClass: IncidentClass;
  hazards: HazardCategory[];
  reportableToDEL: boolean;      // OHS Act s24 / GAR 8
  coidaClaimRequired: boolean;
  confidence: Confidence;
}

export type CauseCategory =
  | "people" | "method" | "machine" | "material" | "environment" | "management"; // 6M Ishikawa

export interface WhyStep {
  level: number;           // 1..5
  question: string;
  answer: string;
  evidence: string[];      // references into ParsedIncident.facts
}

export interface RootCauseAnalysis {
  method: "5_whys+ishikawa";
  whys: WhyStep[];
  fishbone: Record<CauseCategory, string[]>;
  immediateCause: string;
  underlyingCauses: string[];
  rootCause: string;
  /** True if the RCA leans on "worker carelessness" without systemic cause — rejected by the critic. */
  blameFlagged: boolean;
  confidence: Confidence;
}

/** Hierarchy of controls — ISO 45001 8.1.2. CAPAs are ranked by this. */
export type ControlLevel =
  | "elimination" | "substitution" | "engineering" | "administrative" | "ppe";

export type CapaStatus = "proposed" | "approved" | "in_progress" | "verifying" | "closed" | "rejected";

export interface CorrectiveAction {
  id: CapaId;
  type: "corrective" | "preventive";
  description: string;
  controlLevel: ControlLevel;
  ownerRole: "site_manager" | "general_manager" | "safety_officer" | "maintenance" | "hr";
  dueAt: ISODateString;
  /** Measurable verification criterion for V&V (e.g. "0 repeat slips in 60 days"). */
  verification: string;
  status: CapaStatus;
}

export type WorkflowState =
  | "captured"
  | "triaged"
  | "investigating"
  | "awaiting_validation"   // HITL queue
  | "capa_in_progress"
  | "verifying"
  | "closed";

export interface Incident {
  id: IncidentId;
  tenantId: TenantId;
  siteId: SiteId;
  reportedBy: UserId;
  channel: IntakeChannel;
  narrative: string;
  parsed: ParsedIncident;
  classification: Classification;
  risk: RiskScore;
  clauses: ClauseMapping[];
  rca: RootCauseAnalysis;
  capas: CorrectiveAction[];
  state: WorkflowState;
  /** True if any agent confidence fell below threshold or risk is high/critical. */
  requiresHumanReview: boolean;
  reviewReasons: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
