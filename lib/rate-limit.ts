import { headers } from "next/headers";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Upstash Redis client
// Automatically pick up UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env
const redis = typeof window === "undefined" && process.env.UPSTASH_REDIS_REST_URL
  ? Redis.fromEnv()
  : null;

/**
 * Checks if an IP has exceeded the allowed rate limit for a specific action.
 * Fails open if credentials are not configured.
 */
export async function checkRateLimit(action: string, maxRequests: number, windowMinutes: number) {
  try {
    if (!redis || !process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      // Fail open if Upstash is not yet loaded / configured
      return { success: true };
    }

    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Initialize Ratelimit instance dynamically based on function parameters
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests, `${windowMinutes} m`),
      analytics: true,
      prefix: `@climit:${action}`,
    });

    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return {
        success: false,
        error: `Too many requests. Please try again in ${windowMinutes} minute(s).`,
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Upstash rate limiting failed:", error.message);
    // Fail open in case of network or API issues to avoid blocking users
    return { success: true };
  }
}
