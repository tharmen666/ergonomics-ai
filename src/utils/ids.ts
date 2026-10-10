/**
 * Collision-safe record IDs. Uses crypto.randomUUID() where available and falls back to
 * crypto.getRandomValues() (randomUUID is missing on plain-HTTP LAN origins and very old browsers).
 */
export const newId = (prefix: string): string => {
    const c: Crypto | undefined = typeof globalThis !== 'undefined' ? (globalThis as { crypto?: Crypto }).crypto : undefined;
    if (c && typeof c.randomUUID === 'function') return `${prefix}-${c.randomUUID()}`;
    if (c && typeof c.getRandomValues === 'function') {
        const b = c.getRandomValues(new Uint8Array(16));
        b[6] = (b[6] & 0x0f) | 0x40;
        b[8] = (b[8] & 0x3f) | 0x80;
        const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
        return `${prefix}-${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
    }
    throw new Error('No secure random source available to generate a record ID');
};
