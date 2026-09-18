"use client";
import React, { useState, useEffect } from "react";
import { getCurrentUser } from "@/app/actions/auth";
import { submitSupportTicket } from "@/app/actions/support";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";

type FaqCategory = "ALL" | "INSPECTIONS" | "PAYMENTS" | "ROOMMATES" | "AGENTS" | "SAFETY";

interface FaqItem {
  q: string;
  a: string;
  category: FaqCategory;
  categoryLabel: string;
}

export default function SupportPage() {
  // FAQ accordion open index state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>("ALL");

  // Ticket contact form state
  const [ticketName, setTicketName] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketFeedback, setTicketFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setTicketName(currentUser.name || "");
        setTicketEmail(currentUser.email || "");
      }
    };
    checkUser();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketLoading(true);
    setTicketFeedback(null);

    try {
      const res = await submitSupportTicket({
        name: ticketName,
        email: ticketEmail,
        subject: ticketSubject,
        message: ticketMessage,
      });

      if (res.success) {
        setTicketFeedback({
          type: "success",
          message: res.message || "Ticket submitted successfully! We have emailed you a confirmation receipt.",
        });
        setTicketSubject("");
        setTicketMessage("");
      } else {
        setTicketFeedback({
          type: "error",
          message: res.error || "Failed to submit ticket. Please check your details or email support directly.",
        });
      }
    } catch {
      setTicketFeedback({
        type: "error",
        message: "An unexpected error occurred. Please email support@campustent.com directly.",
      });
    } finally {
      setTicketLoading(false);
    }
  };

  const faqData: FaqItem[] = [
    {
      category: "INSPECTIONS",
      categoryLabel: "Availability & Tours",
      q: "What is the 24-Hour Availability Check and how does it work?",
      a: "Before booking or paying for an inspection, you initiate a free Availability Check. We immediately notify the verified agent or landlord with a 24-hour verification token. If the agent confirms the hostel room is vacant, you receive an email and notification unlocking the physical inspection booking. If the agent does not respond within 24 hours, the request automatically expires so you never pay for a taken room."
    },
    {
      category: "INSPECTIONS",
      categoryLabel: "Availability & Tours",
      q: "What does the ₦7,500 inspection fee cover?",
      a: "The ₦7,500 inspection fee guarantees a scheduled physical tour of your chosen hostel AND covers tours of any alternative accommodation units the agent manages within that same area and price bracket. Additionally, it unlocks direct in-app messaging with the verified agent. Your fee remains protected in Campus Tent Escrow until the tour is carried out."
    },
    {
      category: "INSPECTIONS",
      categoryLabel: "Availability & Tours",
      q: "What happens if an agent fails to show up for an inspection?",
      a: "Because all inspection payments are held in Campus Tent Escrow, agents are only paid after the tour is completed and confirmed. If an agent does not show up, cancels without notice, or the property does not match its listing, you can raise an immediate dispute through your dashboard to receive a full refund or get reassigned to a verified agent."
    },
    {
      category: "PAYMENTS",
      categoryLabel: "Payments & Escrow",
      q: "How does Campus Tent Escrow protect my money?",
      a: "When you pay for an inspection, your money is held safely in escrow. Agents only receive their payout (₦5,020 net after processing and commission) once the inspection takes place. This guarantees zero financial loss from ghost agents, fake listings, or unfulfilled promises."
    },
    {
      category: "PAYMENTS",
      categoryLabel: "Payments & Escrow",
      q: "What payment methods are supported on Campus Tent?",
      a: "Payments are processed securely via Paystack, supporting Nigerian Naira debit cards (Mastercard, Visa, Verve), direct bank transfers, and USSD. All transactions are encrypted and provide instant email and in-app receipts."
    },
    {
      category: "PAYMENTS",
      categoryLabel: "Payments & Escrow",
      q: "What are Caution Fees and Total Package breakdowns?",
      a: "Campus Tent promotes 100% transparent pricing with no hidden gate fees. Every listing clearly itemizes the annual base rent alongside any required caution deposits, utility fees, maintenance dues, or legal charges so you know the exact total cost before scheduling an inspection."
    },
    {
      category: "ROOMMATES",
      categoryLabel: "Roommate Matching",
      q: "How does Roommate Matching work on Campus Tent?",
      a: "You can create a Roommate Profile specifying your budget, study habits, religion, cleanliness expectations, department, and campus location preferences. You can search and filter compatible students, message verified profiles, and find someone who shares your lifestyle before signing a lease."
    },
    {
      category: "ROOMMATES",
      categoryLabel: "Roommate Matching",
      q: "What is the difference between 'Co-Renting' and 'Paired' statuses?",
      a: "A 'Co-Renting' badge indicates that a student is actively looking for a roommate to split the cost of a new hostel or apartment. Once you agree to pair up, you can update your status to 'Paired'. Paired listings are automatically archived from public searches after 30 minutes to prevent unwanted inquiries."
    },
    {
      category: "ROOMMATES",
      categoryLabel: "Roommate Matching",
      q: "Can I update or change my Roommate Profile later?",
      a: "Yes. You can edit your roommate questionnaire, budget, preferences, or description at any time directly from the Roommate Matching dashboard or your user profile settings."
    },
    {
      category: "AGENTS",
      categoryLabel: "Agents & Landlords",
      q: "How do agents register and get verified?",
      a: "Agents register an Agent Account, upload their National Identity Number (NIN) or government-issued ID, and provide verifiable contact details. Our team audits every submission before awarding a green 'Verified' badge. Unverified agents cannot receive inspection bookings."
    },
    {
      category: "AGENTS",
      categoryLabel: "Agents & Landlords",
      q: "How do agents receive their inspection payouts?",
      a: "Agents submit their Nigerian bank account details (account number and bank name) in their Agent Dashboard. Once a student's physical tour is completed and marked confirmed, the ₦5,020 payout is automatically disbursed directly to the agent's verified bank account."
    },
    {
      category: "SAFETY",
      categoryLabel: "Trust & Safety",
      q: "How does Campus Tent prevent hostel scams and fraud?",
      a: "We combat student housing fraud through three layers of security: (1) Mandatory NIN identity verification for all agents, (2) A 24-hour availability check before any payment can be initiated, and (3) Escrow-protected inspection payments that are never released without proof of service. Students should never pay full rent without physical inspection."
    },
    {
      category: "SAFETY",
      categoryLabel: "Trust & Safety",
      q: "How do I report a fake listing or suspicious user?",
      a: "Every listing, message conversation, and roommate profile has a 'Report' button. Clicking it sends an urgent flag to our moderation team with listing details. You can also submit an urgent ticket directly using the form on this page."
    }
  ];

  const categories: { key: FaqCategory; label: string }[] = [
    { key: "ALL", label: "All Questions" },
    { key: "INSPECTIONS", label: "Availability & Tours" },
    { key: "PAYMENTS", label: "Payments & Escrow" },
    { key: "ROOMMATES", label: "Roommates" },
    { key: "AGENTS", label: "Agents & Landlords" },
    { key: "SAFETY", label: "Trust & Safety" },
  ];

  const filteredFaqs = selectedCategory === "ALL"
    ? faqData
    : faqData.filter((f) => f.category === selectedCategory);

  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Hero Header */}
      <section className="support-hero">
        <h1>Help & <span>Support</span> Center</h1>
        <p>Answers to common questions about availability checks, escrow inspections, roommate matching, and verified agent tours.</p>
      </section>

      {/* Main Support Grid */}
      <section className="support-content">
        <div className="support-grid">
          {/* FAQ list */}
          <div>
            <h2 className="faq-section-title">
              <i className="fas fa-question-circle faq-title-icon"></i> Frequently Asked Questions
            </h2>

            {/* Category Filter Pills */}
            <div className="faq-categories">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`faq-cat-btn ${selectedCategory === cat.key ? "active" : ""}`}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    setOpenFaqIndex(0);
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="faq-list">
              {filteredFaqs.map((faq, i) => (
                <div key={i} className={`faq-item ${openFaqIndex === i ? "active" : ""}`}>
                  <button className="faq-question" onClick={() => toggleFaq(i)}>
                    <div className="faq-question-content">
                      <span className="faq-cat-tag">{faq.categoryLabel}</span>
                      <span>{faq.q}</span>
                    </div>
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
            <p>Need help with an inspection, payment, or listing? Send our support team a direct message.</p>

            <form onSubmit={handleTicketSubmit} className="support-form">
              <div className="input-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Inspection Query, Refund Request, Agent Report"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Message Detail</label>
                <textarea
                  rows={4}
                  placeholder="Provide property name, transaction reference, or details of your inquiry..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              {ticketFeedback && (
                <div className={`support-status-box ${ticketFeedback.type}`}>
                  {ticketFeedback.message}
                </div>
              )}

              <button type="submit" className="primary-btn" disabled={ticketLoading}>
                {ticketLoading ? "Submitting Ticket..." : "Submit Inquiry"}
              </button>
            </form>

            <div className="quick-contact-card">
              <h4>Direct Channels</h4>
              <a href="mailto:support@campustent.com" className="quick-contact-item">
                <i className="fas fa-envelope"></i> support@campustent.com
              </a>
              <a
                href="https://www.instagram.com/campus_tent?stkn=djZ4YjQxeDZ4Zm1t&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="quick-contact-item"
              >
                <i className="fab fa-instagram"></i> Follow on Instagram (@campus_tent)
              </a>
              <a
                href="https://x.com/campustent?s=11"
                target="_blank"
                rel="noopener noreferrer"
                className="quick-contact-item"
              >
                <i className="fab fa-x-twitter"></i> Follow on Twitter / X (@campustent)
              </a>
              <a
                href="https://www.tiktok.com/@campus.tent"
                target="_blank"
                rel="noopener noreferrer"
                className="quick-contact-item"
              >
                <i className="fab fa-tiktok"></i> Follow on TikTok (@campus.tent)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
