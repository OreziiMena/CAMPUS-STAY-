"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";

export default function TenantGuide() {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="guide-hero">
        <h1>Student <span>Tenant Guide</span></h1>
        <p>Your step-by-step handbook to safely finding, inspecting, and securing the best off-campus hostels near your university.</p>
      </section>

      {/* Main Guide Content */}
      <main className="guide-container">
        <div className="guide-grid">
          <div className="guide-main">
            <h2>The Campus Stay Tenant Journey</h2>
            
            <div className="guide-step-card">
              <div className="step-num">1</div>
              <div className="step-content">
                <h3>Browse & Filter Smartly</h3>
                <p>
                  Start by searching for listings near your specific institution. Use advanced search filters to narrow down properties based on hostel type (self-contain, flat, shared room), budget limits, and walk proximity from campus gates (e.g. under 5 minutes walk).
                </p>
              </div>
            </div>

            <div className="guide-step-card">
              <div className="step-num">2</div>
              <div className="step-content">
                <h3>Look for Verification Badges</h3>
                <p>
                  We verify agent/landlord identities using government statutory requirements. Prioritize listings that feature green verification checks, indicating that the host has submitted valid identity credentials and verified property ownership.
                </p>
              </div>
            </div>

            <div className="guide-step-card">
              <div className="step-num">3</div>
              <div className="step-content">
                <h3>Initiate Direct Inquiry</h3>
                <p>
                  Click "Chat on WhatsApp" on the property details page. Our platform immediately constructs a pre-filled listing inquiry message for you. Communicate directly with the host to ask questions, check details, and arrange a viewing schedule without broker fee markups.
                </p>
              </div>
            </div>

            <div className="guide-step-card">
              <div className="step-num">4</div>
              <div className="step-content">
                <h3>Physical Inspection & Sign-off</h3>
                <p>
                  Never make payments before carrying out a physical inspection. Walk around the compound, check utilities (electricity meter, running water, gate security), confirm lease lengths, and verify that a legitimate written tenancy agreement is signed by both parties.
                </p>
              </div>
            </div>
          </div>

          <div className="guide-sidebar">
            <div className="sidebar-box safety-box">
              <h4><i className="fas fa-shield-alt"></i> Safety Checklist</h4>
              <p>Follow these essential rules to guard against off-campus housing scams:</p>
              <ul>
                <li><i className="fas fa-check"></i> Inspect the actual room in person first.</li>
                <li><i className="fas fa-check"></i> Meet the agent/landlord in a public place.</li>
                <li><i className="fas fa-check"></i> Pay directly to verified bank accounts.</li>
                <li><i className="fas fa-check"></i> Request a valid payment receipt.</li>
              </ul>
            </div>

            <div className="sidebar-box">
              <h4><i className="fas fa-user-friends"></i> Split the Rent?</h4>
              <p>Off-campus flats can be split with roommate partners to save costs. Complete your student profile roommate preferences and find verified students on the platform to share rent.</p>
              <Link href="/auth/rolepick" className="start-btn guide-start-btn">Find Roommate Now</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
