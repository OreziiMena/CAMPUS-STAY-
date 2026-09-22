"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { NIGERIAN_BANKS } from "@/lib/banks";
import { logAuditEvent } from "@/lib/audit";
import { verifyTOTPCode, verifyBackupCode } from "@/lib/totp";
import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/email-sanitizer";

export async function getNigerianBanks() {
  return { success: true, banks: NIGERIAN_BANKS };
}

export async function getAgentBankDetails() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT" || !user.agentProfile) {
      return { success: false, error: "Unauthorized" };
    }

    const profile = await prisma.agentProfile.findUnique({
      where: { id: user.agentProfile.id },
      select: {
        bankCode: true,
        bankName: true,
        accountNumber: true,
        accountName: true,
        recipientCode: true,
      },
    });

    return {
      success: true,
      bankDetails: profile,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load bank details." };
  }
}

export async function resolveBankAccount(accountNumber: string, bankCode: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT") {
      return { success: false, error: "Unauthorized" };
    }

    if (!accountNumber || accountNumber.trim().length !== 10) {
      return { success: false, error: "Please enter a valid 10-digit Nigerian NUBAN account number." };
    }

    if (!bankCode) {
      return { success: false, error: "Please select a bank." };
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret || paystackSecret.includes("your-paystack-secret-key")) {
      // Return simulated success in local test mode if key not set
      return {
        success: true,
        accountName: user.name || "Verified Agent Account",
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

export async function saveAgentBankDetails(data: {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  securityCode: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT" || !user.agentProfile) {
      return { success: false, error: "Unauthorized" };
    }

    const { bankCode, bankName, accountNumber, accountName, securityCode } = data;
    if (!bankCode || !bankName || !accountNumber || !accountName) {
      return { success: false, error: "All bank fields are required." };
    }

    if (!securityCode || typeof securityCode !== "string" || !securityCode.trim()) {
      return { success: false, error: "A 6-digit security verification code is required to update payout bank details." };
    }

    const cleanCode = securityCode.trim();

    // Fetch user 2FA and OTP data
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        twoFactorBackupCodes: true,
      },
    });

    if (!dbUser) {
      return { success: false, error: "User account not found." };
    }

    let authMethod = "EMAIL_OTP";

    if (dbUser.twoFactorEnabled) {
      // 1. Check TOTP Code
      let valid = false;
      if (dbUser.twoFactorSecret) {
        valid = verifyTOTPCode(cleanCode, dbUser.twoFactorSecret);
      }

      // 2. Fallback to backup code
      if (!valid && dbUser.twoFactorBackupCodes?.length > 0) {
        const backupIndex = verifyBackupCode(cleanCode, dbUser.twoFactorBackupCodes);
        if (backupIndex !== -1) {
          valid = true;
          authMethod = "BACKUP_CODE";
          // Burn single-use backup code
          const updatedCodes = [...dbUser.twoFactorBackupCodes];
          updatedCodes.splice(backupIndex, 1);
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { twoFactorBackupCodes: updatedCodes },
          });
        }
      }

      if (!valid) {
        return { success: false, error: "Invalid authenticator code. Payout details were not changed." };
      }
      authMethod = authMethod === "BACKUP_CODE" ? "BACKUP_CODE" : "TOTP_AUTHENTICATOR";
    } else {
      // Agent does not have TOTP enabled: verify Email OTP
      const otpRecord = await prisma.oTP.findFirst({
        where: {
          email: dbUser.email,
          purpose: "TWO_FACTOR_AUTH",
        },
        orderBy: { createdAt: "desc" },
      });

      if (!otpRecord) {
        return { success: false, error: "Verification code expired or not found. Please request a new code." };
      }

      if (new Date() > otpRecord.expiresAt) {
        await prisma.oTP.delete({ where: { id: otpRecord.id } }).catch(() => {});
        return { success: false, error: "Verification code has expired. Please request a new code." };
      }

      if (otpRecord.code !== cleanCode) {
        const updatedAttempts = otpRecord.attempts + 1;
        if (updatedAttempts >= otpRecord.maxAttempts) {
          await prisma.oTP.delete({ where: { id: otpRecord.id } }).catch(() => {});
          return { success: false, error: "Too many failed attempts. This code has been invalidated. Please request a new code." };
        } else {
          await prisma.oTP.update({
            where: { id: otpRecord.id },
            data: { attempts: updatedAttempts },
          });
          const remaining = otpRecord.maxAttempts - updatedAttempts;
          return { success: false, error: `Invalid security code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` };
        }
      }

      // Valid OTP: delete it so it cannot be reused
      await prisma.oTP.delete({ where: { id: otpRecord.id } }).catch(() => {});
      authMethod = "EMAIL_OTP";
    }

    let recipientCode = user.agentProfile.recipientCode;
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    // Create Transfer Recipient on Paystack
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
            description: `Agent Escrow Recipient for ${user.email}`,
          }),
        });

        const recipData = await recipRes.json();
        if (recipRes.ok && recipData.status && recipData.data?.recipient_code) {
          recipientCode = recipData.data.recipient_code;
        } else {
          console.warn("Paystack transferrecipient creation note:", recipData.message);
        }
      } catch (paystackErr: any) {
        console.error("Paystack transfer recipient error:", paystackErr);
      }
    }

    if (!recipientCode) {
      recipientCode = `RCP_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }

    await prisma.agentProfile.update({
      where: { id: user.agentProfile.id },
      data: {
        bankCode,
        bankName,
        accountNumber,
        accountName,
        recipientCode,
      },
    });

    await logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorName: user.name || "Agent",
      actorRole: "AGENT",
      action: "AGENT_BANK_DETAILS_UPDATED",
      targetType: "SETTINGS",
      targetId: user.agentProfile.id,
      targetLabel: `${bankName} - ${accountNumber.substring(0, 3)}****${accountNumber.substring(7)}`,
      details: `Agent updated payout bank details to ${bankName} (${accountName}) via ${authMethod}.`,
      metadata: {
        bankName,
        bankCode,
        accountName,
        recipientCode,
        authMethod,
      },
    });

    // Dispatch security alert email to the agent notifying them of the bank change
    const maskedAcc = `${accountNumber.substring(0, 3)}****${accountNumber.substring(7)}`;
    const safeBankName = escapeHtml(bankName);
    const safeAccName = escapeHtml(accountName);
    const safeAgentName = escapeHtml(user.name || "Agent");

    await sendEmail({
      to: user.email,
      subject: "Security Alert: Payout Bank Account Updated - Campus Tent",
      html: `
        <div style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
          <div style="background-color: #02351c; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Campus Tent Security Alert</h1>
          </div>
          <div style="padding: 24px;">
            <p style="color: #1e293b; font-size: 15px; margin-top: 0;">Hi ${safeAgentName},</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
              Your Campus Tent agent payout bank account was just successfully updated using <strong>${authMethod}</strong> verification.
            </p>
            <div style="background-color: #f8fafc; border-left: 4px solid #059669; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;">Updated Account Details:</p>
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0f172a;">
                ${safeBankName} &bull; ${maskedAcc} (${safeAccName})
              </p>
            </div>
            <p style="color: #dc2626; font-size: 13px; line-height: 1.5;">
              <strong>Did you not authorize this change?</strong><br />
              If you did not perform this update, your credentials may be compromised. Please contact support immediately at <strong>support@campustent.com</strong> to secure your account and freeze payouts.
            </p>
          </div>
          <div style="background-color: #f8fafc; padding: 14px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8;">
            &copy; ${new Date().getFullYear()} Campus Tent. All rights reserved.
          </div>
        </div>
      `,
    }).catch((err) => console.error("Failed to send bank update alert email:", err));

    return {
      success: true,
      recipientCode,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save bank details." };
  }
}
