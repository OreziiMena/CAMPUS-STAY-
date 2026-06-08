"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/app/actions/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CampusStayLanding() {
  const [stats, setStats] = useState({ properties: 0, customers: 0, collaborations: 0 });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    checkUser();

    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setStats({
        properties: Math.floor((500 / steps) * step),
        customers: Math.floor((300 / steps) * step),
        collaborations: Math.floor((50 / steps) * step)
      });
      if (step >= steps) {
        clearInterval(timer);
        setStats({ properties: 500, customers: 300, collaborations: 50 });
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* First Section */}
      <section className="hero">
        <div>
          <h1 className="hero-text">Find The Best <br /><span>Apartment</span> For You</h1>
          <p className="hero-para">
            We are here to help you find the best apartment for you. <br /> 
            We have a wide range of apartments for you to choose from.
          </p>
          <Link href="/explore">
            <button className="hero-btn">Explore Now</button>
          </Link>
        </div>
      </section>

      {/* Second Section */}
      <section className="second-hero">
        <div>
          <h2 className="section-text">We Find The Perfect House <br />And Roomates For You</h2>
        </div>
        <div>
          <p className="section-text2">
            Navigating off-campus living just got easier. Whether you want to secure <br /> 
            a comfortable apartment that fits your budget or match with verified <br /> 
            students to share the rent, we've got you covered. <br /> 
            Choose your path below.
          </p>
          <div className="cta-buttons">
            <Link href={user ? (user.role === "AGENT" ? "/agent-dashboard" : "/explore") : "/auth/rolepick"}>
              <button className="btn primary-btn">Rent a House <i className="fas fa-arrow-right"></i></button>
            </Link>
            <Link href={user ? (user.role === "AGENT" ? "/agent-dashboard" : "/explore") : "/auth/rolepick"}>
              <button className="btn secondary-btn">Find a Roommate <i className="fas fa-arrow-right"></i></button>
            </Link>
          </div>
        </div>
      </section>

      {/* Third Section */}
      <section className="third-hero">
        <div className="stat-group">
          <div className="number-wrapper">
            <div className="counter">{stats.properties}</div>
            <span className="plus-sign">+</span>
          </div>
          <p className="hero-ptextt">Listed Properties</p>
        </div>

        <div className="stat-group">
          <div className="number-wrapper">
            <div className="counter">{stats.customers}</div>
            <span className="plus-sign">+</span>
          </div>
          <p className="hero-ptextt">Happy Customers</p>
        </div>

        <div className="stat-group">
          <div className="number-wrapper">
            <div className="counter">{stats.collaborations}</div>
            <span className="plus-sign">+</span>
          </div>
          <p className="hero-ptextt">Collaborations</p>
        </div>
      </section>

      {/* Fourth Section */}
      <section className="features-section">
        <h2 className="section-title">Why Students Love Campus Stay</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-box">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <h3>Smart Proximity</h3>
            <p>Find apartments sorted by their exact distance from the campus gates.</p>
          </div>

          <div className="feature-card">
            <div className="icon-box">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3>Verified Landlords</h3>
            <p>Every property and agent is vetted to ensure a safe environment for students.</p>
          </div>

          <div className="feature-card">
            <div className="icon-box">
              <i className="fa-solid fa-user-group"></i>
            </div>
            <h3>Roommate Matching</h3>
            <p>Connect with fellow students to split rent and find the perfect housemate.</p>
          </div>

          <div className="feature-card">
            <div className="icon-box">
              <i className="fa-solid fa-comments"></i>
            </div>
            <h3>Direct Scheduling</h3>
            <p>Instantly message landlords or agents to schedule a property viewing.</p>
          </div>
        </div>
      </section>

      {/* Fifth Section */}
      <section className="faq-section">
        <div className="faq-left">
          <h2>General FAQs</h2>
          <p>Everything you need to know about Campus Stay and how it works. Can't find an answer? <Link href="/support">Chat to our team.</Link></p>
        </div>

        <div className="faq-right">
          <details className="faq-item" open>
            <summary>
              Is Campus Stay free for students?
              <span className="icon-box"><i className="fa-solid fa-chevron-down arrow-icon"></i></span>
            </summary>
            <div className="faq-content">
              <p>Yes, browsing apartments and contacting landlords on Campus Stay is completely free. You only pay the rent and any associated agency fees directly to the verified landlord or agent.</p>
            </div>
          </details>

          <details className="faq-item">
            <summary>
              Are the landlords and apartments verified?
              <span className="icon-box"><i className="fa-solid fa-chevron-down arrow-icon"></i></span>
            </summary>
            <div className="faq-content">
              <p>Absolutely. Student safety is our top priority. Every landlord and property listed on our platform goes through a strict verification process before their listing goes live.</p>
            </div>
          </details>

          <details className="faq-item">
            <summary>
              Can I find a roommate through this platform?
              <span className="icon-box"><i className="fa-solid fa-chevron-down arrow-icon"></i></span>
            </summary>
            <div className="faq-content">
              <p>Yes! We have a built-in roommate matching feature that connects you with fellow students looking to split rent, based on lifestyle and budget preferences.</p>
            </div>
          </details>

          <details className="faq-item">
            <summary>
              How do I schedule an apartment viewing?
              <span className="icon-box"><i className="fa-solid fa-chevron-down arrow-icon"></i></span>
            </summary>
            <div className="faq-content">
              <p>Once you find a place you like, you can use our direct messaging feature to contact the landlord or agent instantly and set up a convenient time for a physical viewing.</p>
            </div>
          </details>
        </div>
      </section>

      {/* Sixth Section */}
      <section className="landlord-cta">
        <div className="cta-container">
          <div className="cta-info">
            <span className="highlight-label">LANDLORDS & AGENTS</span>
            <h2 className="cta-header">Got a property <br />near campus?</h2>
            <p className="cta-description">List your student apartment for free on Campus Stay and connect directly with thousands of verified student tenants actively searching for housing.</p>
            <ul className="feature-list">
              <li><i className="fa-solid fa-check feature-icon"></i> Free limited property listings</li>
              <li><i className="fa-solid fa-check feature-icon"></i> Feature and highlight your property highlights</li>
              <li><i className="fa-solid fa-check feature-icon"></i> Manage direct tenant inquiries and requests</li>
              <li><i className="fa-solid fa-check feature-icon"></i> Comprehensive property analytics dashboard</li>
            </ul>
          </div>
          <div className="cta-action">
            <Link href={user ? (user.role === "AGENT" ? "/agent-dashboard/add-property" : "/explore") : "/auth/rolepick"} className="primary-btn landlord-btn">List Property For Free →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}