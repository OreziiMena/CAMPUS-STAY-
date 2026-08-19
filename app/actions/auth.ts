"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { uploadToR2 } from "@/lib/r2";
import crypto from "crypto";
import { generateOTP } from "./otp";
import { checkRateLimit } from "@/lib/rate-limit";

const SESSION_COOKIE_NAME = "campus_stay_session";
const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-secret-key-at-least-32-chars-long-security-key";

// Cryptographic signing of session JSON payload
function signSession(payload: any): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("hex");
  return `${data}.${signature}`;
}

// Verification of signed session token
function verifySession(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    
    const expectedSignature = crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("hex");
    
    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      console.warn("Session signature verification failed - potential cookie tampering detected.");
      return null;
    }
    
    const decoded = Buffer.from(data, "base64url").toString("utf8");
    const payload = JSON.parse(decoded);

    // Validate expiration to prevent replay of old session strings
    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      console.warn("Session expired.");
      return null;
    }

    return payload;
  } catch (err) {
    console.error("Failed to verify/parse session token:", err);
    return null;
  }
}

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
    const rateCheck = await checkRateLimit("register", 5, 10);
    if (!rateCheck.success) {
      return { success: false, error: rateCheck.error };
    }

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

    // Generate OTP for email verification
    await generateOTP(email, "EMAIL_VERIFICATION");

    return { success: true, requireVerification: true, email };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to register student.") };
  }
}

export async function registerAgent(data: any) {
  try {
    const rateCheck = await checkRateLimit("register", 5, 10);
    if (!rateCheck.success) {
      return { success: false, error: rateCheck.error };
    }

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

    // Generate OTP for email verification
    await generateOTP(email, "EMAIL_VERIFICATION");

    return { success: true, requireVerification: true, email };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to register agent.") };
  }
}

export async function loginUser(data: any) {
  try {
    const rateCheck = await checkRateLimit("login", 5, 3);
    if (!rateCheck.success) {
      return { success: false, error: rateCheck.error };
    }

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

    if (!user.isEmailVerified) {
      await generateOTP(email, "EMAIL_VERIFICATION");
      return { success: false, requireVerification: true, email, error: "Please verify your email address to continue." };
    }

    const cookieStore = await cookies();
    const token = signSession({
      userId: user.id,
      role: user.role,
      passwordVersion: user.password.substring(0, 10),
      expiresAt: Date.now() + 60 * 60 * 24 * 7 * 1000, // 7 days in milliseconds
    });
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
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

    const payload = verifySession(session.value);
    if (!payload || !payload.userId) return null;

    const { userId, passwordVersion } = payload;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        agentProfile: true,
      },
    });

    if (!user) return null;

    // Validate password version to support instant session invalidation on password changes
    if (passwordVersion && user.password.substring(0, 10) !== passwordVersion) {
      return null;
    }

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

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "File size exceeds the 5MB limit." };
    }

    const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];
    let ext = (path.extname(file.name) || "").toLowerCase();
    
    // Sanitize extension to prevent path traversal attempts
    ext = ext.replace(/[^a-z0-9.]/g, "");
    
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return { success: false, error: "Invalid document file type. Only PDF and image files (.jpg, .jpeg, .png, .webp) are allowed." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads", "verification");
    const filename = `${user.agentProfile.id}-${Date.now()}${ext}`;

    let relativePath = "";
    const r2Result = await uploadToR2(buffer, `verification/${filename}`, file.type || "application/pdf");
    if (r2Result.success && r2Result.url) {
      relativePath = r2Result.url;
    } else {
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      relativePath = `/uploads/verification/${filename}`;
    }

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
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Re-issue cookie for the current device so they remain logged in
    const cookieStore = await cookies();
    const token = signSession({
      userId: updatedUser.id,
      role: updatedUser.role,
      passwordVersion: hashedPassword.substring(0, 10),
      expiresAt: Date.now() + 60 * 60 * 24 * 7 * 1000,
    });
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to update password.") };
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "No account found with this email address." };
    }

    const otpRes = await generateOTP(email, "PASSWORD_RESET");
    if (!otpRes.success) {
      return { success: false, error: otpRes.error || "Failed to generate verification code." };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

export async function verifyPasswordResetOTP(email: string, code: string) {
  try {
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        email,
        code,
        purpose: "PASSWORD_RESET",
      },
    });

    if (!otpRecord) {
      return { success: false, error: "Invalid verification code." };
    }

    if (new Date() > otpRecord.expiresAt) {
      await prisma.oTP.delete({ where: { id: otpRecord.id } }).catch(() => {});
      return { success: false, error: "Verification code has expired." };
    }

    await prisma.oTP.delete({ where: { id: otpRecord.id } }).catch(() => {});

    const resetToken = signSession({
      email,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    return { success: true, token: resetToken };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to verify code." };
  }
}

export async function resetPasswordWithToken(email: string, token: string, newPassword: string) {
  try {
    const payload = verifySession(token);
    if (!payload || !payload.email || payload.email !== email) {
      return { success: false, error: "Invalid or expired reset session. Please start over." };
    }

    if (Date.now() > payload.expiresAt) {
      return { success: false, error: "Reset session has expired. Please start over." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reset password." };
  }
}
