"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import "./styles.css";
import "../globals.css";

export default function AboutPage() {
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
            <li><Link className="active" href="/about">About</Link></li>
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
      <section className="about-hero">
        <h1>Connecting Students to <span>Comfort</span></h1>
        <p>
          We bridge the gap between tertiary students and off-campus housing. Finding secure, close-to-campus accommodation has never been this simple, transparent, and quick.
        </p>
      </section>

      {/* Story & Pillars Section */}
      <section className="about-section">
        <div className="story-container">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              Campus Stay was born out of a common student struggle: the exhausting, stressful process of searching for off-campus hostels. We realized that students spent days walking around university towns, dealing with untrustworthy middle-men, and paying hidden fees.
            </p>
            <p>
              We envisioned a central platform where properties are verified, walking distances are computed honestly, and students can chat directly with vetted landlords without agents standing in the way.
            </p>
          </div>
          <div className="story-image-placeholder">
            <i className="fas fa-university"></i>
            <h4>Founded on Campuses</h4>
            <p>Built by students, for students, to bring convenience and transparency to off-campus stay search.</p>
          </div>
        </div>

        <div className="pillars-heading">
          <h2>Our Core Pillars</h2>
          <p>The values that guide how we help thousands of students find their perfect home.</p>
        </div>

        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon"><i className="fas fa-shield-alt"></i></div>
            <h3>Vetted Listings</h3>
            <p>We require NIN verification and document checks from all agents to eliminate accommodation scams.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon"><i className="fas fa-walking"></i></div>
            <h3>Proximity Focus</h3>
            <p>We calculate accurate walk times so you can choose a room that fits your lecture schedules.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon"><i className="fas fa-comments"></i></div>
            <h3>Direct Chat</h3>
            <p>Inquire and chat directly with property hosts on WhatsApp immediately without middleman fees.</p>
          </div>
        </div>

        {/* Stats Showcase Banner */}
        <div className="stats-banner">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Active Listings</p>
          </div>
          <div className="stat-item">
            <h3>300+</h3>
            <p>Students Housed</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Vetted Landlords</p>
          </div>
        </div>
      </section>

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
