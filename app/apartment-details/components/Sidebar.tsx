import React from "react";
import Link from "next/link";

interface SidebarProps {
  property: {
    id: string;
    price: string;
    rentAmount?: number;
    agentFee?: number;
    cautionFee?: number;
    isNegotiable?: boolean;
    agent: {
      name: string;
      role: string;
      isVerified?: boolean;
    };
  };
  currentUser: any;
  rawTotal: number;
  onScrollToScheduler: () => void;
  onShare: () => void;
  onOpenReportModal: () => void;
}

export default function Sidebar({
  property,
  currentUser,
  rawTotal,
  onScrollToScheduler,
  onShare,
  onOpenReportModal,
}: SidebarProps) {
  return (
    <aside className="details-sidebar-column">
      <div className="details-sidebar-sticky">
        
        {/* 1. Pricing Package Card */}
        <div id="pricing-card" className="pricing-package-card">
          <div className="sidebar-price-tag">
            {property.price} <span>/ year</span>
          </div>
          <div style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: "600" }}>
            Total initial package payment
          </div>

          {/* Breakdown List */}
          <div className="sidebar-breakdown-box">
            <div className="sidebar-breakdown-row">
              <span>House Rent</span>
              <strong>₦{(property.rentAmount ?? rawTotal).toLocaleString()}</strong>
            </div>
            <div className="sidebar-breakdown-row">
              <span>
                Agent Fee {property.isNegotiable && <span style={{ color: "#059669" }}>(Negotiable)</span>}
              </span>
              <strong style={{ color: property.agentFee ? "#b45309" : "#059669" }}>
                ₦{(property.agentFee ?? 0).toLocaleString()}
              </strong>
            </div>
            {property.cautionFee !== undefined && property.cautionFee > 0 && (
              <div className="sidebar-breakdown-row">
                <span>Caution Fee</span>
                <strong>₦{property.cautionFee.toLocaleString()}</strong>
              </div>
            )}
            <div className="sidebar-breakdown-row total">
              <span>Total Initial Package</span>
              <span>{property.price}</span>
            </div>
          </div>
        </div>

        {/* 2. Agent Profile & Contact Action Card */}
        <div id="agent-card" className="agent-action-card">
          <div className="agent-profile-box">
            <div className="agent-avatar-circle">
              <i className="fas fa-user"></i>
            </div>
            <div className="agent-details-info">
              <h5>
                {property.agent.name}
                {property.agent.isVerified && (
                  <i className="fas fa-check-circle" style={{ color: "#16a34a", fontSize: "0.9rem" }}></i>
                )}
              </h5>
              <p className="agent-role-text">{property.agent.role}</p>
              <div className="response-rate-pill">
                <i className="fas fa-bolt"></i> Responds fast (&lt; 30 mins)
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          {!currentUser || (currentUser.role === "STUDENT" && !currentUser.studentProfile?.isVerified) ? (
            <div className="verification-lock-banner">
              <p><i className="fas fa-lock"></i> Verification Required</p>
              <small>Please verify your student profile to message listing owners.</small>
              <Link href={currentUser ? "/student-dashboard/profile" : "/auth/login"} className="verify-link-btn">
                {currentUser ? "Verify Now" : "Log In to Verify"}
              </Link>
            </div>
          ) : (
            <Link 
              href={`/chat?propertyId=${property.id}`} 
              className="chat-cta-btn"
            >
              <i className="fas fa-comments"></i> Message Agent Directly
            </Link>
          )}

          <button 
            type="button" 
            onClick={onScrollToScheduler}
            className="schedule-shortcut-btn"
          >
            <i className="fas fa-calendar-alt"></i> Book Inspection Appointment
          </button>

          <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
            <button className="action-btn" onClick={onShare}>
              <i className="fas fa-share-alt"></i> Share
            </button>
            <button className="action-btn" onClick={onOpenReportModal}>
              <i className="far fa-flag"></i> Report
            </button>
          </div>
        </div>

        {/* 3. Safety Tips Card */}
        <div className="sidebar-safety-card">
          <div className="safety-header-line">
            <i className="fas fa-shield-alt"></i> Student Safety Notice
          </div>
          <ul className="safety-tips-list">
            <li>Never pay rent before inspecting the apartment physically in person.</li>
            <li>Always inspect properties during daylight hours.</li>
            <li>Keep negotiations and chats on Campus Tent to protect your tenancy records.</li>
          </ul>
        </div>

      </div>
    </aside>
  );
}
