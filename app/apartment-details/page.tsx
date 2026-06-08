"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import "./styles.css";
import "../globals.css";
import { getPropertyDetails, createInquiry } from "@/app/actions/properties";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  distance: string;
  description: string;
  amenities: string[];
  images: string[];
  agent: {
    name: string;
    role: string;
    phone: string;
  };
}

const mockProperties: Record<string, Property> = {
  "1": {
    id: "1",
    title: "Standard Self-Con near FUPRE Main Gate",
    price: "₦150,000",
    location: "FUPRE Road, Effurun",
    distance: "5 mins walk to campus",
    description: "A neat and well-maintained self-contained apartment located just 5 minutes walk from the FUPRE main gate. Perfect for single students who desire proximity to lectures, featuring a serene study environment, strong security, and constant water supply.",
    amenities: ["1 Bed", "1 Bath", "Prepaid Meter", "Borehole Water", "Fenced Gate", "Security Guard"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    agent: {
      name: "Precious Olise",
      role: "Verified Agent",
      phone: "+2349161863877"
    }
  },
  "2": {
    id: "2",
    title: "2-Bedroom Flat for Roommate Sharing",
    price: "₦250,000",
    location: "PTI Road Junction",
    distance: "10 mins walk to campus",
    description: "Spacious 2-bedroom flat ideal for roommate sharing. Located close to PTI Road Junction with easy transport access. Secure gated compound, large kitchen, clean bathrooms, and parking space. Highly recommended for students who wish to split rent.",
    amenities: ["2 Beds", "2 Baths", "Gated Compound", "Prepaid Meter", "Generator Space", "Water Running"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    agent: {
      name: "Campus Stay Official",
      role: "Premium Partner",
      phone: "+2349161863877"
    }
  },
  "3": {
    id: "3",
    title: "Single Room Off-Campus",
    price: "₦80,000",
    location: "Ugbomro Community",
    distance: "12 mins walk to campus",
    description: "Budget-friendly single room in Ugbomro Community. Suitable for students looking for low-cost off-campus housing. The environment is quiet and study-friendly. Shared bathroom facility and 24/7 borehole water access.",
    amenities: ["1 Bed", "Shared Bath", "Borehole Water", "Kitchen Space", "Prepaid Meter"],
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    agent: {
      name: "Abed Jason",
      role: "Verified Landlord",
      phone: "+2349161863877"
    }
  }
};

function ApartmentDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") || "1";

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const res = await getPropertyDetails(id);
      if (res.success && res.property) {
        const prop = res.property;
        setProperty({
          id: prop.id,
          title: prop.title,
          price: `₦${prop.price.toLocaleString()}`,
          location: prop.location,
          distance: prop.distance,
          description: prop.description,
          amenities: prop.amenities,
          images: prop.images,
          agent: {
            name: prop.agent.fullName,
            role: prop.agent.isVerified ? "Verified Agent" : "Agent/Landlord",
            phone: prop.agent.user.phone || "+2349161863877",
          }
        });
      } else {
        const mock = mockProperties[id] || mockProperties["1"];
        setProperty(mock);
      }
      setLoading(false);
    };
    fetchDetails();

    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    checkUser();
  }, [id]);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.refresh();
  };

  const handleWhatsAppClick = async () => {
    if (!property) return;
    await createInquiry({
      propertyId: property.id,
      message: `Hi, I am interested in your listing "${property.title}" on Campus Stay.`,
    });
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    if (property) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    if (property) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading || !property) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "Poppins" }}>
        Loading property details...
      </div>
    );
  }

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
          {user ? (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
                  <Link href={user.role === "AGENT" ? "/agent-dashboard/profile" : "/"} className="explore-dropdown-item">
                    <i className="fas fa-user" style={{ width: "16px" }}></i> Profile
                  </Link>
                  {user.role === "AGENT" && (
                    <Link href="/agent-dashboard" className="explore-dropdown-item">
                      <i className="fas fa-th-large" style={{ width: "16px" }}></i> Dashboard
                    </Link>
                  )}
                  <Link href={user.role === "AGENT" ? "/agent-dashboard/settings" : "/"} className="explore-dropdown-item">
                    <i className="fas fa-cog" style={{ width: "16px" }}></i> Settings
                  </Link>
                  <div className="explore-dropdown-divider"></div>
                  <button 
                    onClick={handleLogout} 
                    className="explore-dropdown-item logout-link" 
                  >
                    <i className="fas fa-sign-out-alt" style={{ width: "16px" }}></i> Log Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/auth/rolepick" className="start-btn">Get Started</Link>
          )}
        </div>
        <button className="mobilebtn" onClick={toggleMobileMenu}>
          <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </nav>

      <main className="property-details-layout" style={{ marginTop: "15vh" }}>
        <div className="main-info">
          <div className="property-image-container">
            <img 
              src={property.images[currentImageIndex] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
              className="property-main-image" 
              alt={property.title} 
            />
            {property.images.length > 1 && (
              <>
                <div className="image-counter">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
                <button className="carousel-control-prev" type="button" onClick={prevSlide}>
                  <i className="fas fa-chevron-left" style={{ color: "white" }}></i>
                </button>
                <button className="carousel-control-next" type="button" onClick={nextSlide}>
                  <i className="fas fa-chevron-right" style={{ color: "white" }}></i>
                </button>
              </>
            )}
          </div>
          
          <div className="info-card">
            <h1 className="listing-title">{property.title}</h1>

            <div className="meta-row">
              <span><i className="far fa-eye"></i> 124 views</span>
              <span><i className="fas fa-home"></i> Student Hostel</span>
              <span><i className="far fa-calendar-alt"></i> Listed recently</span>
            </div>

            <div className="location-row">
              <p><i className="fas fa-map-marker-alt"></i> <span>{property.location}</span></p>
              <p><i className="fas fa-walking"></i> {property.distance}</p>
            </div>

            <h2 className="listing-price">{property.price} <span>/ year</span></h2>

            <p className="desc-text">{property.description}</p>
          </div>

          <div className="info-card">
            <h3>Amenities</h3>
            <ul className="amenities-check-list">
              {property.amenities.map((amenity: string, i: number) => (
                <li key={i}>
                  <i className="fas fa-check-circle"></i> {amenity}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="property-sidebar">
          <div className="sidebar-card">
            <h4 className="card-heading">Listed by</h4>
            
            <div className="agent-profile">
              <div className="avatar-circle"><i className="fas fa-user"></i></div>
              <div className="agent-info">
                <h5>{property.agent.name} <i className="fas fa-check-circle verified-icon"></i></h5>
                <p className="agent-role">{property.agent.role}</p>
              </div>
            </div>

            <a 
              href={`https://wa.me/${property.agent.phone.replace(/[^0-9+]/g, "")}?text=Hi%20${encodeURIComponent(property.agent.name)},%20I%20am%20interested%20in%20your%20listing%20"${encodeURIComponent(property.title)}"%20on%20Campus%20Stay.`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="whatsapp-btn full-width"
              onClick={handleWhatsAppClick}
              style={{ display: "block", textAlign: "center", textDecoration: "none" }}
            >
              <i className="fab fa-whatsapp"></i> Chat on WhatsApp
            </a>
            <Link href="/explore" className="view-listings-link">View all listings &rarr;</Link>
          </div>

          <div className="sidebar-card">
            <h4 className="card-heading">Actions</h4>
            <div className="action-buttons">
              <button className="action-btn" onClick={() => alert("Link copied to clipboard!")}><i className="fas fa-share-alt"></i> Share</button>
              <button className="action-btn" onClick={() => alert("Listing reported. Thank you.")}><i className="far fa-flag"></i> Report</button>
            </div>
          </div>

          <div className="sidebar-card safety-card">
            <h4 className="safety-heading"><i className="fas fa-shield-alt"></i> Safety Tips</h4>
            <ul className="safety-list">
              <li><span>Never pay before inspecting the apartment.</span></li>
              <li><span>Always verify the agent's identity in person.</span></li>
              <li><span>Report suspicious listings immediately.</span></li>
              <li><span>Get a proper tenancy agreement.</span></li>
            </ul>
          </div>
        </aside>
      </main>

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

export default function ApartmentDetails() {
  return (
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "Poppins" }}>Loading...</div>}>
      <ApartmentDetailsContent />
    </Suspense>
  );
}
