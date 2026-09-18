import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/email-sanitizer";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY || "";

    if (!paystackSecret || !signature) {
      console.warn("[PAYSTACK WEBHOOK] Missing secret key or signature header.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify HMAC-SHA512 signature
    const hash = crypto
      .createHmac("sha512", paystackSecret.trim())
      .update(rawBody)
      .digest("hex");

    const sigBuf = Buffer.from(signature, "hex");
    const hashBuf = Buffer.from(hash, "hex");

    if (sigBuf.length !== hashBuf.length || !crypto.timingSafeEqual(sigBuf, hashBuf)) {
      console.warn("[PAYSTACK WEBHOOK] Invalid HMAC signature detected.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event?.event;
    const data = event?.data;

    console.log(`[PAYSTACK WEBHOOK] Received verified event: ${eventType}`);

    if (eventType === "charge.success") {
      const reference = data?.reference;
      const metadata = data?.metadata || {};
      const amountKobo = data?.amount;
      const currency = data?.currency;

      // Security Check: Verify amount matches at least ₦7,500 (750,000 kobo) and currency is NGN
      if (typeof amountKobo !== "number" || amountKobo < 750000 || currency !== "NGN") {
        console.warn(`[PAYSTACK WEBHOOK] Ignored charge.success due to amount or currency mismatch: ${amountKobo} kobo, currency: ${currency}. Ref: ${reference}`);
        return NextResponse.json({ error: "Invalid payment amount or currency." }, { status: 400 });
      }

      if (reference) {
        // Find existing payment by reference
        const existing = await prisma.inspectionPayment.findUnique({
          where: { reference },
          include: {
            property: true,
            student: { include: { studentProfile: true } },
            agent: { include: { agentProfile: true } },
          },
        });

        if (existing) {
          if (existing.status !== "PAID") {
            await prisma.inspectionPayment.update({
              where: { id: existing.id },
              data: { status: "PAID" },
            });
          }
        } else if (metadata.propertyId && metadata.studentId && metadata.agentId) {
          // Create inspection payment record if it was initiated directly through Paystack checkout
          const newPayment = await prisma.inspectionPayment.create({
            data: {
              studentId: metadata.studentId,
              propertyId: metadata.propertyId,
              agentId: metadata.agentId,
              amount: 7500,
              currency: "NGN",
              status: "PAID",
              reference: reference,
            },
            include: {
              property: true,
              student: { include: { studentProfile: true } },
              agent: { include: { agentProfile: true } },
            },
          });

          // Send confirmation emails
          const studentEmail = newPayment.student.email;
          const agentEmail = newPayment.agent.email;
          const studentName = escapeHtml(newPayment.student.studentProfile?.fullName || "Student");
          const propertyTitle = escapeHtml(newPayment.property.title);

          if (studentEmail) {
            sendEmail({
              to: studentEmail,
              subject: `Inspection Fee Payment Confirmed: ${newPayment.property.title}`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                  <div style="background-color: #02351c; padding: 24px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
                    <p style="color: #cbd5e1; font-size: 14px; margin: 6px 0 0 0;">Inspection Fee Receipt & Confirmation</p>
                  </div>
                  <div style="padding: 24px;">
                    <h2 style="color: #02351c; font-size: 18px; margin-top: 0;">Inspection Fee Confirmed!</h2>
                    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                      Hi ${studentName}, your inspection fee of <strong>₦7,500</strong> for <strong>"${propertyTitle}"</strong> has been confirmed.
                    </p>
                    <div style="background-color: #ecfdf5; border-left: 4px solid #16a34a; padding: 16px; border-radius: 6px; margin: 20px 0;">
                      <p style="margin: 0 0 6px 0; font-size: 14px; color: #065f46;"><strong>Amount Paid:</strong> ₦7,500</p>
                      <p style="margin: 0; font-size: 14px; color: #065f46;"><strong>Reference:</strong> ${reference}</p>
                    </div>
                  </div>
                  <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #64748b;">
                    Campus Tent &bull; Safe Student Accommodation
                  </div>
                </div>
              `,
              isInspectionMessage: true,
            }).catch((err) => console.error("Webhook student confirmation email error:", err));
          }

          if (agentEmail) {
            sendEmail({
              to: agentEmail,
              subject: `Inspection Fee Received (₦7,500): ${newPayment.property.title}`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                  <div style="background-color: #02351c; padding: 24px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
                    <p style="color: #cbd5e1; font-size: 14px; margin: 6px 0 0 0;">New Inspection Fee Paid</p>
                  </div>
                  <div style="padding: 24px;">
                    <h2 style="color: #02351c; font-size: 18px; margin-top: 0;">Inspection Fee Received (₦7,500)</h2>
                    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                      <strong>${studentName}</strong> has paid the <strong>₦7,500 inspection fee</strong> for your property: <strong>"${propertyTitle}"</strong>.
                    </p>
                  </div>
                </div>
              `,
              isInspectionMessage: true,
            }).catch((err) => console.error("Webhook agent notification email error:", err));
          }
        }
      }
    } else if (eventType === "transfer.success") {
      const reference = data?.reference;
      const transferCode = data?.transfer_code;

      if (reference || transferCode) {
        await prisma.inspectionPayment.updateMany({
          where: {
            OR: [
              ...(reference ? [{ payoutReference: reference }] : []),
              ...(transferCode ? [{ payoutReference: transferCode }] : []),
            ],
          },
          data: {
            payoutStatus: "DISBURSED",
            payoutDisbursedAt: new Date(),
          },
        });
      }
    } else if (eventType === "transfer.failed" || eventType === "transfer.reversed") {
      const reference = data?.reference;
      const transferCode = data?.transfer_code;

      if (reference || transferCode) {
        await prisma.inspectionPayment.updateMany({
          where: {
            OR: [
              ...(reference ? [{ payoutReference: reference }] : []),
              ...(transferCode ? [{ payoutReference: transferCode }] : []),
            ],
          },
          data: {
            payoutStatus: "FAILED",
          },
        });
      }
    } else if (eventType === "refund.processed") {
      const transactionRef = data?.transaction_reference || data?.reference;

      if (transactionRef) {
        await prisma.inspectionPayment.updateMany({
          where: {
            reference: transactionRef,
          },
          data: {
            status: "REFUNDED",
            refundedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: any) {
    console.error("[PAYSTACK WEBHOOK ERROR]:", error);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
