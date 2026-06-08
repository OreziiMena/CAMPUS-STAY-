"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import "./styles.css";
import "../globals.css";

export default function SupportPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // FAQ accordion open index state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Ticket contact form state
  const [ticketName, setTicketName] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketStatus, setTicketStatus] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        setTicketName(currentUser.name || "");
        setTicketEmail(currentUser.email || "");
      }
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

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketLoading(true);
    setTicketStatus("");

    // Simulate API ticket creation call
    setTimeout(() => {
      setTicketStatus("Ticket submitted successfully! Our support team will reach out via email.");
      setTicketSubject("");
      setTicketMessage("");
      setTicketLoading(false);
      setTimeout(() => {
        setTicketStatus("");
      }, 5000);
    }, 1500);
  };

  const faqData = [
    {
      q: "How do I contact a property landlord or agent?",
      a: "You can reach out directly from the listing details page. Select a property, click 'Chat on WhatsApp', and it will compose a pre-filled inquiry. You can discuss rent details directly with the landlord without middleman fees."
    },
    {
      q: "Are the listed hostels vetted and verified?",
      a: "Yes. Campus Stay requires NIN uploads and identity verification from all registered agents. Verified landlords and listings display green verification badges to protect you against scams."
    },
    {
      q: "How do I list my property as an Agent?",
      a: "Simply click 'Get Started' and register as an Agent. Log in, complete your details, upload your NIN document in the profile panel, and click 'Add New Property' in your dashboard to submit listings."
    },
    {
      q: "What does the Proximity walking time mean?",
      a: "Every listing calculates the approximate walking time in minutes to the nearest campus gate. Filters help you query hostels under 5 minutes walk, 5-10 minutes, or over 10 minutes to suit your schedules."
    }
  ];

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
            <li><Link className="active" href="/support">Support</Link></li>
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

      {/* Hero Header */}
      <section className="support-hero">
        <h1>Help & <span>Support</span> Center</h1>
        <p>Frequently asked questions and direct contact support. We are here to help you secure comfortable campus stays.</p>
      </section>

      {/* Main Support Grid */}
      <section className="support-content">
        <div className="support-grid">
          {/* FAQ list */}
          <div>
            <h2 className="faq-section-title"><i className="fas fa-question-circle" style={{ color: "rgb(2, 53, 28)", marginRight: "10px" }}></i> Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqData.map((faq, i) => (
                <div key={i} className={`faq-item ${openFaqIndex === i ? "active" : ""}`}>
                  <button className="faq-question" onClick={() => toggleFaq(i)}>
                    {faq.q}
                    <i className="fas fa-chevron-down"></i>
                  </button>
                  <div className="faq-answer">
                    <div className="faq-answer-inner">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="form-card">
            <h3>Submit a Ticket</h3>
            <p>Send a message directly to our help desk and we will get back to you within 24 hours.</p>
            <form onSubmit={handleTicketSubmit} className="support-form">
              <div className="input-group">
                <label>Your Name</label>
                <input type="text" placeholder="Full Name" value={ticketName} onChange={(e) => setTicketName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" placeholder="name@email.com" value={ticketEmail} onChange={(e) => setTicketEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Subject</label>
                <input type="text" placeholder="How can we help?" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Message Detail</label>
                <textarea rows={4} placeholder="Write your question or request..." value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} required></textarea>
              </div>

              {ticketStatus && (
                <p style={{ color: "#28a745", fontFamily: "Poppins", fontSize: "14px", margin: "10px 0" }}>
                  {ticketStatus}
                </p>
              )}

              <button type="submit" className="primary-btn" disabled={ticketLoading}>
                {ticketLoading ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>

            <div className="quick-contact-card">
              <h4>Direct Channels</h4>
              <a href="mailto:support@campusstay.com" className="quick-contact-item">
                <i className="fas fa-envelope"></i> support@campusstay.com
              </a>
              <a href="https://wa.me/2349161863877?text=Hi%20Campus%20Stay%20Support,%20I%20need%20help" target="_blank" rel="noopener noreferrer" className="quick-contact-item">
                <i className="fab fa-whatsapp"></i> Chat on WhatsApp
              </a>
            </div>
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
