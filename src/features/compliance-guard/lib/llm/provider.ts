import type { z } from "zod";

export interface JsonGenerationRequest<T> {
  /** Stable system instruction (cache-friendly). */
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  temperature?: number;
  /** Hard timeout per attempt. */
  timeoutMs?: number;
}

/**
 * Provider-agnostic contract. Agents depend ONLY on this interface, so swapping
 * Gemini ↔ OpenAI ↔ Anthropic ↔ on-prem is a one-file change.
 */
export interface LlmProvider {
  readonly name: string;
  readonly model?: string;
  /** False for the offline provider — agents then use their deterministic heuristic path. */
  readonly supportsGeneration: boolean;
  generateJson<T>(req: JsonGenerationRequest<T>): Promise<T>;
  embed(texts: string[]): Promise<number[][]>;
}

export class LlmUnavailableError extends Error {
  constructor(msg = "LLM generation not available for this provider") {
    super(msg);
    this.name = "LlmUnavailableError";
  }
}

export async function withTimeout<T>(p: Promise<T>, ms: number, label = "operation"): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    clearTimeout(timer);
  }
}
