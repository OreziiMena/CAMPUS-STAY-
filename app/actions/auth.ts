"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const SESSION_COOKIE_NAME = "campus_stay_session";

function getFriendlyErrorMessage(err: any, defaultMsg: string): string {
  console.error("Auth server action error:", err);
  const errMsg = err.message || "";
  if (
    errMsg.includes("PrismaClient") || 
    errMsg.includes("database") || 
    errMsg.includes("column") || 
    errMsg.includes("relation") || 
    errMsg.includes("Unknown argument") ||
    errMsg.includes("does not exist") ||
    errMsg.includes("P1001") ||
    errMsg.includes("P2021") ||
    errMsg.includes("P2022")
  ) {
    return "Database schema out of sync or connection issue. Please stop your Next.js dev server, run 'npx prisma db push' followed by 'npx prisma generate', and restart the dev server to apply schema changes.";
  }
  return defaultMsg;
}


export async function checkUsernameAvailable(username: string): Promise<boolean> {
  if (!username) return false;
  const normalized = username.toLowerCase().trim();
  
  const student = await prisma.studentProfile.findFirst({
    where: { username: { equals: normalized, mode: "insensitive" } },
  });
  
  return !student;
}

export async function registerStudent(data: any) {
  try {
    const { fullname, email, phone, university, username, password } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "Email already registered." };
    }

    const isAvailable = await checkUsernameAvailable(username);
    if (!isAvailable) {
      return { success: false, error: "Username is already taken." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        role: "STUDENT",
        studentProfile: {
          create: {
            fullName: fullname,
            university,
            username: username.toLowerCase().trim(),
          },
        },
      },
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify({ userId: newUser.id, role: "STUDENT" }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to register student.") };
  }
}

export async function registerAgent(data: any) {
  try {
    const { fullname, email, phone, address, username, password } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "Email already registered." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        role: "AGENT",
        agentProfile: {
          create: {
            fullName: fullname,
            address,
          },
        },
      },
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify({ userId: newUser.id, role: "AGENT" }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to register agent.") };
  }
}

export async function loginUser(data: any) {
  try {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        agentProfile: true,
      },
    });

    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password." };
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify({ userId: user.id, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, role: user.role };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Login failed.") };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    if (!session?.value) return null;

    const { userId } = JSON.parse(session.value);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        agentProfile: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      name: user.role === "STUDENT" ? user.studentProfile?.fullName : user.agentProfile?.fullName,
      studentProfile: user.studentProfile,
      agentProfile: user.agentProfile,
    };
  } catch {
    return null;
  }
}

export async function updateAgentProfile(data: {
  firstName: string;
  lastName: string;
  phone: string;
  agencyName?: string;
  bio?: string;
  address?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT" || !user.agentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const { firstName, lastName, phone, agencyName, bio, address } = data;
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    if (!fullName) {
      return { success: false, error: "Name cannot be empty." };
    }
    if (!phone) {
      return { success: false, error: "Phone number is required." };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { phone },
      }),
      prisma.agentProfile.update({
        where: { id: user.agentProfile.id },
        data: {
          fullName,
          agencyName: agencyName || null,
          bio: bio || null,
          address: address || null,
        },
      }),
    ]);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to update profile details.") };
  }
}

export async function uploadAgentVerification(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT" || !user.agentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const file = formData.get("ninDocument") as File;
    if (!file) {
      return { success: false, error: "No document file uploaded." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads", "verification");
    await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || ".pdf";
    const filename = `${user.agentProfile.id}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const relativePath = `/uploads/verification/${filename}`;

    await prisma.agentProfile.update({
      where: { id: user.agentProfile.id },
      data: {
        ninDocument: relativePath,
      },
    });

    return { success: true, filePath: relativePath };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to upload document.") };
  }
}

export async function updateAgentPassword(data: any) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized." };
    }

    const { currentPassword, newPassword } = data;
    
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return { success: false, error: "User not found." };
    }

    const isValidPassword = await bcrypt.compare(currentPassword, dbUser.password);
    if (!isValidPassword) {
      return { success: false, error: "Incorrect current password." };
    }

    if (newPassword.length < 8) {
      return { success: false, error: "New password must be at least 8 characters long." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to update password.") };
  }
}
