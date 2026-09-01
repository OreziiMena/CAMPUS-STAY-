"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { uploadToR2 } from "@/lib/r2";

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
        agentVerified = room.agent.studentProfile.isVerified;
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
        agentVerified = inq.property.student.isVerified;
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
          agentVerified = v.property.student.isVerified;
        }

        return {
          id: v.id,
          dateTime: v.dateTime,
          status: v.status,
          propertyTitle: v.property.title,
          propertyId: v.property.id,
          agentName: agentName,
          agentVerified: agentVerified,
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

export async function uploadStudentVerification(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const idCardFile = formData.get("idCard") as File | null;
    const feesReceiptFile = formData.get("feesReceipt") as File | null;
    const portalScreenshotFile = formData.get("portalScreenshot") as File | null;
    const jambLetterFile = formData.get("jambLetter") as File | null;

    // Check if at least one file was uploaded
    const hasIdCard = idCardFile && idCardFile.size > 0;
    const hasFeesReceipt = feesReceiptFile && feesReceiptFile.size > 0;
    const hasPortalScreenshot = portalScreenshotFile && portalScreenshotFile.size > 0;
    const hasJambLetter = jambLetterFile && jambLetterFile.size > 0;

    if (!hasIdCard && !hasFeesReceipt && !hasPortalScreenshot && !hasJambLetter) {
      return { success: false, error: "Please upload at least one verification document." };
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "student_verification");
    const updateData: any = {};
    const timestamp = Date.now();
    const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];

    if (hasIdCard) {
      const ext = (path.extname(idCardFile.name) || "").toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return { success: false, error: "Invalid ID Card file type. Only PDF and image files (.jpg, .jpeg, .png, .webp) are allowed." };
      }
      const buffer = Buffer.from(await idCardFile.arrayBuffer());
      const filename = `${user.studentProfile.id}-idcard-${timestamp}${ext}`;
      
      const r2Result = await uploadToR2(buffer, `student_verification/${filename}`, idCardFile.type || "application/pdf");
      if (r2Result.success && r2Result.url) {
        updateData.idCardDoc = r2Result.url;
      } else {
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);
        updateData.idCardDoc = `/uploads/student_verification/${filename}`;
      }
    }

    if (hasFeesReceipt) {
      const ext = (path.extname(feesReceiptFile.name) || "").toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return { success: false, error: "Invalid Fees Receipt file type. Only PDF and image files (.jpg, .jpeg, .png, .webp) are allowed." };
      }
      const buffer = Buffer.from(await feesReceiptFile.arrayBuffer());
      const filename = `${user.studentProfile.id}-fees-${timestamp}${ext}`;
      
      const r2Result = await uploadToR2(buffer, `student_verification/${filename}`, feesReceiptFile.type || "application/pdf");
      if (r2Result.success && r2Result.url) {
        updateData.feesReceiptDoc = r2Result.url;
      } else {
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);
        updateData.feesReceiptDoc = `/uploads/student_verification/${filename}`;
      }
    }

    if (hasPortalScreenshot) {
      const ext = (path.extname(portalScreenshotFile.name) || "").toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return { success: false, error: "Invalid Portal Screenshot file type. Only PDF and image files (.jpg, .jpeg, .png, .webp) are allowed." };
      }
      const buffer = Buffer.from(await portalScreenshotFile.arrayBuffer());
      const filename = `${user.studentProfile.id}-portal-${timestamp}${ext}`;
      
      const r2Result = await uploadToR2(buffer, `student_verification/${filename}`, portalScreenshotFile.type || "application/pdf");
      if (r2Result.success && r2Result.url) {
        updateData.portalScreenshotDoc = r2Result.url;
      } else {
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);
        updateData.portalScreenshotDoc = `/uploads/student_verification/${filename}`;
      }
    }

    if (hasJambLetter) {
      const ext = (path.extname(jambLetterFile.name) || "").toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return { success: false, error: "Invalid JAMB Admission Letter file type. Only PDF and image files (.jpg, .jpeg, .png, .webp) are allowed." };
      }
      const buffer = Buffer.from(await jambLetterFile.arrayBuffer());
      const filename = `${user.studentProfile.id}-jamb-${timestamp}${ext}`;
      
      const r2Result = await uploadToR2(buffer, `student_verification/${filename}`, jambLetterFile.type || "application/pdf");
      if (r2Result.success && r2Result.url) {
        updateData.jambLetterDoc = r2Result.url;
      } else {
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);
        updateData.jambLetterDoc = `/uploads/student_verification/${filename}`;
      }
    }

    await prisma.studentProfile.update({
      where: { id: user.studentProfile.id },
      data: {
        ...updateData,
        isVerified: false, // Reset status to unverified / pending review
      },
    });

    return { success: true, paths: updateData };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to upload document.") };
  }
}

export async function instantToggleVerification() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const currentStatus = user.studentProfile.isVerified;
    const nextStatus = !currentStatus;

    await prisma.studentProfile.update({
      where: { id: user.studentProfile.id },
      data: { isVerified: nextStatus },
    });

    return { success: true, isVerified: nextStatus };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to toggle verification status.") };
  }
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
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return { success: false, error: "You must be logged in as a student to schedule viewings." };
    }

    if (!user.studentProfile.isVerified) {
      return { success: false, error: "Verification required. You must verify your student profile to schedule viewings." };
    }

    const { propertyId, dateTime } = data;

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

    const recipientId = property.agent?.userId || property.student?.userId;
    if (!recipientId) {
      return { success: false, error: "Listing owner not found." };
    }

    const viewing = await prisma.viewing.create({
      data: {
        studentId: user.id,
        propertyId,
        dateTime: new Date(dateTime),
        status: "PENDING",
      },
    });

    // Also send a simulated inquiry/message to the agent for this viewing request
    await prisma.inquiry.create({
      data: {
        studentId: user.id,
        propertyId,
        agentId: recipientId,
        message: `Hi, I have requested a physical viewing appointment for your property "${property.title}" on ${new Date(dateTime).toLocaleString()}.`,
      },
    });

    return { success: true, viewingId: viewing.id };
  } catch (err: any) {
    return { success: false, error: getFriendlyErrorMessage(err, "Failed to schedule viewing.") };
  }
}

export async function getRoommateProfiles() {
  try {
    const user = await getCurrentUser();

    // Query verified student profiles
    const roommateProfiles = await prisma.studentProfile.findMany({
      where: {
        isVerified: true,
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
            isVerified: l.student.isVerified,
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

