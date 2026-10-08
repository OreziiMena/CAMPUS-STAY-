import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPartnerBySlug } from "@/app/actions/partner";
import PartnerInteractive from "./PartnerInteractive";
import PartnerPropertyList from "./PartnerPropertyList";
import styles from "./partner.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getPartnerBySlug(slug);

  if (!res.success || !res.partner) {
    return {
      title: "Partner Agency — CampusTent",
      description: "Discover trusted student housing agencies on CampusTent.",
    };
  }

  const partner = res.partner;
  return {
    title: `${partner.agencyName} — CampusTent Trusted Agency`,
    description: `${partner.agencyName}: ${partner.tagline || partner.bio}`,
    openGraph: {
      title: `${partner.agencyName} | CampusTent Trusted Agency`,
      description: partner.bio,
      images: partner.logoUrl ? [{ url: partner.logoUrl }] : [],
    },
  };
}

export default async function PartnerPage({ params }: PageProps) {
  const { slug } = await params;
  const res = await getPartnerBySlug(slug);

  if (!res.success || !res.partner) {
    notFound();
  }

  const partner = res.partner;
  const properties = partner.properties || [];

  return (
    <div className={styles.partnerPage}>
      <Navbar />

      {/* Brand Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroContainer}>
          {/* Logo Frame */}
          <div className={styles.logoWrapper}>
            {partner.logoUrl ? (
              <img
                src={partner.logoUrl}
                alt={`${partner.agencyName} Logo`}
                className={styles.agencyLogo}
              />
            ) : (
              <div className={styles.logoFallback}>
                {partner.agencyName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Agency Name & Trust Badges */}
          <div className={styles.agencyTitleRow}>
            <h1 className={styles.agencyTitle}>{partner.agencyName}</h1>
          </div>

          <div className={styles.trustedBadge}>
            <i className="fas fa-crown"></i> CampusTent Trusted Agency
          </div>

          <p className={styles.agencyTagline}>
            {partner.tagline || "Student Housing & Real Estate Services"}
          </p>

          {/* Interactive CTAs */}
          <PartnerInteractive
            agencyName={partner.agencyName}
            slug={partner.slug}
            whatsappLink={partner.whatsappLink}
          />
        </div>
      </section>

      {/* Main Content Area */}
      <main className={styles.mainContainer}>
        {/* About Card */}
        <section className={styles.aboutCard}>
          <h2 className={styles.aboutTitle}>
            <i className="fas fa-building"></i> About {partner.agencyName}
          </h2>
          <p className={styles.aboutText}>
            
              EasyVille Estates is a student-focused housing agency dedicated to helping students find suitable off-campus accommodation with ease.
          </p>
          <div className={styles.aboutHighlights}>
            <div className={styles.highlightPill}>
              <i className="fas fa-check-circle"></i> CampusTent Verified Agency
            </div>
            <div className={styles.highlightPill}>
              <i className="fas fa-bolt"></i> Fast Availability Verification
            </div>
            <div className={styles.highlightPill}>
              <i className="fas fa-map-marker-alt"></i> Iterigbi &bull; FUPRE &bull; Effurun
            </div>
            <div className={styles.highlightPill}>
              <i className="fas fa-shield-alt"></i> Zero Agent Wahala Guarantee
            </div>
          </div>
        </section>

        {/* Refer & Earn Banner (₦5,000) */}
        <section className={styles.referBanner}>
          <div className={styles.referBannerGlow}></div>
          <div className={styles.referContent}>
            <div className={styles.referBadge}>
              <i className="fas fa-gift"></i> Student Reward Program
            </div>
            <h2 className={styles.referTitle}>
              Refer an Available Apartment &amp; Earn <span>₦{partner.referralRewardAmount.toLocaleString()} Instantly</span>
            </h2>
            <p className={styles.referDesc}>
              {partner.referralOfferDesc ||
                "Know of an available student apartment? Refer it to EasyVille Estates and earn ₦5,000 instantly once the property is verified."}
            </p>
          </div>
          <div className={styles.referBtnWrapper}>
            <a
              href={partner.referralWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.referBtn}
            >
              <i className="fab fa-whatsapp"></i> Refer a Property
            </a>
          </div>
        </section>

        {/* Available Properties Section with Campus Filters & Pagination */}
        <PartnerPropertyList
          properties={properties}
          partnerSlug={partner.slug}
          partnerName={partner.agencyName}
          whatsappLink={partner.whatsappLink}
        />
      </main>

      <Footer />
    </div>
  );
}
