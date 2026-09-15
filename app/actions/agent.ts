"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { NIGERIAN_BANKS } from "@/lib/banks";
import { logAuditEvent } from "@/lib/audit";

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
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT" || !user.agentProfile) {
      return { success: false, error: "Unauthorized" };
    }

    const { bankCode, bankName, accountNumber, accountName } = data;
    if (!bankCode || !bankName || !accountNumber || !accountName) {
      return { success: false, error: "All bank fields are required." };
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
      details: `Agent updated payout bank details to ${bankName} (${accountName}).`,
      metadata: {
        bankName,
        bankCode,
        accountName,
        recipientCode,
      },
    });

    return {
      success: true,
      recipientCode,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save bank details." };
  }
}
