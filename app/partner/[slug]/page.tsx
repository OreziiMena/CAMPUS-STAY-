import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPartnerBySlug } from "@/app/actions/partner";
import PartnerInteractive from "./PartnerInteractive";
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

        {/* Available Properties Section */}
        <section className={styles.propertiesSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Available Properties</h2>
              <p className={styles.sectionSub}>
                Properties supplied by {partner.agencyName} that are currently available on CampusTent.
              </p>
            </div>
            <span className={styles.propertyCountBadge}>
              <i className="fas fa-home"></i> {properties.length} {properties.length === 1 ? "Property" : "Properties"} Listed
            </span>
          </div>

          {properties.length === 0 ? (
            <div className={styles.emptyCard}>
              <div className={styles.emptyIcon}>
                <i className="fas fa-house-chimney-crack"></i>
              </div>
              <h3 className={styles.emptyTitle}>No Live Properties at This Moment</h3>
              <p className={styles.emptyText}>
                {partner.agencyName} properties are currently being verified or occupied. Check back shortly or contact the agency directly on WhatsApp.
              </p>
              <a
                href={partner.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.emptyBtn}
              >
                Inquire via WhatsApp
              </a>
            </div>
          ) : (
            <div className={styles.propertyGrid}>
              {properties.map((property: any) => {
                const videoTour = property.images?.find((img: string) =>
                  img.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i)
                );
                const firstImage =
                  property.images?.find((img: string) => !img.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i)) ||
                  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

                return (
                  <div key={property.id} className={styles.propertyCard}>
                    <div className={styles.cardMediaWrapper}>
                      <img
                        src={firstImage}
                        alt={property.title}
                        className={styles.cardMedia}
                        loading="lazy"
                      />
                      {videoTour && (
                        <div className={styles.videoBadge}>
                          <i className="fas fa-video"></i> Video Tour
                        </div>
                      )}
                      <span className={styles.availBadge}>
                        {property.isAvailable ? "AVAILABLE" : "OCCUPIED"}
                      </span>
                    </div>

                    <div className={styles.cardBody}>
                      {/* Price Row */}
                      <div className={styles.cardPriceRow}>
                        <h3 className={styles.cardPrice}>
                          ₦{property.price?.toLocaleString()}
                        </h3>
                        <span className={styles.cardPriceSub}>total package</span>
                      </div>

                      {/* Fee Breakdown Pills */}
                      <div className={styles.feeBreakdownRow}>
                        {property.rentAmount && property.rentAmount > 0 && (
                          <span className={`${styles.feePill} ${styles.feePillRent}`}>
                            <i className="fas fa-home"></i> Rent: ₦{property.rentAmount.toLocaleString()}
                          </span>
                        )}
                        {property.agentFee !== undefined && property.agentFee !== null && (
                          <span className={`${styles.feePill} ${styles.feePillAgent}`}>
                            <i className="fas fa-user-tie"></i> Agent Fee: ₦{property.agentFee.toLocaleString()}
                          </span>
                        )}
                        {property.cautionFee && property.cautionFee > 0 && (
                          <span className={styles.feePill}>
                            <i className="fas fa-shield-alt"></i> Caution: ₦{property.cautionFee.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <h4 className={styles.cardTitle}>{property.title}</h4>

                      <p className={styles.cardLocation}>
                        <i className="fas fa-location-dot"></i>
                        <span>
                          {property.location}
                          {property.distance ? ` (${property.distance})` : ""}
                        </span>
                      </p>

                      {/* Action buttons: Custom Details Link & Direct WhatsApp CTA */}
                      <div className={styles.cardActionsRow}>
                        <Link
                          href={`/apartment-details?id=${property.id}&partner=${partner.slug}`}
                          className={styles.cardBtn}
                        >
                          View Details
                        </Link>
                        <a
                          href={`https://wa.me/2347048489342?text=${encodeURIComponent(
                            `Hello EasyVille Estates, I'm inquiring about "${property.title}" (₦${property.price?.toLocaleString()}) on CampusTent.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.cardBtnWhatsApp}
                          title="Inquire on WhatsApp"
                        >
                          <i className="fab fa-whatsapp"></i> Inquire
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
