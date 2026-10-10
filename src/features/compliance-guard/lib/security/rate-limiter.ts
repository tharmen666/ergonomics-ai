interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds (default: 60s)
  max?: number;      // Max allowed requests per window (default: 30)
}

/**
 * In-memory sliding rate limiter.
 * In a distributed multi-instance deployment, this can be swapped with Redis or Upstash.
 */
export function checkRateLimit(
  identifier: string,
  options?: RateLimitOptions
): { allowed: boolean; remaining: number; retryAfterSecs: number } {
  const windowMs = options?.windowMs ?? 60 * 1000;
  const max = options?.max ?? 30;
  const now = Date.now();

  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: max - 1,
      retryAfterSecs: 0,
    };
  }

  if (entry.count >= max) {
    const retryAfterSecs = Math.ceil((entry.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSecs,
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: max - entry.count,
    retryAfterSecs: 0,
  };
}

/**
 * Extracts a safe client identifier (IP address or generic fingerprint) from request headers.
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'client-default-ip';
}
