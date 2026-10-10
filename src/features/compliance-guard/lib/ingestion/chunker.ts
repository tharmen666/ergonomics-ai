import { estimateTokens } from "@/lib/utils/core";

export interface ChunkDraft {
  ordinal: number;
  headingPath: string[];
  text: string;
  tokenEstimate: number;
}

export interface ChunkOptions {
  maxTokens?: number;
  overlapTokens?: number;
}

/** Markdown (#), numbered (1., 4.2, 4.2.1) and ALL-CAPS headings typical of SOP templates. */
const HEADING_RX = /^(?:(#{1,6})\s+(.+)|((?:\d+\.){1,4}\d*)\s+([A-Z].{2,80})|([A-Z][A-Z0-9 &/,-]{3,60}):?)$/;

function headingLevel(line: string): { level: number; title: string } | null {
  const m = line.trim().match(HEADING_RX);
  if (!m) return null;
  if (m[1]) return { level: m[1].length, title: m[2].trim() };
  if (m[3]) return { level: m[3].replace(/\.$/, "").split(".").length, title: `${m[3]} ${m[4]}`.trim() };
  if (m[5]) return { level: 1, title: m[5].trim() };
  return null;
}

/**
 * Structure-aware chunker: splits on SOP headings, keeps a heading breadcrumb per
 * chunk (better retrieval + citations), packs paragraphs up to `maxTokens` with overlap.
 */
export function chunkDocument(text: string, opts: ChunkOptions = {}): ChunkDraft[] {
  const maxTokens = opts.maxTokens ?? 400;
  const overlapTokens = opts.overlapTokens ?? 60;
  const out: ChunkDraft[] = [];
  const path: string[] = [];
  let buf: string[] = [];
  let bufTokens = 0;

  const flush = () => {
    const body = buf.join("\n").trim();
    if (body) out.push({ ordinal: out.length, headingPath: [...path], text: body, tokenEstimate: estimateTokens(body) });
    // carry overlap tail into next chunk
    const tail: string[] = [];
    let t = 0;
    for (let i = buf.length - 1; i >= 0 && t < overlapTokens; i--) {
      tail.unshift(buf[i]);
      t += estimateTokens(buf[i]);
    }
    buf = tail;
    bufTokens = t;
  };

  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    const h = line.length < 100 ? headingLevel(line) : null;
    if (h) {
      if (bufTokens > 0) { flush(); buf = []; bufTokens = 0; }
      path.splice(h.level - 1);
      path[h.level - 1] = h.title;
      continue;
    }
    if (!line.trim()) continue;
    const tokens = estimateTokens(line);
    if (bufTokens + tokens > maxTokens && bufTokens > 0) flush();
    // Hard-split pathological single lines (e.g. PDF text with no newlines).
    if (tokens > maxTokens) {
      const size = maxTokens * 4;
      for (let i = 0; i < line.length; i += size) { buf.push(line.slice(i, i + size)); bufTokens += maxTokens; flush(); }
      continue;
    }
    buf.push(line);
    bufTokens += tokens;
  }
  if (bufTokens > 0 && buf.join("").trim()) {
    const body = buf.join("\n").trim();
    out.push({ ordinal: out.length, headingPath: [...path], text: body, tokenEstimate: estimateTokens(body) });
  }
  return out;
}
