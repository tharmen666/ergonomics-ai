import type { ISODateString } from "@/lib/types";

/** Sortable, collision-resistant ID: <prefix>_<time36><rand>. */
export function newId<T extends string = string>(prefix: string): T {
  const time = Date.now().toString(36);
  const rand = crypto.getRandomValues(new Uint32Array(2));
  return `${prefix}_${time}${rand[0].toString(36)}${rand[1].toString(36)}` as T;
}

export const nowIso = (): ISODateString => new Date().toISOString() as ISODateString;

export function addMinutes(iso: string, minutes: number): ISODateString {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString() as ISODateString;
}

export function addMonths(iso: string, months: number): ISODateString {
  const d = new Date(iso);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString() as ISODateString;
}

/** True if `iso` falls inside the rolling retention window ending now. */
export function withinRollingWindow(iso: string, months: number, now = new Date()): boolean {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - months);
  return t >= cutoff.getTime() && t <= now.getTime() + 86_400_000;
}

/** SHA-256 hex digest via WebCrypto (works on Node 18+, Edge and browser). */
export async function sha256Hex(data: Uint8Array | string): Promise<string> {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const digest = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Cheap token estimate (~4 chars/token) — good enough for chunk budgeting. */
export const estimateTokens = (text: string): number => Math.ceil(text.length / 4);

/** Monotonic stopwatch for per-stage timings. */
export function stopwatch() {
  const start = performance.now();
  let last = start;
  const laps: Record<string, number> = {};
  return {
    lap(label: string) {
      const t = performance.now();
      laps[label] = Math.round(t - last);
      last = t;
    },
    total: () => Math.round(performance.now() - start),
    laps,
  };
}

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
