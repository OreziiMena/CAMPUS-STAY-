"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";

export default function Privacy() {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Hero Header */}
      <section className="static-hero">
        <h1>Privacy Policy</h1>
        <p>Last updated: April 2026</p>
      </section>

      {/* Main Content */}
      <main className="static-content-container">
        <div className="content-card">
          <section className="content-section">
            <h2>1. Introduction</h2>
            <p>Welcome to Campus Tent. We value your privacy and are committed to safeguarding your personal information while providing an accessible, transparent housing marketplace for students and agents.</p>
          </section>

          <section className="content-section">
            <h2>2. The Information We Collect</h2>
            <p>We collect information necessary to deliver our services, process inspection bookings, and protect against fraudulent activity.</p>

            <h3>A. Basic Account Details</h3>
            <p>When you register as a Student or Agent, we collect your name, email address, phone number, and account password.</p>

            <h3>B. Optional Agent Verification Data</h3>
            <p>To acquire the <em>Verified Agent Badge</em> and priority Explore ranking, agents may optionally provide verification credentials (such as video walkthroughs, utility/lease receipts, tenant references, BVN/Bank match, or identity documents). These credentials are used solely for authentication and safety scoring.</p>

            <h3>C. Inspection Payment & Transaction Data</h3>
            <p>When booking physical inspections, we record transaction identifiers, Paystack references, or bank transfer confirmations to manage the ₦7,500 inspection fee escrow (₦5,020 agent disbursement and ₦2,480 platform fee).</p>
          </section>

          <section className="content-section">
            <h2>3. How We Use Your Information</h2>
            <p>Your data is used strictly to:</p>
            <ul>
              <li>Tailor explore feeds to your university location.</li>
              <li>Connect students with hostel agents via real-time messaging and appointment scheduling.</li>
              <li>Disburse escrow payments accurately upon mutual inspection confirmation.</li>
              <li>Maintain platform integrity, prevent spam, and resolve disputes.</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>3. How We Use Your Information</h2>
            <p>Campus Tent uses the data we collect to operate, improve, and protect our platform. Specifically, your information allows us to:</p>
            <ul>
              <li><strong>Facilitate Connections:</strong> Enable students to seamlessly browse, save, and inquire about properties, and allow agents to manage and respond to these inquiries.</li>
              <li><strong>Maintain Platform Safety:</strong> Authenticate accounts, verify NINs and Student IDs, and actively monitor for fraudulent or suspicious activity.</li>
              <li><strong>Communicate with You:</strong> Send essential service updates, account notifications, password reset links, and responses to your support inquiries.</li>
              <li><strong>Improve User Experience:</strong> Analyze how our platform is used to fix bugs, design better features, and optimize the overall Campus Tent experience.</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>4. Sharing Your Information</h2>
            <p>We do not sell, rent, or trade your personal information to third parties. We only share your information in the following limited circumstances:</p>
            <ul>
              <li><strong>Between Students and Agents:</strong> When a student makes an inquiry on a property, we share necessary details (such as the student's name, university, and message) with the verified agent to facilitate communication.</li>
              <li><strong>Service Providers:</strong> We may share data with trusted third-party services that help us operate our platform (e.g., secure cloud hosting providers, database management, and email delivery services). These providers are legally obligated to protect your data.</li>
              <li><strong>Legal and Safety Requirements:</strong> We may disclose your information if required by Nigerian law, legal processes, or to protect the rights, property, and safety of Campus Tent, our users, or the public.</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>5. Security</h2>
            <p>We take the security of your personal information and verification documents seriously. Campus Tent implements industry-standard technical and organizational measures to protect your data.</p>
            
            <h3>A. Data Protection Measures</h3>
            <ul>
              <li><strong>Encryption:</strong> Sensitive data, including passwords and verification documents like your NIN or Student ID, are encrypted and stored securely within our database infrastructure.</li>
              <li><strong>Access Control:</strong> Strict access controls are in place to ensure that only authorized system administrators can access verification documents solely for the purpose of account approval.</li>
            </ul>

            <h3>B. Your Responsibilities</h3>
            <p>While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure. You are responsible for keeping your password confidential and for ensuring you log out of shared devices after using the Campus Tent platform.</p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
