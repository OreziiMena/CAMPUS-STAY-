import { headers } from "next/headers";
import prisma from "@/lib/prisma";

/**
 * Checks if an IP has exceeded the allowed rate limit for a specific action.
 * Automatically cleans up expired logs in the database.
 */
export async function checkRateLimit(action: string, maxRequests: number, windowMinutes: number) {
  try {
    const headerList = await headers();
    // Vercel forwards client IP in x-forwarded-for header
    const forwardedFor = headerList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);

    // 1. Clean up old entries for this action
    await prisma.rateLimit.deleteMany({
      where: {
        action,
        createdAt: { lt: windowStart },
      },
    });

    // 2. Count requests in the current window
    const requestCount = await prisma.rateLimit.count({
      where: {
        ip,
        action,
        createdAt: { gte: windowStart },
      },
    });

    if (requestCount >= maxRequests) {
      return {
        success: false,
        error: `Too many requests. Please try again in ${windowMinutes} minute(s).`,
      };
    }

    // 3. Log the current request
    await prisma.rateLimit.create({
      data: {
        ip,
        action,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Rate limiting failed:", error.message);
    // Fail open in case of database exceptions to avoid blocking users
    return { success: true };
  }
}
