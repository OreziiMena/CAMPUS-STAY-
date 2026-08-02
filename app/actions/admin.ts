"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { Role } from "@/lib/generated-client";
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
        subject: role === "STUDENT" ? "✅ Your Student Verification Approved! - Campus Stay" : "✅ Your Agent Profile Approved! - Campus Stay",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: rgb(2, 53, 28);">Congratulations! 🎉</h2>
            <p>Hi ${targetName},</p>
            <p>Your identity verification documents have been successfully reviewed and approved by our team.</p>            <p>You now have full access to:
              <ul>
                <li>Contacting verified accommodation agents.</li>
                <li>Scheduling physical room viewings.</li>
                <li>Posting roommate space listings.</li>
              </ul>
            </p>
                <p>You can now log in to access all verified features on the platform.</p>
            <p>Find your next campus home today!</p>
            <a href="https://campus-stay-chi.vercel.app/" style="display: inline-block; background-color: rgb(2, 53, 28); color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 10px;">Check out Properties Now</a>
          </div>
        `,
        text: `Hi ${targetName},\n\nYour identity verification documents have been successfully reviewed and approved by our team.\n\nYou can now log in to access all verified features on the platform: https://campus-stay-chi.vercel.app/`
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
