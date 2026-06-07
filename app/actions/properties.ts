"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";

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
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        agent: {
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
    if (!user || user.role !== "AGENT" || !user.agentProfile) {
      return { success: false, error: "Unauthorized. Only registered agents can list properties." };
    }

    const { title, hostelType, price, location, distance, description, amenities, images } = data;

    const property = await prisma.property.create({
      data: {
        title,
        hostelType,
        price: parseFloat(price),
        location,
        distance,
        description,
        amenities: amenities || [],
        images: images || [],
        agentId: user.agentProfile.id,
      },
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

    const { propertyId, message } = data;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        agent: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        studentId: user.id,
        propertyId,
        agentId: property.agent.userId,
        message,
      },
    });

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

    const newInquiries = await prisma.inquiry.count({
      where: { agentId: user.id },
    });

    const recentInquiries = await prisma.inquiry.findMany({
      where: { agentId: user.id },
      include: {
        student: {
          include: {
            studentProfile: true,
          },
        },
        property: true,
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
      recentInquiries: recentInquiries.map((inq) => ({
        id: inq.id,
        studentName: inq.student.studentProfile?.fullName || "Student",
        phone: inq.student.phone,
        email: inq.student.email,
        propertyName: inq.property.title,
        message: inq.message,
        createdAt: inq.createdAt.toISOString(),
      })),
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load dashboard data." };
  }
}
