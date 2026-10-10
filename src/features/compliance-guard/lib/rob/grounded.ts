import { REGISTRY, RegId, RegulationEntry } from '../compliance/regulations-registry';

export interface RobResponse {
  answer: string;
  citationsUsed: string[];
  isVerified?: boolean;
}

export interface GroundedRobOptions {
  requireVerified?: boolean;
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'how', 'in', 'is', 'it', 'of', 'on', 'or', 'that', 'the', 'this',
  'to', 'was', 'what', 'when', 'where', 'who', 'will', 'with', 'do',
  'i', 'need', 'my', 'we', 'our', 'should', 'can', 'must', 'me', 'you',
  'give', 'legal', 'advice', 'law', 'laws', 'rules', 'rule', 'all',
  'any', 'about', 'tell'
]);

const PROMPT_INJECTION_PATTERN = /ignore\s+(all\s+)?(previous\s+)?(rules|instructions|system\s+prompt)|say\s+(i\s+am|that\s+i\s+am)\s+.*compliant/i;

/**
 * Tokenizes text into lowercase alphanumeric keywords without stop words.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * Scores a regulation entry based on keyword overlap across its metadata and summary.
 * Internal scopeNote is strictly excluded from scoring and never leaked to users.
 */
function scoreEntry(entry: RegulationEntry, queryTokens: string[], rawQuery: string): number {
  if (queryTokens.length === 0) return 0;

  let score = 0;
  const searchableText = [
    entry.id,
    entry.instrument,
    entry.provision,
    entry.title,
    entry.summary,
  ].join(' ').toLowerCase();

  for (const token of queryTokens) {
    if (searchableText.includes(token)) {
      score += 3;
    }
  }

  // Exact ID match bonus
  if (rawQuery.includes(entry.id.toLowerCase())) {
    score += 20;
  }

  // Semantic domain keyword bonuses
  if (entry.id === 'OHSA_S17' && (rawQuery.includes('rep') || rawQuery.includes('representative') || rawQuery.includes('ratio') || rawQuery.includes('safety rep'))) {
    score += 15;
  }
  if (entry.id === 'GSR_3' && (rawQuery.includes('first aid') || rawQuery.includes('first-aid') || rawQuery.includes('first aider') || rawQuery.includes('first aid box'))) {
    score += 15;
  }
  if (entry.id === 'ERGO_2019' && (rawQuery.includes('ergo') || rawQuery.includes('ergonomic') || rawQuery.includes('manual handling') || rawQuery.includes('lifting posture'))) {
    score += 15;
  }
  if (entry.id === 'SANS_10087_1' && (rawQuery.includes('lpg') || rawQuery.includes('gas cylinder') || rawQuery.includes('gas installation'))) {
    score += 15;
  }
  if (entry.id === 'SANS_10089_3' && (rawQuery.includes('forecourt') || rawQuery.includes('underground storage') || rawQuery.includes('fuel tank') || rawQuery.includes('petroleum storage'))) {
    score += 15;
  }
  if (entry.id === 'R638' && (rawQuery.includes('food handling') || rawQuery.includes('food premises') || rawQuery.includes('food hygiene'))) {
    score += 15;
  }
  if (entry.id === 'DMR_18' && (rawQuery.includes('lifting machine') || rawQuery.includes('forklift') || rawQuery.includes('crane') || rawQuery.includes('stacking'))) {
    score += 15;
  }

  return score;
}

/**
 * Validates that every sentence in an answer contains a [REG:<ID>] token from the retrieved set.
 */
export function validateAnswerSentences(answer: string, allowedIds: string[]): boolean {
  if (!answer.trim()) return false;
  const sentences = answer
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const sentence of sentences) {
    const hasAllowedToken = allowedIds.some(
      (id) => sentence.includes(`[REG:${id}]`) || sentence.includes(`[${id}]`)
    );
    if (!hasAllowedToken) {
      return false;
    }
  }
  return true;
}

/**
 * Grounded ROB OHS Assistant Engine.
 * 
 * Rules:
 * 1. Scores registry entries by keyword overlap across id, instrument, provision, title, and summary.
 * 2. Scope notes are NEVER returned to the user (they are internal verifier text).
 * 3. Answers are constructed strictly from summary.
 * 4. Every sentence must contain a statutory citation token from the retrieved set.
 * 5. In release mode (REQUIRE_VERIFIED_CITATIONS=1), unverified entries are ignored.
 * 6. If no match exists or question is outside statutory scope, returns exactly:
 *    "This requires human professional legal interpretation."
 * 7. Ignores prompt injection attempts.
 */
export function queryGroundedRob(question: string, options?: GroundedRobOptions): RobResponse {
  const requireVerified = options?.requireVerified ?? (process.env.REQUIRE_VERIFIED_CITATIONS === '1');
  const lowerQ = question.toLowerCase().trim();

  // Guard against empty query or prompt injection
  if (!lowerQ || PROMPT_INJECTION_PATTERN.test(question)) {
    return {
      answer: 'This requires human professional legal interpretation.',
      citationsUsed: [],
    };
  }

  const queryTokens = tokenize(question);
  const scoredEntries: Array<{ id: RegId; entry: RegulationEntry; score: number }> = [];

  for (const [id, entry] of Object.entries(REGISTRY) as Array<[RegId, RegulationEntry]>) {
    if (requireVerified && entry.status !== 'verified') {
      // Release mode ignores all unverified entries
      continue;
    }

    const score = scoreEntry(entry, queryTokens, lowerQ);
    // Minimum threshold for confident statutory relevance
    if (score >= 6) {
      scoredEntries.push({ id, entry, score });
    }
  }

  // Sort by highest overlap score
  scoredEntries.sort((a, b) => b.score - a.score);

  if (scoredEntries.length === 0) {
    return {
      answer: 'This requires human professional legal interpretation.',
      citationsUsed: [],
    };
  }

  const topMatch = scoredEntries[0];
  const citationId = topMatch.id;
  const entry = topMatch.entry;

  // Build answer strictly from summary (never scopeNote). Clean any accidental "CONFIRM:" text.
  const cleanSummary = entry.summary.replace(/CONFIRM:[^.]*\.?/gi, '').trim();

  // Every sentence must contain [REG:<ID>] token; also include [ID] for legacy tests
  const answer = `Per [REG:${citationId}] ([${citationId}]) (${entry.instrument}, ${entry.provision}), ${cleanSummary}.`;

  // Validate sentence citation guarantee
  const isValid = validateAnswerSentences(answer, [citationId]);
  if (!isValid) {
    return {
      answer: 'This requires human professional legal interpretation.',
      citationsUsed: [],
    };
  }

  return {
    answer,
    citationsUsed: [citationId],
    isVerified: entry.status === 'verified',
  };
}
