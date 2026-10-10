import type { ClauseRef, HazardCategory, IncidentClass, IngestSourceKind } from "@/lib/types";

/**
 * Curated clause catalogue. Each entry carries trigger keywords used by the
 * deterministic mapper and as grounding context for the LLM mapper — the LLM may
 * ONLY return clauses that exist in this catalogue (prevents hallucinated clauses).
 */
export interface CatalogueEntry extends ClauseRef {
  key: string;
  keywords: string[];
  hazards?: HazardCategory[];
  classes?: IncidentClass[];
  sources?: IngestSourceKind[];
}

export const CLAUSE_CATALOGUE: readonly CatalogueEntry[] = [
  // ── ISO 45001 ──
  { key: "45001-5.4", standard: "ISO45001", clause: "5.4", title: "Consultation and participation of workers",
    keywords: ["consult", "worker participation", "toolbox", "safety committee"], sources: ["policy"] },
  { key: "45001-6.1.2", standard: "ISO45001", clause: "6.1.2", title: "Hazard identification and assessment of risks",
    keywords: ["hazard", "risk assessment", "hira", "near miss", "unsafe condition"],
    classes: ["near_miss", "unsafe_condition", "unsafe_act"], sources: ["risk_assessment"] },
  { key: "45001-7.2", standard: "ISO45001", clause: "7.2", title: "Competence",
    keywords: ["training", "untrained", "induction", "competent", "new staff"], sources: ["training_record"] },
  { key: "45001-7.5", standard: "ISO45001", clause: "7.5", title: "Documented information",
    keywords: ["sop", "procedure", "document", "record", "version"],
    sources: ["sop", "policy", "work_instruction"] },
  { key: "45001-8.1.2", standard: "ISO45001", clause: "8.1.2", title: "Eliminating hazards and reducing OH&S risks",
    keywords: ["guard", "control", "ppe", "eliminate", "substitute", "engineering"],
    sources: ["sop", "work_instruction"] },
  { key: "45001-8.2", standard: "ISO45001", clause: "8.2", title: "Emergency preparedness and response",
    keywords: ["fire", "evacuation", "emergency", "robbery", "first aid", "extinguisher"],
    hazards: ["fire", "violence_robbery"] },
  { key: "45001-9.1", standard: "ISO45001", clause: "9.1", title: "Monitoring, measurement, analysis and performance evaluation",
    keywords: ["inspection", "monitoring", "kpi", "audit"], sources: ["audit_report"] },
  { key: "45001-10.2", standard: "ISO45001", clause: "10.2", title: "Incident, nonconformity and corrective action",
    keywords: ["incident", "injury", "investigation", "root cause", "corrective"],
    classes: ["first_aid", "medical_treatment", "lost_time_injury", "property_damage", "dangerous_occurrence", "near_miss"],
    sources: ["incident_log"] },

  // ── ISO 9001 / 22000 ──
  { key: "9001-7.5.3", standard: "ISO9001", clause: "7.5.3", title: "Control of documented information",
    keywords: ["document control", "revision", "approval", "superseded"], sources: ["sop", "policy", "work_instruction"] },
  { key: "9001-8.7", standard: "ISO9001", clause: "8.7", title: "Control of nonconforming outputs",
    keywords: ["defect", "nonconform", "reject", "quality", "customer complaint"],
    classes: ["quality_nonconformance"], hazards: ["product_quality"] },
  { key: "9001-10.2", standard: "ISO9001", clause: "10.2", title: "Nonconformity and corrective action",
    keywords: ["corrective action", "capa", "recurrence"], classes: ["quality_nonconformance"] },
  { key: "22000-8.5", standard: "ISO22000", clause: "8.5", title: "Hazard control (HACCP)",
    keywords: ["food", "temperature", "cold chain", "contamination", "allergen", "fryer", "haccp"],
    classes: ["food_safety"], hazards: ["biological"] },

  // ── ISO 14001 ──
  { key: "14001-8.1", standard: "ISO14001", clause: "8.1", title: "Operational planning and control",
    keywords: ["spill", "waste", "oil", "effluent", "environment"], classes: ["environmental"] },

  // ── SA statutory ──
  { key: "ohsa-s8", standard: "OHSA", clause: "s8", title: "General duties of employers to their employees",
    keywords: ["safe working environment", "employer duty", "unsafe", "maintenance"] },
  { key: "ohsa-s24", standard: "OHSA", clause: "s24", title: "Report to inspector regarding certain incidents",
    keywords: ["hospital", "amputation", "fracture", "unconscious", "fatal", "lost time", "dangerous occurrence"],
    classes: ["lost_time_injury", "dangerous_occurrence"] },
  { key: "ergo-reg3", standard: "ERGO_REGS", clause: "Reg 3", title: "Ergonomic risk assessment",
    keywords: ["lifting", "carrying", "posture", "repetitive", "strain", "back", "shelf", "pallet", "manual handling"],
    hazards: ["manual_handling", "repetitive_strain"] },
  { key: "gsr-2", standard: "GSR", clause: "Reg 2", title: "Personal safety equipment and facilities",
    keywords: ["ppe", "gloves", "boots", "goggles", "apron", "mesh glove"], hazards: ["cut_laceration", "burn_scald"] },
  { key: "eir-coc", standard: "EMR", clause: "EIR Reg 7", title: "Certificate of Compliance (electrical installation)",
    keywords: ["electrical", "shock", "wiring", "db board", "plug", "coc", "trip switch"], hazards: ["electrical"] },
  { key: "hca-reg", standard: "HCA", clause: "Reg 6", title: "Risk assessment — hazardous chemical agents",
    keywords: ["chemical", "sds", "msds", "bleach", "degreaser", "fumes", "sanitiser"], hazards: ["chemical"] },
  { key: "coida-s38", standard: "COIDA", clause: "s38", title: "Employer's report of accident (W.Cl.2)",
    keywords: ["doctor", "medical treatment", "hospital", "days off", "booked off"],
    classes: ["medical_treatment", "lost_time_injury"] },
] as const;

export const catalogueByKey = new Map(CLAUSE_CATALOGUE.map((c) => [c.key, c]));
