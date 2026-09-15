"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";

export default function Terms() {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Hero Header */}
      <section className="static-hero">
        <h1>Terms of Service</h1>
        <p>Last updated: April 2026</p>
      </section>

      {/* Main Content */}
      <main className="static-content-container">
        <div className="content-card">
          <section className="content-section">
            <h2>1. Introduction</h2>
            <p>Welcome to Campus Tent. By accessing our platform, you agree to these Terms of Service. Campus Tent connects Nigerian university students with verified accommodation, hostels, roommates, and trusted property agents.</p>
          </section>

          <section className="content-section">
            <h2>2. User Accounts & Verification</h2>
            <p>Whether you register as a Student or an Agent/Landlord, you are responsible for maintaining the confidentiality of your account credentials.</p>
            <ul>
              <li><strong>Open Student Access:</strong> Mandatory student ID or admission letter uploads are not required to browse listings, explore tailored campus feeds, or book inspection viewings.</li>
              <li><strong>Agent Listings & Priority Verification:</strong> Agents and landlords may publish properties freely. To earn the <em>Verified Agent Badge</em> and top priority ranking on campus Explore feeds, agents may complete verification via government ID, live video walkthrough, utility bill/lease proof, student tenant vouching, BVN name match, or SUG/Landlords association endorsement.</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>3. Physical Inspection Fee Policy (₦7,500)</h2>
            <p>To prevent ghost visits, compensate agents for transit time, and protect students against property scams, Campus Tent operates an auditable inspection escrow service:</p>
            <ul>
              <li><strong>Inspection Fee Amount:</strong> The standard inspection fee is fixed at <strong>₦7,500</strong> per booking.</li>
              <li><strong>Multi-Hostel Bonus Value:</strong> Your ₦7,500 fee covers a physical inspection of the primary property plus any alternative available accommodation options shown by the agent in the same campus vicinity and budget.</li>
              <li><strong>Automated Agent Payout Split:</strong> Out of the ₦7,500 inspection fee, <strong>₦5,020</strong> is held in automated escrow and paid directly to the agent/landlord once both the student and agent confirm the inspection tour was completed. The remaining <strong>₦2,480</strong> is retained as the Campus Tent platform service fee.</li>
              <li><strong>Supported Payment Methods:</strong> Payments can be processed securely online via Paystack (Debit Cards, USSD, Bank Transfer) or through direct bank transfer to verified Campus Tent corporate accounts.</li>
              <li><strong>Refund Policy:</strong> Inspection fees are 100% refundable to the student if the agent fails to conduct the scheduled inspection or marks the property unavailable.</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>4. Property Listings & Accuracy</h2>
            <p>Listing hosts are required to represent properties truthfully. Submitting deceptive media, fraudulent rent figures, or bait-and-switch listings is strictly prohibited and subject to immediate account termination and escrow forfeiture.</p>
          </section>

          <section className="content-section">
            <h2>5. Limitation of Liability</h2>
            <p>Campus Tent provides discovery and escrow technology tools. Users are advised to inspect all accommodations during daylight hours and only pay annual tenancy rent after physical verification of tenancy contracts.</p>
          </section>

          <section className="content-section">
            <h2>6. Data Collection & Privacy</h2>
            <p>To provide a secure, reliable marketplace for the university community, Campus Tent collects basic contact details, listing data, and voluntary agent verification documents.</p>
            <ul>
              <li><strong>Personal Data:</strong> Name, email address, phone number, and optional profile data.</li>
              <li><strong>Voluntary Verification Documents:</strong> Documents voluntarily submitted by agents seeking verified badge status are securely stored and used strictly for identity authentication and anti-fraud monitoring.</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>7. Sharing Your Information</h2>
            <p>We do not sell, rent, or trade your personal information to third parties. Data is shared strictly between students and agents to facilitate accommodation tours and communications, or as required by law.</p>
          </section>

          <section className="content-section">
            <h2>8. Security & Dispute Resolution</h2>
            <p>All sensitive transactions and messages are encrypted. In the event of an inspection dispute, Campus Tent administrators review audit logs and payment references to issue immediate refunds or resolve discrepancies fairly.</p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
