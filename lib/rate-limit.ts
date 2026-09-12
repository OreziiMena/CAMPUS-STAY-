import { headers } from "next/headers";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Upstash Redis client if credentials exist
const redis =
  typeof window === "undefined" &&
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

// In-memory sliding-window bucket store for resilient local / fallback rate limiting
interface RateLimitBucket {
  timestamps: number[];
}

const inMemoryStore = new Map<string, RateLimitBucket>();

// Periodic cleanup of stale in-memory buckets (every 5 minutes)
if (typeof window === "undefined") {
  const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of inMemoryStore.entries()) {
      bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < 60 * 60 * 1000);
      if (bucket.timestamps.length === 0) {
        inMemoryStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS).unref();
}

/**
 * In-memory sliding-window rate limiter fallback.
 * Guarantees brute-force and flood protection even when Redis is offline or unconfigured.
 */
function checkInMemoryRateLimit(
  key: string,
  maxRequests: number,
  windowMinutes: number
): { success: boolean; error?: string; remaining: number } {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;

  let bucket = inMemoryStore.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    inMemoryStore.set(key, bucket);
  }

  // Remove timestamps outside the sliding window
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);

  if (bucket.timestamps.length >= maxRequests) {
    const oldestTimestamp = bucket.timestamps[0];
    const resetTimeRemainingSec = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    const resetTimeRemainingMin = Math.max(1, Math.ceil(resetTimeRemainingSec / 60));

    return {
      success: false,
      error: `Too many requests for this action. Please wait ${resetTimeRemainingMin} minute(s) before trying again.`,
      remaining: 0,
    };
  }

  // Record this valid request timestamp
  bucket.timestamps.push(now);

  return {
    success: true,
    remaining: maxRequests - bucket.timestamps.length,
  };
}

/**
 * Checks if a client IP/identifier has exceeded allowed rate limits.
 * Tiers:
 * 1. Distributed Upstash Redis (if configured)
 * 2. In-Memory Sliding-Window Fallback (always active, never fails open)
 */
export async function checkRateLimit(
  action: string,
  maxRequests: number,
  windowMinutes: number,
  customIdentifier?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    let clientIp = "127.0.0.1";

    try {
      const headerList = await headers();
      const forwardedFor = headerList.get("x-forwarded-for");
      const realIp = headerList.get("x-real-ip");
      if (forwardedFor) {
        clientIp = forwardedFor.split(",")[0].trim();
      } else if (realIp) {
        clientIp = realIp.trim();
      }
    } catch {
      // In server action test contexts where headers() might be mocked
      clientIp = "127.0.0.1";
    }

    const key = customIdentifier
      ? `${action}:${customIdentifier.trim().toLowerCase()}:${clientIp}`
      : `${action}:${clientIp}`;

    // 1. Tier 1: Upstash Redis distributed rate limiting
    if (redis && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const ratelimit = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(maxRequests, `${windowMinutes} m`),
          analytics: true,
          prefix: `@campustent:rl:${action}`,
        });

        const { success } = await ratelimit.limit(key);
        if (!success) {
          return {
            success: false,
            error: `Too many attempts. Please try again in ${windowMinutes} minute(s).`,
          };
        }
        return { success: true };
      } catch (redisError: any) {
        console.warn("Upstash Redis connection error; falling back to in-memory limiter:", redisError.message);
      }
    }

    // 2. Tier 2: Resilient In-Memory Sliding Window Fallback
    const memoryResult = checkInMemoryRateLimit(key, maxRequests, windowMinutes);
    return {
      success: memoryResult.success,
      error: memoryResult.error,
    };
  } catch (err: any) {
    console.error("Rate limiter unexpected error:", err);
    // Even on unexpected exceptions, enforce fallback check
    return checkInMemoryRateLimit(`${action}:emergency-fallback`, maxRequests, windowMinutes);
  }
}
