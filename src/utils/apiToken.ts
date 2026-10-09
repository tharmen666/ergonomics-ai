// TODO(auth): shared token is visible in the client bundle; replace with per-user session auth
// before production. Any VITE_* variable is compiled into public JavaScript.
// The dev fallback only applies to `vite dev`; production builds send no token unless
// VITE_ERGOSAFE_API_TOKEN is set, so a misconfigured deploy fails visibly (401/500).
export const getClientApiToken = (): string =>
    import.meta.env.VITE_ERGOSAFE_API_TOKEN || (import.meta.env.DEV ? 'ergosafe-dev-token' : '');
