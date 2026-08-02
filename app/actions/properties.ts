"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { uploadToR2 } from "@/lib/r2";
import { sendEmail } from "@/lib/email";

export async function getProperties(filterParam?: string | {
  searchQuery?: string;
  university?: string;
  hostelType?: string;
  minPrice?: number;
  maxPrice?: number;
  proximity?: string;
}) {
  try {
    let searchQuery: string | undefined;
    let university: string | undefined;
    let hostelType: string | undefined;
    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    let proximity: string | undefined;

    if (typeof filterParam === "string") {
      searchQuery = filterParam;
    } else if (filterParam && typeof filterParam === "object") {
      searchQuery = filterParam.searchQuery;
      university = filterParam.university;
      hostelType = filterParam.hostelType;
      minPrice = filterParam.minPrice;
      maxPrice = filterParam.maxPrice;
      proximity = filterParam.proximity;
    }

    const whereClause: any = {
      isAvailable: true,
      isVerified: true,
      isRoommateOption: false,
    };

    const andConditions: any[] = [];

    // 1. Base Search Query
    if (searchQuery) {
      const trimmed = searchQuery.trim();
      andConditions.push({
        OR: [
          { title: { contains: trimmed, mode: "insensitive" } },
          { location: { contains: trimmed, mode: "insensitive" } },
          { description: { contains: trimmed, mode: "insensitive" } },
        ]
      });
    }

    // 2. University
    if (university && university !== "All") {
      andConditions.push({
        OR: [
          { university: { equals: university, mode: "insensitive" } },
          { title: { contains: university, mode: "insensitive" } },
          { location: { contains: university, mode: "insensitive" } },
          { description: { contains: university, mode: "insensitive" } },
        ]
      });
    }

    // 3. Hostel Type
    if (hostelType && hostelType !== "All") {
      andConditions.push({
        hostelType: { equals: hostelType }
      });
    }

    // 4. Price range
    if (minPrice !== undefined && !isNaN(minPrice)) {
      andConditions.push({
        price: { gte: minPrice }
      });
    }
    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      andConditions.push({
        price: { lte: maxPrice }
      });
    }

    if (andConditions.length > 0) {
      whereClause.AND = andConditions;
    }

    let properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        agent: true,
        student: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 5. Proximity filter (in-memory walk time minutes comparison)
    if (proximity && proximity !== "Any") {
      properties = properties.filter((property) => {
        const distStr = property.distance || "";
        const minsMatch = distStr.match(/(\d+)\s*mins?/i);
        if (!minsMatch) return false;
        const mins = parseInt(minsMatch[1], 10);

        if (proximity === "under_5") {
          return mins < 5;
        } else if (proximity === "5_10") {
          return mins >= 5 && mins <= 10;
        } else if (proximity === "over_10") {
          return mins > 10;
        }
        return true;
      });
    }

    return { success: true, properties };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch properties." };
  }
}

export async function getPropertyDetails(id: string) {
  try {
    const property = await (prisma.property as any).update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
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

    return { success: true, property };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch property details." };
  }
}

export async function addProperty(data: any) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const { title, hostelType, price, location, distance, description, amenities, images, university } = data;

    const createData: any = {
      title,
      hostelType,
      price: parseFloat(price),
      location,
      distance,
      description,
      university: university || "FUPRE",
      amenities: amenities || [],
      images: images || [],
    };

    if (user.role === "STUDENT") {
      if (!user.studentProfile) {
        return { success: false, error: "Student profile not found." };
      }
      if (!user.studentProfile.isVerified) {
        return { success: false, error: "Verification required. Please verify your student profile to upload roommate listings." };
      }
      createData.studentId = user.studentProfile.id;
      createData.isRoommateOption = true; // Enforce roommate option for students
    } else if (user.role === "AGENT") {
      if (!user.agentProfile) {
        return { success: false, error: "Agent profile not found." };
      }
      createData.agentId = user.agentProfile.id;
      createData.isRoommateOption = false;
    } else {
      return { success: false, error: "Unauthorized role." };
    }

    const property = await prisma.property.create({
      data: createData,
    });

    return { success: true, propertyId: property.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create property." };
  }
}

export async function createInquiry(data: { propertyId: string; message: string }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "You must be logged in to send inquiries." };
    }

    if (user.role === "STUDENT" && !user.studentProfile?.isVerified) {
      return { success: false, error: "Verification required. You must verify your student profile to contact agents." };
    }

    const { propertyId, message } = data;

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

    const inquiry = await prisma.inquiry.create({
      data: {
        studentId: user.id,
        propertyId,
        agentId: recipientId,
        message,
      },
    });

    const recipientEmail = property.agent?.user.email || property.student?.user.email;
    const recipientName = property.agent?.fullName || property.student?.fullName || "User";
    if (recipientEmail) {
      await sendEmail({
        to: recipientEmail,
        subject: "🏠 New Inquiry on Your Listing - Campus Stay",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: rgb(2, 53, 28);">New Inquiry Received!</h2>
            <p>Hi ${recipientName},</p>
            <p>A user has sent an inquiry regarding your listing: <strong>"${property.title}"</strong>.</p>
            <blockquote style="background: #f9f9f9; padding: 12px; border-left: 4px solid rgb(2, 53, 28); margin: 20px 0;">
              "${message}"
            </blockquote>
            <p>Log in to your Campus Stay dashboard to reply in the chat room.</p>
            <a href="https://campus-stay-chi.vercel.app/chat" style="display: inline-block; background-color: rgb(2, 53, 28); color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 10px;">Go to Chat Inbox</a>
          </div>
        `,
        text: `Hi ${recipientName},\n\nA user has sent an inquiry regarding your listing: "${property.title}".\n\n"${message}"\n\nLog in to your Campus Stay dashboard to reply in the chat inbox: https://campus-stay-chi.vercel.app/chat`
      });
    }

    return { success: true, inquiryId: inquiry.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit inquiry." };
  }
}

export async function getAgentDashboardData() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT" || !user.agentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const agentProfileId = user.agentProfile.id;

    const totalProperties = await prisma.property.count({
      where: { agentId: agentProfileId },
    });

    const activeListings = await prisma.property.count({
      where: { agentId: agentProfileId, isAvailable: true },
    });

    const newInquiries = await prisma.chatRoom.count({
      where: { agentId: user.id },
    });

    const recentChatRooms = await prisma.chatRoom.findMany({
      where: { agentId: user.id },
      include: {
        student: {
          include: {
            studentProfile: true,
          },
        },
        property: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return {
      success: true,
      stats: {
        totalProperties,
        activeListings,
        newInquiries,
      },
      recentInquiries: recentChatRooms.map((room) => ({
        id: room.id,
        studentName: room.student.studentProfile?.username 
          ? `@${room.student.studentProfile.username}` 
          : "Student",
        studentVerified: room.student.studentProfile?.isVerified || false,
        phone: room.student.phone,
        email: room.student.email,
        propertyName: room.property.title,
        message: room.messages?.[0]?.text || "No messages yet",
        createdAt: (room.messages?.[0]?.createdAt || room.createdAt).toISOString(),
      })),
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load dashboard data." };
  }
}

export async function getAgentAnalyticsData() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT" || !user.agentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const agentProfileId = user.agentProfile.id;

    // 1. Fetch properties to compute views
    const properties = await prisma.property.findMany({
      where: { agentId: agentProfileId },
      select: {
        id: true,
        title: true,
        views: true,
      },
    });

    const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);

    // 2. Fetch inquiries
    const inquiries = await prisma.inquiry.findMany({
      where: { agentId: user.id },
      include: {
        student: {
          include: {
            studentProfile: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const totalInquiries = inquiries.length;

    // 3. Conversion Rate
    const conversionRate = totalViews > 0 ? parseFloat(((totalInquiries / totalViews) * 100).toFixed(1)) : 0.0;

    // 4. Demographics by university
    const demoMap: { [key: string]: number } = {};
    inquiries.forEach((inq) => {
      const uni = inq.student.studentProfile?.university || "Other";
      demoMap[uni] = (demoMap[uni] || 0) + 1;
    });

    const demographics = Object.keys(demoMap).map((uni) => ({
      university: uni,
      count: demoMap[uni],
    }));

    // 5. Engagement trend (past 7 days)
    const trendDays = 7;
    const engagementTrend: any[] = [];
    const now = new Date();

    for (let i = trendDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateString = d.toLocaleDateString("en-US", { weekday: "short" });
      const dateKey = d.toDateString();

      const inquiryCount = inquiries.filter((inq) => {
        return new Date(inq.createdAt).toDateString() === dateKey;
      }).length;

      // Distribute views across days
      const dayFactor = (i % 3) + 1;
      const estimatedViews = totalViews > 0 ? Math.max(1, Math.round((totalViews / 7) * (dayFactor / 2))) : 0;

      engagementTrend.push({
        day: dateString,
        views: estimatedViews,
        inquiries: inquiryCount,
      });
    }

    return {
      success: true,
      metrics: {
        totalViews,
        clicks: totalViews,
        totalInquiries,
        conversionRate,
      },
      viewsPerProperty: properties.map((p) => ({
        title: p.title.length > 20 ? p.title.substring(0, 17) + "..." : p.title,
        views: p.views || 0,
      })),
      demographics,
      engagementTrend,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load analytics data." };
  }
}

export async function uploadPropertyImages(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const files = formData.getAll("images") as File[];
    if (files.length === 0) {
      return { success: true, urls: [] };
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "properties");
    const urls: string[] = [];
    const timestamp = Date.now();
    const ALLOWED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || file.size === 0) continue;

      const ext = (path.extname(file.name) || "").toLowerCase();
      if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
        return { success: false, error: "Invalid image file type. Only .jpg, .jpeg, .png, and .webp images are allowed." };
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${user.id}-property-${timestamp}-${i}${ext}`;
      
      const r2Result = await uploadToR2(buffer, `properties/${filename}`, file.type || "image/jpeg");
      if (r2Result.success && r2Result.url) {
        urls.push(r2Result.url);
      } else {
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);
        urls.push(`/uploads/properties/${filename}`);
      }
    }

    return { success: true, urls };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to upload images." };
  }
}

export async function getAgentProperties() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT" || !user.agentProfile) {
      return { success: false, error: "Unauthorized." };
    }

    const properties = await prisma.property.findMany({
      where: {
        agentId: user.agentProfile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, properties };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch properties." };
  }
}

export async function togglePropertyAvailability(propertyId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized." };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    if (user.role === "STUDENT") {
      if (!user.studentProfile || property.studentId !== user.studentProfile.id) {
        return { success: false, error: "Unauthorized." };
      }
    } else if (user.role === "AGENT") {
      if (!user.agentProfile || property.agentId !== user.agentProfile.id) {
        return { success: false, error: "Unauthorized." };
      }
    } else {
      return { success: false, error: "Unauthorized." };
    }

    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: { isAvailable: !property.isAvailable },
    });

    return { success: true, isAvailable: updated.isAvailable };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to toggle availability." };
  }
}

export async function updateProperty(propertyId: string, data: any) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized." };
    }

    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!existingProperty) {
      return { success: false, error: "Property not found." };
    }

    if (user.role === "STUDENT") {
      if (!user.studentProfile || existingProperty.studentId !== user.studentProfile.id) {
        return { success: false, error: "Unauthorized." };
      }
    } else if (user.role === "AGENT") {
      if (!user.agentProfile || existingProperty.agentId !== user.agentProfile.id) {
        return { success: false, error: "Unauthorized." };
      }
    } else {
      return { success: false, error: "Unauthorized." };
    }

    const { title, hostelType, price, location, distance, description, amenities, images, university } = data;

    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: {
        title,
        hostelType,
        price: parseFloat(price),
        location,
        distance,
        description,
        university: university || existingProperty.university || "FUPRE",
        amenities: amenities || [],
        images: images || [],
      },
    });

    return { success: true, propertyId: updated.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update property." };
  }
}

export async function deleteProperty(propertyId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized." };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    if (user.role === "STUDENT") {
      if (!user.studentProfile || property.studentId !== user.studentProfile.id) {
        return { success: false, error: "Unauthorized." };
      }
    } else if (user.role === "AGENT") {
      if (!user.agentProfile || property.agentId !== user.agentProfile.id) {
        return { success: false, error: "Unauthorized." };
      }
    } else {
      return { success: false, error: "Unauthorized." };
    }

    await prisma.property.delete({
      where: { id: propertyId },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete property." };
  }
}
