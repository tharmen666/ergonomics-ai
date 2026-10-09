// Minimal browser `window` for store unit tests running in Node.
// Without it, store code guarded by `typeof window !== 'undefined'` (event listeners,
// CustomEvent dispatch) never runs in tests, so bugs there can't be caught.
// Import this FIRST in any spec that imports a store.
if (typeof (globalThis as any).window === 'undefined') {
    const target = new EventTarget();
    (globalThis as any).window = {
        addEventListener: target.addEventListener.bind(target),
        removeEventListener: target.removeEventListener.bind(target),
        dispatchEvent: target.dispatchEvent.bind(target),
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
    };
}
export {};
