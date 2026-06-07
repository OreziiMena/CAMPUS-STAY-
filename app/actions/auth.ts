"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

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
