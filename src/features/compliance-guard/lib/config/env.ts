import "server-only";
import { z } from "zod";

/**
 * Validated server environment. Every key is optional so the platform boots in
 * "offline demo" mode (in-memory store + deterministic agents) with zero config.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  LLM_PROVIDER: z.enum(["gemini", "offline"]).default("gemini"),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  GEMINI_EMBED_MODEL: z.string().default("gemini-embedding-001"),
  EMBEDDING_DIMS: z.coerce.number().int().positive().default(768),
  /** Agent outputs below this confidence are routed to the HITL safety officer queue. */
  HITL_CONFIDENCE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.7),
  RETENTION_MONTHS: z.coerce.number().int().positive().default(36),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(15),
});

export type Env = z.infer<typeof EnvSchema>;

let cached: Env | undefined;

export function env(): Env {
  if (cached) return cached;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment: ${parsed.error.message}`);
  }
  cached = parsed.data;
  return cached;
}
