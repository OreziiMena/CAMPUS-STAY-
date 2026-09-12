"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { Role } from "@prisma/client";
import { sendEmail } from "@/lib/email";

export async function getAdminDashboardData() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    // 1. Fetch unverified students
    const unverifiedStudents = await prisma.studentProfile.findMany({
      where: { isVerified: false },
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
      where: { isVerified: false },
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
      where: { isVerified: false },
      include: {
        agent: true,
        student: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 4. Fetch all users
    const allUsers = await prisma.user.findMany({
      include: {
        studentProfile: true,
        agentProfile: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 5. Fetch all properties
    const allProperties = await prisma.property.findMany({
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

export async function toggleUserVerification(profileId: string, role: "STUDENT" | "AGENT", status: boolean) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    let targetEmail: string | undefined;
    let targetName: string | undefined;

    if (role === "STUDENT") {
      const profile = await prisma.studentProfile.findUnique({
        where: { id: profileId },
        include: { user: true },
      });
      if (profile) {
        targetEmail = profile.user.email;
        targetName = profile.fullName || "Student";
      }
      await prisma.studentProfile.update({
        where: { id: profileId },
        data: { isVerified: status },
      });
    } else if (role === "AGENT") {
      const profile = await prisma.agentProfile.findUnique({
        where: { id: profileId },
        include: { user: true },
      });
      if (profile) {
        targetEmail = profile.user.email;
        targetName = profile.fullName || "Agent";
      }
      await prisma.agentProfile.update({
        where: { id: profileId },
        data: { isVerified: status },
      });
    } else {
      return { success: false, error: "Invalid role." };
    }

    if (status && targetEmail) {
      await sendEmail({
        to: targetEmail,
        subject: role === "STUDENT" ? "✅ Your Student Verification Approved! - Campus Tent" : "✅ Your Agent Profile Approved! - Campus Tent",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: rgb(2, 53, 28);">Congratulations! 🎉</h2>
            <p>Hi ${targetName},</p>
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

    await prisma.property.update({
      where: { id: propertyId },
      data: { isVerified: status },
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

    await prisma.property.delete({
      where: { id: propertyId },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete property." };
  }
}

export async function deleteUserByAdmin(profileId: string, role: "STUDENT" | "AGENT") {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    if (role === "STUDENT") {
      const profile = await prisma.studentProfile.findUnique({
        where: { id: profileId },
        select: { userId: true },
      });
      if (profile) {
        await prisma.user.delete({ where: { id: profile.userId } });
      }
    } else if (role === "AGENT") {
      const profile = await prisma.agentProfile.findUnique({
        where: { id: profileId },
        select: { userId: true },
      });
      if (profile) {
        await prisma.user.delete({ where: { id: profile.userId } });
      }
    }

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

    const totalStudents = await prisma.studentProfile.count();
    const totalAgents = await prisma.agentProfile.count();
    const verifiedStudents = await prisma.studentProfile.count({
      where: { isVerified: true },
    });
    const verifiedAgents = await prisma.agentProfile.count({
      where: { isVerified: true },
    });
    const totalProperties = await prisma.property.count({
      where: { isRoommateOption: false },
    });
    const totalRoommates = await prisma.property.count({
      where: { isRoommateOption: true },
    });

    // Fetch properties to construct a listing growth chart
    const properties = await prisma.property.findMany({
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
      prisma.user.count({ where: { email: { not: "" } } }),
      prisma.user.count({ where: { role: Role.STUDENT, email: { not: "" } } }),
      prisma.user.count({ where: { role: Role.AGENT, email: { not: "" } } }),
      prisma.studentProfile.count({ where: { isVerified: true } }),
      prisma.agentProfile.count({ where: { isVerified: true } }),
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
  sendTestOnly?: boolean;
  testEmail?: string;
}) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const { audience, subject, headline, message, ctaText, ctaUrl, sendTestOnly, testEmail } = params;

    if (!subject || subject.trim() === "") {
      return { success: false, error: "Email subject is required." };
    }
    if (!message || message.trim() === "") {
      return { success: false, error: "Email message content is required." };
    }

    // Helper to generate styled HTML email
    const generateHtml = (recipientName?: string) => {
      const formattedMessage = message
        .split("\n\n")
        .map((p) => `<p style="margin: 0 0 16px 0; line-height: 1.6; color: #374151; font-size: 15px;">${p.replace(/\n/g, "<br/>")}</p>`)
        .join("");

      const buttonHtml = ctaText && ctaUrl ? `
        <div style="margin: 28px 0; text-align: center;">
          <a href="${ctaUrl}" style="display: inline-block; background-color: rgb(2, 53, 28); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(2, 53, 28, 0.25);">
            ${ctaText}
          </a>
        </div>
      ` : "";

      return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
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
                ⛺ Campus Tent
              </div>
              <div style="color: rgba(255, 255, 255, 0.85); font-size: 13px; margin-top: 4px; font-weight: 500;">
                Verified Student Accommodation & Roommates
              </div>
              ${headline ? `
                <div style="margin-top: 18px; padding-top: 18px; border-top: 1px solid rgba(255, 255, 255, 0.15); color: #fef08a; font-size: 18px; font-weight: 700;">
                  ${headline}
                </div>
              ` : ""}
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 30px;">
              ${recipientName ? `
                <p style="margin: 0 0 18px 0; color: #111827; font-size: 16px; font-weight: 600;">
                  Hello ${recipientName},
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
      });

      if (!res.success) {
        return { success: false, error: res.error || "Failed to send test email." };
      }

      return { 
        success: true, 
        isTest: true, 
        testRecipient: targetTestEmail,
        message: `Test email successfully delivered to ${targetTestEmail}`
      };
    }

    // Build recipient list based on Audience
    let whereCondition: any = {
      email: { not: "" },
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


