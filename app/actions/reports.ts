"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { ReportReason, ReportStatus } from "@prisma/client";
import { checkRateLimit } from "@/lib/rate-limit";

export async function submitReport(data: {
  propertyId?: string;
  roommateId?: string;
  reason: ReportReason;
  customReason?: string;
  description: string;
}) {
  try {
    const rateCheck = await checkRateLimit("submit-report", 5, 10);
    if (!rateCheck.success) {
      return { success: false, error: rateCheck.error };
    }

    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in to submit a report." };
    }

    if (!data.propertyId && !data.roommateId) {
      return { success: false, error: "Please specify a target to report (property or roommate profile)." };
    }

    if (!data.description || data.description.trim().length < 10) {
      return { success: false, error: "Please provide a detailed description (minimum 10 characters)." };
    }

    await prisma.report.create({
      data: {
        reporterId: user.id,
        propertyId: data.propertyId || null,
        roommateId: data.roommateId || null,
        reason: data.reason,
        customReason: data.customReason || null,
        description: data.description,
        status: ReportStatus.PENDING,
      },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit report." };
  }
}

export async function getPendingReports() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized access." };
    }

    const reports = await prisma.report.findMany({
      where: {
        status: { in: [ReportStatus.PENDING, ReportStatus.INVESTIGATING] },
      },
      include: {
        reporter: {
          select: {
            id: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            location: true,
            isAvailable: true,
          },
        },
        roommate: {
          select: {
            id: true,
            fullName: true,
            username: true,
            university: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, reports };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch reports." };
  }
}

export async function moderateReport(
  reportId: string,
  action: "DISMISS" | "RESOLVE",
  deleteListing: boolean = false
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized access." };
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return { success: false, error: "Report not found." };
    }

    if (action === "DISMISS") {
      await prisma.report.update({
        where: { id: reportId },
        data: { status: ReportStatus.DISMISSED },
      });
    } else if (action === "RESOLVE") {
      await prisma.report.update({
        where: { id: reportId },
        data: { status: ReportStatus.RESOLVED },
      });

      if (deleteListing) {
        if (report.propertyId) {
          // Soft-delete flagged property listing
          await prisma.property.update({
            where: { id: report.propertyId },
            data: {
              deletedAt: new Date(),
              isAvailable: false,
            },
          });
        } else if (report.roommateId) {
          // Find and soft-delete roommate listing matching this student profile id
          const roommateListing = await prisma.property.findFirst({
            where: {
              studentId: report.roommateId,
              isRoommateOption: true,
              deletedAt: null,
            },
          });
          if (roommateListing) {
            await prisma.property.update({
              where: { id: roommateListing.id },
              data: {
                deletedAt: new Date(),
                isAvailable: false,
              },
            });
          }
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to process report moderation." };
  }
}
