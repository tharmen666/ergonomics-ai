import type { ISODateString, SiteId, TenantId } from "./common";

/** Management-system standards and SA statutory instruments we map evidence against. */
export type Standard =
  | "ISO45001"   // OH&S management
  | "ISO9001"    // Quality management
  | "ISO14001"   // Environmental
  | "ISO22000"   // Food safety (franchise kitchens)
  | "OHSA"       // Occupational Health and Safety Act 85 of 1993
  | "ERGO_REGS"  // Ergonomics Regulations, 2019
  | "GSR"        // General Safety Regulations
  | "EMR"        // Electrical Machinery Regulations / Electrical Installation Regs (CoC)
  | "HCA"        // Regulations for Hazardous Chemical Agents, 2021
  | "COIDA"      // Compensation for Occupational Injuries and Diseases Act
  | "LPS";       // Lean Production System / internal TQM

export interface ClauseRef {
  standard: Standard;
  /** e.g. "8.1.2", "s8(2)(d)", "Reg 3" */
  clause: string;
  title: string;
}

export interface ClauseMapping extends ClauseRef {
  confidence: number;
  rationale: string;
}

/** Department of Employment & Labour (DEL) audit-shield artefacts. */
export type DelArtefactKind =
  | "ergonomics_risk_assessment"
  | "hira"                         // Hazard Identification & Risk Assessment
  | "electrical_coc"
  | "fire_equipment_service"
  | "first_aid_certificate"
  | "hs_rep_appointment"           // OHS Act s17
  | "hs_committee_minutes"         // OHS Act s19
  | "s16_2_appointment"            // Assigned CEO duties
  | "medical_surveillance_record"
  | "coida_registration";

export type ReadinessStatus = "compliant" | "expiring" | "expired" | "missing";

export interface DelArtefact {
  id: string;
  tenantId: TenantId;
  siteId: SiteId;
  kind: DelArtefactKind;
  title: string;
  issuedAt?: ISODateString;
  expiresAt?: ISODateString;
  status: ReadinessStatus;
  evidenceDocumentIds: string[];
  clauses: ClauseRef[];
}

export interface AuditReadinessPack {
  siteId: SiteId;
  generatedAt: ISODateString;
  /** 0..100 weighted readiness score. */
  score: number;
  artefacts: DelArtefact[];
  gaps: Array<{ kind: DelArtefactKind; reason: string; clause: ClauseRef }>;
}
