"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { uploadToR2 } from "@/lib/r2";
import { validateFileBuffer, generateSecureFilename } from "@/lib/upload-validator";
import { sendEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { escapeHtml } from "@/lib/email-sanitizer";
import { triggerPusherEvent } from "@/lib/pusher";

function getFriendlyErrorMessage(err: any, defaultMsg: string): string {
  console.error("Student server action error:", err);
  return err.message || defaultMsg;
}

export async function getStudentDashboardData() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    // 1. Fetch real-time chat rooms initiated by this student
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        property: {
          include: {
            agent: true,
            student: true,
          },
        },
        agent: {
          include: {
            agentProfile: true,
            studentProfile: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const chatInquiries = chatRooms.map(room => {
      const lastMsg = room.messages?.[0]?.text || "Conversation started.";
      const lastMsgAt = room.messages?.[0]?.createdAt || room.createdAt;
      
      let agentName = "Campus Tent User";
      let agentVerified = false;

      if (room.agent.studentProfile) {
        agentName = room.agent.studentProfile.username 
          ? `@${room.agent.studentProfile.username}` 
          : "Student";
        agentVerified = false;
      } else {
        agentName = room.agent.agentProfile?.fullName || "Agent";
        agentVerified = room.agent.agentProfile?.isVerified || false;
      }

      return {
        id: room.id,
        message: lastMsg,
        createdAt: lastMsgAt,
        propertyTitle: room.property.title,
        propertyId: room.property.id,
        agentName: agentName,
        agentVerified: agentVerified,
      };
    });

    // 2. Fetch database inquiries (simulated via WhatsApp clicks or viewing requests)
    const dbInquiries = await prisma.inquiry.findMany({
      where: { studentId: user.id },
      include: {
        property: {
          include: {
            agent: true,
            student: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedDbInquiries = dbInquiries.map(inq => {
      let agentName = "Campus Tent Official";
      let agentVerified = true; // Default system verification is true

      if (inq.property.agent) {
        agentName = inq.property.agent.fullName;
        agentVerified = inq.property.agent.isVerified;
      } else if (inq.property.student) {
        agentName = inq.property.student.username 
          ? `@${inq.property.student.username}` 
          : "Student";
        agentVerified = false;
      }

      return {
        id: inq.id,
        message: inq.message,
        createdAt: inq.createdAt,
        propertyTitle: inq.property.title,
        propertyId: inq.property.id,
        agentName: agentName,
        agentVerified: agentVerified,
      };
    });

    // 3. Merge, sort by latest activity, and deduplicate by propertyId
    const allInquiries = [...chatInquiries, ...mappedDbInquiries];
    allInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const seenProperties = new Set();
    const uniqueInquiries = allInquiries.filter(inq => {
      if (seenProperties.has(inq.propertyId)) {
        return false;
      }
      seenProperties.add(inq.propertyId);
      return true;
    });

    // 4. Fetch scheduled viewings
    const viewings = await prisma.viewing.findMany({
      where: { studentId: user.id },
      include: {
        property: {
          include: {
            agent: true,
            student: true,
          },
        },
      },
      orderBy: { dateTime: "desc" },
    });

    return {
      success: true,
      profile,
      inquiries: uniqueInquiries,
      viewings: viewings.map(v => {
        let agentName = "Campus Tent Official";
        let agentVerified = true;

        if (v.property.agent) {
          agentName = v.property.agent.fullName;
          agentVerified = v.property.agent.isVerified;
        } else if (v.property.student) {
          agentName = v.property.student.username 
            ? `@${v.property.student.username}` 
            : "Student";
          agentVerified = true;
        }

        return {
          id: v.id,
          dateTime: v.dateTime,
          status: v.status,
          propertyTitle: v.property.title,
          propertyId: v.property.id,
          agentName: agentName,
          agentVerified: agentVerified,
          agentInspectionStatus: v.agentInspectionStatus,
          agentInspectionNotes: v.agentInspectionNotes,
          studentConfirmedTour: v.studentConfirmedTour,
          studentConfirmedAt: v.studentConfirmedAt,
        };
      }),
    };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to load dashboard data.") };
  }
}

export async function updateStudentProfile(data: {
  firstName: string;
  lastName: string;
  phone: string;
  university: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const { firstName, lastName, phone, university } = data;
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    if (!fullName) {
      return { success: false, error: "Name cannot be empty." };
    }
    if (!phone) {
      return { success: false, error: "Phone number is required." };
    }
    if (!university) {
      return { success: false, error: "University is required." };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { phone },
      }),
      prisma.studentProfile.update({
        where: { id: user.studentProfile.id },
        data: {
          fullName,
          university,
        },
      }),
    ]);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to update profile details.") };
  }
}

export async function uploadStudentVerification(_formData: FormData) {
  return { success: true };
}

export async function saveStudentPreferences(preferences: {
  openToRoommates: boolean;
  budgetLimit: number;
  gender?: string;
  cleanliness?: string;
  sleepSchedule?: string;
  noiseLevel?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    await prisma.studentProfile.update({
      where: { id: user.studentProfile.id },
      data: {
        preferences: preferences as any,
      },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to save preferences.") };
  }
}

export async function scheduleViewing(data: {
  propertyId: string;
  dateTime: string;
  note?: string;
}) {
  try {
    const rateCheck = await checkRateLimit("schedule-viewing", 5, 10);
    if (!rateCheck.success) {
      return { success: false, error: rateCheck.error };
    }

    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Please log in to schedule a viewing appointment." };
    }

    if (user.role === "AGENT") {
      return {
        success: false,
        error: "Agents cannot book or schedule inspections on listings. Only student accounts can book inspections.",
      };
    }

    const { propertyId, dateTime, note } = data;
    const appointmentDate = new Date(dateTime);

    if (isNaN(appointmentDate.getTime())) {
      return { success: false, error: "Please select a valid date and time." };
    }

    if (appointmentDate.getTime() < Date.now()) {
      return { success: false, error: "Please select an upcoming future date and time." };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        agent: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
                role: true,
              },
            },
          },
        },
        student: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
                role: true,
              },
            },
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
      return { success: false, error: "You cannot schedule an inspection on your own property." };
    }

    // Check inspection payment if this is an agent listing
    if (property.agentId && user.role === "STUDENT") {
      const payment = await prisma.inspectionPayment.findFirst({
        where: {
          studentId: user.id,
          propertyId: propertyId,
          status: "PAID",
        },
      });

      if (!payment) {
        return {
          success: false,
          error: "Inspection fee required. Please pay the ₦7,500 inspection fee on the listing page before scheduling your appointment.",
          requiresPayment: true,
        };
      }
    }

    const viewing = await prisma.viewing.create({
      data: {
        studentId: user.id,
        propertyId,
        dateTime: appointmentDate,
        status: "PENDING",
      },
    });

    const studentName = escapeHtml(user.studentProfile?.fullName || user.agentProfile?.fullName || user.name || "Student");
    const studentPhone = escapeHtml(user.phone || "Not provided");
    const propertyTitle = escapeHtml(property.title);
    const propertyLocation = escapeHtml(property.location);
    const safeUserEmail = escapeHtml(user.email);
    const formattedTime = appointmentDate.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Post inspection booking directly to the Agent in ChatRoom & broadcast via Pusher
    const chatMessageText = `📅 [INSPECTION APPOINTMENT BOOKED]\nI have scheduled an in-person inspection tour for "${property.title}".\n• Date & Time: ${formattedTime}\n• Student Phone: ${studentPhone}${note ? `\n• Note: "${note}"` : ""}`;

    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        studentId: user.id,
        agentId: recipientId,
        propertyId: property.id,
      },
    });

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          studentId: user.id,
          agentId: recipientId,
          propertyId: property.id,
        },
      });
    }

    const chatMsg = await prisma.message.create({
      data: {
        chatRoomId: chatRoom.id,
        senderId: user.id,
        text: chatMessageText,
      },
      include: {
        sender: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    // Real-time broadcast to ChatRoom & Agent
    await triggerPusherEvent(`chat-${chatRoom.id}`, "new-message", {
      id: chatMsg.id,
      chatRoomId: chatRoom.id,
      senderId: chatMsg.senderId,
      text: chatMsg.text,
      createdAt: chatMsg.createdAt.toISOString(),
      senderName: studentName,
    }).catch((e) => console.warn("Pusher chat broadcast failed:", e));

    await triggerPusherEvent(`user-${recipientId}`, "new-unread-message", {
      chatRoomId: chatRoom.id,
      propertyTitle: property.title,
      senderName: studentName,
      messageText: chatMessageText,
    }).catch((e) => console.warn("Pusher agent alert broadcast failed:", e));

    // Also record Inquiry for system logging
    await prisma.inquiry.create({
      data: {
        studentId: user.id,
        propertyId,
        agentId: recipientId,
        message: chatMessageText,
      },
    }).catch(() => null);

    // 2. Send instant Email Notification to the Agent / Landlord via Resend
    if (recipientUser?.email) {
      const agentHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #02351c; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
            <p style="color: #cbd5e1; font-size: 14px; margin: 6px 0 0 0;">New Physical Viewing Request</p>
          </div>
          <div style="padding: 24px;">
            <h2 style="color: #02351c; font-size: 18px; margin-top: 0;">Viewing Requested</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              A student has requested to inspect your hostel listing in person.
            </p>
            <div style="background-color: #f8fafc; border-left: 4px solid #d35400; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e293b;"><strong>Property:</strong> ${propertyTitle}</p>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e293b;"><strong>Date & Time:</strong> ${formattedTime}</p>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e293b;"><strong>Student:</strong> ${studentName}</p>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e293b;"><strong>Phone:</strong> ${studentPhone}</p>
              <p style="margin: 0; font-size: 14px; color: #1e293b;"><strong>Email:</strong> ${safeUserEmail}</p>
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://campustent.com/chat" style="background-color: #02351c; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
                Reply in Chat
              </a>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
            Campus Tent &bull; Safe Student Accommodation
          </div>
        </div>
      `;

      sendEmail({
        to: recipientUser.email,
        subject: `New Viewing Request: ${property.title}`,
        html: agentHtml,
        isInspectionMessage: true,
      }).catch((e) => console.error("Agent viewing email notification failed:", e));
    }

    // 3. Send confirmation Email to Student
    if (user.email) {
      const studentHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #02351c; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Campus Tent</h1>
            <p style="color: #cbd5e1; font-size: 14px; margin: 6px 0 0 0;">Viewing Request Received</p>
          </div>
          <div style="padding: 24px;">
            <h2 style="color: #02351c; font-size: 18px; margin-top: 0;">Viewing Request Sent</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              Hi ${studentName}, your inspection request for <strong>"${propertyTitle}"</strong> has been sent to the agent.
            </p>
            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #065f46;"><strong>Scheduled Time:</strong> ${formattedTime}</p>
              <p style="margin: 0; font-size: 14px; color: #065f46;"><strong>Location:</strong> ${propertyLocation}</p>
            </div>
            <p style="color: #4b5563; font-size: 13.5px;">
              The agent will contact you shortly or reply via Campus Tent Chat to confirm details.
            </p>
          </div>
        </div>
      `;

      sendEmail({
        to: user.email,
        subject: `Viewing Request Sent: ${property.title}`,
        html: studentHtml,
        isInspectionMessage: true,
      }).catch((e) => console.error("Student viewing confirmation email failed:", e));
    }

    return { success: true, viewingId: viewing.id };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to schedule viewing.") };
  }
}

export async function getRoommateProfiles() {
  try {
    const user = await getCurrentUser();

    // Query student profiles
    const roommateProfiles = await prisma.studentProfile.findMany({
      where: {
        user: { deletedAt: null },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Filter students who opted in to roommate matching
    const activeRoommates = roommateProfiles.filter((p) => {
      const prefs = p.preferences as any;
      return prefs && prefs.openToRoommates === true && p.userId !== user?.id; // Exclude self
    });

    return {
      success: true,
      roommates: activeRoommates.map((p) => {
        const prefs = p.preferences as any;
        return {
          id: p.id,
          userId: p.userId,
          fullName: p.fullName,
          university: p.university,
          username: p.username,
          preferences: {
            budgetLimit: prefs.budgetLimit || 0,
            gender: prefs.gender || "Any",
            cleanliness: prefs.cleanliness || "Average",
            sleepSchedule: prefs.sleepSchedule || "Flexible",
            noiseLevel: prefs.noiseLevel || "Flexible",
          },
        };
      }),
    };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to load roommate profiles.") };
  }
}

export async function getRoommateListings() {
  try {
    const user = await getCurrentUser();

    // Query roommate listings (properties where isRoommateOption is true)
    const listings = await prisma.property.findMany({
      where: {
        isRoommateOption: true,
        deletedAt: null,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Exclude current user's own listings if they are logged in
    const otherListings = listings.filter((l) => l.student?.userId !== user?.id);

    return {
      success: true,
      listings: otherListings.map((l) => {
        const prefs = l.student?.preferences as any;
        return {
          id: l.id,
          title: l.title,
          hostelType: l.hostelType,
          price: l.price,
          location: l.location,
          distance: l.distance,
          description: l.description,
          amenities: l.amenities,
          images: l.images,
          university: l.university,
          genderPreference: l.genderPreference || "Any",
          student: l.student ? {
            id: l.student.id,
            userId: l.student.userId,
            fullName: l.student.fullName,
            username: l.student.username,
            isVerified: false,
            gender: prefs?.gender || "Any",
            cleanliness: prefs?.cleanliness || "Average",
            sleepSchedule: prefs?.sleepSchedule || "Flexible",
            noiseLevel: prefs?.noiseLevel || "Flexible",
          } : null,
        };
      }),
    };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to load roommate listings.") };
  }
}

export async function getStudentPaymentHistory() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT") {
      return { success: false, error: "Unauthorized. Student access required." };
    }

    const payments = await prisma.inspectionPayment.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        property: true,
        agent: {
          include: {
            agentProfile: true,
            studentProfile: true,
          },
        },
      },
      orderBy: { paidAt: "desc" },
    });

    return {
      success: true,
      payments: payments.map((p) => {
        let agentName = "Campus Tent Agent";
        let agentPhone = p.agent.phone || "Not provided";
        let agentEmail = p.agent.email;
        let agencyName = p.agent.agentProfile?.agencyName || undefined;

        if (p.agent.agentProfile?.fullName) {
          agentName = p.agent.agentProfile.fullName;
        } else if (p.agent.studentProfile?.fullName) {
          agentName = p.agent.studentProfile.fullName;
        }

        return {
          id: p.id,
          amount: p.amount,
          currency: p.currency,
          status: p.status,
          reference: p.reference,
          paidAt: p.paidAt.toISOString(),
          createdAt: p.createdAt.toISOString(),
          disputeReason: p.disputeReason,
          disputedAt: p.disputedAt?.toISOString() || null,
          refundReason: p.refundReason,
          refundedAt: p.refundedAt?.toISOString() || null,
          payoutStatus: p.payoutStatus,
          property: {
            id: p.property.id,
            title: p.property.title,
            location: p.property.location,
            university: p.property.university,
            price: p.property.price,
            thumbnail: p.property.images?.[0] || null,
          },
          agent: {
            id: p.agent.id,
            name: agentName,
            agencyName: agencyName,
            email: agentEmail,
            phone: agentPhone,
          },
        };
      }),
    };
  } catch (err: any) {
    console.error("getStudentPaymentHistory error:", err);
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to load payment history.") };
  }
}

