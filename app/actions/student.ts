"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

function getFriendlyErrorMessage(err: any, defaultMsg: string): string {
  console.error("Student server action error:", err);
  return err.message || defaultMsg;
}

export async function getStudentDashboardData() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    const inquiries = await prisma.inquiry.findMany({
      where: { studentId: user.id },
      include: {
        property: {
          include: {
            agent: true,
            student: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const viewings = await prisma.viewing.findMany({
      where: { studentId: user.id },
      include: {
        property: {
          include: {
            agent: true,
            student: true,
          },
        },
      },
      orderBy: { dateTime: "desc" },
    });

    return {
      success: true,
      profile,
      inquiries: inquiries.map(inq => ({
        id: inq.id,
        message: inq.message,
        createdAt: inq.createdAt,
        propertyTitle: inq.property.title,
        propertyId: inq.property.id,
        agentName: inq.property.agent ? inq.property.agent.fullName : (inq.property.student ? inq.property.student.fullName : "Campus Stay Official"),
      })),
      viewings: viewings.map(v => ({
        id: v.id,
        dateTime: v.dateTime,
        status: v.status,
        propertyTitle: v.property.title,
        propertyId: v.property.id,
        agentName: v.property.agent ? v.property.agent.fullName : (v.property.student ? v.property.student.fullName : "Campus Stay Official"),
      })),
    };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to load dashboard data.") };
  }
}

export async function updateStudentProfile(data: {
  firstName: string;
  lastName: string;
  phone: string;
  university: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const { firstName, lastName, phone, university } = data;
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    if (!fullName) {
      return { success: false, error: "Name cannot be empty." };
    }
    if (!phone) {
      return { success: false, error: "Phone number is required." };
    }
    if (!university) {
      return { success: false, error: "University is required." };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { phone },
      }),
      prisma.studentProfile.update({
        where: { id: user.studentProfile.id },
        data: {
          fullName,
          university,
        },
      }),
    ]);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to update profile details.") };
  }
}

export async function uploadStudentVerification(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const idCardFile = formData.get("idCard") as File | null;
    const feesReceiptFile = formData.get("feesReceipt") as File | null;
    const portalScreenshotFile = formData.get("portalScreenshot") as File | null;

    // Check if at least one file was uploaded
    const hasIdCard = idCardFile && idCardFile.size > 0;
    const hasFeesReceipt = feesReceiptFile && feesReceiptFile.size > 0;
    const hasPortalScreenshot = portalScreenshotFile && portalScreenshotFile.size > 0;

    if (!hasIdCard && !hasFeesReceipt && !hasPortalScreenshot) {
      return { success: false, error: "Please upload at least one verification document." };
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "student_verification");
    await mkdir(uploadDir, { recursive: true });

    const updateData: any = {};
    const timestamp = Date.now();

    if (hasIdCard) {
      const buffer = Buffer.from(await idCardFile.arrayBuffer());
      const ext = path.extname(idCardFile.name) || ".pdf";
      const filename = `${user.studentProfile.id}-idcard-${timestamp}${ext}`;
      await writeFile(path.join(uploadDir, filename), buffer);
      updateData.idCardDoc = `/uploads/student_verification/${filename}`;
    }

    if (hasFeesReceipt) {
      const buffer = Buffer.from(await feesReceiptFile.arrayBuffer());
      const ext = path.extname(feesReceiptFile.name) || ".pdf";
      const filename = `${user.studentProfile.id}-fees-${timestamp}${ext}`;
      await writeFile(path.join(uploadDir, filename), buffer);
      updateData.feesReceiptDoc = `/uploads/student_verification/${filename}`;
    }

    if (hasPortalScreenshot) {
      const buffer = Buffer.from(await portalScreenshotFile.arrayBuffer());
      const ext = path.extname(portalScreenshotFile.name) || ".pdf";
      const filename = `${user.studentProfile.id}-portal-${timestamp}${ext}`;
      await writeFile(path.join(uploadDir, filename), buffer);
      updateData.portalScreenshotDoc = `/uploads/student_verification/${filename}`;
    }

    await prisma.studentProfile.update({
      where: { id: user.studentProfile.id },
      data: {
        ...updateData,
        isVerified: false, // Reset status to unverified / pending review
      },
    });

    return { success: true, paths: updateData };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to upload document.") };
  }
}

export async function instantToggleVerification() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const currentStatus = user.studentProfile.isVerified;
    const nextStatus = !currentStatus;

    await prisma.studentProfile.update({
      where: { id: user.studentProfile.id },
      data: { isVerified: nextStatus },
    });

    return { success: true, isVerified: nextStatus };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to toggle verification status.") };
  }
}

export async function saveStudentPreferences(preferences: {
  openToRoommates: boolean;
  budgetLimit: number;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    await prisma.studentProfile.update({
      where: { id: user.studentProfile.id },
      data: {
        preferences: preferences as any,
      },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to save preferences.") };
  }
}

export async function scheduleViewing(data: {
  propertyId: string;
  dateTime: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return { success: false, error: "You must be logged in as a student to schedule viewings." };
    }

    if (!user.studentProfile.isVerified) {
      return { success: false, error: "Verification required. You must verify your student profile to schedule viewings." };
    }

    const { propertyId, dateTime } = data;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        agent: {
          include: {
            user: true,
          },
        },
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    const recipientId = property.agent?.userId || property.student?.userId;
    if (!recipientId) {
      return { success: false, error: "Listing owner not found." };
    }

    const viewing = await prisma.viewing.create({
      data: {
        studentId: user.id,
        propertyId,
        dateTime: new Date(dateTime),
        status: "PENDING",
      },
    });

    // Also send a simulated inquiry/message to the agent for this viewing request
    await prisma.inquiry.create({
      data: {
        studentId: user.id,
        propertyId,
        agentId: recipientId,
        message: `Hi, I have requested a physical viewing appointment for your property "${property.title}" on ${new Date(dateTime).toLocaleString()}.`,
      },
    });

    return { success: true, viewingId: viewing.id };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to schedule viewing.") };
  }
}
