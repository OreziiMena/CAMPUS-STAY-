"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { Role } from "@/lib/generated-client";

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

    if (role === "STUDENT") {
      await prisma.studentProfile.update({
        where: { id: profileId },
        data: { isVerified: status },
      });
    } else if (role === "AGENT") {
      await prisma.agentProfile.update({
        where: { id: profileId },
        data: { isVerified: status },
      });
    } else {
      return { success: false, error: "Invalid role." };
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
