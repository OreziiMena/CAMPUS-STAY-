import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export interface LogAuditOptions {
  actorId?: string | null;
  actorEmail?: string;
  actorName?: string;
  actorRole?: "ADMIN" | "AGENT" | "STUDENT" | "SYSTEM";
  action: string;
  targetType: "USER" | "PROPERTY" | "PAYMENT" | "REPORT" | "BROADCAST" | "AUTH" | "SETTINGS" | "AMBASSADOR";
  targetId?: string | null;
  targetLabel?: string | null;
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function logAuditEvent(options: LogAuditOptions) {
  try {
    let reqIp = options.ipAddress || null;
    let reqUserAgent = options.userAgent || null;

    try {
      const headerList = await headers();
      if (!reqIp) {
        reqIp =
          headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          headerList.get("cf-connecting-ip") ||
          headerList.get("x-real-ip") ||
          null;
      }
      if (!reqUserAgent) {
        reqUserAgent = headerList.get("user-agent") || null;
      }
    } catch {
      // In non-request execution contexts (e.g. background tasks), headers() will throw, so safe fallback
    }

    const log = await prisma.auditLog.create({
      data: {
        actorId: options.actorId || null,
        actorEmail: options.actorEmail || "system@campustent.com",
        actorName: options.actorName || "System Automated",
        actorRole: options.actorRole || "SYSTEM",
        action: options.action,
        targetType: options.targetType,
        targetId: options.targetId || null,
        targetLabel: options.targetLabel || null,
        details: options.details,
        metadata: options.metadata || undefined,
        ipAddress: reqIp,
        userAgent: reqUserAgent,
      },
    });

    return { success: true, id: log.id };
  } catch (err) {
    console.error("Failed to write audit log:", err);
    return { success: false, error: err };
  }
}
