"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { ReportReason, ReportStatus } from "@/lib/generated-client";

export async function submitReport(data: {
  propertyId?: string;
  roommateId?: string;
  reason: ReportReason;
  customReason?: string;
  description: string;
}) {
  try {
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
          // Delete flagged property listing
          await prisma.property.delete({
            where: { id: report.propertyId },
          });
        } else if (report.roommateId) {
          // Reset roommate profile verification or disable roommate option
          // (Instead of deleting the entire student profile, we delete the roommate property listing)
          // Let's find roommate property listings matching this student profile id
          const roommateListing = await prisma.property.findFirst({
            where: {
              studentId: report.roommateId,
              isRoommateOption: true,
            },
          });
          if (roommateListing) {
            await prisma.property.delete({
              where: { id: roommateListing.id },
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
