"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { logAuditEvent } from "@/lib/audit";
import { sendEmail } from "@/lib/email";

export interface AmbassadorSubmitInput {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  level: string;
  pitch: string;
  socialHandle?: string;
}

// Generate an attractive, memorable referral code: e.g. CT-EMEN-924
function generateReferralCode(fullName: string): string {
  const clean = fullName.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4) || "CAMP";
  const randomDigits = Math.floor(100 + Math.random() * 900);
  return `CT-${clean}-${randomDigits}`;
}

export async function submitAmbassadorApplication(data: AmbassadorSubmitInput) {
  try {
    const fullName = data.fullName?.trim();
    const email = data.email?.trim().toLowerCase();
    const phone = data.phone?.trim();
    const university = data.university?.trim();
    const department = data.department?.trim();
    const level = data.level?.trim();
    const pitch = data.pitch?.trim();
    const socialHandle = data.socialHandle?.trim() || null;

    if (!fullName || !email || !phone || !university || !department || !level || !pitch) {
      return { success: false, error: "Please fill in all required fields." };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Please provide a valid email address." };
    }

    if (pitch.length < 20) {
      return { success: false, error: "Please tell us a bit more about why you'd like to be an ambassador (at least 20 characters)." };
    }

    // Check if an application already exists with this email
    const existing = await prisma.ambassadorApplication.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.status === "APPROVED") {
        return {
          success: true,
          alreadyApproved: true,
          referralCode: existing.referralCode,
          status: existing.status,
          message: `You are already an approved Campus Tent Ambassador! Your referral code is ${existing.referralCode}.`,
        };
      }
      return {
        success: true,
        alreadyPending: true,
        referralCode: existing.referralCode,
        status: existing.status,
        message: `We already have your application under review. Please check your email within 24 to 48 hours. Your assigned referral code is ${existing.referralCode}.`,
      };
    }

    // Generate unique referral code
    let referralCode = generateReferralCode(fullName);
    let attempts = 0;
    while (attempts < 5) {
      const codeExists = await prisma.ambassadorApplication.findUnique({
        where: { referralCode },
      });
      if (!codeExists) break;
      referralCode = generateReferralCode(fullName);
      attempts++;
    }

    // Check if user is logged in
    const currentUser = await getCurrentUser();

    const application = await prisma.ambassadorApplication.create({
      data: {
        userId: currentUser?.id || null,
        fullName,
        email,
        phone,
        university,
        department,
        level,
        socialHandle,
        pitch,
        referralCode,
        status: "PENDING",
      },
    });

    await logAuditEvent({
      actorId: currentUser?.id || null,
      actorEmail: email,
      actorName: fullName,
      actorRole: currentUser?.role || "STUDENT",
      action: "AMBASSADOR_APPLICATION_SUBMITTED",
      targetType: "AMBASSADOR",
      targetId: application.id,
      targetLabel: `${fullName} (${referralCode})`,
      details: `New campus ambassador application submitted for ${university}`,
      metadata: { university, department, level, referralCode },
    });

    // Send confirmation email with 24-48 hours notice and instructions
    const referralLink = `https://campustent.com/auth/student-signup?ref=${application.referralCode}`;
    try {
      await sendEmail({
        to: email,
        subject: "Ambassador Application Received: Check Email within 24-48 Hours - Campus Tent",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
            <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #f1f5f9;">
              <h1 style="color: #02351c; margin: 0; font-size: 24px;">Campus Tent</h1>
              <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">Campus Ambassador Network</p>
            </div>

            <h2 style="color: #02351c; font-size: 20px; margin-top: 0;">Application Received!</h2>
            <p style="font-size: 15px; line-height: 1.6;">Hi <strong>${fullName}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6;">
              Thank you for applying to become an official <strong>Campus Tent Ambassador</strong> for <strong>${university}</strong>!
            </p>

            <div style="background-color: #ecfdf5; border-left: 4px solid #059669; padding: 14px 18px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: bold;">
                IMPORTANT: Review Window (24 - 48 Hours)
              </p>
              <p style="margin: 6px 0 0 0; color: #047857; font-size: 14px; line-height: 1.5;">
                Our community onboarding team is currently evaluating your profile. Please <strong>check your email within the next 24 to 48 hours</strong> for your official approval notice and ambassador kit.
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #02351c 0%, #064e3b 100%); color: #ffffff; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #cbd5e1; margin-bottom: 6px;">
                Your Assigned Referral Code
              </div>
              <div style="font-size: 28px; font-weight: 800; letter-spacing: 2px; color: #fef08a;">
                ${application.referralCode}
              </div>
              <div style="font-size: 13px; color: #a7f3d0; margin-top: 8px;">
                Direct Link: <a href="${referralLink}" style="color: #ffffff; text-decoration: underline;">${referralLink}</a>
              </div>
            </div>

            <h3 style="color: #02351c; font-size: 17px; margin-bottom: 12px;">How to Use Your Referral Code:</h3>
            <ol style="font-size: 14px; line-height: 1.7; padding-left: 20px; color: #334155;">
              <li style="margin-bottom: 8px;">
                <strong>Share with Students & Freshers:</strong> Share your unique link (or code <code>${application.referralCode}</code>) with course mates, department groups, and hostel forums searching for verified accommodation.
              </li>
              <li style="margin-bottom: 8px;">
                <strong>Automatic Signup Attribution:</strong> When students register via your link or enter your code on <a href="https://campustent.com/auth/student-signup" style="color: #02351c; font-weight: bold;">Student Signup</a>, they are instantly linked to your account.
              </li>
              <li style="margin-bottom: 8px;">
                <strong>Earn ₦1,000 per Referral:</strong> Earn commissions on every booked viewing tour and confirmed hostel reservation.
              </li>
              <li style="margin-bottom: 8px;">
                <strong>Real-time Tracking:</strong> Check your live referral count and earnings anytime on our <a href="https://campustent.com/ambassador" style="color: #02351c; font-weight: bold;">Ambassador Tracking Page</a>.
              </li>
              <li>
                <strong>Certificates & Merch:</strong> Top-performing ambassadors qualify for official Leadership Certificates endorsed by Campus Tent and branded merch.
              </li>
            </ol>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 13px;">
              <p style="margin: 0;">Have questions? Reach our ambassador relations desk at <a href="mailto:support@campustent.com" style="color: #02351c; font-weight: 600;">support@campustent.com</a></p>
              <p style="margin: 6px 0 0 0;">&copy; ${new Date().getFullYear()} Campus Tent. All rights reserved.</p>
            </div>
          </div>
        `,
        text: `Hi ${fullName},\n\nThank you for applying to become a Campus Tent Ambassador for ${university}!\n\nIMPORTANT: Our team will review your application. Please check your email within 24 to 48 hours for your onboarding confirmation.\n\nYour Referral Code: ${application.referralCode}\nYour Referral Link: ${referralLink}\n\nHow to use your code:\n1. Share your code or referral link with students looking for accommodation.\n2. When students sign up using your code, you earn ₦1,000 per referral and unlock leadership certificates.\n3. Check your status anytime at https://campustent.com/ambassador\n\nBest regards,\nCampus Tent Team`,
      });
    } catch (emailErr) {
      console.error("Failed to dispatch ambassador confirmation email:", emailErr);
    }

    return {
      success: true,
      referralCode: application.referralCode,
      status: application.status,
      message: "Application submitted successfully! Please check your email within 24 to 48 hours for your review confirmation and referral onboarding instructions.",
    };
  } catch (error: any) {
    console.error("Ambassador application error:", error);
    return { success: false, error: error.message || "Failed to submit application. Please try again." };
  }
}

export async function getAmbassadorStatus(identifier: string) {
  try {
    if (!identifier || !identifier.trim()) {
      return { success: false, error: "Please provide your email or referral code." };
    }

    const query = identifier.trim().toLowerCase();

    const application = await prisma.ambassadorApplication.findFirst({
      where: {
        OR: [
          { email: query },
          { referralCode: query.toUpperCase() },
        ],
      },
      include: {
        payouts: {
          orderBy: { disbursedAt: "desc" },
        },
      },
    });

    if (!application) {
      return { success: false, error: "No ambassador record found for the provided email or code." };
    }

    return {
      success: true,
      application: {
        id: application.id,
        fullName: application.fullName,
        email: application.email,
        university: application.university,
        referralCode: application.referralCode,
        status: application.status,
        referralCount: application.referralCount,
        earnings: application.earnings,
        bankCode: application.bankCode,
        bankName: application.bankName,
        accountNumber: application.accountNumber,
        accountName: application.accountName,
        recipientCode: application.recipientCode,
        payouts: (application.payouts || []).map((p) => ({
          id: p.id,
          amount: p.amount,
          reference: p.reference,
          bankName: p.bankName,
          accountNumber: p.accountNumber,
          accountName: p.accountName,
          status: p.status,
          note: p.note,
          disbursedAt: p.disbursedAt.toISOString(),
        })),
        createdAt: application.createdAt.toISOString(),
      },
    };
  } catch (error: any) {
    console.error("Get ambassador status error:", error);
    return { success: false, error: "Could not retrieve status." };
  }
}

/**
 * Resolve Nigerian bank account name via Paystack for ambassadors
 */
export async function resolveAmbassadorBankAccount(accountNumber: string, bankCode: string) {
  try {
    if (!accountNumber || accountNumber.trim().length !== 10) {
      return { success: false, error: "Please enter a valid 10-digit Nigerian NUBAN account number." };
    }

    if (!bankCode) {
      return { success: false, error: "Please select a bank." };
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret || paystackSecret.includes("your-paystack-secret-key")) {
      return {
        success: true,
        accountName: "Verified Ambassador Account",
        accountNumber: accountNumber.trim(),
        bankCode,
      };
    }

    const res = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(
        accountNumber.trim()
      )}&bank_code=${encodeURIComponent(bankCode.trim())}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret.trim()}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    if (!res.ok || !data.status) {
      return {
        success: false,
        error: data.message || "Could not resolve bank account name. Please verify the account number and bank.",
      };
    }

    return {
      success: true,
      accountName: data.data.account_name,
      accountNumber: data.data.account_number,
      bankCode,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error while resolving bank details." };
  }
}

/**
 * Save ambassador bank details and generate Paystack transfer recipient
 */
export async function saveAmbassadorBankDetails(data: {
  identifier: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}) {
  try {
    const { identifier, bankCode, bankName, accountNumber, accountName } = data;
    if (!identifier || !bankCode || !bankName || !accountNumber || !accountName) {
      return { success: false, error: "All bank fields and ambassador identifier are required." };
    }

    const query = identifier.trim().toLowerCase();
    const existing = await prisma.ambassadorApplication.findFirst({
      where: {
        OR: [
          { email: query },
          { referralCode: query.toUpperCase() },
        ],
      },
    });

    if (!existing) {
      return { success: false, error: "Ambassador record not found." };
    }

    let recipientCode = existing.recipientCode;
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    if (paystackSecret && !paystackSecret.includes("your-paystack-secret-key") && paystackSecret.startsWith("sk_")) {
      try {
        const recipRes = await fetch("https://api.paystack.co/transferrecipient", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${paystackSecret.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "nuban",
            name: accountName.trim(),
            account_number: accountNumber.trim(),
            bank_code: bankCode.trim(),
            currency: "NGN",
            description: `Ambassador Payout Recipient for ${existing.email} (${existing.referralCode})`,
          }),
        });

        const recipData = await recipRes.json();
        if (recipRes.ok && recipData.status && recipData.data?.recipient_code) {
          recipientCode = recipData.data.recipient_code;
        }
      } catch (paystackErr: any) {
        console.warn("Paystack transfer recipient note for ambassador:", paystackErr);
      }
    }

    if (!recipientCode) {
      recipientCode = `RCP_AMB_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }

    const updated = await prisma.ambassadorApplication.update({
      where: { id: existing.id },
      data: {
        bankCode,
        bankName,
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
        recipientCode,
      },
    });

    await logAuditEvent({
      actorId: existing.userId || null,
      actorEmail: existing.email,
      actorName: existing.fullName,
      actorRole: "STUDENT",
      action: "AMBASSADOR_BANK_DETAILS_UPDATED",
      targetType: "AMBASSADOR",
      targetId: existing.id,
      targetLabel: `${bankName} - ${accountNumber.substring(0, 3)}****${accountNumber.substring(7)}`,
      details: `Ambassador updated payout bank details to ${bankName} (${accountName}).`,
      metadata: { bankName, bankCode, accountName, recipientCode },
    });

    return {
      success: true,
      message: "Bank details saved successfully for direct payouts!",
      bankDetails: {
        bankCode: updated.bankCode,
        bankName: updated.bankName,
        accountNumber: updated.accountNumber,
        accountName: updated.accountName,
        recipientCode: updated.recipientCode,
      },
    };
  } catch (err: any) {
    console.error("Save ambassador bank details error:", err);
    return { success: false, error: err.message || "Failed to save bank details." };
  }
}

export async function validateReferralCode(code: string) {
  try {
    if (!code || !code.trim()) {
      return { valid: false, message: "Please enter a referral code." };
    }

    const clean = code.trim().toUpperCase();
    const ambassador = await prisma.ambassadorApplication.findUnique({
      where: { referralCode: clean },
      select: {
        id: true,
        fullName: true,
        university: true,
        referralCode: true,
        status: true,
      },
    });

    if (!ambassador) {
      return { valid: false, message: "Invalid referral code." };
    }

    return {
      valid: true,
      ambassador: {
        name: ambassador.fullName,
        university: ambassador.university,
        referralCode: ambassador.referralCode,
      },
      message: `Referred by Ambassador ${ambassador.fullName} (${ambassador.university})`,
    };
  } catch {
    return { valid: false, message: "Could not validate referral code." };
  }
}

export async function adminGetAmbassadors() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized access." };
    }

    const ambassadors = await prisma.ambassadorApplication.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, ambassadors };
  } catch (error: any) {
    console.error("Admin get ambassadors error:", error);
    return { success: false, error: "Failed to fetch ambassador applications." };
  }
}

export async function adminUpdateAmbassadorStatus({
  id,
  status,
  earningsIncrement,
}: {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  earningsIncrement?: number;
}) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "ADMIN") {
      return { success: false, error: "Unauthorized access." };
    }

    const existing = await prisma.ambassadorApplication.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Ambassador application not found." };
    }

    const updateData: any = {
      status,
      reviewedAt: new Date(),
      reviewedBy: admin.email,
    };

    if (typeof earningsIncrement === "number" && earningsIncrement > 0) {
      updateData.earnings = { increment: earningsIncrement };
      updateData.referralCount = { increment: 1 };
    }

    const updated = await prisma.ambassadorApplication.update({
      where: { id },
      data: updateData,
    });

    await logAuditEvent({
      actorId: admin.id,
      actorEmail: admin.email,
      actorName: admin.name || "Admin",
      actorRole: "ADMIN",
      action: `AMBASSADOR_STATUS_${status}`,
      targetType: "AMBASSADOR",
      targetId: updated.id,
      targetLabel: `${updated.fullName} (${updated.referralCode})`,
      details: `Admin changed ambassador application status to ${status}`,
      metadata: { previousStatus: existing.status, newStatus: status, earningsIncrement },
    });

    if (status === "APPROVED" && existing.status !== "APPROVED") {
      const referralLink = `https://campustent.com/auth/student-signup?ref=${updated.referralCode}`;
      try {
        await sendEmail({
          to: updated.email,
          subject: "Official Approval: Welcome as a Campus Tent Ambassador! 🎉 - Campus Tent",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
              <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #f1f5f9;">
                <h1 style="color: #02351c; margin: 0; font-size: 24px;">Campus Tent</h1>
                <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">Campus Ambassador Network</p>
              </div>

              <h2 style="color: #059669; font-size: 22px; margin-top: 0;">Congratulations ${updated.fullName}!</h2>
              <p style="font-size: 15px; line-height: 1.6;">
                Your application to represent <strong>${updated.university}</strong> as a <strong>Campus Tent Ambassador</strong> has been officially <strong>APPROVED</strong>!
              </p>

              <div style="background: linear-gradient(135deg, #02351c 0%, #064e3b 100%); color: #ffffff; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
                <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #cbd5e1; margin-bottom: 6px;">
                  Your Active Referral Code
                </div>
                <div style="font-size: 28px; font-weight: 800; letter-spacing: 2px; color: #fef08a;">
                  ${updated.referralCode}
                </div>
                <div style="font-size: 13px; color: #a7f3d0; margin-top: 8px;">
                  Share Link: <a href="${referralLink}" style="color: #ffffff; text-decoration: underline;">${referralLink}</a>
                </div>
              </div>

              <h3 style="color: #02351c; font-size: 16px;">Next Steps to Start Earning:</h3>
              <ul style="font-size: 14px; line-height: 1.7; padding-left: 20px; color: #334155;">
                <li>Share your referral link on student WhatsApp status, university groups, and hostel forums.</li>
                <li>Earn ₦1,000 commission on every verified inspection & accommodation booking.</li>
                <li>Monitor your referral statistics in real-time at <a href="https://campustent.com/ambassador" style="color: #02351c; font-weight: bold;">campustent.com/ambassador</a>.</li>
              </ul>

              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 13px;">
                <p style="margin: 0;">Need ambassador banners or marketing materials? Contact us at <a href="mailto:support@campustent.com" style="color: #02351c; font-weight: 600;">support@campustent.com</a></p>
              </div>
            </div>
          `,
          text: `Congratulations ${updated.fullName}!\n\nYour application to become a Campus Tent Ambassador for ${updated.university} has been APPROVED!\n\nYour Active Referral Code: ${updated.referralCode}\nReferral Link: ${referralLink}\n\nStart sharing your link to earn ₦1,000 per referral!\nTrack earnings at: https://campustent.com/ambassador\n\nCampus Tent Team`,
        });
      } catch (e) {
        console.error("Failed to send approval email:", e);
      }
    }

    return { success: true, ambassador: updated };
  } catch (error: any) {
    console.error("Admin update ambassador error:", error);
    return { success: false, error: "Failed to update ambassador." };
  }
}

/**
 * Admin disburse or record an ambassador commission payout
 */
export async function adminDisburseAmbassadorPayout(data: {
  ambassadorId: string;
  amount: number;
  note?: string;
}) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "ADMIN") {
      return { success: false, error: "Unauthorized access." };
    }

    const { ambassadorId, amount, note } = data;
    if (!ambassadorId || !amount || amount <= 0) {
      return { success: false, error: "Valid ambassador ID and positive payout amount are required." };
    }

    const ambassador = await prisma.ambassadorApplication.findUnique({
      where: { id: ambassadorId },
    });

    if (!ambassador) {
      return { success: false, error: "Ambassador not found." };
    }

    if (!ambassador.accountNumber || !ambassador.bankName || !ambassador.accountName) {
      return {
        success: false,
        error: "This ambassador has not configured their Nigerian bank payout details yet.",
      };
    }

    const reference = `CS-AMB-${Math.floor(100000 + Math.random() * 900000)}`;

    const payout = await prisma.ambassadorPayout.create({
      data: {
        ambassadorId,
        amount,
        reference,
        bankName: ambassador.bankName,
        accountNumber: ambassador.accountNumber,
        accountName: ambassador.accountName,
        status: "SUCCESS",
        note: note?.trim() || `Ambassador commission payout for ${ambassador.fullName}`,
        disbursedAt: new Date(),
      },
    });

    await logAuditEvent({
      actorId: admin.id,
      actorEmail: admin.email,
      actorName: admin.name || "Admin",
      actorRole: "ADMIN",
      action: "AMBASSADOR_PAYOUT_DISBURSED",
      targetType: "AMBASSADOR",
      targetId: ambassador.id,
      targetLabel: `${ambassador.fullName} - ₦${amount.toLocaleString()} (${reference})`,
      details: `Admin disbursed ₦${amount.toLocaleString()} to ${ambassador.bankName} (${ambassador.accountNumber}). Ref: ${reference}`,
      metadata: {
        payoutId: payout.id,
        amount,
        reference,
        bankName: ambassador.bankName,
        accountNumber: ambassador.accountNumber,
        accountName: ambassador.accountName,
      },
    });

    // Send confirmation email to ambassador
    try {
      await sendEmail({
        to: ambassador.email,
        subject: `Payout Disbursed: ₦${amount.toLocaleString()} Commission Received! 🎉 - Campus Tent`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
            <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #f1f5f9;">
              <h1 style="color: #02351c; margin: 0; font-size: 24px;">Campus Tent</h1>
              <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">Ambassador Commission Payout</p>
            </div>
            <h2 style="color: #059669; font-size: 20px; margin-top: 0;">Payment Disbursed!</h2>
            <p style="font-size: 15px; line-height: 1.6;">Hi <strong>${ambassador.fullName}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6;">
              Great news! Your commission payout of <strong style="color: #059669; font-size: 18px;">₦${amount.toLocaleString()}</strong> has been processed and disbursed directly to your registered bank account.
            </p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; font-size: 14px; color: #334155;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Amount:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #059669;">₦${amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Bank:</td>
                  <td style="padding: 6px 0; font-weight: bold;">${ambassador.bankName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Account Number:</td>
                  <td style="padding: 6px 0; font-weight: bold;">${ambassador.accountNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Account Name:</td>
                  <td style="padding: 6px 0; font-weight: bold;">${ambassador.accountName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Reference:</td>
                  <td style="padding: 6px 0; font-family: monospace; font-weight: bold;">${reference}</td>
                </tr>
              </table>
            </div>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              You can view your complete transaction history anytime on your <a href="https://campustent.com/ambassador" style="color: #02351c; font-weight: bold;">Ambassador Tracking Dashboard</a>.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send payout email to ambassador:", emailErr);
    }

    return { success: true, payout, reference };
  } catch (error: any) {
    console.error("Admin disburse ambassador payout error:", error);
    return { success: false, error: error.message || "Failed to disburse payout." };
  }
}

