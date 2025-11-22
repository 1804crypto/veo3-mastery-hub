import { Request, Response, NextFunction } from 'express';

const MAX_REQUESTS_PER_HOUR = 60;
const ONE_HOUR_IN_MS = 60 * 60 * 1000;

// In-memory store for request timestamps. In a production/scaled environment,
// this would be replaced with a distributed store like Redis.
const userRequests = new Map<string, number[]>();

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    // Should be handled by verifyAuth, but as a safeguard:
    return res.status(401).json({ ok: false, message: 'Authentication required for rate limiting.' });
  }

  const now = Date.now();
  const windowStart = now - ONE_HOUR_IN_MS;

  // Get current user's timestamps and filter out old ones
  const userTimestamps = userRequests.get(userId) || [];
  const recentTimestamps = userTimestamps.filter(ts => ts > windowStart);

  if (recentTimestamps.length >= MAX_REQUESTS_PER_HOUR) {
    return res.status(429).json({
      ok: false,
      message: 'Too many requests. Please try again later.',
    });
  }

  // Add current request timestamp and update the store
  recentTimestamps.push(now);
  userRequests.set(userId, recentTimestamps);

  next();
};
