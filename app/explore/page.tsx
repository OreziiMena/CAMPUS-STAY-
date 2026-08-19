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
  { code: "Single Room", name: "Single Room" },
  { code: "1-Bedroom Flat", name: "1-Bedroom Flat" },
  { code: "2-Bedroom Flat", name: "2-Bedroom Flat" },
  { code: "Shared Hostel Room", name: "Shared Hostel Room" }
];

const PROXIMITIES = [
  { code: "Any", name: "Any distance" },
  { code: "under_5", name: "< 5 mins walk" },
  { code: "5_10", name: "5–10 mins walk" },
  { code: "over_10", name: "> 10 mins walk" }
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
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastFilters, setLastFilters] = useState("");
  const LIMIT = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSafetyTip(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic filter watcher with a 300ms debounce
  useEffect(() => {
    const currentFiltersKey = JSON.stringify({ university, hostelType, proximity, minPrice, maxPrice, searchQuery });
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
        page: page,
        limit: LIMIT,
      });

      if (res.success && res.properties) {
        if (page === 1) {
          setProperties(res.properties);
        } else {
          setProperties((prev) => [...prev, ...res.properties]);
        }
        setHasMore(res.properties.length === LIMIT);
      }
      setLoading(false);
    };

    const timer = setTimeout(() => {
      fetchProperties(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [university, hostelType, proximity, minPrice, maxPrice, searchQuery, page, lastFilters]);

  const handleClearFilters = () => {
    setUniversity("All");
    setHostelType("All");
    setProximity("Any");
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
  };

  const hasActiveFilters = searchQuery !== "" || university !== "All" || hostelType !== "All" || proximity !== "Any" || minPrice !== "" || maxPrice !== "";
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
                {(searchQuery || university !== "All" || hostelType !== "All" || proximity !== "Any" || minPrice || maxPrice) && (
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
              <div className="no-properties-found" style={{ textAlign: "center", padding: "50px 20px", background: "white", borderRadius: "12px", width: "100%", border: "1px solid #eaeaea", fontFamily: "'Poppins', sans-serif" }}>
                <i className="fas fa-search" style={{ fontSize: "40px", color: "#ccc", marginBottom: "15px" }}></i>
                <h3 style={{ color: "rgb(2, 53, 28)", marginBottom: "10px" }}>
                  {hasActiveFilters ? "No properties found" : "No available properties"}
                </h3>
                <p style={{ color: "#666", fontSize: "15px" }}>
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
                    : (property.student ? `@${property.student.username}` : "Campus Stay Official");
                  const isVerified = property.agent 
                    ? property.agent.isVerified 
                    : (property.student ? property.student.isVerified : true);
                  const initial = property.agent 
                    ? property.agent.fullName.charAt(0) 
                    : (property.student ? (property.student.fullName?.charAt(0) || "S") : "C");

                  return (
                    <div key={property.id} className="property-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", background: "white", borderRadius: "16px", padding: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0", fontFamily: "'Poppins', sans-serif" }}>
                      <div>
                        {/* Owner Header on top */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 12px 0" }}>
                          <div style={{ 
                            width: "36px", 
                            height: "36px", 
                            borderRadius: "50%", 
                            backgroundColor: "#e8f0fe", 
                            color: "#1a73e8", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            fontSize: "0.85rem", 
                            fontWeight: "bold",
                            border: "1px solid rgba(26, 115, 232, 0.15)",
                            fontFamily: "'Poppins', sans-serif"
                          }}>
                            {initial.toUpperCase()}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#333", margin: 0, display: "flex", alignItems: "center", gap: "4px", fontFamily: "'Poppins', sans-serif" }}>
                              {ownerName}
                              {isVerified && (
                                <i className="fas fa-check-circle verified-icon" style={{ color: "#2e7d32", fontSize: "0.9rem", marginLeft: "4px" }} title="Verified Owner"></i>
                              )}
                            </h3>
                            <span style={{ fontSize: "0.75rem", color: "#666", fontFamily: "'Poppins', sans-serif" }}>
                              {property.agent ? "Agent / Landlord" : "Student Roommate"}
                            </span>
                          </div>
                          <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                            <span style={{ 
                              background: property.isAvailable ? "#e6f4ea" : "#fce8e6", 
                              color: property.isAvailable ? "#137333" : "#c5221f", 
                              padding: "2px 6px", 
                              borderRadius: "4px", 
                              fontSize: "0.65rem", 
                              fontWeight: "bold",
                              fontFamily: "'Poppins', sans-serif"
                            }}>
                              {property.isAvailable ? "AVAILABLE" : "TAKEN"}
                            </span>
                            {property.isRoommateOption && (
                              <span style={{ background: "#e8f0fe", color: "#1a73e8", padding: "2px 6px", borderRadius: "4px", fontSize: "0.65rem", fontWeight: "bold", fontFamily: "'Poppins', sans-serif" }}>
                                ROOMMATE
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Property Media in middle */}
                        <div style={{ position: "relative", width: "100%", height: "160px", borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
                          {(() => {
                            const mediaUrl = property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                            const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
                            return isVideo ? (
                              <video 
                                src={mediaUrl} 
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                muted 
                                loop 
                                playsInline 
                                autoPlay
                              />
                            ) : (
                              <img 
                                src={mediaUrl} 
                                alt={property.title} 
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                              />
                            );
                          })()}
                        </div>

                        {/* Price large and bold */}
                        <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#000", margin: "0 0 6px 0", fontFamily: "'Poppins', sans-serif" }}>
                          ₦{property.price.toLocaleString()} <span style={{ fontSize: "0.8rem", color: "#666", fontWeight: "normal", fontFamily: "'Poppins', sans-serif" }}>/ year</span>
                        </h3>

                        {/* Title */}
                        <p style={{ fontSize: "0.85rem", color: "#333", fontWeight: "600", margin: "0 0 8px 0", fontFamily: "'Poppins', sans-serif" }}>
                          {property.title}
                        </p>

                        {/* Location Pill */}
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", backgroundColor: "#f1f3f4", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", color: "#444", margin: "0 0 12px 0", fontFamily: "'Poppins', sans-serif" }}>
                          <i className="fas fa-map-marker-alt" style={{ color: "#7e6b01" }}></i>
                          <span>{property.location} ({property.distance})</span>
                        </div>
                        
                      </div>

                      <div>
                        <Link 
                          href={`/apartment-details?id=${property.id}`} 
                          className="view-btn"
                          style={{ 
                            display: "block", 
                            textAlign: "center", 
                            textDecoration: "none", 
                            padding: "10px", 
                            borderRadius: "8px", 
                            background: "#02351c", 
                            color: "white", 
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            fontFamily: "'Poppins', sans-serif"
                          }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {hasMore && properties.length > 0 && (
              <div style={{ display: "flex", justifyContent: "center", margin: "40px 0" }}>
                <button
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
                  style={{
                    padding: "12px 30px",
                    borderRadius: "30px",
                    backgroundColor: "white",
                    border: "2px solid rgb(2, 53, 28)",
                    color: "rgb(2, 53, 28)",
                    fontWeight: "700",
                    fontFamily: "'Poppins', sans-serif",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgb(2, 53, 28)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = "rgb(2, 53, 28)";
                  }}
                >
                  Load More Listings
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
                For your safety, always check for the <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", verticalAlign: "middle", margin: "0 2px" }}>
                  <i className="fas fa-certificate" style={{ color: "rgb(2, 53, 28)", fontSize: "1.1rem" }}></i>
                  <i className="fas fa-check" style={{ position: "absolute", color: "white", fontSize: "0.45rem" }}></i>
                </span> verification badge, it means the agent has completed ID verification.
              </p>
              <Link href="/student-dashboard/profile" className="safety-tip-link">
                Verify your account now for added trust.
              </Link>
            </div>

            <button 
              onClick={() => setShowSafetyTip(false)} 
              style={{ 
                position: "absolute", 
                top: "10px", 
                right: "10px", 
                border: "none", 
                background: "none", 
                cursor: "pointer", 
                color: "#888", 
                fontSize: "1rem" 
              }}
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
