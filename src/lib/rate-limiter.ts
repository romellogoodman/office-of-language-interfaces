interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class SimpleRateLimiter {
  private requests = new Map<string, RateLimitEntry>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(key: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const entry = this.requests.get(key);

    if (!entry || now > entry.resetTime) {
      // New window or expired entry
      const resetTime = now + this.windowMs;
      this.requests.set(key, { count: 1, resetTime });
      return { allowed: true, remaining: this.maxRequests - 1, resetTime };
    }

    if (entry.count >= this.maxRequests) {
      // Rate limit exceeded
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    // Increment count
    entry.count++;
    this.requests.set(key, entry);
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Clean up expired entries periodically
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Global rate limiter instances
export const globalRateLimiter = new SimpleRateLimiter(100, 60000); // 100 requests per minute globally
export const ipRateLimiter = new SimpleRateLimiter(20, 60000); // 20 requests per minute per IP

// Clean up expired entries every 5 minutes
setInterval(
  () => {
    globalRateLimiter.cleanup();
    ipRateLimiter.cleanup();
  },
  5 * 60 * 1000
);

export function getClientIP(request: Request): string {
  // Try to get real IP from headers (for production with reverse proxy)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  // Fallback for local development
  return "unknown";
}
