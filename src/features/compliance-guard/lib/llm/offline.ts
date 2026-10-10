import { type LlmProvider, LlmUnavailableError } from "./provider";

/**
 * Deterministic, zero-network provider. Generation is unsupported (agents fall back
 * to their rule-based heuristics); embeddings use signed feature hashing over
 * word uni/bi-grams so semantic search still works offline and in CI.
 */
export class OfflineProvider implements LlmProvider {
  readonly name = "offline";
  readonly supportsGeneration = false;

  constructor(private readonly dims: number) {}

  async generateJson<T>(): Promise<T> {
    throw new LlmUnavailableError();
  }

  async embed(texts: string[]): Promise<number[][]> {
    return texts.map((t) => this.hashEmbed(t));
  }

  private hashEmbed(text: string): number[] {
    const v = new Float32Array(this.dims);
    const tokens: string[] = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
    const feats = tokens.concat(tokens.slice(1).map((t, i) => `${tokens[i]}_${t}`));
    for (const f of feats) {
      const h = fnv1a(f);
      v[h % this.dims] += h & 0x80000000 ? -1 : 1;
    }
    let norm = 0;
    for (const x of v) norm += x * x;
    norm = Math.sqrt(norm) || 1;
    return Array.from(v, (x) => x / norm);
  }
}

function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
