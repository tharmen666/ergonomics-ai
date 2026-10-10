import type { ParsedIncident, RootCauseAnalysis } from "@/lib/types";
import { defineAgent } from "../core/agent";

export interface CriticInput {
  rca: RootCauseAnalysis;
  parsed: ParsedIncident;
}

export interface CriticVerdict {
  passed: boolean;
  blameFlagged: boolean;
  issues: string[];
}

const BLAME_RX = /\b(careless(?:ness)?|negligen(?:t|ce)|not paying attention|didn'?t pay attention|human error|worker error|stupid|lazy|should have known|failed to be careful|own fault)\b/i;

/**
 * Deterministic quality gate (fast, explainable). Enforces Just Culture and evidence
 * grounding before an RCA can reach the human validator.
 */
export const rcaCriticAgent = defineAgent<CriticInput, CriticVerdict>({
  name: "rca_critic",
  heuristic({ rca }) {
    const issues: string[] = [];
    const blameIn = [rca.rootCause, ...rca.underlyingCauses].filter((s) => BLAME_RX.test(s));
    const blameFlagged = blameIn.length > 0;
    if (blameFlagged) issues.push(`Root/underlying cause attributes blame to the individual ("${blameIn[0].slice(0, 80)}"). Identify the systemic condition that allowed the behaviour.`);

    if (rca.whys.length < 3) issues.push("5-Whys chain is too shallow (<3 levels).");
    const ungrounded = rca.whys.filter((w) => w.level <= 2 && w.evidence.length === 0);
    if (ungrounded.length) issues.push(`Why level(s) ${ungrounded.map((w) => w.level).join(", ")} lack supporting evidence from the facts.`);

    const populated = Object.values(rca.fishbone).filter((v) => v.length > 0).length;
    if (populated < 2) issues.push("Ishikawa covers fewer than 2 of the 6M categories.");

    if (rca.rootCause.trim().toLowerCase() === rca.immediateCause.trim().toLowerCase()) {
      issues.push("Root cause restates the immediate cause; go deeper to a management-system level.");
    }

    return {
      value: { passed: issues.length === 0, blameFlagged, issues },
      confidence: 0.9,
      note: issues.length ? `${issues.length} issue(s)` : "passed",
    };
  },
});
