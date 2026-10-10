import type {
  AgentRun, ControlledDocument, DocumentChunk, DocumentId, HazardCategory, Incident, SiteId, TenantId,
} from "@/lib/types";
import { withinRollingWindow } from "@/lib/utils/core";
import type { Repository, ScoredChunk } from "./repository";

interface Store {
  documents: Map<string, ControlledDocument>;
  chunks: Map<string, DocumentChunk[]>;
  incidents: Map<string, Incident>;
  runs: AgentRun[];
}

// Pinned to globalThis so state survives Next.js dev HMR reloads.
const g = globalThis as unknown as { __cgStore?: Store };
const store: Store = (g.__cgStore ??= {
  documents: new Map(), chunks: new Map(), incidents: new Map(), runs: [],
});

const cosine = (a: number[], b: number[]) => {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] ** 2; nb += b[i] ** 2; }
  return dot / (Math.sqrt(na * nb) || 1);
};

/** Zero-config dev/demo store. Not for production — state is per-instance. */
export class MemoryRepository implements Repository {
  readonly kind = "memory" as const;

  async findDocumentByHash(tenantId: TenantId, hash: string) {
    for (const d of store.documents.values()) if (d.tenantId === tenantId && d.contentHash === hash) return d;
    return null;
  }

  async findCurrentDocument(tenantId: TenantId, key: { externalRef?: string; title: string }) {
    let best: ControlledDocument | null = null;
    for (const d of store.documents.values()) {
      if (d.tenantId !== tenantId || d.status === "superseded") continue;
      const match = key.externalRef ? d.externalRef === key.externalRef : d.title === key.title;
      if (match && (!best || d.version > best.version)) best = d;
    }
    return best;
  }

  async saveDocumentVersion(doc: ControlledDocument, chunks: DocumentChunk[], previousId?: DocumentId) {
    if (previousId) {
      const prev = store.documents.get(previousId);
      if (prev) store.documents.set(previousId, { ...prev, status: "superseded", updatedAt: doc.createdAt });
    }
    store.documents.set(doc.id, doc);
    store.chunks.set(doc.id, chunks);
  }

  async listDocuments(tenantId: TenantId, limit = 50) {
    return [...store.documents.values()]
      .filter((d) => d.tenantId === tenantId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  async searchChunks(tenantId: TenantId, embedding: number[], k: number): Promise<ScoredChunk[]> {
    const scored: ScoredChunk[] = [];
    for (const [docId, chunks] of store.chunks) {
      const doc = store.documents.get(docId);
      if (!doc || doc.tenantId !== tenantId || doc.status === "superseded") continue;
      for (const c of chunks) if (c.embedding) scored.push({ ...c, score: cosine(embedding, c.embedding) });
    }
    return scored.sort((a, b) => b.score - a.score).slice(0, k);
  }

  async saveIncidents(incidents: Incident[]) {
    for (const i of incidents) store.incidents.set(i.id, i);
  }

  async listIncidents(tenantId: TenantId, opts: { limit?: number; hitlOnly?: boolean } = {}) {
    return [...store.incidents.values()]
      .filter((i) => i.tenantId === tenantId && (!opts.hitlOnly || i.requiresHumanReview))
      .sort((a, b) => b.parsed.occurredAt.localeCompare(a.parsed.occurredAt))
      .slice(0, opts.limit ?? 100);
  }

  async countSimilarIncidents(tenantId: TenantId, siteId: SiteId, hazard: HazardCategory, sinceIso: string) {
    let n = 0;
    for (const i of store.incidents.values()) {
      if (i.tenantId === tenantId && i.siteId === siteId && i.parsed.occurredAt >= sinceIso
        && i.classification.hazards.includes(hazard)) n++;
    }
    return n;
  }

  async saveAgentRun(run: AgentRun) {
    store.runs.push(run);
    if (store.runs.length > 500) store.runs.splice(0, store.runs.length - 500);
  }

  async purgeOutsideWindow(tenantId: TenantId, months: number) {
    let n = 0;
    for (const [id, i] of store.incidents) {
      if (i.tenantId === tenantId && !withinRollingWindow(i.parsed.occurredAt, months)) {
        store.incidents.delete(id);
        n++;
      }
    }
    return n;
  }
}
