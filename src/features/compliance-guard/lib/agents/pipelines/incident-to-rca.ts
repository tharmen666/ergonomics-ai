import type {
  AgentRun, AgentRunId, AppError, Incident, IncidentId, IncidentIntake, ISODateString, Result,
} from "@/lib/types";
import type { LlmProvider } from "@/lib/llm/provider";
import type { Repository, ScoredChunk } from "@/lib/db/repository";
import { addMonths, newId, nowIso } from "@/lib/utils/core";
import { planSla, type SlaPlan } from "@/lib/sla/policies";
import type { AgentContext } from "../core/agent";
import { intakeParserAgent } from "../incident/intake-parser.agent";
import { classifierAgent } from "../incident/classifier.agent";
import { riskScorerAgent } from "../incident/risk-scorer.agent";
import { isoMapperAgent } from "../incident/iso-mapper.agent";
import { rcaInvestigatorAgent } from "../incident/rca-investigator.agent";
import { rcaCriticAgent } from "../incident/rca-critic.agent";
import { capaPlannerAgent } from "../incident/capa-planner.agent";

export interface IncidentPipelineDeps {
  repo: Repository;
  llm: LlmProvider;
  hitlThreshold: number;
  /** Bulk historical back-fill: deterministic agents only, no SLA nudges, state=closed. */
  historical?: boolean;
  persist?: boolean;
}

export interface IncidentPipelineResult {
  incident: Incident;
  sla: SlaPlan | null;
  run: AgentRun;
}

const SOP_MIN_SCORE = 0.15;

async function retrieveSops(deps: IncidentPipelineDeps, ctx: AgentContext, query: string): Promise<ScoredChunk[]> {
  try {
    const [vec] = await deps.llm.embed([query]);
    if (!vec?.length) return [];
    return (await deps.repo.searchChunks(ctx.tenantId, vec, 4)).filter((c) => c.score >= SOP_MIN_SCORE);
  } catch {
    return []; // Retrieval is an enhancement, never a blocker.
  }
}

/**
 * Multi-agent orchestration: Incident → RCA → CAPA → SLA.
 *
 *   IntakeParser ─▶ Classifier ─┬─▶ RiskScorer (+recurrence lookup) ─┐
 *                               ├─▶ IsoMapper                        ├─▶ RCA Investigator ⇄ Critic ─▶ CAPA Planner ─▶ SLA Router
 *                               └─▶ SOP retrieval (RAG)              ┘
 *
 * Independent stages run concurrently; total latency ≈ the critical path, not the sum.
 */
export async function runIncidentToRca(
  intake: IncidentIntake,
  deps: IncidentPipelineDeps,
): Promise<Result<IncidentPipelineResult>> {
  const t0 = performance.now();
  const now = nowIso();
  const ctx: AgentContext = {
    tenantId: intake.tenantId,
    llm: deps.llm,
    hitlThreshold: deps.hitlThreshold,
    forceHeuristic: deps.historical,
    traces: [],
  };

  try {
    // ── Stage 1: structure the narrative ──
    const parsed = await intakeParserAgent.run({ intake, now }, ctx);

    // ── Stage 2: classify ──
    const cls = await classifierAgent.run({ narrative: intake.narrative, parsed: parsed.value }, ctx);
    const classification = { ...cls.value, confidence: cls.confidence };

    // ── Stage 3: fan-out (risk ∥ ISO mapping ∥ SOP retrieval) ──
    const since = addMonths(parsed.value.occurredAt, -12);
    const [recurrence, sopContext, clauses] = await Promise.all([
      deps.repo.countSimilarIncidents(intake.tenantId, intake.siteId, classification.hazards[0], since).catch(() => 0),
      deps.historical ? Promise.resolve([]) : retrieveSops(deps, ctx, `${parsed.value.summary} ${classification.hazards.join(" ")} ${parsed.value.equipment.join(" ")}`),
      isoMapperAgent.run({
        text: intake.narrative, incidentClass: classification.incidentClass, hazards: classification.hazards,
      }, ctx),
    ]);
    const risk = await riskScorerAgent.run({ classification, parsed: parsed.value, recurrenceCount: recurrence }, ctx);

    // ── Stage 4: RCA with critic loop (max 1 revision) ──
    const rcaInput = { parsed: parsed.value, classification, risk: risk.value, sopContext };
    let rca = await rcaInvestigatorAgent.run(rcaInput, ctx);
    let verdict = await rcaCriticAgent.run({ rca: rca.value, parsed: parsed.value }, ctx);
    if (!verdict.value.passed && ctx.llm.supportsGeneration && !ctx.forceHeuristic) {
      rca = await rcaInvestigatorAgent.run({ ...rcaInput, critique: verdict.value.issues }, ctx);
      verdict = await rcaCriticAgent.run({ rca: rca.value, parsed: parsed.value }, ctx);
    }
    const rcaValue = { ...rca.value, confidence: rca.confidence, blameFlagged: verdict.value.blameFlagged };

    // ── Stage 5: CAPA ──
    const capas = await capaPlannerAgent.run({ classification, risk: risk.value, rca: rcaValue, now }, ctx);

    // ── HITL gate ──
    const reviewReasons: string[] = [];
    const lowConf = ctx.traces.filter((t) => t.confidence < deps.hitlThreshold).map((t) => t.agent);
    if (lowConf.length) reviewReasons.push(`Low agent confidence: ${[...new Set(lowConf)].join(", ")}`);
    if (risk.value.band === "high" || risk.value.band === "critical") reviewReasons.push(`Risk band ${risk.value.band}`);
    if (classification.reportableToDEL) reviewReasons.push("OHS Act s24 reportable");
    if (!verdict.value.passed) reviewReasons.push(...verdict.value.issues.map((i) => `Critic: ${i}`));
    const requiresHumanReview = !deps.historical && reviewReasons.length > 0;

    const id = newId<IncidentId>("inc");
    const incident: Incident = {
      id,
      tenantId: intake.tenantId,
      siteId: intake.siteId,
      reportedBy: intake.reportedBy,
      channel: intake.channel,
      narrative: intake.narrative,
      parsed: parsed.value,
      classification,
      risk: risk.value,
      clauses: clauses.value,
      rca: rcaValue,
      capas: capas.value.map((c) => ({ ...c, status: deps.historical ? "closed" : requiresHumanReview ? "proposed" : "approved" })),
      state: deps.historical ? "closed" : requiresHumanReview ? "awaiting_validation" : "capa_in_progress",
      requiresHumanReview,
      reviewReasons,
      createdAt: now,
      updatedAt: now,
    };

    const sla = deps.historical ? null : planSla(id, risk.value.band, classification, now);
    const run: AgentRun = {
      id: newId<AgentRunId>("run"),
      tenantId: intake.tenantId,
      pipeline: deps.historical ? "historical_backfill" : "incident_to_rca",
      traces: ctx.traces,
      totalMs: Math.round(performance.now() - t0),
      createdAt: now as ISODateString,
    };

    if (deps.persist !== false) {
      await Promise.all([deps.repo.saveIncidents([incident]), deps.repo.saveAgentRun(run, id)]);
    }
    return { ok: true, value: { incident, sla, run } };
  } catch (e) {
    const error: AppError = {
      code: "AGENT_FAILURE",
      message: e instanceof Error ? e.message : "Incident pipeline failed",
      details: { traces: ctx.traces },
    };
    return { ok: false, error };
  }
}
