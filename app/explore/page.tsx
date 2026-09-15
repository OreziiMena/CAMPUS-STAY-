"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProperties } from "@/app/actions/properties";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";
import { NIGERIAN_UNIVERSITIES } from "@/lib/universities";
import SearchableSelect from "@/components/SearchableSelect";

const HOSTEL_TYPES = [
  { code: "All", name: "All Types" },
  { code: "Self-Contain", name: "Self-Contain" },
  { code: "Bedsitter", name: "Bedsitter" },
  { code: "1-Bedroom Flat", name: "1-Bedroom Flat" },
  { code: "2-Bedroom Flat", name: "2-Bedroom Flat" },
];

const PROXIMITIES = [
  { code: "Any", name: "Any distance" },
  { code: "under_5", name: "< 5 mins walk" },
  { code: "5_10", name: "5–10 mins walk" },
  { code: "over_10", name: "> 10 mins walk" }
];

const AGENT_FEE_OPTIONS = [
  { code: "All", name: "All Agent Fees" },
  { code: "zero", name: "No Agent Fee (₦0)" },
  { code: "under_20k", name: "Under ₦20,000" },
  { code: "under_50k", name: "Under ₦50,000" },
  { code: "above_50k", name: "₦50,000+" },
];

const CAMPUS_OPTIONS = [
  { code: "All", name: "All Universities" },
  ...NIGERIAN_UNIVERSITIES
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSafetyTip, setShowSafetyTip] = useState(true);

  // Advanced Filters State
  const [university, setUniversity] = useState("All");
  const [hostelType, setHostelType] = useState("All");
  const [proximity, setProximity] = useState("Any");
  const [agentFee, setAgentFee] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [lastFilters, setLastFilters] = useState("");
  const LIMIT = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSafetyTip(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic filter watcher with a 300ms debounce
  useEffect(() => {
    const currentFiltersKey = JSON.stringify({ university, hostelType, proximity, agentFee, minPrice, maxPrice, searchQuery });
    if (lastFilters !== currentFiltersKey) {
      setLastFilters(currentFiltersKey);
      setPage(1);
      return;
    }

    const fetchProperties = async (query = "") => {
      setLoading(true);
      const parsedMinPrice = minPrice ? parseFloat(minPrice) : undefined;
      const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined;

      const res = await getProperties({
        searchQuery: query || undefined,
        university: university !== "All" ? university : undefined,
        hostelType: hostelType !== "All" ? hostelType : undefined,
        minPrice: parsedMinPrice,
        maxPrice: parsedMaxPrice,
        proximity: proximity !== "Any" ? proximity : undefined,
        agentFeeFilter: agentFee !== "All" ? agentFee : undefined,
        page: page,
        limit: LIMIT,
      });

      if (res.success && res.properties) {
        setProperties(res.properties);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.totalCount || 0);
      }
      setLoading(false);
    };

    const timer = setTimeout(() => {
      fetchProperties(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [university, hostelType, proximity, agentFee, minPrice, maxPrice, searchQuery, page, lastFilters]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const element = document.getElementById("explore-listings-section") || document.querySelector(".apartment-listings");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 350, behavior: "smooth" });
    }
  };

  const handleClearFilters = () => {
    setUniversity("All");
    setHostelType("All");
    setProximity("Any");
    setAgentFee("All");
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
  };

  const hasActiveFilters = searchQuery !== "" || university !== "All" || hostelType !== "All" || proximity !== "Any" || agentFee !== "All" || minPrice !== "" || maxPrice !== "";
  const displayProperties = properties;

  return (
    <>
      <Navbar />

      {/* Main Content Area */}
      <section className="hero">
        <div>
          <h1 className="hero-text">Explore Properties</h1>
          <p className="hero-para">
            Verified Apartment Near your University <br /> We have a wide range of apartments for you to choose from
          </p>

          <div className="search-section-wrapper">
            <form onSubmit={(e) => e.preventDefault()} className="search-form-layout">
              {/* Search Input Bar (High Visibility) */}
              <div className="search-bar-custom">
                <i className="fas fa-search search-bar-icon-custom"></i>

                {/* Active Filter Chips inside Search Bar */}
                {university !== "All" && (
                  <span className="filter-chip">
                    Campus: {university}
                    <button type="button" onClick={() => setUniversity("All")}>&times;</button>
                  </span>
                )}
                {hostelType !== "All" && (
                  <span className="filter-chip">
                    {hostelType}
                    <button type="button" onClick={() => setHostelType("All")}>&times;</button>
                  </span>
                )}
                {proximity !== "Any" && (
                  <span className="filter-chip">
                    Proximity: {proximity === "under_5" ? "< 5 mins" : proximity === "5_10" ? "5-10 mins" : "> 10 mins"}
                    <button type="button" onClick={() => setProximity("Any")}>&times;</button>
                  </span>
                )}
                {agentFee !== "All" && (
                  <span className="filter-chip">
                    Fee: {agentFee === "zero" ? "₦0 (No Fee)" : agentFee === "under_20k" ? "< ₦20k" : agentFee === "under_50k" ? "< ₦50k" : "₦50k+"}
                    <button type="button" onClick={() => setAgentFee("All")}>&times;</button>
                  </span>
                )}
                {minPrice !== "" && (
                  <span className="filter-chip">
                    Min: ₦{parseFloat(minPrice).toLocaleString()}
                    <button type="button" onClick={() => setMinPrice("")}>&times;</button>
                  </span>
                )}
                {maxPrice !== "" && (
                  <span className="filter-chip">
                    Max: ₦{parseFloat(maxPrice).toLocaleString()}
                    <button type="button" onClick={() => setMaxPrice("")}>&times;</button>
                  </span>
                )}

                <input 
                  type="text" 
                  placeholder="Search by university, title, or location..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input-field-custom"
                />

                {/* Clear button if search or filters active */}
                {(searchQuery || university !== "All" || hostelType !== "All" || proximity !== "Any" || agentFee !== "All" || minPrice || maxPrice) && (
                  <button type="button" className="clear-filters-btn-custom" onClick={handleClearFilters}>
                    Clear All
                  </button>
                )}
              </div>

              {/* Horizontal Filters (Always Visible) */}
              <div className="filters-horizontal-row">
                {/* Campus Selection */}
                <div className="filter-select-col">
                  <label htmlFor="filter-uni" className="filter-select-label">Campus</label>
                  <SearchableSelect
                    options={CAMPUS_OPTIONS}
                    value={university}
                    onChange={(val) => setUniversity(val)}
                  />
                </div>

                {/* Hostel Type Selection */}
                <div className="filter-select-col">
                  <label htmlFor="filter-type" className="filter-select-label">Type</label>
                  <SearchableSelect
                    options={HOSTEL_TYPES}
                    value={hostelType}
                    onChange={(val) => setHostelType(val)}
                  />
                </div>

                {/* Walk Proximity Selection */}
                <div className="filter-select-col">
                  <label htmlFor="filter-proximity" className="filter-select-label">Proximity</label>
                  <SearchableSelect
                    options={PROXIMITIES}
                    value={proximity}
                    onChange={(val) => setProximity(val)}
                  />
                </div>

                {/* Agent Fee Selection */}
                <div className="filter-select-col">
                  <label htmlFor="filter-agent-fee" className="filter-select-label">Agent Fee</label>
                  <SearchableSelect
                    options={AGENT_FEE_OPTIONS}
                    value={agentFee}
                    onChange={(val) => setAgentFee(val)}
                  />
                </div>

                {/* Price Range */}
                <div className="filter-price-col">
                  <label className="filter-select-label">Price Range (₦)</label>
                  <div className="filter-price-inputs-wrapper">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(e.target.value)} 
                      aria-label="Min price"
                      className="filter-price-input"
                    />
                    <span className="filter-price-separator">-</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)} 
                      aria-label="Max price"
                      className="filter-price-input"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="trust-badges">
            <div className="glass-badge">
              <i className="fa-solid fa-circle-check"></i>
              <span>Verified Listings</span>
            </div>

            <div className="glass-badge">
              <i className="fa-solid fa-location-dot"></i>
              <span>Close to Campus</span>
            </div>

            <div className="glass-badge">
              <i className="fa-solid fa-graduation-cap"></i>
              <span>Students Only</span>
            </div>
          </div>
        </div>
      </section>

      <section className="properties-container">
        {loading ? (
          <div className="properties-loading-screen">
            <i className="fas fa-spinner fa-spin"></i> Loading Properties...
          </div>
        ) : (
          <>
            {displayProperties.length === 0 ? (
              <div className="no-properties-found explore-no-properties-box">
                <i className="fas fa-search explore-no-properties-icon"></i>
                <h3 className="explore-no-properties-title">
                  {hasActiveFilters ? "No properties found" : "No available properties"}
                </h3>
                <p className="explore-no-properties-text">
                  {hasActiveFilters 
                    ? "We couldn't find any hostels matching your criteria. Try widening your filters or clearing your search." 
                    : "There are currently no hostels listed on the platform. Please check back later!"}
                </p>
              </div>
            ) : (
              <div className="property-grid">
                {displayProperties.map((property: any) => {
                  const ownerName = property.agent 
                    ? property.agent.fullName 
                    : (property.student ? `@${property.student.username}` : "Campus Tent Official");
                  const isVerified = property.agent 
                    ? property.agent.isVerified 
                    : (property.student ? property.student.isVerified : true);
                  const initial = property.agent 
                    ? property.agent.fullName.charAt(0) 
                    : (property.student ? (property.student.fullName?.charAt(0) || "S") : "C");

                  return (
                    <div key={property.id} className="property-card explore-card-custom">
                      <div>
                        {/* Owner Header on top */}
                        <div className="explore-owner-header">
                          <div className="explore-owner-avatar">
                            {initial.toUpperCase()}
                          </div>
                          <div className="explore-owner-details">
                            <h3 className="explore-owner-name">
                              {ownerName}
                              {isVerified && (
                                <i className="fas fa-check-circle verified-icon explore-owner-verified-icon" title="Verified Owner"></i>
                              )}
                            </h3>
                            <span className="explore-owner-type">
                              {property.agent ? "Agent / Landlord" : "Student Roommate"}
                            </span>
                          </div>
                          <div className="explore-badges-col">
                            <span className={`explore-availability-badge ${property.isAvailable ? "available" : "taken"}`}>
                              {property.isAvailable ? "AVAILABLE" : "TAKEN"}
                            </span>
                            {property.isRoommateOption && (
                              <span className="explore-roommate-badge">
                                ROOMMATE
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Property Media in middle */}
                        <div className="explore-media-container">
                          {(() => {
                            const videoUrl = property.images?.find((img: string) => img.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i));
                            const posterUrl = property.images?.find((img: string) => !img.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i));
                            const defaultImg = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

                            return videoUrl ? (
                              <>
                                <video 
                                  ref={(el) => {
                                    if (el) {
                                      el.muted = true;
                                      el.defaultMuted = true;
                                      el.play().catch(() => {});
                                    }
                                  }}
                                  src={videoUrl} 
                                  poster={posterUrl}
                                  className="explore-media-element" 
                                  muted 
                                  loop 
                                  playsInline 
                                  autoPlay
                                  preload="auto"
                                />
                                <div className="explore-video-tour-badge">
                                  <i className="fas fa-play explore-video-play-icon"></i> Video Tour
                                </div>
                              </>
                            ) : (
                              <img 
                                src={posterUrl || property.images?.[0] || defaultImg} 
                                alt={property.title} 
                                className="explore-media-element" 
                              />
                            );
                          })()}
                        </div>

                        {/* Price large and bold + Negotiable badge */}
                        <div className="explore-price-row">
                          <h3 className="explore-price-value">
                            ₦{property.price.toLocaleString()} <span className="explore-price-period">/ year</span>
                          </h3>
                          {property.isNegotiable && (
                            <span className="explore-negotiable-badge">
                              <i className="fas fa-handshake"></i> Fee Negotiable
                            </span>
                          )}
                        </div>

                        {/* Agent Fee & Pricing Breakdown Badges */}
                        <div className="explore-fees-row">
                          {property.agentFee && property.agentFee > 0 ? (
                            <span className="explore-agent-fee-badge">
                              <i className="fas fa-user-tie explore-fee-icon"></i>
                              Agent Fee: ₦{property.agentFee.toLocaleString()}
                            </span>
                          ) : (
                            <span className="explore-zero-agent-fee-badge">
                              <i className="fas fa-tag explore-fee-icon"></i>
                              0% Agent Fee (Direct Host)
                            </span>
                          )}
                          {property.cautionFee && property.cautionFee > 0 ? (
                            <span className="explore-caution-fee-badge">
                              Caution: ₦{property.cautionFee.toLocaleString()}
                            </span>
                          ) : null}
                        </div>

                        {/* Title */}
                        <p className="explore-property-title-text">
                          {property.title}
                        </p>

                        {/* Location Pill */}
                        <div className="explore-location-pill">
                          <i className="fas fa-map-marker-alt explore-map-icon"></i>
                          <span>{property.location} ({property.distance})</span>
                        </div>
                        
                      </div>

                      <div>
                        <Link 
                          href={`/apartment-details?id=${property.id}`} 
                          className="view-btn explore-view-details-btn"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && properties.length > 0 && (
              <div className="explore-pagination-wrapper">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(page - 1, 1))}
                  disabled={page === 1}
                  className="explore-page-nav-btn"
                >
                  <i className="fas fa-chevron-left explore-page-nav-icon"></i> Prev
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isActive = p === page;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(p)}
                      className={`explore-page-num-btn ${isActive ? "active" : ""}`}
                    >
                      {p}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                  disabled={page === totalPages}
                  className="explore-page-nav-btn"
                >
                  Next <i className="fas fa-chevron-right explore-page-nav-icon"></i>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {showSafetyTip && (
        <>
          <style>{`
            .safety-tip-card {
              position: fixed;
              bottom: 24px;
              right: 24px;
              width: calc(100% - 48px);
              max-width: 380px;
              background-color: white;
              border: 1.5px solid #d4edda;
              border-radius: 16px;
              padding: 20px;
              box-shadow: 0 8px 30px rgba(0,0,0,0.12);
              z-index: 1000;
              display: flex;
              gap: 16px;
              font-family: 'Poppins', sans-serif;
            }
            .safety-tip-icon-container {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }
            .safety-tip-icon-bg {
              position: relative;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background-color: #e8f7f5;
            }
            .safety-tip-icon-cert {
              color: rgb(2, 53, 28);
              font-size: 2.2rem;
            }
            .safety-tip-icon-check {
              position: absolute;
              color: white;
              font-size: 0.9rem;
            }
            .safety-tip-content {
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            .safety-tip-title {
              margin: 0;
              font-size: 0.95rem;
              font-weight: bold;
              color: #1a1a1a;
            }
            .safety-tip-text {
              margin: 0;
              font-size: 0.8rem;
              color: #555;
              line-height: 1.4;
            }
            .safety-tip-link {
              margin: 4px 0 0 0;
              font-size: 0.85rem;
              font-weight: bold;
              color: rgb(2, 53, 28);
              text-decoration: none;
            }
            
            @media (max-width: 576px) {
              .safety-tip-card {
                bottom: 12px;
                right: 12px;
                width: calc(100% - 24px);
                max-width: 300px;
                padding: 12px;
                gap: 10px;
                border-radius: 12px;
              }
              .safety-tip-icon-bg {
                width: 36px;
                height: 36px;
              }
              .safety-tip-icon-cert {
                font-size: 1.6rem;
              }
              .safety-tip-icon-check {
                font-size: 0.65rem;
              }
              .safety-tip-content {
                gap: 3px;
              }
              .safety-tip-title {
                font-size: 0.85rem;
              }
              .safety-tip-text {
                font-size: 0.72rem;
              }
              .safety-tip-link {
                font-size: 0.75rem;
                margin-top: 2px;
              }
            }
          `}</style>
          <div className="safety-tip-card">
            <div className="safety-tip-icon-container">
              <div className="safety-tip-icon-bg">
                <i className="fas fa-certificate safety-tip-icon-cert"></i>
                <i className="fas fa-check safety-tip-icon-check"></i>
              </div>
            </div>
            
            <div className="safety-tip-content">
              <h4 className="safety-tip-title">Safety Tip</h4>
              <p className="safety-tip-text">
                For your safety, always check for the <span className="explore-safety-badge-wrap">
                  <i className="fas fa-certificate explore-safety-cert-icon"></i>
                  <i className="fas fa-check explore-safety-check-icon"></i>
                </span> verification badge, it means the agent has completed ID verification.
              </p>
              <Link href="/student-dashboard/profile" className="safety-tip-link">
                Verify your account now for added trust.
              </Link>
            </div>

            <button 
              onClick={() => setShowSafetyTip(false)} 
              className="explore-safety-close-btn"
            >
              &times;
            </button>
          </div>
        </>
      )}

      <Footer />
    </>
  );
}
