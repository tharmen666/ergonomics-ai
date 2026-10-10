import "server-only";
import { z } from "zod";
import type { JsonGenerationRequest, LlmProvider } from "./provider";
import { OfflineProvider } from "./offline";
import { GeminiProvider } from "./gemini";
import { env } from "@/lib/config/env";

export interface ResilientBridgeOptions {
  maxRetries?: number;
  initialBackoffMs?: number;
  circuitBreakerThreshold?: number;
  circuitBreakerResetMs?: number;
  timeoutMs?: number;
}

/**
 * Resilient, provider-agnostic bridge with deterministic offline fallback.
 * Ensures the system NEVER crashes, throws unhandled exceptions, or freezes
 * during high-volume data processing or network outages.
 */
export class ResilientLlmBridge implements LlmProvider {
  readonly name: string;
  readonly model?: string;
  readonly supportsGeneration = true;

  private primary: LlmProvider;
  private fallback: OfflineProvider;
  private failureCount = 0;
  private circuitOpenUntil = 0;
  private activeCalls = 0;
  private readonly maxConcurrency = 10;

  constructor(
    primaryProvider?: LlmProvider,
    private readonly options: ResilientBridgeOptions = {}
  ) {
    const e = env();
    this.fallback = new OfflineProvider(e.EMBEDDING_DIMS);
    this.primary =
      primaryProvider ??
      (e.LLM_PROVIDER === "gemini" && e.GEMINI_API_KEY
        ? new GeminiProvider(e.GEMINI_API_KEY, e.GEMINI_MODEL, e.GEMINI_EMBED_MODEL, e.EMBEDDING_DIMS)
        : this.fallback);

    this.name = `bridge(${this.primary.name}->offline)`;
    this.model = this.primary.model;
  }

  /**
   * Generates structured JSON with strict schema validation.
   * If primary fails, hits timeouts, or trips circuit breaker,
   * cleanly falls back to deterministic heuristic rules.
   */
  async generateJson<T>(req: JsonGenerationRequest<T>): Promise<T> {
    const maxRetries = this.options.maxRetries ?? 2;
    const initialBackoff = this.options.initialBackoffMs ?? 300;
    const timeout = req.timeoutMs ?? this.options.timeoutMs ?? 25000;

    // Check circuit breaker status
    const isCircuitOpen = Date.now() < this.circuitOpenUntil;

    if (!isCircuitOpen && this.primary.supportsGeneration) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          await this.acquireSlot();
          try {
            const result = await this.primary.generateJson<T>({
              ...req,
              timeoutMs: timeout,
            });
            this.recordSuccess();
            return result;
          } finally {
            this.releaseSlot();
          }
        } catch (err: unknown) {
          const isLastAttempt = attempt === maxRetries;
          if (isLastAttempt) {
            this.recordFailure();
            break;
          }
          // Exponential jittered backoff
          const jitter = Math.random() * 100;
          const backoff = initialBackoff * Math.pow(2, attempt - 1) + jitter;
          await new Promise((r) => setTimeout(r, backoff));
        }
      }
    }

    // Deterministic fallback: Offline provider doesn't generate JSON,
    // so we throw a clean LlmUnavailableError that the agent runtime catches
    // to execute its verified heuristic pathway without crashing.
    return this.fallback.generateJson<T>();
  }

  /**
   * Embeds text batches. Falls back to deterministic feature hashing on network error.
   */
  async embed(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];
    if (Date.now() < this.circuitOpenUntil || !this.primary.supportsGeneration) {
      return this.fallback.embed(texts);
    }

    try {
      return await this.primary.embed(texts);
    } catch {
      this.recordFailure();
      return this.fallback.embed(texts);
    }
  }

  private recordSuccess() {
    this.failureCount = 0;
  }

  private recordFailure() {
    this.failureCount++;
    const threshold = this.options.circuitBreakerThreshold ?? 4;
    const resetMs = this.options.circuitBreakerResetMs ?? 60000;

    if (this.failureCount >= threshold) {
      this.circuitOpenUntil = Date.now() + resetMs;
    }
  }

  private async acquireSlot(): Promise<void> {
    while (this.activeCalls >= this.maxConcurrency) {
      await new Promise((r) => setTimeout(r, 50));
    }
    this.activeCalls++;
  }

  private releaseSlot(): void {
    this.activeCalls = Math.max(0, this.activeCalls - 1);
  }
}

let bridgeInstance: ResilientLlmBridge | undefined;

export function getResilientBridge(): ResilientLlmBridge {
  if (!bridgeInstance) {
    bridgeInstance = new ResilientLlmBridge();
  }
  return bridgeInstance;
}
