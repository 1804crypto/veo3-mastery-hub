import { Request, Response, NextFunction } from 'express';

// Rate limits by tier (Daily limits)
const RATE_LIMITS = {
  guest: 5,       // 5 requests/day for guests (by IP)
  free: 5,        // 5 requests/day for free users
  pro: 10000,     // Effectively unlimited for Pro users
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

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

const cleanOldTimestamps = (identifier: string, windowStart: number) => {
  const timestamps = requestStore.get(identifier) || [];
  const recentTimestamps = timestamps.filter(ts => ts > windowStart);
  if (recentTimestamps.length === 0) {
    requestStore.delete(identifier);
  } else {
    requestStore.set(identifier, recentTimestamps);
  }
  return recentTimestamps;
};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const identifier = getIdentifier(req);
  const limit = getRateLimit(req.user);
  const now = Date.now();
  const windowStart = now - ONE_DAY_IN_MS;

  // Get current timestamps and filter out old ones
  const recentTimestamps = cleanOldTimestamps(identifier, windowStart);

  if (recentTimestamps.length >= limit) {
    const oldestTimestamp = recentTimestamps[0];
    const resetTime = Math.ceil((oldestTimestamp + ONE_DAY_IN_MS - now) / 1000 / 60 / 60); // Hours
    return res.status(429).json({
      ok: false,
      message: `Daily rate limit exceeded. Try again in ${resetTime} hours.`,
      limit,
      remaining: 0,
      resetInHours: resetTime,
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
 * For now, we align this with the main rate limiter but keep it separate for future tracking.
 */
export const aiRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const identifier = getIdentifier(req);
  // Same logic as main limiter for now, based on the requirement "restrict free users to 5 generations per day"
  // which implies the AI generation IS the main constraint.
  const limit = getRateLimit(req.user);
  const now = Date.now();
  const windowStart = now - ONE_DAY_IN_MS;

  const key = `ai:${identifier}`;
  const recentTimestamps = cleanOldTimestamps(key, windowStart);

  if (recentTimestamps.length >= limit) {
    const oldestTimestamp = recentTimestamps[0];
    const resetTime = Math.ceil((oldestTimestamp + ONE_DAY_IN_MS - now) / 1000 / 60 / 60);
    return res.status(429).json({
      ok: false,
      message: `Daily AI generation limit exceeded (${limit}/day). Upgrade to Pro for unlimited access.`,
      limit,
      remaining: 0,
      resetInHours: resetTime,
    });
  }

  recentTimestamps.push(now);
  requestStore.set(key, recentTimestamps);

  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', limit - recentTimestamps.length);

  next();
};
