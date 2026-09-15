"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/email-sanitizer";
import { triggerPusherEvent } from "@/lib/pusher";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * 1. Query Property Availability
 * Student asks if the property is available right now before paying inspection fee.
 * Sends 1-click email to agent.
 */
export async function queryPropertyAvailability(propertyId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Please log in to check property availability." };
    }

    if (user.role === "AGENT") {
      return {
        success: false,
        error: "Agents cannot check availability or book viewings. Please use a student account.",
      };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        agent: {
          include: {
            user: true,
          },
        },
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    const recipientUser = property.agent?.user || property.student?.user;
    const recipientId = recipientUser?.id;
    if (!recipientId) {
      return { success: false, error: "Listing host not found." };
    }

    if (recipientId === user.id) {
      return { success: false, error: "You are the owner of this listing." };
    }

    // Check if an existing query was submitted
    const existingQuery = await prisma.availabilityQuery.findFirst({
      where: {
        studentId: user.id,
        propertyId: propertyId,
      },
      orderBy: { createdAt: "desc" },
    });

    let query = existingQuery;

    // If query exists and is already AVAILABLE, return that immediately
    if (existingQuery && existingQuery.status === "AVAILABLE") {
      return { success: true, queryId: existingQuery.id, status: "AVAILABLE", isAvailable: true };
    }

    // If no query or previous was answered UNAVAILABLE, create a fresh query
    if (!existingQuery || existingQuery.status === "UNAVAILABLE") {
      query = await prisma.availabilityQuery.create({
        data: {
          studentId: user.id,
          propertyId: propertyId,
          agentId: recipientId,
          status: "PENDING",
        },
      });
    }

    const studentName = escapeHtml(user.studentProfile?.fullName || user.name || "Student");
    const propertyTitle = escapeHtml(property.title);
    const hostelType = escapeHtml(property.hostelType || "Self-Contain");
    const rentAmount = property.rentAmount || property.price || 0;
    const locationArea = escapeHtml(property.location || "N/A");
    const distanceToCampus = property.distance ? escapeHtml(property.distance) : "";
    const listingUrl = `${BASE_URL}/apartment-details?id=${property.id}`;
    const availableUrl = `${BASE_URL}/property-availability?token=${query!.token}&response=available`;
    const unavailableUrl = `${BASE_URL}/property-availability?token=${query!.token}&response=unavailable`;

    if (recipientUser.email) {
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #02351c 0%, #064e3b 100%); padding: 26px 20px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 800; letter-spacing: 0.5px;">Campus Tent</h1>
            <p style="color: #a7f3d0; font-size: 13.5px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Live Property Availability Check</p>
          </div>
          
          <div style="padding: 26px 22px;">
            <h2 style="color: #02351c; font-size: 19px; margin-top: 0; line-height: 1.4;">Is this property available right now?</h2>
            
            <p style="color: #334155; font-size: 14.5px; line-height: 1.6; margin: 0 0 16px 0;">
              <strong>${studentName}</strong> is ready to pay the <strong>₦7,500 inspection fee</strong> and book a physical tour for your listing below:
            </p>

            <!-- Detailed Property Specs Card -->
            <div style="background-color: #f8fafc; border: 1.5px solid #e2e8f0; border-left: 5px solid #02351c; border-radius: 10px; padding: 18px 20px; margin: 20px 0;">
              <div style="font-size: 16px; font-weight: 800; color: #02351c; margin-bottom: 10px;">
                ${propertyTitle}
              </div>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; color: #334155;">
                <tr>
                  <td style="padding: 5px 0; color: #64748b; width: 130px; font-weight: 600;">🏢 Hostel Type:</td>
                  <td style="padding: 5px 0; font-weight: 700; color: #0f172a;">${hostelType}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #64748b; font-weight: 600;">💰 Annual Rent:</td>
                  <td style="padding: 5px 0; font-weight: 800; color: #059669;">₦${rentAmount.toLocaleString()} / year</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #64748b; font-weight: 600;">📍 Specific Area:</td>
                  <td style="padding: 5px 0; font-weight: 600; color: #0f172a;">${locationArea} ${distanceToCampus ? `(${distanceToCampus})` : ""}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #64748b; font-weight: 600;">👤 Prospective Student:</td>
                  <td style="padding: 5px 0; font-weight: 700; color: #02351c;">${studentName}</td>
                </tr>
              </table>

              <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #cbd5e1; text-align: right;">
                <a href="${listingUrl}" style="color: #02351c; font-size: 13px; font-weight: 700; text-decoration: underline;">
                  View Property Listing on Campus Tent &rarr;
                </a>
              </div>
            </div>

            <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 16px 0;">
              Before paying the inspection fee, the student is checking to confirm that this accommodation is still vacant and ready for inspection. Please confirm below:
            </p>
            
            <!-- 1-Click Action Buttons -->
            <div style="display: flex; gap: 12px; margin: 24px 0; justify-content: center; flex-wrap: wrap;">
              <a href="${availableUrl}" style="background-color: #16a34a; color: #ffffff; padding: 14px 26px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block; margin-right: 8px;">
                ✓ Yes, Available
              </a>
              <a href="${unavailableUrl}" style="background-color: #dc2626; color: #ffffff; padding: 14px 26px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
                ✕ No, Unavailable / Occupied
              </a>
            </div>

            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin: 18px 0; text-align: center;">
              <p style="margin: 0; color: #166534; font-size: 13px; font-weight: 600;">
                💵 Your Payout: You will receive <strong>₦5,020</strong> automatically once this inspection tour is completed.
              </p>
            </div>

            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 15px;">
              Clicking directly updates the student's screen in real-time so they can proceed with their inspection payment.
            </p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9;">
            Campus Tent &bull; Connecting Students with Verified Accommodation
          </div>
        </div>
      `;

      sendEmail({
        to: recipientUser.email,
        subject: `Availability Check: "${property.title}" - Action Required`,
        html: emailHtml,
        isInspectionMessage: false,
      }).catch((err) => console.error("Agent availability check email failed:", err));
    }

    return {
      success: true,
      queryId: query!.id,
      status: "PENDING",
      message: "Availability check request sent to the agent. You will receive an instant update once they confirm.",
    };
  } catch (err: any) {
    console.error("queryPropertyAvailability error:", err);
    return { success: false, error: err.message || "Failed to submit availability query." };
  }
}

/**
 * 2. Respond to Property Availability (Called via 1-click email token)
 */
export async function respondPropertyAvailability(token: string, responseType: "available" | "unavailable") {
  try {
    if (!token) {
      return { success: false, error: "Missing verification token." };
    }

    const query = await prisma.availabilityQuery.findUnique({
      where: { token },
      include: {
        property: true,
        student: {
          include: {
            studentProfile: true,
          },
        },
        agent: {
          include: {
            agentProfile: true,
          },
        },
      },
    });

    if (!query) {
      return { success: false, error: "Invalid or expired confirmation link." };
    }

    const newStatus = responseType === "available" ? "AVAILABLE" : "UNAVAILABLE";

    await prisma.availabilityQuery.update({
      where: { id: query.id },
      data: {
        status: newStatus,
        respondedAt: new Date(),
      },
    });

    // Also sync property availability and statusChangedAt timestamp
    await prisma.property.update({
      where: { id: query.propertyId },
      data: {
        isAvailable: responseType === "available",
        statusChangedAt: new Date(),
      },
    });

    // Trigger Pusher broadcast for real-time update on the property page
    await triggerPusherEvent(`property-${query.propertyId}`, "availability-status", {
      status: newStatus,
      propertyId: query.propertyId,
      studentId: query.studentId,
    });

    // Notify the student by email
    if (query.student.email) {
      const studentName = escapeHtml(query.student.studentProfile?.fullName || "Student");
      const propertyTitle = escapeHtml(query.property.title);
      const isAvailable = newStatus === "AVAILABLE";

      const studentHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #02351c; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
            <p style="color: #cbd5e1; font-size: 14px; margin: 6px 0 0 0;">Property Availability Update</p>
          </div>
          <div style="padding: 24px;">
            <h2 style="color: #02351c; font-size: 18px; margin-top: 0;">
              ${isAvailable ? "Property is Available!" : "Property is Currently Unavailable"}
            </h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              Hi ${studentName}, the agent has confirmed the status for <strong>"${propertyTitle}"</strong>:
            </p>
            <div style="background-color: ${isAvailable ? "#ecfdf5" : "#fef2f2"}; border-left: 4px solid ${isAvailable ? "#16a34a" : "#dc2626"}; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; font-size: 15px; color: ${isAvailable ? "#065f46" : "#991b1b"}; font-weight: 600;">
                ${isAvailable ? "The agent confirmed this property is available right now." : "The agent reported this property is currently occupied or unavailable."}
              </p>
              ${
                isAvailable
                  ? `<p style="margin: 8px 0 0 0; font-size: 13.5px; color: #047857;">
                      You can now pay the ₦7,500 inspection fee to unlock direct messaging and schedule your physical inspection tour.
                    </p>`
                  : `<p style="margin: 8px 0 0 0; font-size: 13.5px; color: #b91c1c;">
                      Please explore other verified listings on Campus Tent.
                    </p>`
              }
            </div>

            ${
              isAvailable
                ? `
              <div style="text-align: center; margin: 25px 0;">
                <a href="${BASE_URL}/apartment-details?id=${query.propertyId}" style="background-color: #02351c; color: #ffffff; padding: 13px 26px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                  Proceed to Pay ₦7,500 Inspection Fee
                </a>
              </div>
            `
                : `
              <div style="text-align: center; margin: 25px 0;">
                <a href="${BASE_URL}/explore" style="background-color: #02351c; color: #ffffff; padding: 13px 26px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                  Explore Alternative Hostels
                </a>
              </div>
            `
            }
          </div>
          <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #64748b;">
            Campus Tent &bull; Safe Student Accommodation
          </div>
        </div>
      `;

      sendEmail({
        to: query.student.email,
        subject: `${isAvailable ? "Available: " : "Unavailable: "} ${query.property.title}`,
        html: studentHtml,
      }).catch((err) => console.error("Student availability update email failed:", err));
    }

    return {
      success: true,
      status: newStatus,
      propertyTitle: query.property.title,
      propertyId: query.propertyId,
    };
  } catch (err: any) {
    console.error("respondPropertyAvailability error:", err);
    return { success: false, error: err.message || "Failed to submit availability response." };
  }
}

/**
 * 3. Get Inspection & Availability Status for a Property
 */
export async function getInspectionStatus(propertyId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: true,
        isPaid: false,
        availabilityStatus: "NONE",
        isOwner: false,
      };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        agent: true,
        student: true,
      },
    });

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    const isOwner =
      property.agent?.userId === user.id ||
      property.student?.userId === user.id ||
      user.role === "ADMIN";

    if (isOwner) {
      return {
        success: true,
        isPaid: true,
        availabilityStatus: "AVAILABLE",
        isOwner: true,
      };
    }

    // Check inspection payment
    const payment = await prisma.inspectionPayment.findFirst({
      where: {
        studentId: user.id,
        propertyId: propertyId,
        status: "PAID",
      },
    });

    // Check latest availability query
    const latestQuery = await prisma.availabilityQuery.findFirst({
      where: {
        studentId: user.id,
        propertyId: propertyId,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      isPaid: !!payment,
      payment: payment
        ? {
            id: payment.id,
            amount: payment.amount,
            paidAt: payment.paidAt.toISOString(),
            reference: payment.reference,
          }
        : null,
      availabilityStatus: latestQuery?.status || "NONE",
      queryId: latestQuery?.id || null,
      isOwner: false,
    };
  } catch (err: any) {
    console.error("getInspectionStatus error:", err);
    return { success: false, error: err.message || "Failed to check status." };
  }
}

/**
 * 4. Initialize Paystack Inspection Payment Server-Side
 * Pre-registers the transaction with Paystack to prevent "Transaction reference not found" errors
 */
export async function initializePaystackInspection(propertyId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Please log in to initialize payment." };
    }

    if (user.role === "AGENT") {
      return {
        success: false,
        error: "Agents cannot pay inspection fees. Please use a student account.",
      };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        agent: { include: { user: true } },
        student: { include: { user: true } },
      },
    });

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    const recipientUser = property.agent?.user || property.student?.user;
    if (recipientUser?.id === user.id) {
      return { success: false, error: "You cannot pay an inspection fee on your own listing." };
    }

    // Require agent/host to confirm property availability first (unless Admin)
    if (user.role !== "ADMIN" && property.agentId) {
      const confirmedAvailability = await prisma.availabilityQuery.findFirst({
        where: {
          studentId: user.id,
          propertyId: propertyId,
          status: "AVAILABLE",
        },
      });

      if (!confirmedAvailability) {
        return {
          success: false,
          error: "Property availability must be confirmed by the agent before paying.",
        };
      }
    }

    const reference = `INSP-PSK-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now()}`;
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    if (
      paystackSecret &&
      !paystackSecret.includes("your-paystack-secret-key") &&
      paystackSecret.startsWith("sk_")
    ) {
      try {
        const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${paystackSecret.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email || "student@campustent.com",
            amount: 750000, // ₦7,500 in kobo
            reference: reference,
            callback_url: `${BASE_URL}/apartment-details?id=${propertyId}&paystack_callback=1`,
            metadata: {
              propertyId,
              studentId: user.id,
              propertyTitle: property.title,
              custom_fields: [
                {
                  display_name: "Inspection Property",
                  variable_name: "property_title",
                  value: property.title,
                },
                {
                  display_name: "Student Name",
                  variable_name: "student_name",
                  value: user.studentProfile?.fullName || user.name || "Student",
                },
              ],
            },
          }),
        });

        const initData = await initRes.json();
        if (initRes.ok && initData.status && initData.data) {
          return {
            success: true,
            reference: reference,
            accessCode: initData.data.access_code,
            authorizationUrl: initData.data.authorization_url,
          };
        } else {
          console.warn("[Paystack Init] API responded with non-ok status:", initData);
          // Return fallback reference so client can proceed
          return {
            success: true,
            reference: reference,
            fallback: true,
            message: initData.message || "Paystack account pending activation.",
          };
        }
      } catch (paystackInitErr: any) {
        console.error("[Paystack Init] Network exception:", paystackInitErr);
        return {
          success: true,
          reference: reference,
          fallback: true,
          message: "Network issue contacting Paystack.",
        };
      }
    }

    return {
      success: true,
      reference: reference,
      fallback: true,
    };
  } catch (err: any) {
    console.error("initializePaystackInspection error:", err);
    return { success: false, error: err.message || "Failed to initialize payment." };
  }
}

/**
 * 5. Submit Direct Bank Transfer Inspection Payment (Alternative to Paystack)
 */
export async function submitBankTransferInspectionPayment(data: {
  propertyId: string;
  senderName: string;
  bankName: string;
  reference?: string;
  receiptUrl?: string;
  notes?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Please log in to submit payment." };
    }

    if (user.role === "AGENT") {
      return {
        success: false,
        error: "Agents cannot pay inspection fees. Please use a student account.",
      };
    }

    const { propertyId, senderName, bankName, receiptUrl, notes } = data;
    if (!propertyId || !senderName || !bankName) {
      return { success: false, error: "Please provide sender name and bank name." };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        agent: { include: { user: true } },
        student: { include: { user: true } },
      },
    });

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    const recipientUser = property.agent?.user || property.student?.user;
    const recipientId = recipientUser?.id;
    if (!recipientId) {
      return { success: false, error: "Listing host not found." };
    }

    if (recipientId === user.id) {
      return { success: false, error: "You cannot pay an inspection fee on your own listing." };
    }

    // Check if already paid
    const existingPayment = await prisma.inspectionPayment.findFirst({
      where: {
        studentId: user.id,
        propertyId: propertyId,
        status: "PAID",
      },
    });

    if (existingPayment) {
      return {
        success: true,
        alreadyPaid: true,
        payment: existingPayment,
      };
    }

    // Require confirmed availability
    if (user.role !== "ADMIN" && property.agentId) {
      const confirmedAvailability = await prisma.availabilityQuery.findFirst({
        where: {
          studentId: user.id,
          propertyId: propertyId,
          status: "AVAILABLE",
        },
      });

      if (!confirmedAvailability) {
        return {
          success: false,
          error: "Property availability must be confirmed by the agent before payment.",
        };
      }
    }

    const paymentRef = data.reference?.trim() || `BT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now()}`;

    const payment = await prisma.inspectionPayment.create({
      data: {
        studentId: user.id,
        propertyId: property.id,
        agentId: recipientId,
        amount: 7500,
        currency: "NGN",
        status: "PAID",
        reference: paymentRef,
      },
    });

    // Record audit log for Admin review
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        userName: senderName.trim(),
        userEmail: user.email || "",
        action: "BANK_TRANSFER_INSPECTION_PAYMENT",
        description: `Direct Bank Transfer Inspection Payment (₦7,500). Sender: ${senderName.trim()} (${bankName.trim()}). Ref: ${paymentRef}${receiptUrl ? ` Receipt: ${receiptUrl}` : ""}${notes ? ` Notes: ${notes}` : ""}`,
        propertyTitle: property.title,
      },
    }).catch((e) => console.warn("Failed to create activity log for bank transfer:", e));

    const studentDisplayName = escapeHtml(user.studentProfile?.fullName || user.name || senderName || "Student");
    const propertyTitle = escapeHtml(property.title);
    const agentDisplayName = escapeHtml(property.agent?.fullName || property.student?.fullName || "Agent");

    // Send confirmation email to student
    if (user.email) {
      const studentHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #02351c; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
            <p style="color: #cbd5e1; font-size: 14px; margin: 6px 0 0 0;">Bank Transfer Inspection Confirmation</p>
          </div>
          <div style="padding: 24px;">
            <h2 style="color: #02351c; font-size: 18px; margin-top: 0;">Inspection Payment Confirmed!</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              Hi ${studentDisplayName}, your direct bank transfer payment of <strong>₦7,500</strong> for <strong>"${propertyTitle}"</strong> has been confirmed.
            </p>
            <div style="background-color: #ecfdf5; border-left: 4px solid #16a34a; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #065f46;"><strong>Amount:</strong> ₦7,500</p>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #065f46;"><strong>Method:</strong> Direct Bank Transfer (${escapeHtml(bankName)})</p>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #065f46;"><strong>Reference:</strong> ${paymentRef}</p>
              <p style="margin: 0; font-size: 14px; color: #065f46;"><strong>Agent:</strong> ${agentDisplayName}</p>
            </div>
            <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13.5px; color: #334155; font-weight: 600;">Bonus Value Covered:</p>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                "Your ₦7,500 fee covers a physical inspection of this property, plus any alternative options the agent has available in the same area/budget."
              </p>
            </div>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${BASE_URL}/apartment-details?id=${property.id}" style="background-color: #02351c; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                Book Physical Tour & Contact Agent
              </a>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #64748b;">
            Campus Tent &bull; Safe Student Accommodation
          </div>
        </div>
      `;

      sendEmail({
        to: user.email,
        subject: `Inspection Payment Confirmed (Bank Transfer): ${property.title}`,
        html: studentHtml,
        isInspectionMessage: true,
      }).catch((err) => console.error("Student bank transfer email failed:", err));
    }

    // Send notification email to Agent
    if (recipientUser.email) {
      const agentHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #02351c; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
            <p style="color: #cbd5e1; font-size: 14px; margin: 6px 0 0 0;">New Inspection Fee Paid</p>
          </div>
          <div style="padding: 24px;">
            <h2 style="color: #02351c; font-size: 18px; margin-top: 0;">Inspection Fee Received (₦7,500)</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              <strong>${studentDisplayName}</strong> has paid the <strong>₦7,500 inspection fee</strong> for your property: <strong>"${propertyTitle}"</strong>.
            </p>
            <div style="background-color: #f8fafc; border-left: 4px solid #02351c; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;"><strong>Student:</strong> ${studentDisplayName}</p>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;"><strong>Phone:</strong> ${escapeHtml(user.phone || "Not provided")}</p>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;"><strong>Payment Method:</strong> Bank Transfer</p>
              <p style="margin: 0; font-size: 14px; color: #1e293b;"><strong>Reference:</strong> ${paymentRef}</p>
            </div>
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin: 18px 0; text-align: center;">
              <p style="margin: 0; color: #166534; font-size: 13.5px; font-weight: 600;">
                💵 Your Payout: You will receive <strong>₦5,020</strong> automatically once this inspection tour is completed.
              </p>
            </div>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${BASE_URL}/agent-dashboard" style="background-color: #02351c; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                View in Agent Dashboard
              </a>
            </div>
          </div>
        </div>
      `;

      sendEmail({
        to: recipientUser.email,
        subject: `Inspection Fee Paid (₦7,500): ${property.title}`,
        html: agentHtml,
        isInspectionMessage: true,
      }).catch((err) => console.error("Agent bank transfer alert email failed:", err));
    }

    return {
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        paidAt: payment.paidAt.toISOString(),
        reference: payment.reference,
      },
    };
  } catch (err: any) {
    console.error("submitBankTransferInspectionPayment error:", err);
    return { success: false, error: err.message || "Failed to process bank transfer payment." };
  }
}

/**
 * 6. Process Inspection Payment (₦7,500)
 */
export async function processInspectionPayment(propertyId: string, reference?: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Please log in to make an inspection payment." };
    }

    if (user.role === "AGENT") {
      return {
        success: false,
        error: "Agents cannot pay inspection fees or book viewings. Please use a student account.",
      };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        agent: {
          include: { user: true },
        },
        student: {
          include: { user: true },
        },
      },
    });

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    const recipientUser = property.agent?.user || property.student?.user;
    const recipientId = recipientUser?.id;
    if (!recipientId) {
      return { success: false, error: "Listing host not found." };
    }

    if (recipientId === user.id) {
      return { success: false, error: "You cannot pay an inspection fee on your own listing." };
    }

    // Check if already paid
    const existingPayment = await prisma.inspectionPayment.findFirst({
      where: {
        studentId: user.id,
        propertyId: propertyId,
        status: "PAID",
      },
    });

    if (existingPayment) {
      return {
        success: true,
        alreadyPaid: true,
        payment: existingPayment,
      };
    }

    // Require agent/host to confirm property availability first
    if (user.role !== "ADMIN") {
      const confirmedAvailability = await prisma.availabilityQuery.findFirst({
        where: {
          studentId: user.id,
          propertyId: propertyId,
          status: "AVAILABLE",
        },
      });

      if (!confirmedAvailability && property.agentId) {
        return {
          success: false,
          error: "Property availability must be checked and confirmed by the agent before payment can be processed.",
        };
      }
    }

    // Server-side Paystack verification if reference provided
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (reference && paystackSecret && !paystackSecret.includes("your-paystack-secret-key") && paystackSecret.startsWith("sk_")) {
      try {
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference.trim())}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${paystackSecret.trim()}`,
            "Content-Type": "application/json",
          },
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.status || verifyData.data?.status !== "success") {
          return {
            success: false,
            error: verifyData.message || "Payment verification failed with Paystack.",
          };
        }

        // Verify amount matches ₦7,500 (750,000 kobo)
        const amountPaidKobo = verifyData.data?.amount;
        if (amountPaidKobo < 750000) {
          return {
            success: false,
            error: "Payment amount does not match the ₦7,500 inspection fee.",
          };
        }
      } catch (verifyErr: any) {
        console.error("Paystack verification exception:", verifyErr);
        return {
          success: false,
          error: "Network error during Paystack payment verification.",
        };
      }
    }

    const paymentRef = reference || `INSP-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now()}`;

    const payment = await prisma.inspectionPayment.create({
      data: {
        studentId: user.id,
        propertyId: property.id,
        agentId: recipientId,
        amount: 7500,
        currency: "NGN",
        status: "PAID",
        reference: paymentRef,
      },
    });

    const studentName = escapeHtml(user.studentProfile?.fullName || "Student");
    const propertyTitle = escapeHtml(property.title);
    const agentName = escapeHtml(property.agent?.fullName || property.student?.fullName || "Agent");

    // Send confirmation email to student
    if (user.email) {
      const studentHtml = `
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
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #065f46;"><strong>Reference:</strong> ${paymentRef}</p>
              <p style="margin: 0; font-size: 14px; color: #065f46;"><strong>Agent:</strong> ${agentName}</p>
            </div>
            <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13.5px; color: #334155; font-weight: 600;">
                Bonus Value Covered:
              </p>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                "Your ₦7,500 fee covers a physical inspection of this property, plus any alternative options the agent has available in the same area/budget."
              </p>
            </div>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${BASE_URL}/apartment-details?id=${property.id}" style="background-color: #02351c; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                Go to Property & Book Appointment
              </a>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #64748b;">
            Campus Tent &bull; Safe Student Accommodation
          </div>
        </div>
      `;

      sendEmail({
        to: user.email,
        subject: `Inspection Fee Payment Confirmed: ${property.title}`,
        html: studentHtml,
        isInspectionMessage: true,
      }).catch((err) => console.error("Student payment confirmation email failed:", err));
    }

    // Send notification email to Agent
    if (recipientUser.email) {
      const agentHtml = `
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
            <div style="background-color: #f8fafc; border-left: 4px solid #02351c; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;"><strong>Student:</strong> ${studentName}</p>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;"><strong>Phone:</strong> ${escapeHtml(user.phone || "Not provided")}</p>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;"><strong>Reference:</strong> ${paymentRef}</p>
            </div>
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin: 18px 0; text-align: center;">
              <p style="margin: 0; color: #166534; font-size: 13.5px; font-weight: 600;">
                💵 Your Payout: You will receive <strong>₦5,020</strong> automatically once this inspection tour is completed.
              </p>
            </div>
            <p style="color: #4b5563; font-size: 13.5px; line-height: 1.5;">
              The student can now message you directly and book an inspection appointment. Remember to showcase alternative units in the same area/budget during the tour if available.
            </p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${BASE_URL}/agent-dashboard" style="background-color: #02351c; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                View in Agent Dashboard
              </a>
            </div>
          </div>
        </div>
      `;

      sendEmail({
        to: recipientUser.email,
        subject: `Inspection Fee Paid (₦7,500): ${property.title}`,
        html: agentHtml,
        isInspectionMessage: true,
      }).catch((err) => console.error("Agent payment alert email failed:", err));
    }

    return {
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        paidAt: payment.paidAt.toISOString(),
        reference: payment.reference,
      },
    };
  } catch (err: any) {
    console.error("processInspectionPayment error:", err);
    return { success: false, error: err.message || "Failed to process inspection fee." };
  }
}

/**
 * Internal helper to automatically disburse the agent's payout (₦5,020)
 * when both student and agent have confirmed the physical inspection tour.
 */
async function checkAndTriggerAutomatedPayout(params: {
  propertyId: string;
  studentId: string;
}) {
  try {
    const { propertyId, studentId } = params;

    // Check if there is a viewing for this student & property that is confirmed by both sides
    const completedViewing = await prisma.viewing.findFirst({
      where: {
        propertyId,
        studentId,
        studentConfirmedTour: true,
        agentInspectionStatus: "INSPECTED",
      },
    });

    if (!completedViewing) {
      return { disbursed: false, reason: "Tour not yet mutually confirmed." };
    }

    // Find the eligible paid payment in PENDING escrow status
    const payment = await prisma.inspectionPayment.findFirst({
      where: {
        propertyId,
        studentId,
        status: "PAID",
        payoutStatus: "PENDING",
      },
      include: {
        agent: {
          include: {
            agentProfile: true,
          },
        },
        property: true,
        student: {
          include: {
            studentProfile: true,
          },
        },
      },
    });

    if (!payment) {
      return { disbursed: false, reason: "No pending payment found to disburse." };
    }

    const agentProfile = payment.agent.agentProfile;
    if (!agentProfile?.recipientCode && !agentProfile?.accountNumber) {
      console.warn(`[Auto-Payout] Agent ${payment.agentId} has not configured bank details yet. Skipping auto-disburse.`);
      return { disbursed: false, reason: "Agent bank details not configured." };
    }

    let payoutRef = `TRF-AUTO-${Date.now()}`;
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    if (
      agentProfile.recipientCode &&
      paystackSecret &&
      !paystackSecret.includes("your-paystack-secret-key") &&
      paystackSecret.startsWith("sk_")
    ) {
      try {
        const transferRes = await fetch("https://api.paystack.co/transfer", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${paystackSecret.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: "balance",
            amount: 502000, // ₦5,020 in kobo
            recipient: agentProfile.recipientCode,
            reason: `Campus Tent Auto-Payout for ${payment.property.title}`,
          }),
        });

        const transferData = await transferRes.json();
        if (transferRes.ok && transferData.status) {
          payoutRef = transferData.data?.reference || transferData.data?.transfer_code || payoutRef;
        } else {
          console.warn("[Auto-Payout] Paystack transfer response not ok:", transferData);
        }
      } catch (paystackErr) {
        console.error("[Auto-Payout] Network error calling Paystack transfer:", paystackErr);
      }
    }

    await prisma.inspectionPayment.update({
      where: { id: payment.id },
      data: {
        payoutStatus: "DISBURSED",
        payoutReference: payoutRef,
        payoutDisbursedAt: new Date(),
      },
    });

    // Notify agent via email
    if (payment.agent.email) {
      const agentName = escapeHtml(agentProfile?.fullName || (payment.agent as any).name || "Agent");
      const propTitle = escapeHtml(payment.property.title);
      const studentName = escapeHtml((payment.student as any).studentProfile?.fullName || (payment.student as any).name || "Student");

      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #02351c; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
            <p style="color: #cbd5e1; font-size: 14px; margin: 6px 0 0 0;">Automated Payout Disbursed</p>
          </div>
          <div style="padding: 24px;">
            <h2 style="color: #02351c; font-size: 18px; margin-top: 0;">Inspection Fee Payout Sent!</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              Hi ${agentName}, both you and the student (<strong>${studentName}</strong>) have confirmed the inspection tour for:
            </p>
            <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px; color: #166534; font-weight: 700;">Payout Amount: ₦5,020</p>
              <p style="margin: 6px 0 0 0; font-size: 13.5px; color: #334155;">Property: ${propTitle}</p>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Transfer Ref: ${payoutRef}</p>
            </div>
            <p style="color: #4b5563; font-size: 13.5px; line-height: 1.5;">
              The funds have been sent directly to your registered bank account (${escapeHtml(agentProfile?.bankName || "Bank")} - ${escapeHtml(agentProfile?.accountNumber || "")}).
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #64748b;">
            Campus Tent &bull; Safe Student Accommodation
          </div>
        </div>
      `;

      sendEmail({
        to: payment.agent.email,
        subject: `₦5,020 Inspection Payout Disbursed: ${payment.property.title}`,
        html: emailHtml,
        isInspectionMessage: true,
      }).catch((e) => console.error("Agent auto-payout email error:", e));
    }

    return { disbursed: true, reference: payoutRef };
  } catch (err: any) {
    console.error("checkAndTriggerAutomatedPayout error:", err);
    return { disbursed: false, error: err.message };
  }
}

/**
 * 5. Update Agent Inspection Lead Status
 * Post-inspection update by Agent:
 * - "Client successfully inspected the properties"
 * - "Client rescheduled"
 */
export async function updateAgentInspectionStatus(data: {
  viewingId: string;
  status: "INSPECTED" | "RESCHEDULED";
  notes?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT" || !user.agentProfile) {
      return { success: false, error: "Unauthorized. Agent access only." };
    }

    const { viewingId, status, notes } = data;

    const viewing = await prisma.viewing.findUnique({
      where: { id: viewingId },
      include: {
        property: true,
        student: {
          include: { studentProfile: true },
        },
      },
    });

    if (!viewing) {
      return { success: false, error: "Viewing appointment not found." };
    }

    if (viewing.property.agentId !== user.agentProfile.id) {
      return { success: false, error: "Unauthorized access to this viewing." };
    }

    const updatedViewing = await prisma.viewing.update({
      where: { id: viewingId },
      data: {
        agentInspectionStatus: status,
        agentInspectionNotes: notes || null,
        status: status === "INSPECTED" ? "CONFIRMED" : "PENDING",
      },
    });

    // If marked as INSPECTED, check if automated payout can be triggered immediately
    if (status === "INSPECTED") {
      await checkAndTriggerAutomatedPayout({
        propertyId: viewing.propertyId,
        studentId: viewing.studentId,
      });
    }

    return {
      success: true,
      viewing: {
        id: updatedViewing.id,
        agentInspectionStatus: updatedViewing.agentInspectionStatus,
        agentInspectionNotes: updatedViewing.agentInspectionNotes,
        status: updatedViewing.status,
      },
    };
  } catch (err: any) {
    console.error("updateAgentInspectionStatus error:", err);
    return { success: false, error: err.message || "Failed to update inspection status." };
  }
}

/**
 * 6. Confirm Student Inspection Tour
 * Student button: "Confirm the agent met me and conducted the inspection tour."
 */
export async function confirmStudentInspectionTour(viewingId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized." };
    }

    const viewing = await prisma.viewing.findUnique({
      where: { id: viewingId },
    });

    if (!viewing) {
      return { success: false, error: "Viewing appointment not found." };
    }

    if (viewing.studentId !== user.id) {
      return { success: false, error: "Unauthorized access to this viewing." };
    }

    const updated = await prisma.viewing.update({
      where: { id: viewingId },
      data: {
        studentConfirmedTour: true,
        studentConfirmedAt: new Date(),
      },
    });

    // Check if automated payout can be triggered immediately upon student confirmation
    await checkAndTriggerAutomatedPayout({
      propertyId: viewing.propertyId,
      studentId: viewing.studentId,
    });

    return {
      success: true,
      studentConfirmedTour: updated.studentConfirmedTour,
      studentConfirmedAt: updated.studentConfirmedAt?.toISOString(),
    };
  } catch (err: any) {
    console.error("confirmStudentInspectionTour error:", err);
    return { success: false, error: err.message || "Failed to confirm inspection tour." };
  }
}

/**
 * 7. Get Agent Viewings and Leads with Inspection Information
 */
export async function getAgentViewingsAndLeads() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT" || !user.agentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const viewings = await prisma.viewing.findMany({
      where: {
        property: { agentId: user.agentProfile.id },
      },
      include: {
        student: {
          include: { studentProfile: true },
        },
        property: true,
      },
      orderBy: { dateTime: "desc" },
    });

    const inspectionPayments = await prisma.inspectionPayment.findMany({
      where: {
        agentId: user.id,
      },
      include: {
        student: {
          include: { studentProfile: true },
        },
        property: true,
      },
      orderBy: { paidAt: "desc" },
    });

    return {
      success: true,
      viewings: viewings.map((v) => ({
        id: v.id,
        propertyId: v.property.id,
        propertyTitle: v.property.title,
        studentName: v.student.studentProfile?.fullName || "Student",
        studentPhone: v.student.phone || "Not provided",
        studentEmail: v.student.email,
        dateTime: v.dateTime.toISOString(),
        status: v.status,
        agentInspectionStatus: v.agentInspectionStatus,
        agentInspectionNotes: v.agentInspectionNotes,
        studentConfirmedTour: v.studentConfirmedTour,
        studentConfirmedAt: v.studentConfirmedAt?.toISOString() || null,
      })),
      inspectionPayments: inspectionPayments.map((p) => ({
        id: p.id,
        propertyId: p.property.id,
        propertyTitle: p.property.title,
        studentName: p.student.studentProfile?.fullName || "Student",
        studentPhone: p.student.phone || "Not provided",
        amount: p.amount,
        reference: p.reference,
        status: p.status,
        payoutStatus: p.payoutStatus,
        payoutReference: p.payoutReference,
        payoutDisbursedAt: p.payoutDisbursedAt?.toISOString() || null,
        disputeReason: p.disputeReason,
        paidAt: p.paidAt.toISOString(),
      })),
    };
  } catch (err: any) {
    console.error("getAgentViewingsAndLeads error:", err);
    return { success: false, error: err.message || "Failed to fetch leads." };
  }
}

export async function reportInspectionIssue(data: {
  paymentId: string;
  reason: string;
  description?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT") {
      return { success: false, error: "Unauthorized. Student login required." };
    }

    const { paymentId, reason, description } = data;
    if (!paymentId || !reason) {
      return { success: false, error: "Payment ID and reason are required." };
    }

    const payment = await prisma.inspectionPayment.findUnique({
      where: { id: paymentId },
      include: {
        property: true,
        agent: { include: { agentProfile: true } },
      },
    });

    if (!payment) {
      return { success: false, error: "Inspection payment record not found." };
    }

    if (payment.studentId !== user.id) {
      return { success: false, error: "You can only dispute payments made by your account." };
    }

    const fullDisputeReason = `${reason.trim()}${description ? `: ${description.trim()}` : ""}`;

    await prisma.inspectionPayment.update({
      where: { id: payment.id },
      data: {
        status: "DISPUTED",
        disputeReason: fullDisputeReason,
        disputedAt: new Date(),
      },
    });

    // Create Report record for Admin visibility
    await prisma.report.create({
      data: {
        reporterId: user.id,
        propertyId: payment.propertyId,
        reason: "OTHER",
        customReason: "INSPECTION_DISPUTE",
        description: `[INSPECTION DISPUTE] Ref: ${payment.reference} - Agent ID: ${payment.agentId} - Reason: ${fullDisputeReason}`,
        status: "PENDING",
      },
    }).catch((e) => console.warn("Failed to create dispute report record:", e));

    return { success: true };
  } catch (err: any) {
    console.error("reportInspectionIssue error:", err);
    return { success: false, error: err.message || "Failed to submit dispute." };
  }
}

