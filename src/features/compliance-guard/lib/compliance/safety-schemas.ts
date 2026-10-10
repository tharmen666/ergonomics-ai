import { z } from "zod";
import { CLAUSE_CATALOGUE } from "./clause-catalogue";

/**
 * Strict Safety & Anti-Hallucination Schemas.
 * Enforces ISO 45001, ISO 9001, OHS Act, and POPIA regulatory boundaries.
 * Zero-tolerance for ungrounded LLM fabrications or individual worker blame.
 */

// 1. Closed-catalogue clause references
const VALID_CLAUSE_KEYS = CLAUSE_CATALOGUE.map((c) => c.key) as [string, ...string[]];
const VALID_STANDARDS = [
  "ISO45001", "ISO9001", "ISO14001", "ISO22000", "OHSA",
  "ERGO_REGS", "GSR", "EMR", "HCA", "COIDA", "LPS"
] as const;

export const ClauseMappingSafetySchema = z.object({
  key: z.enum(VALID_CLAUSE_KEYS, {
    message: "Invalid or hallucinated clause key. Must originate from curated statutory catalogue.",
  }),
  standard: z.enum(VALID_STANDARDS),
  clause: z.string().min(1).max(30),
  title: z.string().min(3).max(120),
  confidence: z.number().min(0.1).max(1.0),
  rationale: z.string().min(5).max(300).describe("Factual evidence grounding mapping to clause"),
});

// 2. SOP Document Control Schema (ISO 9001 §7.5.3)
export const SopDocumentSafetySchema = z.object({
  title: z.string().trim().min(3).max(180),
  kind: z.enum([
    "sop", "policy", "work_instruction", "risk_assessment",
    "incident_log", "audit_report", "training_record", "unknown"
  ]),
  version: z.number().int().positive().default(1),
  contentHash: z.string().regex(/^[a-f0-9]{64}$/, "Must be valid SHA-256 hex digest"),
  sourceFileName: z.string().min(1).max(255),
  mimeType: z.enum([
    "text/plain", "text/markdown", "text/csv", "application/json",
    "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]),
  reviewDueAt: z.string().datetime(),
  clauseMappings: z.array(ClauseMappingSafetySchema).max(12),
});

// 3. Just-Culture Anti-Blame Regex Guardrail
const BLAME_PATTERNS = [
  /\bcareless(?:ness)?\b/i,
  /\bnegligen(?:t|ce)\b/i,
  /\bworker error\b/i,
  /\bhuman error\b/i,
  /\blazy\b/i,
  /\bnot paying attention\b/i,
  /\bfailed to be careful\b/i,
  /\bown fault\b/i,
  /\bstupid\b/i,
  /\bshould have known better\b/i,
];

export const RcaWhyStepSafetySchema = z.object({
  level: z.number().int().min(1).max(5),
  question: z.string().min(3).max(200),
  answer: z.string().min(3).max(300),
  evidence: z.array(z.string().min(1)).min(1, "Each Why level must be grounded in facts or SOP text"),
});

export const RcaSafetySchema = z.object({
  method: z.literal("5_whys+ishikawa"),
  whys: z.array(RcaWhyStepSafetySchema).min(3, "Root cause analysis must have at least 3 levels of depth"),
  fishbone: z.object({
    people: z.array(z.string()),
    method: z.array(z.string()),
    machine: z.array(z.string()),
    material: z.array(z.string()),
    environment: z.array(z.string()),
    management: z.array(z.string()),
  }),
  immediateCause: z.string().min(5).max(300),
  underlyingCauses: z.array(z.string().min(5)).min(1),
  rootCause: z.string().min(10).max(400),
  confidence: z.number().min(0).max(1),
}).superRefine((data, ctx) => {
  // Enforce Just Culture: Reject individual blame in systemic root causes
  for (const pattern of BLAME_PATTERNS) {
    if (pattern.test(data.rootCause)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rootCause"],
        message: "Blame-based root causes violate Just Culture. Must identify the systemic or organizational failure.",
      });
      break;
    }
  }

  // Ensure root cause is not merely a verbatim repetition of the immediate cause
  if (data.rootCause.trim().toLowerCase() === data.immediateCause.trim().toLowerCase()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["rootCause"],
      message: "Root cause cannot restate immediate cause. Must penetrate to management-system level.",
    });
  }
});

// 4. CAPA Safety Hierarchy Schema (ISO 45001 §8.1.2)
export const CapaActionSafetySchema = z.object({
  type: z.enum(["corrective", "preventive"]),
  description: z.string().min(10).max(400),
  controlLevel: z.enum(["elimination", "substitution", "engineering", "administrative", "ppe"]),
  ownerRole: z.enum(["site_manager", "general_manager", "safety_officer", "maintenance", "hr"]),
  dueAt: z.string().datetime(),
  verification: z.string().min(10).max(250).describe("Measurable criterion with quantity & timeframe"),
});

export const CapaPlanSafetySchema = z.array(CapaActionSafetySchema)
  .min(1, "At least one corrective action is mandatory")
  .superRefine((actions, ctx) => {
    // PPE cannot be the sole control mechanism
    const onlyPpe = actions.every((a) => a.controlLevel === "ppe");
    if (onlyPpe && actions.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "PPE cannot be the sole corrective control (ISO 45001 §8.1.2 Hierarchy of Controls).",
      });
    }
  });

// 5. Immutable Audit Log Security Schema
export const AuditLogRecordSafetySchema = z.object({
  id: z.string().min(5),
  tenantId: z.string().min(3),
  action: z.enum(["ingest", "rca_generated", "capa_approved", "purge_rolling_window", "del_pack_exported"]),
  timestamp: z.string().datetime(),
  recordHash: z.string().regex(/^[a-f0-9]{64}$/, "Tamper-evident SHA-256 seal required"),
  performedBy: z.string().min(3),
  payloadSummary: z.string().max(500),
});

export type ClauseMappingSafe = z.infer<typeof ClauseMappingSafetySchema>;
export type SopDocumentSafe = z.infer<typeof SopDocumentSafetySchema>;
export type RcaSafe = z.infer<typeof RcaSafetySchema>;
export type CapaActionSafe = z.infer<typeof CapaActionSafetySchema>;
export type AuditLogRecordSafe = z.infer<typeof AuditLogRecordSafetySchema>;

export * from "./site-intake-schema";
