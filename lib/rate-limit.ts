/**
 * Simple rate limiting utility
 * For production, consider using a more robust solution like Upstash Redis
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Simple in-memory rate limiter
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param maxRequests - Maximum number of requests
 * @param windowMs - Time window in milliseconds
 * @returns true if allowed, false if rate limited
 */
export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute default
): boolean {
  const now = Date.now();
  const key = identifier;

  // Clean up expired entries
  if (store[key] && store[key].resetTime < now) {
    delete store[key];
  }

  // Initialize or get existing entry
  if (!store[key]) {
    store[key] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  // Check if limit exceeded
  if (store[key].count >= maxRequests) {
    return false;
  }

  // Increment count
  store[key].count++;

  return true;
}

/**
 * Get rate limit info for an identifier
 */
export function getRateLimitInfo(identifier: string): {
  remaining: number;
  resetTime: number;
} | null {
  const key = identifier;
  const entry = store[key];

  if (!entry) {
    return null;
  }

  const now = Date.now();
  if (entry.resetTime < now) {
    return null;
  }

  return {
    remaining: Math.max(0, 10 - entry.count), // Assuming max 10 requests
    resetTime: entry.resetTime,
  };
}

/**
 * Middleware helper for API routes
 */
export function createRateLimiter(maxRequests: number = 10, windowMs: number = 60000) {
  return (identifier: string): boolean => {
    return rateLimit(identifier, maxRequests, windowMs);
  };
}


