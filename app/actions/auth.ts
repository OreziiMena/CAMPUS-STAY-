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
import { validateFileBuffer, generateSecureFilename } from "@/lib/upload-validator";
import { getAuthSecret } from "@/lib/auth-secret";
import { logAuditEvent } from "@/lib/audit";
import { isDeltaStateInstitution } from "@/lib/universities";

const SESSION_COOKIE_NAME = "campus_stay_session";

// Cryptographic signing of session JSON payload
function signSession(payload: any): string {
  const secret = getAuthSecret();
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(data).digest("hex");
  return `${data}.${signature}`;
}

// Verification of signed session token
function verifySession(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const secret = getAuthSecret();
    
    const expectedSignature = crypto.createHmac("sha256", secret).update(data).digest("hex");
    
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

    const { fullname, email, phone, university, username, password, referralCode } = data;

    // Restrict student onboarding exclusively to Delta State tertiary institutions and UNIBEN
    if (!university || !isDeltaStateInstitution(university)) {
      return {
        success: false,
        error: "Student signups are currently exclusive to tertiary institutions in Delta State and UNIBEN (e.g. FUPRE, DELSU, PTI, UNIBEN, DOU, DSUST, UNIDEL). Campus Tent is expanding to your school soon!",
      };
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long." };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "Email already registered." };
    }

    const isAvailable = await checkUsernameAvailable(username);
    if (!isAvailable) {
      return { success: false, error: "Username is already taken." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate referral code if provided
    let appliedAmbassador: any = null;
    const cleanRef = typeof referralCode === "string" ? referralCode.trim().toUpperCase() : null;
    if (cleanRef) {
      appliedAmbassador = await prisma.ambassadorApplication.findUnique({
        where: { referralCode: cleanRef },
      });
    }

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
            preferences: appliedAmbassador
              ? {
                  referredBy: appliedAmbassador.referralCode,
                  ambassadorName: appliedAmbassador.fullName,
                  ambassadorUniversity: appliedAmbassador.university,
                  referredAt: new Date().toISOString(),
                }
              : undefined,
          },
        },
      },
    });

    // Increment ambassador referral count and log audit event
    if (appliedAmbassador) {
      try {
        await prisma.ambassadorApplication.update({
          where: { id: appliedAmbassador.id },
          data: {
            referralCount: { increment: 1 },
          },
        });

        await logAuditEvent({
          actorId: newUser.id,
          actorEmail: email,
          actorName: fullname,
          actorRole: "STUDENT",
          action: "REFERRAL_CODE_APPLIED",
          targetType: "AMBASSADOR",
          targetId: appliedAmbassador.id,
          targetLabel: `${appliedAmbassador.fullName} (${appliedAmbassador.referralCode})`,
          details: `Student ${fullname} (${email}) signed up using referral code ${appliedAmbassador.referralCode}`,
          metadata: {
            studentId: newUser.id,
            studentEmail: email,
            studentName: fullname,
            referralCode: cleanRef,
            ambassadorId: appliedAmbassador.id,
            ambassadorName: appliedAmbassador.fullName,
          },
        });
      } catch (refErr) {
        console.error("Failed to update ambassador referral count:", refErr);
      }
    }

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

    if (!password || typeof password !== "string" || password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long." };
    }

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

    if (user.deletedAt) {
      return { success: false, error: "This account has been deactivated. Please contact support." };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password." };
    }

    if (!user.isEmailVerified) {
      await generateOTP(email, "EMAIL_VERIFICATION");
      return { success: false, requireVerification: true, email, error: "Please verify your email address to continue." };
    }

    // Two-Factor Authentication Check
    if (user.twoFactorEnabled) {
      const { sign2FATempToken } = await import("./two-factor");
      const tempToken = await sign2FATempToken(user.id);
      return {
        success: false,
        require2FA: true,
        tempToken,
        email: user.email,
        role: user.role,
      };
    }

    const cookieStore = await cookies();
    const token = signSession({
      userId: user.id,
      role: user.role,
      passwordVersion: user.password.substring(0, 10),
      tokenVersion: user.tokenVersion || 1,
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

    const { userId, passwordVersion, tokenVersion } = payload;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        agentProfile: true,
      },
    });

    if (!user || user.deletedAt) return null;

    // Validate password version and tokenVersion to support instant session invalidation
    if (passwordVersion && user.password.substring(0, 10) !== passwordVersion) {
      return null;
    }
    if (tokenVersion && user.tokenVersion && tokenVersion !== user.tokenVersion) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      name: user.role === "STUDENT" ? user.studentProfile?.fullName : user.agentProfile?.fullName,
      twoFactorEnabled: !!user.twoFactorEnabled,
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

export async function uploadAgentVerification(_formData: FormData) {
  return { success: true };
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
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 },
      },
    });

    // Re-issue cookie for the current device so they remain logged in
    const cookieStore = await cookies();
    const token = signSession({
      userId: updatedUser.id,
      role: updatedUser.role,
      passwordVersion: hashedPassword.substring(0, 10),
      tokenVersion: updatedUser.tokenVersion,
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

    if (!user || user.deletedAt) {
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
    const rateCheck = await checkRateLimit("otp-verify-reset", 5, 5);
    if (!rateCheck.success) {
      return { success: false, error: rateCheck.error };
    }

    const trimmedCode = (code || "").trim();

    const otpRecord = await prisma.oTP.findFirst({
      where: {
        email,
        purpose: "PASSWORD_RESET",
      },
    });

    if (!otpRecord) {
      return { success: false, error: "Invalid verification code or code has expired." };
    }

    if (new Date() > otpRecord.expiresAt) {
      await prisma.oTP.delete({ where: { id: otpRecord.id } }).catch(() => {});
      return { success: false, error: "Verification code has expired. Please request a new code." };
    }

    // Brute-force lockout verification
    if (otpRecord.code !== trimmedCode) {
      const updatedAttempts = (otpRecord.attempts || 0) + 1;
      const maxAttempts = otpRecord.maxAttempts || 3;

      if (updatedAttempts >= maxAttempts) {
        await prisma.oTP.delete({ where: { id: otpRecord.id } }).catch(() => {});
        return {
          success: false,
          error: "Too many failed attempts. This OTP has been invalidated for your security. Please request a fresh verification code.",
        };
      } else {
        await prisma.oTP.update({
          where: { id: otpRecord.id },
          data: { attempts: updatedAttempts },
        });
        const remaining = maxAttempts - updatedAttempts;
        return {
          success: false,
          error: `Invalid verification code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
        };
      }
    }

    await prisma.oTP.delete({ where: { id: otpRecord.id } }).catch(() => {});

    const user = await prisma.user.findUnique({ where: { email } });
    const passwordVersion = user ? user.password.substring(0, 10) : "initial";

    const resetToken = signSession({
      email,
      passwordVersion,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    return { success: true, token: resetToken };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to verify code." };
  }
}

export async function resetPasswordWithToken(email: string, token: string, newPassword: string) {
  try {
    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      return { success: false, error: "New password must be at least 8 characters long." };
    }

    const payload = verifySession(token);
    if (!payload || !payload.email || payload.email !== email) {
      return { success: false, error: "Invalid or expired reset session. Please start over." };
    }

    if (Date.now() > payload.expiresAt) {
      return { success: false, error: "Reset session has expired. Please start over." };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "User account not found." };
    }

    // Single-use token enforcement: verify password version hasn't already been changed
    if (payload.passwordVersion && user.password.substring(0, 10) !== payload.passwordVersion) {
      return { success: false, error: "This password reset link has already been used." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 },
      },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reset password." };
  }
}
