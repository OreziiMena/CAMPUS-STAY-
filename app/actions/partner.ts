"use server";

import prisma from "@/lib/prisma";

export interface PartnerData {
  id: string;
  name: string;
  agencyName: string;
  slug: string;
  logoUrl: string;
  tagline: string;
  bio: string;
  isVerified: boolean;
  isTrustedPartner: boolean;
  phone: string;
  email?: string;
  whatsappLink: string;
  referralRewardAmount: number;
  referralOfferTitle: string;
  referralOfferDesc: string;
  referralWhatsappLink: string;
  properties: any[];
  totalProperties: number;
}

const EASYVILLE_FALLBACK: PartnerData = {
  id: "easyville-estates-default",
  name: "Easyville Estates",
  agencyName: "Easyville Estates",
  slug: "easyville-estates",
  logoUrl: "/partners/easyville-logo.jpg",
  tagline: "Student Housing & Real Estate Services",
  bio: "EasyVille Estates is a student-focused housing agency dedicated to helping students find suitable off-campus accommodation with ease.",
  isVerified: true,
  isTrustedPartner: true,
  phone: "+2347048489342",
  email: "support@campustent.com",
  whatsappLink: "https://wa.me/2347048489342?text=Hello%20EasyVille%20Estates,%20I'm%20inquiring%20about%20your%20student%20hostels%20on%20CampusTent.",
  referralRewardAmount: 5000,
  referralOfferTitle: "Refer an available student apartment and earn ₦5,000 instantly.",
  referralOfferDesc: "Know of an available student apartment? Refer it to EasyVille Estates and earn ₦5,000 instantly once the property is verified.",
  referralWhatsappLink: "https://wa.me/2347048489342?text=I%20have%20an%20available%20student%20apartment.",
  properties: [],
  totalProperties: 0,
};

export async function getPartnerBySlug(rawSlug: string): Promise<{ success: boolean; partner?: PartnerData; error?: string }> {
  try {
    const slug = (rawSlug || "").trim().toLowerCase();

    // 1. Try to find the agent profile in DB by slug or agencyName
    const isEasyVilleQuery = slug === "easyville-estates" || slug === "easyville" || slug.includes("easyville");

    let agent: any = null;

    // 1. Try to find the agent profile in DB by slug or agencyName
    try {
      agent = await (prisma.agentProfile as any).findFirst({
        where: {
          OR: [
            { slug: slug },
            ...(isEasyVilleQuery ? [{ agencyName: { contains: "Easyville", mode: "insensitive" as const } }] : []),
          ],
        },
        include: {
          user: {
            select: {
              phone: true,
              email: true,
            },
          },
          properties: {
            where: {
              isVerified: true,
              deletedAt: null,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    } catch (queryErr: any) {
      // In-memory Prisma client in running dev server hasn't reloaded new schema fields yet
      console.warn("Prisma slug query fallback (server restart recommended):", queryErr?.message || queryErr);
      try {
        agent = await prisma.agentProfile.findFirst({
          where: {
            agencyName: {
              contains: isEasyVilleQuery ? "Easyville" : slug,
              mode: "insensitive" as const,
            },
          },
          include: {
            user: {
              select: {
                phone: true,
                email: true,
              },
            },
            properties: {
              where: {
                isVerified: true,
                deletedAt: null,
              },
              orderBy: { createdAt: "desc" },
            },
          },
        });
      } catch (fallbackErr) {
        console.warn("Fallback query warning:", fallbackErr);
      }
    }

    // If it's EasyVille and found without proper slug/logo, auto-enrich and save
    if (agent && isEasyVilleQuery && (!agent.slug || !agent.logoUrl || !agent.isTrustedPartner)) {
      try {
        agent = await (prisma.agentProfile as any).update({
          where: { id: agent.id },
          data: {
            slug: "easyville-estates",
            logoUrl: "/partners/easyville-logo.jpg",
            isTrustedPartner: true,
            isVerified: true,
            tagline: agent.tagline || "Student Housing & Real Estate Services",
            bio: agent.bio || "EasyVille Estates is a student-focused housing agency dedicated to helping students find suitable off-campus accommodation with ease.",
            referralRewardAmount: agent.referralRewardAmount || 5000,
            referralOfferTitle: agent.referralOfferTitle || "Refer an available student apartment and earn ₦5,000 instantly.",
            referralOfferDesc: agent.referralOfferDesc || "Know of an available student apartment? Refer it to EasyVille Estates and earn ₦5,000 instantly once the property is verified.",
            referralWhatsappLink: agent.referralWhatsappLink || "https://wa.me/2347048489342?text=I%20have%20an%20available%20student%20apartment.",
          },
          include: {
            user: {
              select: {
                phone: true,
                email: true,
              },
            },
            properties: {
              where: {
                isVerified: true,
                deletedAt: null,
              },
              orderBy: { createdAt: "desc" },
            },
          },
        });
      } catch (updateErr) {
        console.warn("Could not auto-enrich agent profile (pending server restart):", updateErr);
      }
    }

    if (agent) {
      const phoneNum = agent.user?.phone?.replace(/\D/g, "") || "2347048489342";
      const cleanPhone = phoneNum.startsWith("0") ? `234${phoneNum.slice(1)}` : phoneNum;
      const agencyDisplayName = agent.agencyName || agent.fullName || "Partner Agency";

      return {
        success: true,
        partner: {
          id: agent.id,
          name: agent.fullName,
          agencyName: agencyDisplayName,
          slug: agent.slug || slug,
          logoUrl: agent.logoUrl || (isEasyVilleQuery ? "/partners/easyville-logo.jpg" : ""),
          tagline: agent.tagline || "Student Housing & Real Estate Services",
          bio: agent.bio || "Student-focused housing agency on CampusTent.",
          isVerified: agent.isVerified,
          isTrustedPartner: agent.isTrustedPartner,
          phone: agent.user?.phone || "+2347048489342",
          email: agent.user?.email,
          whatsappLink: `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(agencyDisplayName)},%20I'm%20inquiring%20about%20your%20properties%20on%20CampusTent.`,
          referralRewardAmount: agent.referralRewardAmount || 5000,
          referralOfferTitle: agent.referralOfferTitle || "Refer an available student apartment and earn ₦5,000 instantly.",
          referralOfferDesc: agent.referralOfferDesc || "Know of an available student apartment? Refer it to our agency and earn ₦5,000 instantly once the property is verified.",
          referralWhatsappLink: agent.referralWhatsappLink || `https://wa.me/${cleanPhone}?text=Hello%20Easyville,%20I%20have%20an%20available%20student%20apartment.`,
          properties: agent.properties || [],
          totalProperties: agent.properties?.length || 0,
        },
      };
    }

    // If query is for EasyVille and not yet in DB, return enriched fallback
    if (isEasyVilleQuery) {
      const properties = await prisma.property.findMany({
        where: {
          isVerified: true,
          deletedAt: null,
          OR: [
            { description: { contains: "Easyville", mode: "insensitive" } },
            { title: { contains: "Easyville", mode: "insensitive" } },
            { location: { contains: "Iterigbi", mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
      });

      return {
        success: true,
        partner: {
          ...EASYVILLE_FALLBACK,
          properties,
          totalProperties: properties.length,
        },
      };
    }

    return { success: false, error: "Partner agency not found." };
  } catch (error: any) {
    console.error("getPartnerBySlug error:", error);
    return { success: false, error: error.message || "Failed to load partner page." };
  }
}
