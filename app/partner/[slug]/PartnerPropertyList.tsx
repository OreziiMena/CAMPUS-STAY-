"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import styles from "./partner.module.css";

interface Property {
  id: string;
  title: string;
  price: number;
  rentAmount?: number | null;
  agentFee?: number | null;
  cautionFee?: number | null;
  location: string;
  distance?: string | null;
  university?: string | null;
  images: string[];
  isAvailable: boolean;
}

interface PartnerPropertyListProps {
  properties: Property[];
  partnerSlug: string;
  partnerName: string;
  whatsappLink: string;
}

const CAMPUSES = [
  { key: "ALL", label: "All Campuses", short: "All" },
  { key: "FUPRE", label: "FUPRE", fullName: "Federal Univ. of Petroleum Resources", short: "FUPRE" },
  { key: "DOU", label: "DOU", fullName: "Dennis Osadebay University", short: "DOU" },
  { key: "UNIBEN", label: "UNIBEN", fullName: "University of Benin", short: "UNIBEN" },
];

const ITEMS_PER_PAGE = 6;

export default function PartnerPropertyList({
  properties,
  partnerSlug,
  partnerName,
  whatsappLink,
}: PartnerPropertyListProps) {
  const [selectedCampus, setSelectedCampus] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Helper to match property with a campus key
  const matchesCampus = (property: Property, campusKey: string) => {
    if (campusKey === "ALL") return true;
    const uni = (property.university || "").toUpperCase();
    const loc = (property.location || "").toLowerCase();

    if (campusKey === "FUPRE") {
      return uni.includes("FUPRE") || loc.includes("ugbomro") || loc.includes("iterigbi");
    }
    if (campusKey === "DOU") {
      return uni.includes("DOU") || uni.includes("OSADEBAY");
    }
    if (campusKey === "UNIBEN") {
      return uni.includes("UNIBEN") || loc.includes("ekosodin");
    }
    return uni.includes(campusKey);
  };

  // Property counts per campus
  const campusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: properties.length,
      FUPRE: 0,
      DOU: 0,
      UNIBEN: 0,
    };
    properties.forEach((p) => {
      if (matchesCampus(p, "FUPRE")) counts.FUPRE++;
      if (matchesCampus(p, "DOU")) counts.DOU++;
      if (matchesCampus(p, "UNIBEN")) counts.UNIBEN++;
    });
    return counts;
  }, [properties]);

  // Filter properties by campus
  const finalFiltered = useMemo(() => {
    return properties.filter((p) => matchesCampus(p, selectedCampus));
  }, [properties, selectedCampus]);

  // Pagination calculation
  const totalPages = Math.ceil(finalFiltered.length / ITEMS_PER_PAGE) || 1;
  const currentSafePage = Math.min(currentPage, totalPages);
  const startIndex = (currentSafePage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, finalFiltered.length);
  const paginatedProperties = finalFiltered.slice(startIndex, endIndex);

  const handleCampusChange = (campusKey: string) => {
    setSelectedCampus(campusKey);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className={styles.propertiesSection} ref={sectionRef}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Available Properties</h2>
          <p className={styles.sectionSub}>
            Properties supplied by {partnerName} that are currently verified and available on CampusTent.
          </p>
        </div>
        <span className={styles.propertyCountBadge}>
          <i className="fas fa-home"></i> {finalFiltered.length}{" "}
          {finalFiltered.length === 1 ? "Property" : "Properties"} Found
        </span>
      </div>

      {/* Campus Filter Bar */}
      <div className={styles.filterContainer}>
        <div className={styles.filterLabelRow}>
          <span className={styles.filterLabel}>
            <i className="fas fa-graduation-cap"></i> Select Campus:
          </span>
        </div>
        <div className={styles.campusTabList}>
          {CAMPUSES.map((c) => {
            const count = campusCounts[c.key] || 0;
            const isActive = selectedCampus === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => handleCampusChange(c.key)}
                className={`${styles.campusTabBtn} ${isActive ? styles.campusTabBtnActive : ""}`}
              >
                <span>{c.label}</span>
                <span className={`${styles.tabCountBadge} ${isActive ? styles.tabCountBadgeActive : ""}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Property Cards or Empty State */}
      {finalFiltered.length === 0 ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>
            <i className="fas fa-building-circle-exclamation"></i>
          </div>
          <h3 className={styles.emptyTitle}>
            No Properties Found in {selectedCampus === "ALL" ? "This Filter" : selectedCampus}
          </h3>
          <p className={styles.emptyText}>
            {selectedCampus === "DOU"
              ? `${partnerName} is actively adding hostel listings for Dennis Osadebay University (DOU). Inquire directly to get notified as soon as units open!`
              : `There are currently no matching properties listed under this selection. Try selecting another campus or contact ${partnerName} directly.`}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" }}>
            <button
              type="button"
              onClick={() => handleCampusChange("ALL")}
              className={styles.resetFilterBtn}
            >
              <i className="fas fa-rotate-left"></i> View All Properties ({properties.length})
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.propertyGrid}>
            {paginatedProperties.map((property) => {
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
                    <span
                      className={
                        property.isAvailable
                          ? styles.availBadge
                          : styles.unavailBadge
                      }
                    >
                      {property.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
                    </span>
                    {property.university && (
                      <span className={styles.campusBadge}>
                        {property.university}
                      </span>
                    )}
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
                      {property.rentAmount && property.rentAmount > 0 ? (
                        <span className={`${styles.feePill} ${styles.feePillRent}`}>
                          <i className="fas fa-home"></i> Rent: ₦{property.rentAmount.toLocaleString()}
                        </span>
                      ) : null}
                      {property.agentFee !== undefined && property.agentFee !== null ? (
                        <span className={`${styles.feePill} ${styles.feePillAgent}`}>
                          <i className="fas fa-user-tie"></i> Agent: ₦{property.agentFee.toLocaleString()}
                        </span>
                      ) : null}
                      {property.cautionFee && property.cautionFee > 0 ? (
                        <span className={styles.feePill}>
                          <i className="fas fa-shield-alt"></i> Caution: ₦{property.cautionFee.toLocaleString()}
                        </span>
                      ) : null}
                    </div>

                    <h4 className={styles.cardTitle}>{property.title}</h4>

                    <p className={styles.cardLocation}>
                      <i className="fas fa-location-dot"></i>
                      <span>
                        {property.location}
                        {property.distance ? ` (${property.distance})` : ""}
                      </span>
                    </p>

                    {/* Customized Partner Details Link */}
                    <Link
                      href={`/apartment-details?id=${property.id}&partner=${partnerSlug}`}
                      className={styles.cardBtn}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className={styles.paginationWrapper}>
              <div className={styles.paginationSummary}>
                Showing <strong>{startIndex + 1}</strong>–<strong>{endIndex}</strong> of{" "}
                <strong>{finalFiltered.length}</strong> properties
              </div>
              <div className={styles.paginationControls}>
                <button
                  type="button"
                  onClick={() => goToPage(currentSafePage - 1)}
                  disabled={currentSafePage === 1}
                  className={styles.pageBtnArrow}
                  aria-label="Previous Page"
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>

                <div className={styles.pageNumberList}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => goToPage(pageNum)}
                      className={`${styles.pageNumberBtn} ${
                        pageNum === currentSafePage ? styles.pageNumberBtnActive : ""
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goToPage(currentSafePage + 1)}
                  disabled={currentSafePage === totalPages}
                  className={styles.pageBtnArrow}
                  aria-label="Next Page"
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
