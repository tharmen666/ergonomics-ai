import "server-only";
import { env } from "@/lib/config/env";
import { GeminiProvider } from "./gemini";
import { OfflineProvider } from "./offline";
import type { LlmProvider } from "./provider";

export type { LlmProvider } from "./provider";

let instance: LlmProvider | undefined;

/** Process-wide singleton (reused across warm serverless invocations). */
export function getLlm(): LlmProvider {
  if (instance) return instance;
  const e = env();
  instance =
    e.LLM_PROVIDER === "gemini" && e.GEMINI_API_KEY
      ? new GeminiProvider(e.GEMINI_API_KEY, e.GEMINI_MODEL, e.GEMINI_EMBED_MODEL, e.EMBEDDING_DIMS)
      : new OfflineProvider(e.EMBEDDING_DIMS);
  return instance;
}
