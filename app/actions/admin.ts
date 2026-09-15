"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { Role } from "@prisma/client";
import { sendEmail } from "@/lib/email";
import { escapeHtml, sanitizeUrl, formatSafeEmailMessage } from "@/lib/email-sanitizer";
import { logAuditEvent } from "@/lib/audit";
import { triggerPusherEvent } from "@/lib/pusher";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function getAdminDashboardData() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    // 1. Fetch unverified students
    const unverifiedStudents = await prisma.studentProfile.findMany({
      where: { isVerified: false, user: { deletedAt: null } },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch unverified agents
    const unverifiedAgents = await prisma.agentProfile.findMany({
      where: { isVerified: false, user: { deletedAt: null } },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 3. Fetch unverified properties
    const unverifiedProperties = await prisma.property.findMany({
      where: { isVerified: false, deletedAt: null },
      include: {
        agent: true,
        student: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 4. Fetch all users (excluding sensitive password hashes)
    const allUsers = await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        studentProfile: true,
        agentProfile: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 5. Fetch all properties
    const allProperties = await prisma.property.findMany({
      where: { deletedAt: null },
      include: {
        agent: true,
        student: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      students: unverifiedStudents,
      agents: unverifiedAgents,
      properties: unverifiedProperties,
      users: allUsers,
      allProperties: allProperties,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load admin data." };
  }
}

export async function toggleUserVerification(idOrProfileId: string, role: "STUDENT" | "AGENT", status: boolean) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    let targetEmail: string | undefined;
    let targetName: string | undefined;

    if (role === "STUDENT") {
      let profile = await prisma.studentProfile.findUnique({
        where: { id: idOrProfileId },
        include: { user: true },
      });
      if (!profile) {
        profile = await prisma.studentProfile.findUnique({
          where: { userId: idOrProfileId },
          include: { user: true },
        });
      }

      if (!profile) {
        return { success: false, error: "Student profile not found." };
      }

      targetEmail = profile.user?.email;
      targetName = profile.fullName || "Student";

      await prisma.studentProfile.update({
        where: { id: profile.id },
        data: { isVerified: status },
      });
    } else if (role === "AGENT") {
      let profile = await prisma.agentProfile.findUnique({
        where: { id: idOrProfileId },
        include: { user: true },
      });
      if (!profile) {
        profile = await prisma.agentProfile.findUnique({
          where: { userId: idOrProfileId },
          include: { user: true },
        });
      }

      if (!profile) {
        return { success: false, error: "Agent profile not found." };
      }

      targetEmail = profile.user?.email;
      targetName = profile.fullName || "Agent";

      await prisma.agentProfile.update({
        where: { id: profile.id },
        data: { isVerified: status },
      });
    } else {
      return { success: false, error: "Invalid role specified." };
    }

    if (status && targetEmail) {
      const safeTargetName = escapeHtml(targetName || (role === "STUDENT" ? "Student" : "Agent"));
      await sendEmail({
        to: targetEmail,
        subject: role === "STUDENT" ? "Your Student Verification Approved! - Campus Tent" : "Your Agent Profile Approved! - Campus Tent",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: rgb(2, 53, 28);">Congratulations!</h2>
            <p>Hi ${safeTargetName},</p>
            <p>Your identity verification documents have been successfully reviewed and approved by our team.</p>            
            <p>You now have full access to:
              <ul>
                <li>Contacting verified accommodation agents.</li>
                <li>Scheduling physical room viewings.</li>
                <li>Posting roommate space listings.</li>
              </ul>
            </p>
            <p>You can now log in to access all verified features on the platform.</p>
            <p>Find your next campus home today!</p>
            <a href="https://campustent.com/" style="display: inline-block; background-color: rgb(2, 53, 28); color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 10px;">Check out Properties Now</a>
          </div>
        `,
        text: `Hi ${targetName},\n\nYour identity verification documents have been successfully reviewed and approved by our team.\n\nYou can now log in to access all verified features on the platform: https://campustent.com/`
      });
    }

    await logAuditEvent({
      actorId: adminUser.id,
      actorEmail: adminUser.email,
      actorName: "Admin (" + adminUser.email + ")",
      actorRole: "ADMIN",
      action: status ? "USER_VERIFIED" : "USER_UNVERIFIED",
      targetType: "USER",
      targetId: idOrProfileId,
      targetLabel: `${targetName || "User"} (${targetEmail || idOrProfileId})`,
      details: `Admin ${status ? "approved" : "revoked"} verification for ${role.toLowerCase()} ${targetName || "User"}.`,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update verification status." };
  }
}

export async function togglePropertyVerification(propertyId: string, status: boolean) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: {
        isVerified: status,
        deletedAt: null,
      },
    });

    await logAuditEvent({
      actorId: adminUser.id,
      actorEmail: adminUser.email,
      actorName: "Admin (" + adminUser.email + ")",
      actorRole: "ADMIN",
      action: status ? "PROPERTY_VERIFIED" : "PROPERTY_UNVERIFIED",
      targetType: "PROPERTY",
      targetId: propertyId,
      targetLabel: updated.title,
      details: `Admin ${status ? "verified" : "unverified"} property "${updated.title}".`,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update property status." };
  }
}

export async function deletePropertyByAdmin(propertyId: string) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: {
        deletedAt: new Date(),
        isAvailable: false,
      },
    });

    await logAuditEvent({
      actorId: adminUser.id,
      actorEmail: adminUser.email,
      actorName: "Admin (" + adminUser.email + ")",
      actorRole: "ADMIN",
      action: "PROPERTY_DELETED_ADMIN",
      targetType: "PROPERTY",
      targetId: propertyId,
      targetLabel: updated.title,
      details: `Admin deleted listing "${updated.title}" (ID: ${propertyId}).`,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete property." };
  }
}

export async function deleteUserByAdmin(idOrProfileId: string, role?: "STUDENT" | "AGENT") {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    let targetUserId: string | null = null;

    // 1. Check if idOrProfileId is a direct User.id
    const userRecord = await prisma.user.findUnique({
      where: { id: idOrProfileId },
      select: { id: true },
    });

    if (userRecord) {
      targetUserId = userRecord.id;
    } else if (role === "STUDENT") {
      const studentProf = await prisma.studentProfile.findUnique({
        where: { id: idOrProfileId },
        select: { userId: true },
      });
      if (studentProf) {
        targetUserId = studentProf.userId;
      }
    } else if (role === "AGENT") {
      const agentProf = await prisma.agentProfile.findUnique({
        where: { id: idOrProfileId },
        select: { userId: true },
      });
      if (agentProf) {
        targetUserId = agentProf.userId;
      }
    } else {
      const [studentProf, agentProf] = await Promise.all([
        prisma.studentProfile.findUnique({ where: { id: idOrProfileId }, select: { userId: true } }),
        prisma.agentProfile.findUnique({ where: { id: idOrProfileId }, select: { userId: true } }),
      ]);
      targetUserId = studentProf?.userId || agentProf?.userId || null;
    }

    if (!targetUserId) {
      return { success: false, error: "User account or profile not found." };
    }

    const now = new Date();

    // Soft-delete the user and invalidate active sessions
    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        deletedAt: now,
        tokenVersion: { increment: 1 },
      },
    });

    // Also soft-delete all properties belonging to this user (as agent or student)
    await prisma.property.updateMany({
      where: {
        OR: [
          { agent: { userId: targetUserId } },
          { student: { userId: targetUserId } },
        ],
      },
      data: {
        deletedAt: now,
        isAvailable: false,
      },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete user." };
  }
}

export async function getAdminAnalyticsData() {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const totalStudents = await prisma.studentProfile.count({
      where: { user: { deletedAt: null } },
    });
    const totalAgents = await prisma.agentProfile.count({
      where: { user: { deletedAt: null } },
    });
    const verifiedStudents = await prisma.studentProfile.count({
      where: { isVerified: true, user: { deletedAt: null } },
    });
    const verifiedAgents = await prisma.agentProfile.count({
      where: { isVerified: true, user: { deletedAt: null } },
    });
    const totalProperties = await prisma.property.count({
      where: { isRoommateOption: false, deletedAt: null },
    });
    const totalRoommates = await prisma.property.count({
      where: { isRoommateOption: true, deletedAt: null },
    });

    // Fetch properties to construct a listing growth chart
    const properties = await prisma.property.findMany({
      where: { deletedAt: null },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const monthlyCounts: { [key: string]: number } = {};
    properties.forEach((p) => {
      const date = new Date(p.createdAt);
      const label = date.toLocaleString("default", { month: "short", year: "2-digit" });
      monthlyCounts[label] = (monthlyCounts[label] || 0) + 1;
    });

    const labels = Object.keys(monthlyCounts);
    const data = Object.values(monthlyCounts);

    return {
      success: true,
      stats: {
        totalStudents,
        totalAgents,
        verifiedStudents,
        verifiedAgents,
        totalProperties,
        totalRoommates,
      },
      charts: {
        labels,
        data,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load analytics metrics." };
  }
}

export async function getAgentActivityLogs(params?: {
  searchQuery?: string;
  actionFilter?: string;
  limit?: number;
}) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const { searchQuery, actionFilter, limit = 100 } = params || {};

    const whereClause: any = {};

    if (actionFilter && actionFilter !== "ALL") {
      whereClause.action = actionFilter;
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.trim();
      whereClause.OR = [
        { userName: { contains: q, mode: "insensitive" } },
        { userEmail: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { propertyTitle: { contains: q, mode: "insensitive" } },
      ];
    }

    const logs = await prisma.activityLog.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    return { success: true, logs };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load activity logs." };
  }
}

export async function getBroadcastAudienceStats() {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized." };
    }

    const [
      allUsersCount,
      studentsCount,
      agentsCount,
      verifiedStudentsCount,
      verifiedAgentsCount,
    ] = await Promise.all([
      prisma.user.count({ where: { email: { not: "" }, deletedAt: null } }),
      prisma.user.count({ where: { role: Role.STUDENT, email: { not: "" }, deletedAt: null } }),
      prisma.user.count({ where: { role: Role.AGENT, email: { not: "" }, deletedAt: null } }),
      prisma.studentProfile.count({ where: { isVerified: true, user: { deletedAt: null } } }),
      prisma.agentProfile.count({ where: { isVerified: true, user: { deletedAt: null } } }),
    ]);

    return {
      success: true,
      stats: {
        all: allUsersCount,
        students: studentsCount,
        agents: agentsCount,
        verifiedStudents: verifiedStudentsCount,
        verifiedAgents: verifiedAgentsCount,
      },
      adminEmail: adminUser.email,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch stats." };
  }
}

export async function sendBroadcastEmailAction(params: {
  audience: "ALL" | "STUDENTS" | "AGENTS" | "VERIFIED_STUDENTS" | "VERIFIED_AGENTS";
  subject: string;
  headline?: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
  senderOption?: "support" | "noreply";
  sendTestOnly?: boolean;
  testEmail?: string;
}) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const { audience, subject, headline, message, ctaText, ctaUrl, senderOption = "support", sendTestOnly, testEmail } = params;

    const fromAddress = senderOption === "noreply" 
      ? "Campus Tent Announcements <noreply@campustent.com>" 
      : "Campus Tent Support <support@campustent.com>";

    if (!subject || subject.trim() === "") {
      return { success: false, error: "Email subject is required." };
    }
    const safeSubject = escapeHtml(subject.trim());
    const safeHeadline = headline ? escapeHtml(headline.trim()) : "";
    const safeCtaText = ctaText ? escapeHtml(ctaText.trim()) : "";
    const safeCtaUrl = sanitizeUrl(ctaUrl);
    const formattedMessage = formatSafeEmailMessage(message);

    // Helper to generate styled HTML email
    const generateHtml = (recipientName?: string) => {
      const safeRecipient = recipientName ? escapeHtml(recipientName) : "";

      const buttonHtml = safeCtaText && safeCtaUrl ? `
        <div style="margin: 28px 0; text-align: center;">
          <a href="${safeCtaUrl}" style="display: inline-block; background-color: rgb(2, 53, 28); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(2, 53, 28, 0.25);">
            ${safeCtaText}
          </a>
        </div>
      ` : "";

      return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: rgb(2, 53, 28); padding: 32px 30px; text-align: center;">
              <div style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; text-transform: uppercase;">
                Campus Tent
              </div>
              <div style="color: rgba(255, 255, 255, 0.85); font-size: 13px; margin-top: 4px; font-weight: 500;">
                Verified Student Accommodation & Roommates
              </div>
              ${safeHeadline ? `
                <div style="margin-top: 18px; padding-top: 18px; border-top: 1px solid rgba(255, 255, 255, 0.15); color: #fef08a; font-size: 18px; font-weight: 700;">
                  ${safeHeadline}
                </div>
              ` : ""}
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 30px;">
              ${safeRecipient ? `
                <p style="margin: 0 0 18px 0; color: #111827; font-size: 16px; font-weight: 600;">
                  Hello ${safeRecipient},
                </p>
              ` : ""}
              ${formattedMessage}
              ${buttonHtml}
              <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; line-height: 1.5;">
                Warm regards,<br/>
                <strong style="color: rgb(2, 53, 28);">The Campus Tent Team</strong><br/>
                <a href="https://campustent.com" style="color: #059669; text-decoration: none;">campustent.com</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 22px 30px; text-align: center; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 6px 0;">
                You are receiving this official communication as a registered member of Campus Tent.
              </p>
              <p style="margin: 0;">
                Questions or support? Reach us at <a href="mailto:support@campustent.com" style="color: #059669; text-decoration: none;">support@campustent.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim();
    };

    // If Test Email Only:
    if (sendTestOnly) {
      const targetTestEmail = testEmail || adminUser.email;
      if (!targetTestEmail) {
        return { success: false, error: "No test email address available." };
      }

      const testHtml = generateHtml(adminUser.name || "Admin");
      const res = await sendEmail({
        to: targetTestEmail,
        subject: `[TEST] ${subject}`,
        html: testHtml,
        text: message,
        from: fromAddress,
        replyTo: "support@campustent.com",
      });

      if (!res.success) {
        return { success: false, error: res.error || "Failed to send test email." };
      }

      return { 
        success: true, 
        isTest: true, 
        testRecipient: targetTestEmail,
        message: `Test email successfully delivered to ${targetTestEmail} (Sent as ${fromAddress})`
      };
    }

    // Build recipient list based on Audience
    const whereCondition: any = {
      email: { not: "" },
      deletedAt: null,
    };

    if (audience === "STUDENTS") {
      whereCondition.role = Role.STUDENT;
    } else if (audience === "AGENTS") {
      whereCondition.role = Role.AGENT;
    } else if (audience === "VERIFIED_STUDENTS") {
      whereCondition.role = Role.STUDENT;
      whereCondition.studentProfile = { isVerified: true };
    } else if (audience === "VERIFIED_AGENTS") {
      whereCondition.role = Role.AGENT;
      whereCondition.agentProfile = { isVerified: true };
    }

    const recipients = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        email: true,
        role: true,
        studentProfile: {
          select: { fullName: true, username: true },
        },
        agentProfile: {
          select: { fullName: true },
        },
      },
    });

    if (!recipients || recipients.length === 0) {
      return { success: false, error: "No active users found for the selected audience." };
    }

    // Filter valid emails & deduplicate
    const emailMap = new Map<string, { email: string; name: string }>();
    for (const r of recipients) {
      if (r.email && r.email.includes("@")) {
        const cleanedEmail = r.email.trim().toLowerCase();
        let name = "Campus Tent Member";
        if (r.role === Role.STUDENT && r.studentProfile) {
          name = r.studentProfile.fullName || (r.studentProfile.username ? `@${r.studentProfile.username}` : "Student");
        } else if (r.role === Role.AGENT && r.agentProfile) {
          name = r.agentProfile.fullName || "Agent";
        }
        if (!emailMap.has(cleanedEmail)) {
          emailMap.set(cleanedEmail, { email: cleanedEmail, name });
        }
      }
    }

    const uniqueRecipients = Array.from(emailMap.values());
    const totalTargeted = uniqueRecipients.length;

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Send concurrently in chunks of 5 with delay
    const CHUNK_SIZE = 5;
    for (let i = 0; i < uniqueRecipients.length; i += CHUNK_SIZE) {
      const chunk = uniqueRecipients.slice(i, i + CHUNK_SIZE);
      const promises = chunk.map(async (recipient) => {
        const htmlContent = generateHtml(recipient.name);
        const result = await sendEmail({
          to: recipient.email,
          subject: subject,
          html: htmlContent,
          text: message,
          from: fromAddress,
          replyTo: "support@campustent.com",
        });
        if (result.success) {
          sentCount++;
        } else {
          failedCount++;
          if (result.error && errors.length < 5) {
            errors.push(`${recipient.email}: ${result.error}`);
          }
        }
      });

      await Promise.allSettled(promises);
      if (i + CHUNK_SIZE < uniqueRecipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    return {
      success: true,
      totalTargeted,
      sentCount,
      failedCount,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (err: any) {
    console.error("sendBroadcastEmailAction error:", err);
    return { success: false, error: err.message || "Failed to process broadcast email." };
  }
}

/**
 * Fetch all Inspection Payments and financial metrics for Admin monitoring
 */
export async function getAdminPaymentsData() {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    // Include PAID, DISPUTED, REFUNDED, PENDING_ADMIN_APPROVAL, and REJECTED inspection payments
    const payments = await prisma.inspectionPayment.findMany({
      where: {
        status: { in: ["PAID", "DISPUTED", "REFUNDED", "PENDING_ADMIN_APPROVAL", "REJECTED"] },
      },
      include: {
        student: {
          include: {
            studentProfile: true,
          },
        },
        agent: {
          include: {
            agentProfile: true,
          },
        },
        property: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const paidPayments = payments.filter((p) => p.status === "PAID");
    const totalGross = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    // Platform fee model: ₦2,480 Platform service fee, ₦5,020 Agent escrow payout per ₦7,500 inspection fee
    const paidCount = paidPayments.length;
    const pendingApprovalCount = payments.filter((p) => p.status === "PENDING_ADMIN_APPROVAL").length;
    const platformShare = paidPayments.reduce((sum, p) => sum + (p.amount === 7500 ? 2480 : p.amount * (2480 / 7500)), 0);
    const agentEscrowLiability = totalGross - platformShare;

    return {
      success: true,
      payments: payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        reference: p.reference,
        paidAt: p.paidAt ? p.paidAt.toISOString() : p.createdAt.toISOString(),
        createdAt: p.createdAt.toISOString(),
        payoutStatus: p.payoutStatus || "PENDING",
        payoutReference: p.payoutReference,
        payoutDisbursedAt: p.payoutDisbursedAt ? p.payoutDisbursedAt.toISOString() : null,
        disputeReason: p.disputeReason,
        disputedAt: p.disputedAt ? p.disputedAt.toISOString() : null,
        refundReason: p.refundReason,
        refundedAt: p.refundedAt ? p.refundedAt.toISOString() : null,
        student: {
          id: p.student.id,
          name: p.student.studentProfile?.fullName || (p.student.studentProfile?.username ? `@${p.student.studentProfile.username}` : p.student.email.split("@")[0]),
          email: p.student.email,
          phone: p.student.phone || "Not provided",
          university: p.student.studentProfile?.university || "Not specified",
        },
        agent: {
          id: p.agent.id,
          name: p.agent.agentProfile?.fullName || p.agent.email.split("@")[0],
          agencyName: p.agent.agentProfile?.agencyName || "Independent Agent",
          email: p.agent.email,
          phone: p.agent.phone || "Not provided",
          address: p.agent.agentProfile?.address || "N/A",
          bankName: p.agent.agentProfile?.bankName,
          accountNumber: p.agent.agentProfile?.accountNumber,
          accountName: p.agent.agentProfile?.accountName,
          recipientCode: p.agent.agentProfile?.recipientCode,
        },
        property: {
          id: p.property.id,
          title: p.property.title,
          location: p.property.location,
          university: p.property.university,
          price: p.property.price,
          rentAmount: p.property.rentAmount,
          agentFee: p.property.agentFee,
          cautionFee: p.property.cautionFee,
          hostelType: p.property.hostelType,
          thumbnail: p.property.images?.[0] || null,
        },
      })),
      metrics: {
        totalGross,
        platformShare,
        agentEscrowLiability,
        totalTransactions: payments.length,
        paidCount,
        pendingApprovalCount,
      },
    };
  } catch (err: any) {
    console.error("getAdminPaymentsData error:", err);
    return { success: false, error: err.message || "Failed to fetch payments data." };
  }
}

/**
 * Approve Direct Bank Transfer Inspection Payment
 * Updates status to PAID and sends official emails to Student and Agent
 */
export async function approveBankTransferPayment(paymentId: string) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const payment = await prisma.inspectionPayment.findUnique({
      where: { id: paymentId },
      include: {
        student: { include: { studentProfile: true } },
        property: true,
        agent: { include: { agentProfile: true } },
      },
    });

    if (!payment) {
      return { success: false, error: "Inspection payment record not found." };
    }

    if (payment.status === "PAID") {
      return { success: false, error: "This payment has already been approved." };
    }

    // Update status to PAID
    await prisma.inspectionPayment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    // Log admin audit event
    await logAuditEvent({
      actorId: adminUser.id,
      actorEmail: adminUser.email,
      actorName: "Admin (" + adminUser.email + ")",
      actorRole: "ADMIN",
      action: "APPROVE_BANK_TRANSFER",
      targetType: "PAYMENT",
      targetId: payment.id,
      targetLabel: payment.reference,
      details: `Admin approved direct bank transfer of ₦${payment.amount.toLocaleString()} for property "${payment.property.title}". Student: ${payment.student.email}, Agent: ${payment.agent.email}`,
    });

    // Real-time broadcast to student page
    await triggerPusherEvent(`property-${payment.propertyId}`, "inspection-paid", {
      propertyId: payment.propertyId,
      studentId: payment.studentId,
      status: "PAID",
      amount: payment.amount,
      reference: payment.reference,
    }).catch((e) => console.warn("Pusher broadcast error on approval:", e));

    const studentDisplayName = escapeHtml(
      payment.student.studentProfile?.fullName || payment.student.email || "Student"
    );
    const propertyTitle = escapeHtml(payment.property.title);
    const agentDisplayName = escapeHtml(
      payment.agent.agentProfile?.fullName || payment.agent.email || "Agent"
    );

    // Send official payment confirmation email to Student
    if (payment.student.email) {
      const studentHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #02351c; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
            <p style="color: #cbd5e1; font-size: 14px; margin: 6px 0 0 0;">Bank Transfer Verified & Approved</p>
          </div>
          <div style="padding: 24px;">
            <h2 style="color: #02351c; font-size: 18px; margin-top: 0;">Your Payment is Confirmed!</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              Hi ${studentDisplayName}, your direct bank transfer of <strong>₦7,500</strong> for <strong>"${propertyTitle}"</strong> has been verified and approved by Campus Tent admin.
            </p>
            <div style="background-color: #ecfdf5; border-left: 4px solid #16a34a; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #065f46;"><strong>Amount:</strong> ₦7,500</p>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #065f46;"><strong>Status:</strong> Verified & Active</p>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #065f46;"><strong>Reference:</strong> ${payment.reference}</p>
              <p style="margin: 0; font-size: 14px; color: #065f46;"><strong>Agent:</strong> ${agentDisplayName}</p>
            </div>
            <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13.5px; color: #334155; font-weight: 600;">Bonus Value Covered:</p>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                "Your ₦7,500 fee covers a physical inspection of this property, plus any alternative options the agent has available in the same area/budget."
              </p>
            </div>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${BASE_URL}/apartment-details?id=${payment.property.id}" style="background-color: #02351c; color: #ffffff; padding: 13px 26px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                Book Physical Tour & Contact Agent
              </a>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #64748b;">
            Campus Tent &bull; Safe Student Accommodation
          </div>
        </div>
      `;

      sendEmail({
        to: payment.student.email,
        subject: `Payment Approved (Bank Transfer Verified): ${payment.property.title}`,
        html: studentHtml,
        isInspectionMessage: true,
      }).catch((err) => console.error("Student approval email failed:", err));
    }

    // Send notification email to Agent
    if (payment.agent.email) {
      const agentHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #02351c; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
            <p style="color: #cbd5e1; font-size: 14px; margin: 6px 0 0 0;">New Inspection Fee Paid & Confirmed</p>
          </div>
          <div style="padding: 24px;">
            <h2 style="color: #02351c; font-size: 18px; margin-top: 0;">Inspection Fee Verified (₦7,500)</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              <strong>${studentDisplayName}</strong> has completed their <strong>₦7,500 inspection payment</strong> for your listing:
            </p>
            <div style="background-color: #f8fafc; border-left: 4px solid #02351c; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;"><strong>Property:</strong> ${propertyTitle}</p>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;"><strong>Student:</strong> ${studentDisplayName}</p>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;"><strong>Phone:</strong> ${escapeHtml(payment.student.phone || "Not provided")}</p>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;"><strong>Payment Reference:</strong> ${payment.reference}</p>
            </div>
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin: 18px 0; text-align: center;">
              <p style="margin: 0; color: #166534; font-size: 13.5px; font-weight: 600;">
                💵 Your Payout: You will receive <strong>₦5,020</strong> automatically once this physical inspection is completed.
              </p>
            </div>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${BASE_URL}/agent-dashboard" style="background-color: #02351c; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                Open Agent Dashboard
              </a>
            </div>
          </div>
        </div>
      `;

      sendEmail({
        to: payment.agent.email,
        subject: `Inspection Fee Paid (₦7,500 Confirmed): ${payment.property.title}`,
        html: agentHtml,
        isInspectionMessage: true,
      }).catch((err) => console.error("Agent approval notification email failed:", err));
    }

    return { success: true, paymentId: payment.id };
  } catch (err: any) {
    console.error("approveBankTransferPayment error:", err);
    return { success: false, error: err.message || "Failed to approve bank transfer." };
  }
}

/**
 * Reject Direct Bank Transfer Inspection Payment
 */
export async function rejectBankTransferPayment(paymentId: string, reason?: string) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const payment = await prisma.inspectionPayment.findUnique({
      where: { id: paymentId },
      include: {
        student: { include: { studentProfile: true } },
        property: true,
      },
    });

    if (!payment) {
      return { success: false, error: "Inspection payment record not found." };
    }

    await prisma.inspectionPayment.update({
      where: { id: payment.id },
      data: {
        status: "REJECTED",
        refundReason: reason || "Transfer not found in bank records.",
      },
    });

    await logAuditEvent({
      actorId: adminUser.id,
      actorEmail: adminUser.email,
      actorName: "Admin (" + adminUser.email + ")",
      actorRole: "ADMIN",
      action: "REJECT_BANK_TRANSFER",
      targetType: "PAYMENT",
      targetId: payment.id,
      targetLabel: payment.reference,
      details: `Admin rejected direct bank transfer for payment ${payment.id}. Reason: ${reason || "Deposit could not be verified in bank statement."}`,
    });

    if (payment.student.email) {
      const studentDisplayName = escapeHtml(
        payment.student.studentProfile?.fullName || payment.student.email || "Student"
      );
      const studentHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #991b1b; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
            <p style="color: #fecaca; font-size: 14px; margin: 6px 0 0 0;">Bank Transfer Status Update</p>
          </div>
          <div style="padding: 24px;">
            <h2 style="color: #991b1b; font-size: 18px; margin-top: 0;">Bank Transfer Could Not Be Verified</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              Hi ${studentDisplayName}, we were unable to verify your direct bank transfer submission of ₦7,500 for <strong>"${escapeHtml(payment.property.title)}"</strong>.
            </p>
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #991b1b;"><strong>Reason:</strong> ${escapeHtml(reason || "Deposit could not be confirmed in our bank statement.")}</p>
              <p style="margin: 0; font-size: 14px; color: #991b1b;"><strong>Reference:</strong> ${payment.reference}</p>
            </div>
            <p style="color: #475569; font-size: 13.5px; line-height: 1.5;">
              Please double check your sender details or try paying online with ATM Card / USSD via Paystack.
            </p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${BASE_URL}/apartment-details?id=${payment.property.id}" style="background-color: #02351c; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                Review Payment Options
              </a>
            </div>
          </div>
        </div>
      `;

      sendEmail({
        to: payment.student.email,
        subject: `Bank Transfer Verification Notice: ${payment.property.title}`,
        html: studentHtml,
        isInspectionMessage: true,
      }).catch((err) => console.error("Student rejection email failed:", err));
    }

    return { success: true };
  } catch (err: any) {
    console.error("rejectBankTransferPayment error:", err);
    return { success: false, error: err.message || "Failed to reject bank transfer." };
  }
}

export async function disburseAgentPayout(paymentId: string) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const payment = await prisma.inspectionPayment.findUnique({
      where: { id: paymentId },
      include: {
        agent: { include: { agentProfile: true } },
        property: true,
      },
    });

    if (!payment) {
      return { success: false, error: "Inspection payment not found." };
    }

    if (payment.status !== "PAID") {
      return { success: false, error: `Cannot disburse payout for payment with status '${payment.status}'.` };
    }

    if (payment.payoutStatus === "DISBURSED") {
      return { success: false, error: "Payout has already been disbursed for this inspection." };
    }

    const agentProfile = payment.agent.agentProfile;
    if (!agentProfile?.recipientCode && !agentProfile?.accountNumber) {
      return {
        success: false,
        error: "Agent has not set up their bank account details yet in Agent Settings.",
      };
    }

    let recipientCode = agentProfile.recipientCode;
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    // Call Paystack Transfer API if secret key is configured
    if (paystackSecret && !paystackSecret.includes("your-paystack-secret-key") && paystackSecret.startsWith("sk_")) {
      try {
        const transferRes = await fetch("https://api.paystack.co/transfer", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${paystackSecret.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: "balance",
            amount: 500000, // ₦5,000 in kobo (50% split)
            recipient: recipientCode,
            reason: `Campus Tent Inspection Payout for ${payment.property.title}`,
          }),
        });

        const transferData = await transferRes.json();
        if (!transferRes.ok || !transferData.status) {
          return {
            success: false,
            error: transferData.message || "Paystack transfer initiation failed.",
          };
        }

        const payoutRef = transferData.data?.reference || transferData.data?.transfer_code || `TRF-${Date.now()}`;

        await prisma.inspectionPayment.update({
          where: { id: payment.id },
          data: {
            payoutStatus: "DISBURSED",
            payoutReference: payoutRef,
            payoutDisbursedAt: new Date(),
          },
        });

        await logAuditEvent({
          actorId: adminUser.id,
          actorEmail: adminUser.email,
          actorName: "Admin (" + adminUser.email + ")",
          actorRole: "ADMIN",
          action: "PAYOUT_DISBURSED",
          targetType: "PAYMENT",
          targetId: payment.id,
          targetLabel: payment.reference,
          details: `Admin disbursed ₦5,000 payout to agent ${payment.agent.agentProfile?.fullName || payment.agent.email} for property "${payment.property.title}". Ref: ${payoutRef}`,
          metadata: {
            paymentId: payment.id,
            amount: 5000,
            reference: payment.reference,
            payoutRef,
            agentId: payment.agentId,
          },
        });

        return { success: true, reference: payoutRef };
      } catch (paystackErr: any) {
        console.error("Paystack transfer error:", paystackErr);
        return { success: false, error: "Network error communicating with Paystack transfer service." };
      }
    }

    // Fallback simulation for local development / test keys
    const fallbackRef = `TRF-TEST-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now()}`;
    await prisma.inspectionPayment.update({
      where: { id: payment.id },
      data: {
        payoutStatus: "DISBURSED",
        payoutReference: fallbackRef,
        payoutDisbursedAt: new Date(),
      },
    });

    await logAuditEvent({
      actorId: adminUser.id,
      actorEmail: adminUser.email,
      actorName: "Admin (" + adminUser.email + ")",
      actorRole: "ADMIN",
      action: "PAYOUT_DISBURSED",
      targetType: "PAYMENT",
      targetId: payment.id,
      targetLabel: payment.reference,
      details: `Admin disbursed ₦5,000 payout (simulated test) to agent ${payment.agent.agentProfile?.fullName || payment.agent.email} for property "${payment.property.title}". Ref: ${fallbackRef}`,
      metadata: {
        paymentId: payment.id,
        amount: 5000,
        reference: payment.reference,
        fallbackRef,
        agentId: payment.agentId,
      },
    });

    return { success: true, reference: fallbackRef, simulated: true };
  } catch (err: any) {
    console.error("disburseAgentPayout error:", err);
    return { success: false, error: err.message || "Failed to disburse payout." };
  }
}

export async function refundInspectionPayment(paymentId: string, reason: string) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const payment = await prisma.inspectionPayment.findUnique({
      where: { id: paymentId },
      include: {
        student: { include: { studentProfile: true } },
        property: true,
        agent: { include: { agentProfile: true } },
      },
    });

    if (!payment) {
      return { success: false, error: "Inspection payment record not found." };
    }

    if (payment.status === "REFUNDED") {
      return { success: false, error: "This payment has already been refunded." };
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    if (paystackSecret && !paystackSecret.includes("your-paystack-secret-key") && paystackSecret.startsWith("sk_")) {
      try {
        const refundRes = await fetch("https://api.paystack.co/refund", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${paystackSecret.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transaction: payment.reference,
            customer_note: reason || "Inspection cancelled / tour dispute resolved in student favor.",
            merchant_note: `Campus Tent refund for payment ${payment.id}`,
          }),
        });

        const refundData = await refundRes.json();
        if (!refundRes.ok && !refundData.message?.includes("already refunded")) {
          return {
            success: false,
            error: refundData.message || "Paystack refund request failed.",
          };
        }
      } catch (paystackErr: any) {
        console.error("Paystack refund error:", paystackErr);
      }
    }

    await prisma.inspectionPayment.update({
      where: { id: payment.id },
      data: {
        status: "REFUNDED",
        refundReason: reason,
        refundedAt: new Date(),
      },
    });

    await logAuditEvent({
      actorId: adminUser.id,
      actorEmail: adminUser.email,
      actorName: "Admin (" + adminUser.email + ")",
      actorRole: "ADMIN",
      action: "INSPECTION_REFUNDED",
      targetType: "PAYMENT",
      targetId: payment.id,
      targetLabel: payment.reference,
      details: `Admin processed ₦${payment.amount.toLocaleString()} refund to student ${payment.student.studentProfile?.fullName || payment.student.email} for property "${payment.property.title}". Reason: ${reason || "N/A"}`,
      metadata: {
        paymentId: payment.id,
        amount: payment.amount,
        reference: payment.reference,
        reason,
      },
    });

    // Send refund confirmation email to student
    if (payment.student.email) {
      const studentName = escapeHtml(payment.student.studentProfile?.fullName || "Student");
      const propTitle = escapeHtml(payment.property.title);

      sendEmail({
        to: payment.student.email,
        subject: `Refund Processed: ₦${payment.amount.toLocaleString()} for ${payment.property.title}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #02351c; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
              <p style="color: #cbd5e1; font-size: 14px; margin: 6px 0 0 0;">Inspection Fee Refund Confirmation</p>
            </div>
            <div style="padding: 24px;">
              <h2 style="color: #02351c; font-size: 18px; margin-top: 0;">Refund Processed (₦${payment.amount.toLocaleString()})</h2>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                Hi ${studentName}, your refund of <strong>₦${payment.amount.toLocaleString()}</strong> for <strong>"${propTitle}"</strong> has been processed to your original payment method.
              </p>
              <div style="background-color: #f8fafc; border-left: 4px solid #02351c; padding: 14px; border-radius: 6px; margin: 16px 0;">
                <p style="margin: 0 0 4px 0; font-size: 13.5px; color: #1e293b;"><strong>Reason:</strong> ${escapeHtml(reason)}</p>
                <p style="margin: 0; font-size: 13.5px; color: #1e293b;"><strong>Transaction Ref:</strong> ${payment.reference}</p>
              </div>
              <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
                Depending on your bank, funds typically reflect within 1-3 business days.
              </p>
            </div>
          </div>
        `,
        isInspectionMessage: true,
      }).catch((err) => console.error("Refund email error:", err));
    }

    return { success: true };
  } catch (err: any) {
    console.error("refundInspectionPayment error:", err);
    return { success: false, error: err.message || "Failed to process refund." };
  }
}

/**
 * Fetch immutable administrative audit logs
 */
export async function getAdminAuditLogs(filters?: { action?: string; targetType?: string; limit?: number }) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const where: any = {};
    if (filters?.action && filters.action !== "ALL") {
      where.action = filters.action;
    }
    if (filters?.targetType && filters.targetType !== "ALL") {
      where.targetType = filters.targetType;
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: filters?.limit || 100,
    });

    return {
      success: true,
      logs: logs.map((l) => ({
        id: l.id,
        actorEmail: l.actorEmail,
        actorName: l.actorName,
        actorRole: l.actorRole,
        action: l.action,
        targetType: l.targetType,
        targetLabel: l.targetLabel,
        details: l.details,
        metadata: l.metadata,
        ipAddress: l.ipAddress,
        userAgent: l.userAgent,
        createdAt: l.createdAt.toISOString(),
      })),
    };
  } catch (err: any) {
    console.error("getAdminAuditLogs error:", err);
    return { success: false, error: err.message || "Failed to load audit logs." };
  }
}



