"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProperties } from "@/app/actions/properties";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import "./styles.css";
import "../globals.css";

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
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Advanced Filters State
  const [university, setUniversity] = useState("All");
  const [hostelType, setHostelType] = useState("All");
  const [proximity, setProximity] = useState("Any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

  // 1. Initial User Session Check (runs once on mount)
  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    checkUser();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".explore-profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  // 2. Dynamic filter watcher with a 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [university, hostelType, proximity, minPrice, maxPrice, searchQuery]);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.refresh();
  };

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
    <nav className="sticky-top">
      <div className="brand">
        <img src="/Assets/CAMPUS STAY LOGO.png" alt="logo" className="logo" />
        <h2 className="logo-text">Campus Stay</h2>
      </div>
      <div className={`navlinks ${isMobileMenuOpen ? "active" : ""}`}>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link className="active" href="/explore">Explore</Link></li>
          <li><Link href="/support">Support</Link></li>
        </ul>
        <div className="btn-btn" style={{ alignItems: "center" }}>
          {user ? (
            <>

              {/* Profile Avatar Dropdown */}
              <div 
                className="explore-profile-dropdown" 
                onClick={(e) => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  e.stopPropagation();
                }}
              >
                <div className="explore-profile-info">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "Student")}&background=02351c&color=fff`} 
                    alt="Profile" 
                    className="explore-profile-pic" 
                  />
                  <span className="explore-profile-name" style={{ fontFamily: "Poppins, sans-serif" }}>
                   Hi, {user.name ? user.name.split(" ")[0] : "Student"}
                  </span>
                  <i className="fas fa-chevron-down" style={{ fontSize: "11px", color: "white", marginLeft: "2px" }}></i>
                </div>

                <div className={`explore-dropdown-menu ${isProfileDropdownOpen ? "active" : ""}`} onClick={(e) => e.stopPropagation()}>
                  <Link href="/" className="explore-dropdown-item">
                    <i className="fas fa-user" style={{ width: "16px" }}></i> Profile
                  </Link>
                  {user.role === "AGENT" && (
                    <Link href="/agent-dashboard" className="explore-dropdown-item">
                      <i className="fas fa-th-large" style={{ width: "16px" }}></i> Dashboard
                    </Link>
                  )}
                  <a href="#" className="explore-dropdown-item" onClick={(e) => e.preventDefault()}>
                    <i className="fas fa-cog" style={{ width: "16px" }}></i> Settings
                  </a>
                  <div className="explore-dropdown-divider"></div>
                  <button 
                    onClick={handleLogout} 
                    className="explore-dropdown-item logout-link" 
                  >
                    <i className="fas fa-sign-out-alt" style={{ width: "16px" }}></i> Log Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
             <div className="nav-auth-group">
                <Link href="/auth/rolepick" className="start-btn nav-btn">Sign up</Link>
                <Link href="/auth/login" className="start-btn nav-btn">Log in</Link>
             </div>
            </>
          )}
        </div>
      </div>
      <button className="mobilebtn" onClick={toggleMobileMenu}>
        <i className="fas fa-bars"></i>
      </button>
    </nav>

    <section className="hero">
        <div>
            <h1 className="hero-text">Explore Properties</h1>
             <p className="hero-para">Verified Apartment Near your University 
                <br /> We have a wide range of apartments for you to choose from </p>
            
            <div className="search-section-wrapper" style={{ maxWidth: "850px", margin: "30px auto 0", width: "100%", position: "relative", zIndex: 10 }}>
                 <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
                     
                     {/* Search Input Bar (High Visibility) */}
                     <div className="search-bar" style={{ display: "flex", flexWrap: "wrap", width: "100%", background: "#ffffff", borderRadius: "50px", padding: "6px 12px", border: "2px solid rgb(2, 53, 28)", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", alignItems: "center", minHeight: "60px" }}>
                         <i className="fas fa-search" style={{ color: "rgb(2, 53, 28)", marginLeft: "15px", marginRight: "5px", fontSize: "18px" }}></i>
                         
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
                           style={{ flex: 1, minWidth: "200px", padding: "14px 15px", border: "none", outline: "none", fontSize: "16px", background: "transparent", color: "#333", fontFamily: "Open Sans, sans-serif" }}
                         />
                         
                         {/* Clear button if search or filters active */}
                         {(searchQuery || university !== "All" || hostelType !== "All" || proximity !== "Any" || minPrice || maxPrice) && (
                           <button type="button" className="clear-filters-btn" onClick={handleClearFilters} style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "20px", color: "#475569", cursor: "pointer", padding: "8px 16px", fontSize: "13px", fontWeight: "600", marginRight: "5px", fontFamily: "Poppins, sans-serif", transition: "all 0.3s ease" }}>
                             Clear All
                           </button>
                         )}
                     </div>

                     {/* Horizontal Filters (Always Visible) */}
                     <div className="filters-horizontal-row" style={{ display: "flex", flexWrap: "wrap", gap: "15px", width: "100%", justifyContent: "space-between", background: "rgba(255, 255, 255, 0.98)", padding: "16px 20px", borderRadius: "16px", border: "1px solid rgba(2, 53, 28, 0.15)", boxShadow: "0 6px 20px rgba(0,0,0,0.05)" }}>
                                                {/* Campus Selection */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 150px" }}>
                              <label htmlFor="filter-uni" style={{ fontSize: "12px", fontWeight: "700", color: "rgb(2, 53, 28)", fontFamily: "Poppins, sans-serif", textAlign: "left" }}>Campus</label>
                              <select id="filter-uni" value={university} onChange={(e) => setUniversity(e.target.value)} style={{ padding: "10px 12px", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "Open Sans, sans-serif", width: "100%", cursor: "pointer" }}>
                                <option value="" disabled>Select your institution...</option>
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
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 150px" }}>
                              <label htmlFor="filter-type" style={{ fontSize: "12px", fontWeight: "700", color: "rgb(2, 53, 28)", fontFamily: "Poppins, sans-serif", textAlign: "left" }}>Type</label>
                              <select id="filter-type" value={hostelType} onChange={(e) => setHostelType(e.target.value)} style={{ padding: "10px 12px", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "Open Sans, sans-serif", width: "100%", cursor: "pointer" }}>
                                  <option value="All">All Types</option>
                                  <option value="Self-Contain">Self-Contain</option>
                                  <option value="Single Room">Single Room</option>
                                  <option value="1-Bedroom Flat">1-Bedroom Flat</option>
                                  <option value="2-Bedroom Flat">2-Bedroom Flat</option>
                                  <option value="Shared Hostel Room">Shared Hostel Room</option>
                              </select>
                          </div>

                          {/* Walk Proximity Selection */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 150px" }}>
                              <label htmlFor="filter-proximity" style={{ fontSize: "12px", fontWeight: "700", color: "rgb(2, 53, 28)", fontFamily: "Poppins, sans-serif", textAlign: "left" }}>Proximity</label>
                              <select id="filter-proximity" value={proximity} onChange={(e) => setProximity(e.target.value)} style={{ padding: "10px 12px", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "Open Sans, sans-serif", width: "100%", cursor: "pointer" }}>
                                  <option value="Any">Any distance</option>
                                  <option value="under_5">&lt; 5 mins walk</option>
                                  <option value="5_10">5–10 mins walk</option>
                                  <option value="over_10">&gt; 10 mins walk</option>
                              </select>
                          </div>      

                          {/* Price Range */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 200px" }}>
                              <label style={{ fontSize: "12px", fontWeight: "700", color: "rgb(2, 53, 28)", fontFamily: "Poppins, sans-serif", textAlign: "left" }}>Price Range (₦)</label>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <input 
                                    type="number" 
                                    placeholder="Min" 
                                    value={minPrice} 
                                    onChange={(e) => setMinPrice(e.target.value)} 
                                    aria-label="Min price"
                                    style={{ padding: "9px 10px", borderRadius: "8px", border: "1px solid #ccc", width: "100%", fontSize: "14px", background: "white", outline: "none", color: "#333", fontFamily: "Open Sans, sans-serif" }}
                                  />
                                  <span style={{ color: "#777", fontWeight: "bold" }}>-</span>
                                  <input 
                                    type="number" 
                                    placeholder="Max" 
                                    value={maxPrice} 
                                    onChange={(e) => setMaxPrice(e.target.value)} 
                                    aria-label="Max price"
                                    style={{ padding: "9px 10px", borderRadius: "8px", border: "1px solid #ccc", width: "100%", fontSize: "14px", background: "white", outline: "none", color: "#333", fontFamily: "Open Sans, sans-serif" }}
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
            <div style={{ textAlign: "center", padding: "80px", fontFamily: "Poppins", fontSize: "18px", color: "rgb(2, 53, 28)" }}>
               <i className="fas fa-spinner fa-spin" style={{ marginRight: "10px" }}></i> Loading Properties...
            </div>
        ) : (
            <div className="property-grid">
                {displayProperties.map((property: any) => (
                    <div key={property.id} className="property-card">
                        <div className="card-img-wrapper">
                            <span className={`badge ${property.isAvailable ? "status-available" : "status-taken"}`}>
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

    {/* Footer */}
    <footer className="main-footer">
        <div className="footer-grid">
            <div className="footer-brand">
                <img src="/Assets/CAMPUS STAY LOGO.png" alt="logo" className="footer-logo" />
                <p className="brand-tagline">Connecting Students with <br />Trusted Off-Campus Housing.</p>
            </div>

            <div className="footer-links">
                <h4>PLATFORM</h4>
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About Us</Link></li>
                    <li><Link href="/explore">Explore Properties</Link></li>
                    <li><Link href="/auth/rolepick">Find a Roommate</Link></li>
                    <li><Link href="/how-it-works">How it Works</Link></li>
                </ul>
            </div>

            <div className="footer-links">
                <h4>RESOURCES</h4>
                <ul>
                    <li><Link href="/support">Help Center / Support</Link></li>
                    <li><Link href="/tenant-guide">Tenant Guide</Link></li>
                    <li><Link href="/landlord-hub">Landlord Hub</Link></li>
                    <li><Link href="/blog">Blog</Link></li>
                    <li><Link href="/careers">Careers</Link></li>
                </ul>
            </div>

            <div className="footer-contact">
                <h4>CONNECT</h4>
                <ul>
                    <li><a href="mailto:support@campusstay.com"><i className="fa-solid fa-envelope"></i> support@campusstay.com</a></li>
                    <li><a href="https://wa.me/2349161863877?text=Hi%20Campus%20Stay%20Support,%20I%20need%20help" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i> Chat with Us</a></li>
                    <li><Link href="/terms">Terms of Service</Link></li>
                    <li><Link href="/privacy">Privacy Policy</Link></li>
                </ul>
            </div>
        </div>

        <div className="footer-bottom">
            <p>© 2024 Campus Stay. All rights reserved.</p>
        </div>
    </footer>
    </>
  );
}
