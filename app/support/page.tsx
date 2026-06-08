"use client";
import React, { useState, useEffect } from "react";
import { getCurrentUser } from "@/app/actions/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";

export default function SupportPage() {
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
      <Navbar />

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
            <h2 className="faq-section-title"><i className="fas fa-question-circle faq-title-icon"></i> Frequently Asked Questions</h2>
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
                <p className="support-success-msg">
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
      <Footer />
    </>
  );
}
