"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "campus_stay_session";
const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-secret-key-at-least-32-chars-long-security-key";

function signSession(payload: any): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("hex");
  return `${data}.${signature}`;
}

export async function generateOTP(email: string, purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET") {
  try {
    // 1. Delete any existing OTPs for this email/purpose
    await prisma.oTP.deleteMany({
      where: {
        email,
        purpose,
      },
    });

    // 2. Generate 6-digit numeric code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Set expiry to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // 4. Save to database
    await prisma.oTP.create({
      data: {
        email,
        code,
        purpose,
        expiresAt,
      },
    });

    // 5. Deliver email
    const emailRes = await sendOTPEmail(email, code);
    
    return { success: true, debug: emailRes.debug };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to generate OTP." };
  }
}

export async function verifyOTP(email: string, code: string, purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET") {
  try {
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        email,
        code,
        purpose,
      },
    });

    if (!otpRecord) {
      return { success: false, error: "Invalid verification code." };
    }

    if (new Date() > otpRecord.expiresAt) {
      // Clean up expired record
      await prisma.oTP.delete({ where: { id: otpRecord.id } }).catch(() => {});
      return { success: false, error: "Verification code has expired." };
    }

    // Code is valid - clean it up from database
    await prisma.oTP.delete({ where: { id: otpRecord.id } }).catch(() => {});

    // Update user's email verification status
    const user = await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });

    // Automatically sign session cookie
    const cookieStore = await cookies();
    const token = signSession({ userId: user.id, role: user.role });
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, role: user.role };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to verify OTP." };
  }
}

async function sendOTPEmail(email: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "placeholder" || apiKey.includes("your-api-key")) {
    console.log("\n==============================================");
    console.log(`[DEV OTP DELIVERY FALLBACK]`);
    console.log(`To: ${email}`);
    console.log(`Code: ${code}`);
    console.log("==============================================\n");
    return { success: true, debug: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Campus Stay <onboarding@resend.dev>",
        to: [email],
        subject: "Your Campus Stay OTP Code",
        html: `
          <div style="font-family: 'Poppins', sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; borderRadius: 16px;">
            <h2 style="color: rgb(2, 53, 28); font-weight: 700;">Campus Stay OTP Verification</h2>
            <p>Welcome to Campus Stay! Please use the 6-digit OTP code below to verify your email address. This code is valid for 10 minutes.</p>
            <div style="background-color: #f1f5f3; padding: 16px; text-align: center; border-radius: 8px; font-size: 2rem; font-weight: 800; letter-spacing: 4px; color: rgb(2, 53, 28); margin: 24px 0;">
              ${code}
            </div>
            <p style="color: #666; font-size: 0.85rem;">If you did not request this code, you can safely ignore this email.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Resend API error: ${errorText}`);
      throw new Error("Failed to deliver OTP email via Resend API.");
    }

    return { success: true, debug: false };
  } catch (error: any) {
    console.error(`Email delivery failure: ${error.message}`);
    console.log(`[FALLBACK DELIVERY DUE TO ERROR] Code: ${code} to ${email}`);
    return { success: true, debug: true };
  }
}
