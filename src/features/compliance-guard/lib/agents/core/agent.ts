import type { AgentName, AgentTrace, Confidence, TenantId } from "@/lib/types";
import type { LlmProvider } from "@/lib/llm/provider";
import { nowIso } from "@/lib/utils/core";

export interface AgentContext {
  tenantId: TenantId;
  llm: LlmProvider;
  /** Below this, outputs are flagged for human-in-the-loop validation. */
  hitlThreshold: number;
  /** Force the deterministic path (bulk historical backfill, cost control, tests). */
  forceHeuristic?: boolean;
  /** Shared, append-only trace sink for the pipeline run. */
  traces: AgentTrace[];
}

export interface AgentOutput<O> {
  value: O;
  confidence: Confidence;
  note?: string;
}

export interface AgentSpec<I, O> {
  name: AgentName;
  /** LLM-powered path. Optional — some agents are purely deterministic by design (e.g. risk matrix). */
  llm?: (input: I, ctx: AgentContext) => Promise<AgentOutput<O>>;
  /** Deterministic rule-based path. Always required: guarantees the platform never stalls. */
  heuristic: (input: I, ctx: AgentContext) => AgentOutput<O> | Promise<AgentOutput<O>>;
  maxAttempts?: number;
}

export interface Agent<I, O> {
  readonly name: AgentName;
  run(input: I, ctx: AgentContext): Promise<AgentOutput<O>>;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Wraps an agent spec with: LLM-first execution, exponential-backoff retries,
 * graceful heuristic fallback, and per-agent trace capture for auditability.
 */
export function defineAgent<I, O>(spec: AgentSpec<I, O>): Agent<I, O> {
  const maxAttempts = spec.maxAttempts ?? 2;

  return {
    name: spec.name,
    async run(input, ctx) {
      const startedAt = nowIso();
      const t0 = performance.now();
      let attempts = 0;
      let lastError: string | undefined;

      const useLlm = spec.llm && ctx.llm.supportsGeneration && !ctx.forceHeuristic;

      if (useLlm) {
        while (attempts < maxAttempts) {
          attempts++;
          try {
            const out = await spec.llm!(input, ctx);
            ctx.traces.push({
              agent: spec.name, startedAt, durationMs: Math.round(performance.now() - t0),
              provider: ctx.llm.name, model: ctx.llm.model, confidence: out.confidence, attempts, note: out.note,
            });
            return out;
          } catch (e) {
            lastError = e instanceof Error ? e.message : String(e);
            if (attempts < maxAttempts) await sleep(250 * 2 ** (attempts - 1));
          }
        }
      }

      // Deterministic fallback — confidence is capped so low-certainty output hits the HITL queue.
      const out = await spec.heuristic(input, ctx);
      const confidence = useLlm ? Math.min(out.confidence, 0.6) : out.confidence;
      ctx.traces.push({
        agent: spec.name, startedAt, durationMs: Math.round(performance.now() - t0),
        provider: "heuristic", confidence, attempts, error: lastError,
        note: lastError ? `LLM failed, fell back to rules: ${out.note ?? ""}` : out.note,
      });
      return { ...out, confidence };
    },
  };
}
