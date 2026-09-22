"use server";

import prisma from "@/lib/prisma";
import crypto from "crypto";
import { cookies } from "next/headers";
import { getCurrentUser } from "./auth";
import { getAuthSecret } from "@/lib/auth-secret";
import {
  generateTOTPSecret,
  generateTOTPCode,
  verifyTOTPCode,
  getOTPAuthURI,
  generateBackupCodes,
  hashBackupCode,
  verifyBackupCode,
} from "@/lib/totp";
import { generateOTP, verifyOTP } from "./otp";
import { logAuditEvent } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";

const SESSION_COOKIE_NAME = "campus_stay_session";

// Sign a 5-minute temporary 2FA verification token
export async function sign2FATempToken(userId: string): Promise<string> {
  const secret = getAuthSecret();
  const payload = {
    userId,
    purpose: "2FA_VERIFY",
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(data).digest("hex");
  return `${data}.${signature}`;
}

// Verify a 2FA temporary token
export async function verify2FATempToken(token: string): Promise<{ userId: string } | null> {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const secret = getAuthSecret();

    const expectedSignature = crypto.createHmac("sha256", secret).update(data).digest("hex");
    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (payload.purpose !== "2FA_VERIFY" || Date.now() > payload.expiresAt) {
      return null;
    }

    return { userId: payload.userId };
  } catch {
    return null;
  }
}

// Sign full session cookie
function signSession(payload: any): string {
  const secret = getAuthSecret();
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(data).digest("hex");
  return `${data}.${signature}`;
}

/**
 * Get 2FA status for the logged-in user
 */
export async function get2FAStatus() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        twoFactorEnabled: true,
        twoFactorConfirmedAt: true,
      },
    });

    return {
      success: true,
      enabled: !!dbUser?.twoFactorEnabled,
      confirmedAt: dbUser?.twoFactorConfirmedAt || null,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load 2FA status." };
  }
}

/**
 * Initialize 2FA Setup for the logged-in user (Admin or Agent)
 */
export async function setup2FA() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const secret = generateTOTPSecret();
    const backupCodes = generateBackupCodes(8);
    const otpauthUri = getOTPAuthURI(user.email, secret, "Campus Tent");

    return {
      success: true,
      secret,
      otpauthUri,
      backupCodes,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to initialize 2FA setup." };
  }
}

/**
 * Confirm and activate 2FA with a valid TOTP code
 */
export async function confirm2FA(data: { secret: string; code: string; backupCodes: string[] }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { secret, code, backupCodes } = data;
    if (!secret || !code) {
      return { success: false, error: "Secret and 6-digit verification code are required." };
    }

    const isValid = verifyTOTPCode(code, secret);
    if (!isValid) {
      return { success: false, error: "Invalid authenticator code. Please ensure your device clock is synchronized." };
    }

    const hashedBackupCodes = (backupCodes || []).map((c) => hashBackupCode(c));

    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        twoFactorBackupCodes: hashedBackupCodes,
        twoFactorConfirmedAt: new Date(),
      },
    });

    await logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorName: user.name || "User",
      actorRole: user.role as any,
      action: "2FA_ENABLED",
      targetType: "AUTH",
      targetId: user.id,
      targetLabel: user.email,
      details: `Two-Factor Authentication (TOTP) successfully activated on account ${user.email}.`,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to activate 2FA." };
  }
}

/**
 * Disable 2FA
 */
export async function disable2FA(data: { code: string }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    if (user.role === "ADMIN") {
      return {
        success: false,
        error: "Two-Factor Authentication is mandatory for administrator accounts and cannot be disabled.",
      };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!dbUser?.twoFactorEnabled) {
      return { success: false, error: "2FA is not enabled on this account." };
    }

    if (dbUser.twoFactorSecret) {
      const isValid = verifyTOTPCode(data.code, dbUser.twoFactorSecret);
      if (!isValid) {
        return { success: false, error: "Invalid 6-digit code. Cannot disable 2FA without valid authentication." };
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: [],
        twoFactorConfirmedAt: null,
      },
    });

    await logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorName: user.name || "User",
      actorRole: user.role as any,
      action: "2FA_DISABLED",
      targetType: "AUTH",
      targetId: user.id,
      targetLabel: user.email,
      details: `Two-Factor Authentication was disabled on account ${user.email}.`,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to disable 2FA." };
  }
}

/**
 * Request verification challenge for updating Agent bank payout account details
 */
export async function requestAgentBankUpdateVerification() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT") {
      return { success: false, error: "Unauthorized. Agent session required." };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { twoFactorEnabled: true, email: true },
    });

    if (dbUser?.twoFactorEnabled) {
      return {
        success: true,
        method: "TOTP" as const,
      };
    }

    // Agent does not have TOTP app configured: dispatch Email OTP
    const rateCheck = await checkRateLimit(`bank-otp:${user.id}`, 3, 5);
    if (!rateCheck.success) {
      return { success: false, error: rateCheck.error };
    }

    const otpRes = await generateOTP(user.email, "TWO_FACTOR_AUTH");
    if (!otpRes.success) {
      return { success: false, error: otpRes.error || "Failed to dispatch email verification code." };
    }

    // Mask email for display (e.g., j***@example.com)
    const [localPart, domain] = user.email.split("@");
    const maskedEmail = `${localPart[0]}***@${domain}`;

    return {
      success: true,
      method: "EMAIL_OTP" as const,
      maskedEmail,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to initialize bank verification." };
  }
}

/**
 * Send 2FA Backup Email OTP
 */
export async function send2FAEmailOTP(tempToken: string) {
  try {
    const verified = await verify2FATempToken(tempToken);
    if (!verified) {
      return { success: false, error: "Session expired. Please log in again." };
    }

    const user = await prisma.user.findUnique({
      where: { id: verified.userId },
      select: { email: true, id: true },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    const rateCheck = await checkRateLimit(`2fa-email-otp:${user.id}`, 3, 5);
    if (!rateCheck.success) {
      return { success: false, error: "Too many code requests. Please wait a moment." };
    }

    const otpRes = await generateOTP(user.email, "TWO_FACTOR_AUTH");
    if (!otpRes.success) {
      return { success: false, error: "Failed to dispatch email verification code." };
    }

    return { success: true, message: `A 6-digit security code was sent to ${user.email}.` };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to send backup email code." };
  }
}

/**
 * Complete 2FA Login verification
 */
export async function verify2FALogin(data: {
  tempToken: string;
  code: string;
  isBackupCode?: boolean;
  isEmailOtp?: boolean;
}) {
  try {
    const { tempToken, code, isBackupCode, isEmailOtp } = data;
    if (!tempToken || !code) {
      return { success: false, error: "Security code is required." };
    }

    const verified = await verify2FATempToken(tempToken);
    if (!verified) {
      return { success: false, error: "Login session expired. Please log in again with your password." };
    }

    const user = await prisma.user.findUnique({
      where: { id: verified.userId },
      include: {
        studentProfile: true,
        agentProfile: true,
      },
    });

    if (!user || user.deletedAt) {
      return { success: false, error: "Account not found or deactivated." };
    }

    if (!user.twoFactorEnabled) {
      return { success: false, error: "2FA is not enabled on this account." };
    }

    let authMethod = "TOTP_AUTHENTICATOR";

    if (isEmailOtp) {
      const emailValid = await verifyOTP(user.email, code, "TWO_FACTOR_AUTH");
      if (!emailValid.success) {
        return { success: false, error: emailValid.error || "Invalid or expired email security code." };
      }
      authMethod = "EMAIL_OTP_FALLBACK";
    } else if (isBackupCode) {
      const matchIndex = verifyBackupCode(code, user.twoFactorBackupCodes || []);
      if (matchIndex === -1) {
        return { success: false, error: "Invalid backup recovery code." };
      }

      // Burn the single-use backup code
      const updatedCodes = [...user.twoFactorBackupCodes];
      updatedCodes.splice(matchIndex, 1);
      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorBackupCodes: updatedCodes },
      });

      authMethod = "BACKUP_RECOVERY_CODE";
    } else {
      if (!user.twoFactorSecret) {
        return { success: false, error: "2FA configuration error. Please use backup code or contact support." };
      }
      const validTOTP = verifyTOTPCode(code, user.twoFactorSecret);
      if (!validTOTP) {
        return { success: false, error: "Invalid 6-digit authenticator code." };
      }
    }

    // Issue session cookie
    const cookieStore = await cookies();
    const token = signSession({
      userId: user.id,
      role: user.role,
      passwordVersion: user.password.substring(0, 10),
      tokenVersion: user.tokenVersion || 1,
      expiresAt: Date.now() + 60 * 60 * 24 * 7 * 1000,
    });

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    await logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorName: (user as any).name || (user.role === "STUDENT" ? user.studentProfile?.fullName : user.agentProfile?.fullName) || "User",
      actorRole: user.role as any,
      action: "2FA_LOGIN_SUCCESS",
      targetType: "AUTH",
      targetId: user.id,
      targetLabel: user.email,
      details: `Successful 2FA verification using ${authMethod}.`,
      metadata: { authMethod },
    });

    return { success: true, role: user.role };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to complete 2FA verification." };
  }
}
