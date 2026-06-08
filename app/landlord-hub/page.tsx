"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import "./styles.css";
import "../globals.css";

export default function LandlordHub() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    checkUser();
  }, []);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.refresh();
  };

  return (
    <>
      {/* Navigation */}
      <nav className="sticky-top">
        <div className="brand">
          <Image 
            src="/Assets/CAMPUS STAY LOGO.png" 
            alt="logo" 
            width={50} 
            height={50} 
            className="logo" 
            style={{ width: "auto", height: "auto" }}
          />
          <h2 className="logo-text">Campus Stay</h2>
        </div>
        
        <div className={`navlinks ${isMobileMenuOpen ? "active" : ""}`}>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/explore">Explore</Link></li>
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
                    {user.name ? user.name.split(" ")[0] : "Student"}
                  </span>
                  <i className="fas fa-chevron-down" style={{ fontSize: "11px", color: "white", marginLeft: "2px" }}></i>
                </div>

                <div className={`explore-dropdown-menu ${isProfileDropdownOpen ? "active" : ""}`} onClick={(e) => e.stopPropagation()}>
                  <Link href={user.role === "AGENT" ? "/agent-dashboard/profile" : "/"} className="explore-dropdown-item">
                    <i className="fas fa-user" style={{ width: "16px" }}></i> PROFILE
                  </Link>
                  {user.role === "AGENT" && (
                    <Link href="/agent-dashboard" className="explore-dropdown-item">
                      <i className="fas fa-th-large" style={{ width: "16px" }}></i> DASHBOARD
                    </Link>
                  )}
                  <Link href={user.role === "AGENT" ? "/agent-dashboard/settings" : "/"} className="explore-dropdown-item">
                    <i className="fas fa-cog" style={{ width: "16px" }}></i> SETTINGS
                  </Link>
                  <div className="explore-dropdown-divider"></div>
                  <button 
                    onClick={handleLogout} 
                    className="explore-dropdown-item logout-link" 
                  >
                    <i className="fas fa-sign-out-alt" style={{ width: "16px" }}></i> LOG OUT
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

      {/* Hero Section */}
      <section className="guide-hero">
        <h1>Host & Landlord <span>Hub</span></h1>
        <p>List your property, complete profile identity verification, and connect directly with thousands of student tenants.</p>
      </section>

      {/* Main Content Grid */}
      <main className="guide-container">
        <div className="guide-grid">
          <div className="guide-main">
            <h2>The Agent & Landlord Journey</h2>
            
            <div className="guide-step-card">
              <div className="step-num">1</div>
              <div className="step-content">
                <h3>Register as an Agent</h3>
                <p>
                  Set up your partner account. Choose the Agent role during signup, enter your contact phone details, and set up your secure password to access your customized Agent Dashboard panel.
                </p>
              </div>
            </div>

            <div className="guide-step-card">
              <div className="step-num">2</div>
              <div className="step-content">
                <h3>Submit Verification Documents</h3>
                <p>
                  Go to your profile settings page. Complete your business info, upload statutory government identity documents (NIN verification), and wait for system validation. Accounts displaying green verification badges receive up to 3x higher inquiries.
                </p>
              </div>
            </div>

            <div className="guide-step-card">
              <div className="step-num">3</div>
              <div className="step-content">
                <h3>Create Property Listings</h3>
                <p>
                  Click "Add New Property" inside your dashboard. Upload high-quality listing images, set budgets/pricing details, choose the target campus, define amenities, and write detailed descriptions.
                </p>
              </div>
            </div>

            <div className="guide-step-card">
              <div className="step-num">4</div>
              <div className="step-content">
                <h3>Track Live Analytics</h3>
                <p>
                  Check the performance of your listings dynamically. Monitor overall view clickcounts, student inquiry volumes, university demographics, and conversion trends in real-time inside your Analytics Dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="guide-sidebar">
            <div className="sidebar-box safety-box">
              <h4><i className="fas fa-check-circle"></i> Verification Benefits</h4>
              <p>Why verify your host credentials with Campus Stay?</p>
              <ul>
                <li><i className="fas fa-check"></i> Displays a green trust badge on listings.</li>
                <li><i className="fas fa-check"></i> Listings rank higher in search filters.</li>
                <li><i className="fas fa-check"></i> Instills confidence in student tenants.</li>
                <li><i className="fas fa-check"></i> Qualifies your properties for premium placements.</li>
              </ul>
            </div>

            <div className="sidebar-box">
              <h4><i className="fas fa-plus"></i> List Your Hostel</h4>
              <p>Ready to put your properties in front of thousands of active university students? Sign in or register now to publish listings.</p>
              <Link href="/auth/rolepick" className="start-btn" style={{ display: "inline-block", width: "100%", textAlign: "center", padding: "10px 0", textDecoration: "none" }}>Get Started Today</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image 
              src="/Assets/CAMPUS STAY LOGO.png" 
              alt="logo" 
              width={150} 
              height={50} 
              className="footer-logo" 
              style={{ width: "auto", height: "auto" }}
            />
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
