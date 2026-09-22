"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { getAuthSecret } from "@/lib/auth-secret";

const SESSION_COOKIE_NAME = "campus_stay_session";

function signSession(payload: any): string {
  const secret = getAuthSecret();
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(data).digest("hex");
  return `${data}.${signature}`;
}

export async function generateOTP(email: string, purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "TWO_FACTOR_AUTH") {
  try {
    const rateCheck = await checkRateLimit(`otp-${purpose}`, 3, 3);
    if (!rateCheck.success) {
      return { success: false, error: rateCheck.error };
    }
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
    const emailRes = await sendOTPEmail(email, code, purpose);
    
    return { success: true, debug: emailRes.debug };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to generate OTP." };
  }
}

export async function verifyOTP(email: string, code: string, purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "TWO_FACTOR_AUTH") {
  try {
    const rateCheck = await checkRateLimit("verify-otp", 5, 5);
    if (!rateCheck.success) {
      return { success: false, error: rateCheck.error };
    }

    const trimmedCode = (code || "").trim();

    const otpRecord = await prisma.oTP.findFirst({
      where: {
        email,
        purpose,
      },
    });

    if (!otpRecord) {
      return { success: false, error: "Invalid verification code or code has expired." };
    }

    if (new Date() > otpRecord.expiresAt) {
      // Clean up expired record
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

    // Code is valid 
    await prisma.oTP.delete({ where: { id: otpRecord.id } }).catch(() => {});

    // Update user's email verification status
    const user = await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });

    // Automatically sign session cookie
    const cookieStore = await cookies();
    const token = signSession({
      userId: user.id,
      role: user.role,
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
    return { success: false, error: err.message || "Failed to verify OTP." };
  }
}

async function sendOTPEmail(email: string, code: string, purpose?: string) {
  const apiKey = process.env.RESEND_API_KEY;

  const isTwoFactor = purpose === "TWO_FACTOR_AUTH";
  const subjectTitle = isTwoFactor 
    ? `Campus Tent Security Code: ${code}`
    : `Your Campus Tent Verification Code: ${code}`;
  const headerTitle = isTwoFactor 
    ? "Security Authorization Code" 
    : "Email Verification Code";
  const descText = isTwoFactor
    ? "Use the one-time security code below to authorize your high-privilege account action or login on Campus Tent."
    : "Use the one-time verification code below to complete your registration or password reset on Campus Tent.";

  if (!apiKey || apiKey === "placeholder" || apiKey === "re_test_key" || apiKey.includes("your-api-key")) {
    console.log("\n==============================================");
    console.log(`[DEV OTP DELIVERY FALLBACK - ${purpose || "GENERAL"}]`);
    console.log(`To: ${email}`);
    console.log(`Code: ${code}`);
    console.log("==============================================\n");
    return { success: true, debug: true };
  }

  try {
    const res = await sendEmail({
      to: email,
      subject: subjectTitle,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${headerTitle}</title>
        </head>
        <body style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f6f5; margin: 0; padding: 30px 15px;">
          <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
            <div style="background-color: rgb(2, 53, 28); padding: 28px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">Campus Tent</h1>
              <p style="color: #e2e8f0; margin: 6px 0 0 0; font-size: 13px;">Secure Off-Campus Student Accommodation</p>
            </div>
            
            <div style="padding: 32px 28px;">
              <h2 style="color: rgb(2, 53, 28); font-size: 18px; margin-top: 0; font-weight: 600;">${headerTitle}</h2>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                ${descText}
              </p>
              
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px dashed #059669; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: rgb(2, 53, 28); font-family: monospace;">${code}</span>
              </div>
              
              <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin-bottom: 8px;">
                This code will expire in <strong>10 minutes</strong>.
              </p>
              <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin-top: 16px; border-top: 1px solid #f3f4f6; padding-top: 16px;">
                If you did not request this verification code, you can safely disregard this email.
              </p>
            </div>
            
            <div style="background-color: #fafafa; padding: 16px; text-align: center; border-top: 1px solid #f3f4f6;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} Campus Tent. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (!res.success) {
      console.error(`Resend API delivery error:`, res.error);
      return { success: true, debug: true };
    }

    return { success: true, debug: false };
  } catch (error: any) {
    console.error(`Email delivery failure: ${error.message}`);
    console.log(`[FALLBACK DELIVERY DUE TO ERROR] Code: ${code} to ${email}`);
    return { success: true, debug: true };
  }
}
