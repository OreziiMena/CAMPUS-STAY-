"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";

export default function LandlordHub() {
  return (
    <>

      <Navbar />

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
              <Link href="/auth/rolepick" className="start-btn guide-start-btn">Get Started Today</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
