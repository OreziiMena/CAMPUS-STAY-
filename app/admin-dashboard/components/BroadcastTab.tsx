import React from "react";

export const BROADCAST_TEMPLATES = [
  {
    id: "custom",
    name: "Custom Blank Message",
    audience: "ALL" as const,
    subject: "",
    headline: "",
    message: "",
    ctaText: "",
    ctaUrl: "",
  },
  {
    id: "new_session_hostels",
    name: "New Academic Session & Hostels Alert",
    audience: "STUDENTS" as const,
    subject: "Find Verified Off-Campus Hostels for the New Academic Session - Campus Tent",
    headline: "Verified Student Hostels & Bedsitters Now Available",
    message: "Dear Student,\n\nAs the new academic session begins, hundreds of verified off-campus hostels, bedsitters, and self-contain apartments are now live on Campus Tent.\n\nBrowse verified listings near your institution with direct landlord contacts, transparent fee breakdowns, and zero hidden inspection charges.\n\nStart your search early to secure the best rooms near your school gate!",
    ctaText: "Explore Verified Hostels",
    ctaUrl: "https://campustent.com/explore",
  },
  {
    id: "roommate_matching",
    name: "Split Rent & Roommate Finder Announcement",
    audience: "STUDENTS" as const,
    subject: "Split Rent Costs: Find Compatible Student Roommates on Campus Tent",
    headline: "Cut Your Housing Expenses in Half",
    message: "Hello Student,\n\nLooking for a study-friendly roommate or want to list a spare bed in your room to split rent?\n\nCampus Tent Roommate Finder connects verified university students with compatible peers based on lifestyle habits, budget, department, and school.\n\nPost your roommate space today or find your ideal roommate in minutes!",
    ctaText: "Find Roommates Now",
    ctaUrl: "https://campustent.com/roommates",
  },
  {
    id: "agent_listings_boost",
    name: "Landlords & Agents: Upload Available Hostels",
    audience: "AGENTS" as const,
    subject: "Notice to Agents & Landlords: Upload Available Hostels Before School Resumes",
    headline: "Maximize Your Occupancy with Campus Tent",
    message: "Hello Valued Partner,\n\nStudent search activity on Campus Tent has increased significantly this week. If you have vacant self-contain rooms, bedsitters, or flats, make sure they are listed and active.\n\nEnsure your profile documents are verified to receive the Verified Partner badge and get top priority placement in search results.",
    ctaText: "Go to Agent Dashboard",
    ctaUrl: "https://campustent.com/agent-dashboard/add-property",
  },
  {
    id: "safety_notice",
    name: "Important Tenant Safety Guidelines",
    audience: "ALL" as const,
    subject: "Important Safety Notice: Protect Yourself While Inspecting Hostels",
    headline: "Campus Tent Safety & Anti-Fraud Guidelines",
    message: "Hello Campus Tent Member,\n\nYour security and peace of mind are our highest priorities. Please remember these essential safety precautions:\n\n1. Always inspect properties during daylight hours and inform a coursemate or friend.\n2. Never make payments or rent transfers until you have physically inspected the property and verified ownership.\n3. Look for the green verified checkmark on listings.\n\nReport any suspicious listing or contact immediately using the in-app Report button.",
    ctaText: "Read Tenant Guide",
    ctaUrl: "https://campustent.com/tenant-guide",
  },
  {
    id: "maintenance",
    name: "Scheduled System Maintenance Notice",
    audience: "ALL" as const,
    subject: "Notice: Scheduled System Maintenance & Performance Upgrades",
    headline: "Campus Tent Platform Infrastructure Upgrades",
    message: "Dear Campus Tent User,\n\nWe will be performing a scheduled infrastructure upgrade to improve media upload speed, real-time messaging, and search performance.\n\nDuring this brief window, you may experience momentary delays. We apologize for any inconvenience as we work to bring you an even better accommodation platform.",
    ctaText: "Visit Campus Tent",
    ctaUrl: "https://campustent.com",
  },
];

interface BroadcastTabProps {
  broadcastAudience: "ALL" | "STUDENTS" | "AGENTS" | "VERIFIED_STUDENTS" | "VERIFIED_AGENTS";
  setBroadcastAudience: (aud: "ALL" | "STUDENTS" | "AGENTS" | "VERIFIED_STUDENTS" | "VERIFIED_AGENTS") => void;
  broadcastSenderOption: "support" | "noreply";
  setBroadcastSenderOption: (sender: "support" | "noreply") => void;
  broadcastSubject: string;
  setBroadcastSubject: (subj: string) => void;
  broadcastHeadline: string;
  setBroadcastHeadline: (head: string) => void;
  broadcastMessage: string;
  setBroadcastMessage: (msg: string) => void;
  broadcastCtaText: string;
  setBroadcastCtaText: (txt: string) => void;
  broadcastCtaUrl: string;
  setBroadcastCtaUrl: (url: string) => void;
  broadcastTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  broadcastSending: boolean;
  broadcastTestSending: boolean;
  broadcastResult: any;
  setBroadcastResult: (res: any) => void;
  broadcastStats: {
    all: number;
    students: number;
    agents: number;
    verifiedStudents: number;
    verifiedAgents: number;
  };
  adminEmail: string;
  onSendTestEmail: () => void;
  onOpenPreviewModal: () => void;
  onOpenConfirmModal: () => void;
}

export default function BroadcastTab({
  broadcastAudience,
  setBroadcastAudience,
  broadcastSenderOption,
  setBroadcastSenderOption,
  broadcastSubject,
  setBroadcastSubject,
  broadcastHeadline,
  setBroadcastHeadline,
  broadcastMessage,
  setBroadcastMessage,
  broadcastCtaText,
  setBroadcastCtaText,
  broadcastCtaUrl,
  setBroadcastCtaUrl,
  broadcastTemplate,
  onSelectTemplate,
  broadcastSending,
  broadcastTestSending,
  broadcastResult,
  setBroadcastResult,
  broadcastStats,
  adminEmail,
  onSendTestEmail,
  onOpenPreviewModal,
  onOpenConfirmModal,
}: BroadcastTabProps) {
  return (
    <div className="admin-card broadcast-card-wrapper">
      {/* Header */}
      <div className="broadcast-top-header">
        <div className="broadcast-header-flex">
          <div>
            <h2 className="broadcast-heading-title">
             Send Broadcast Announcements
            </h2>
            <p className="broadcast-heading-sub">
              Broadcast official platform announcements, alerts, and feature updates directly to registered students, landlords, or the entire Campus Tent community.
            </p>
          </div>
          <div className="broadcast-sender-badge">
            <div className="broadcast-sender-title">
              Sender Identity:
            </div>
            <div className="broadcast-custom-select-wrap">
              <select
                value={broadcastSenderOption}
                onChange={(e) => setBroadcastSenderOption(e.target.value as "support" | "noreply")}
                className="broadcast-custom-dropdown"
              >
                <option value="support">support@campustent.com (Campus Tent Support)</option>
                <option value="noreply">noreply@campustent.com (Campus Tent Announcements)</option>
              </select>
              <div className="select-chevron-icon">
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Result Feedback Banner */}
      {broadcastResult && (
        <div className={`broadcast-result-alert ${broadcastResult.success ? "success" : "error"}`}>
          <div className={`broadcast-alert-icon ${broadcastResult.success ? "success" : "error"}`}>
            <i className={broadcastResult.success ? "fas fa-check-circle" : "fas fa-exclamation-circle"}></i>
          </div>
          <div className="broadcast-alert-content">
            <h4 className={`broadcast-alert-heading ${broadcastResult.success ? "success" : "error"}`}>
              {broadcastResult.isTest ? "Test Email Delivered Successfully!" : "Broadcast Completed!"}
            </h4>
            <p className={`broadcast-alert-body ${broadcastResult.success ? "success" : "error"}`}>
              {broadcastResult.message || (
                broadcastResult.isTest 
                  ? `A sample copy of this broadcast was sent to ${broadcastResult.testRecipient || adminEmail}. Check your inbox to review the layout!`
                  : `Successfully dispatched to ${broadcastResult.sentCount} recipients (${broadcastResult.failedCount || 0} failed / bounced).`
              )}
            </p>
            {broadcastResult.errors && broadcastResult.errors.length > 0 && (
              <div className="broadcast-alert-errors-box">
                <strong>Delivery Notes:</strong>
                <ul className="broadcast-alert-errors-list">
                  {broadcastResult.errors.map((err: string, i: number) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button 
            onClick={() => setBroadcastResult(null)}
            className="broadcast-alert-close-btn"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* 1. Target Audience Selection */}
      <div className="broadcast-section-group">
        <label className="broadcast-section-label">

          1. Select Target Audience
        </label>
        <div className="broadcast-audience-grid">
          {[
            { id: "ALL", label: "All Users", count: broadcastStats.all, icon: "fas fa-globe", classKey: "all" },
            { id: "STUDENTS", label: "All Students", count: broadcastStats.students, icon: "fas fa-user-graduate", classKey: "students" },
            { id: "AGENTS", label: "All Agents", count: broadcastStats.agents, icon: "fas fa-user-tie", classKey: "agents" },
            { id: "VERIFIED_STUDENTS", label: "Verified Students", count: broadcastStats.verifiedStudents, icon: "fas fa-user-check", classKey: "vstudents" },
            { id: "VERIFIED_AGENTS", label: "Verified Agents", count: broadcastStats.verifiedAgents, icon: "fas fa-shield-alt", classKey: "vagents" },
          ].map((aud) => {
            const isSelected = broadcastAudience === aud.id;
            return (
              <button
                key={aud.id}
                type="button"
                onClick={() => setBroadcastAudience(aud.id as any)}
                className={`broadcast-audience-btn ${isSelected ? `selected-${aud.classKey}` : ""}`}
              >
                <div className={`broadcast-audience-icon-box ${isSelected ? `active-${aud.classKey}` : ""}`}>
                  <i className={aud.icon}></i>
                </div>
                <div className="broadcast-audience-info">
                  <div className="broadcast-audience-label">
                    {aud.label}
                  </div>
                  <div className="broadcast-audience-count">
                    {aud.count} recipients
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Pre-made Announcement Templates */}
      <div className="broadcast-section-group">
        <div className="broadcast-template-header">
          <label className="broadcast-template-label">
            2. Choose Quick Template (Optional)
          </label>
          <span className="broadcast-template-hint">Pre-fills subject, headline & message</span>
        </div>
        <div className="broadcast-custom-select-wrap full-width">
          <select
            value={broadcastTemplate}
            onChange={(e) => onSelectTemplate(e.target.value)}
            className="broadcast-custom-dropdown full-width"
          >
            {BROADCAST_TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id}>
                {tmpl.name}
              </option>
            ))}
          </select>
          <div className="select-chevron-icon">
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>

      {/* 3. Composer Fields */}
      <div className="broadcast-form-fields">
        {/* Subject */}
        <div>
          <label className="broadcast-field-label">
            Email Subject Line <span className="field-required">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter broadcast subject line..."
            value={broadcastSubject}
            onChange={(e) => setBroadcastSubject(e.target.value)}
            className="broadcast-text-input"
          />
        </div>

        {/* Headline */}
        <div>
          <label className="broadcast-field-label">
            Top Banner Sub-headline (Optional)
          </label>
          <input
            type="text"
            placeholder="Enter announcement headline or banner subtitle..."
            value={broadcastHeadline}
            onChange={(e) => setBroadcastHeadline(e.target.value)}
            className="broadcast-text-input-sub"
          />
        </div>

        {/* Message Body */}
        <div>
          <label className="broadcast-field-label">
            Message Content <span className="field-required">*</span>
          </label>
          <textarea
            rows={8}
            placeholder="Type your official announcement here... Use separate paragraphs for clean readability."
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            className="broadcast-textarea-input"
          />
          <div className="broadcast-field-tip">
            Recipients will receive a personalized greeting automatically with their full name or username.
          </div>
        </div>

        {/* Optional CTA Button Fields */}
        <div className="broadcast-cta-container">
          <div className="broadcast-cta-heading">
           Optional Action Button (Call-To-Action)
          </div>
          <div className="broadcast-cta-grid">
            <div>
              <label className="broadcast-cta-sublabel">Button Text</label>
              <input
                type="text"
                placeholder="Button label text"
                value={broadcastCtaText}
                onChange={(e) => setBroadcastCtaText(e.target.value)}
                className="broadcast-cta-field"
              />
            </div>
            <div>
              <label className="broadcast-cta-sublabel">Destination URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={broadcastCtaUrl}
                onChange={(e) => setBroadcastCtaUrl(e.target.value)}
                className="broadcast-cta-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Controls */}
      <div className="broadcast-action-bar">
        <div className="broadcast-action-group">
          <button
            type="button"
            onClick={onSendTestEmail}
            disabled={broadcastTestSending || broadcastSending}
            className="broadcast-secondary-btn"
          >
            {broadcastTestSending ? (
              <><i className="fas fa-spinner fa-spin"></i> Sending Test...</>
            ) : (
              <><i className="fas fa-vial"></i> Send Test to Admin</>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenPreviewModal}
            className="broadcast-secondary-btn"
          >
            <i className="fas fa-eye"></i> Preview Email Design
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              if (!broadcastSubject.trim()) {
                alert("Please enter an email subject.");
                return;
              }
              if (!broadcastMessage.trim()) {
                alert("Please enter message content.");
                return;
              }
              onOpenConfirmModal();
            }}
            disabled={broadcastSending || broadcastTestSending}
            className="broadcast-submit-btn"
          >
            {broadcastSending ? (
              <><i className="fas fa-spinner fa-spin"></i> Broadcasting to Users...</>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Broadcast to{" "}
                {broadcastAudience === "ALL"
                  ? `${broadcastStats.all} Users`
                  : broadcastAudience === "STUDENTS"
                    ? `${broadcastStats.students} Students`
                    : broadcastAudience === "AGENTS"
                      ? `${broadcastStats.agents} Agents`
                      : broadcastAudience === "VERIFIED_STUDENTS"
                        ? `${broadcastStats.verifiedStudents} Verified Students`
                        : `${broadcastStats.verifiedAgents} Verified Agents`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
