// Shared request guards for the serverless API (files under api/_lib are not routed by Vercel).
//
// IMPORTANT (TODO(auth)): the bearer token is a shared secret. The browser app has to send it,
// so a token baked into the client bundle (VITE_ERGOSAFE_API_TOKEN) is visible to anyone who
// opens DevTools. It keeps casual bots out and, together with the rate limit, caps spend on the
// paid AI endpoint - it is NOT user authentication. Replace with per-user session auth before
// production use.

const DEFAULT_DEV_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173'
];

/** CORS from an allow-list. Never combines a wildcard origin with credentials. */
export function applyCors(req, res, allowHeaders = 'Authorization, Content-Type, X-Requested-With, Accept') {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
    : DEFAULT_DEV_ORIGINS;

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', allowHeaders);
}

/**
 * Bearer-token check that FAILS CLOSED: if ERGOSAFE_API_TOKEN is not configured on the server
 * the request is refused with 500 instead of falling back to a well-known default.
 * Returns true when the request may continue; otherwise it has already sent the response.
 */
export function requireToken(req, res) {
  const expectedToken = process.env.ERGOSAFE_API_TOKEN;
  if (!expectedToken) {
    res.status(500).json({ error: 'Server not configured: ERGOSAFE_API_TOKEN is not set' });
    return false;
  }
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null;
  if (!token || token !== expectedToken) {
    res.status(401).json({ error: 'Unauthorized: missing or invalid Bearer token' });
    return false;
  }
  return true;
}

const buckets = new Map();

/**
 * Simple in-memory fixed-window rate limit per client IP.
 * Per serverless instance only (instances don't share memory) - a cost guard, not a hard quota.
 */
export function rateLimit(req, res, { limit = 10, windowMs = 10 * 60 * 1000, now = Date.now() } = {}) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' && forwarded.split(',')[0].trim())
    || (req.socket && req.socket.remoteAddress)
    || 'unknown';
  const entry = buckets.get(ip);
  if (!entry || now - entry.start >= windowMs) {
    buckets.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count += 1;
  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.start + windowMs - now) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({ error: 'Too Many Requests: rate limit exceeded', retryAfterSeconds: retryAfter });
    return false;
  }
  return true;
}

/** Test helper: clear rate-limit state. */
export function __resetRateLimit() {
  buckets.clear();
}
