"use server";

import { sendEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { escapeHtml } from "@/lib/email-sanitizer";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";

export async function submitSupportTicket(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const rateCheck = await checkRateLimit("support-ticket", 3, 5);
    if (!rateCheck.success) {
      return { success: false, error: rateCheck.error };
    }

    const { name, email, subject, message } = data;
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return { success: false, error: "Please fill out all required fields." };
    }

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeSubject = escapeHtml(subject.trim());
    const safeMessage = escapeHtml(message.trim());

    const user = await getCurrentUser();

    // 1. Log activity in database
    await prisma.activityLog.create({
      data: {
        userId: user?.id || null,
        userName: safeName,
        userEmail: safeEmail,
        action: "SUPPORT_TICKET_SUBMITTED",
        description: `Support Ticket [${safeSubject}]: ${safeMessage.substring(0, 150)}...`,
      },
    }).catch((e) => console.warn("ActivityLog create warning:", e));

    // 2. Deliver email notification to platform support
    const supportHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #02351c; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
          <p style="color: #cbd5e1; font-size: 14px; margin: 6px 0 0 0;">New Support Ticket Received</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #02351c; font-size: 18px; margin-top: 0;">${safeSubject}</h2>
          <p style="color: #64748b; font-size: 14px;"><strong>From:</strong> ${safeName} (${safeEmail})</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #02351c; padding: 16px; border-radius: 6px; margin: 20px 0; color: #334155; font-size: 14.5px; line-height: 1.6; white-space: pre-wrap;">
            ${safeMessage}
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #64748b;">
          Campus Tent Support Desk &bull; Help & Inquiries
        </div>
      </div>
    `;

    await sendEmail({
      to: "support@campustent.com",
      subject: `Support Ticket: ${safeSubject} (from ${safeName})`,
      html: supportHtml,
      replyTo: safeEmail,
    });

    // 3. Send acknowledgement receipt to the student/user
    const ackHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #02351c; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
          <p style="color: #cbd5e1; font-size: 14px; margin: 6px 0 0 0;">We Have Received Your Request</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #02351c; font-size: 18px; margin-top: 0;">Hi ${safeName},</h2>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
            Thank you for reaching out to Campus Tent Support. We have received your inquiry regarding <strong>"${safeSubject}"</strong>.
          </p>
          <div style="background-color: #ecfdf5; border-left: 4px solid #16a34a; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #065f46;">
              Our support desk typically reviews student & agent inquiries within <strong>2 to 12 hours</strong>. An administrator will reply directly to your email address.
            </p>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #64748b;">
          Campus Tent &bull; Safe Student Accommodation
        </div>
      </div>
    `;

    await sendEmail({
      to: safeEmail,
      subject: `Ticket Received: "${safeSubject}" - Campus Tent Support`,
      html: ackHtml,
    });

    return {
      success: true,
      message: "Ticket submitted successfully! We have emailed you a confirmation receipt and our team will respond shortly.",
    };
  } catch (err: any) {
    console.error("submitSupportTicket error:", err);
    return {
      success: false,
      error: err.message || "Failed to submit ticket. Please email support@campustent.com directly.",
    };
  }
}
