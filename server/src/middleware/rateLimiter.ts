import { Request, Response, NextFunction } from 'express';

// Rate limits by tier
const RATE_LIMITS = {
  guest: 20,      // 20 requests/hour for guests (by IP)
  free: 30,       // 30 requests/hour for free users
  pro: 100,       // 100 requests/hour for Pro users
};

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

// In-memory store for request timestamps
// Key: "user:{userId}" or "ip:{ipAddress}"
const requestStore = new Map<string, number[]>();

/**
 * Get rate limit based on user tier
 */
function getRateLimit(user?: { subscriptionStatus?: string }): number {
  if (!user) return RATE_LIMITS.guest;
  if (user.subscriptionStatus === 'pro') return RATE_LIMITS.pro;
  return RATE_LIMITS.free;
}

/**
 * Get identifier for rate limiting (user ID for auth, IP for guests)
 */
function getIdentifier(req: Request): string {
  if (req.user?.id) {
    return `user:${req.user.id}`;
  }
  // Use X-Forwarded-For for proxied requests, fallback to IP
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.ip || 'unknown';
  return `ip:${ip}`;
}

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const identifier = getIdentifier(req);
  const limit = getRateLimit(req.user);
  const now = Date.now();
  const windowStart = now - ONE_HOUR_IN_MS;

  // Get current timestamps and filter out old ones
  const timestamps = requestStore.get(identifier) || [];
  const recentTimestamps = timestamps.filter(ts => ts > windowStart);

  if (recentTimestamps.length >= limit) {
    const resetTime = Math.ceil((recentTimestamps[0] + ONE_HOUR_IN_MS - now) / 1000 / 60);
    return res.status(429).json({
      ok: false,
      message: `Rate limit exceeded. Try again in ${resetTime} minutes.`,
      limit,
      remaining: 0,
      resetInMinutes: resetTime,
    });
  }

  // Add current request timestamp
  recentTimestamps.push(now);
  requestStore.set(identifier, recentTimestamps);

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', limit - recentTimestamps.length);

  next();
};

/**
 * Stricter rate limiter for expensive AI operations
 */
export const aiRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const identifier = getIdentifier(req);
  const baseLimit = getRateLimit(req.user);
  // AI operations get 1/3 of the base limit
  const limit = Math.max(3, Math.floor(baseLimit / 3));
  const now = Date.now();
  const windowStart = now - ONE_HOUR_IN_MS;

  const key = `ai:${identifier}`;
  const timestamps = requestStore.get(key) || [];
  const recentTimestamps = timestamps.filter(ts => ts > windowStart);

  if (recentTimestamps.length >= limit) {
    const resetTime = Math.ceil((recentTimestamps[0] + ONE_HOUR_IN_MS - now) / 1000 / 60);
    return res.status(429).json({
      ok: false,
      message: `AI generation limit exceeded (${limit}/hour). Upgrade to Pro for more.`,
      limit,
      remaining: 0,
      resetInMinutes: resetTime,
    });
  }

  recentTimestamps.push(now);
  requestStore.set(key, recentTimestamps);

  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', limit - recentTimestamps.length);

  next();
};
