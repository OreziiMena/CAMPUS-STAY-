"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProperties } from "@/app/actions/properties";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";

const fallbackProperties = [
  {
    id: "1",
    title: "Standard Self-Con near FUPRE Main Gate",
    price: 150000,
    location: "FUPRE Road, Effurun",
    distance: "5 mins walk to campus",
    isAvailable: true,
    amenities: ["1 Bed", "1 Bath", "Prepaid Meter"],
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]
  },
  {
    id: "2",
    title: "2-Bedroom Flat for Roommate Sharing",
    price: 250000,
    location: "PTI Road Junction",
    distance: "10 mins walk to campus",
    isAvailable: false,
    amenities: ["2 Beds", "2 Baths", "Gated Compound"],
    images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]
  },
  {
    id: "3",
    title: "Single Room Off-Campus",
    price: 80000,
    location: "Ugbomro Community",
    distance: "12 mins walk to campus",
    isAvailable: true,
    amenities: ["1 Bed", "Shared Bath", "Borehole Water"],
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]
  }
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Advanced Filters State
  const [university, setUniversity] = useState("All");
  const [hostelType, setHostelType] = useState("All");
  const [proximity, setProximity] = useState("Any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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
    });

    if (res.success && res.properties) {
      setProperties(res.properties);
    }
    setLoading(false);
  };

  // Dynamic filter watcher with a 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [university, hostelType, proximity, minPrice, maxPrice, searchQuery]);

  const handleClearFilters = () => {
    setUniversity("All");
    setHostelType("All");
    setProximity("Any");
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
  };

  const displayProperties = properties.length > 0 ? properties : fallbackProperties;

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
                  <select id="filter-uni" value={university} onChange={(e) => setUniversity(e.target.value)} className="filter-select-input">
                    <option value="All">All Universities</option>
                    <option value="FUPRE">Federal University of Petroleum Resources (FUPRE)</option>
                    <option value="DSUST">Delta State University of Science and Technology, Ozoro (DSUST)</option>
                    <option value="DOU">Dennis Osadebay University, Asaba (DOU)</option>
                    <option value="UNIDEL">University of Delta, Agbor (UNIDEL)</option>
                    <option value="WDU">Western Delta University, Oghara (WDU)</option>
                    <option value="NOVENA">Novena University, Ogume-Amai</option>
                    <option value="PTI">Petroleum Training Institute, Effurun (PTI)</option>
                    <option value="FEPO">Federal Polytechnic, Orogun</option>
                    <option value="DSPG">Delta State Polytechnic, Ogwashi-Uku (DSPG)</option>
                    <option value="DESPO">Delta State Polytechnic, Otefe-Oghara (DESPO)</option>
                    <option value="COE_WARRI">College of Education, Warri</option>
                    <option value="COE_MOSOGAR">Delta State College of Physical Education, Mosogar</option>
                  </select>
                </div>

                {/* Hostel Type Selection */}
                <div className="filter-select-col">
                  <label htmlFor="filter-type" className="filter-select-label">Type</label>
                  <select id="filter-type" value={hostelType} onChange={(e) => setHostelType(e.target.value)} className="filter-select-input">
                    <option value="All">All Types</option>
                    <option value="Self-Contain">Self-Contain</option>
                    <option value="Single Room">Single Room</option>
                    <option value="1-Bedroom Flat">1-Bedroom Flat</option>
                    <option value="2-Bedroom Flat">2-Bedroom Flat</option>
                    <option value="Shared Hostel Room">Shared Hostel Room</option>
                  </select>
                </div>

                {/* Walk Proximity Selection */}
                <div className="filter-select-col">
                  <label htmlFor="filter-proximity" className="filter-select-label">Proximity</label>
                  <select id="filter-proximity" value={proximity} onChange={(e) => setProximity(e.target.value)} className="filter-select-input">
                    <option value="Any">Any distance</option>
                    <option value="under_5">&lt; 5 mins walk</option>
                    <option value="5_10">5–10 mins walk</option>
                    <option value="over_10">&gt; 10 mins walk</option>
                  </select>
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
          <div className="property-grid">
            {displayProperties.map((property: any) => (
              <div key={property.id} className="property-card">
                <div className="card-img-wrapper">
                  <span className={`property-card-badge ${property.isAvailable ? "status-available" : "status-taken"}`}>
                    {property.isAvailable ? "Available" : "Taken"}
                  </span>
                  <img src={property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} alt={property.title} className="property-img" />
                </div>
                <div className="property-content">
                  <h3 className="property-price">₦{property.price.toLocaleString()} <span>/ year</span></h3>
                  <h4 className="property-title">{property.title}</h4>
                  <p className="property-location"><i className="fas fa-map-marker-alt"></i> {property.location}</p>

                  <div className="property-amenities">
                    {property.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                      <span key={idx}><i className="fas fa-check"></i> {amenity}</span>
                    ))}
                  </div>

                  <Link href={`/apartment-details?id=${property.id}`} className="view-btn">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
