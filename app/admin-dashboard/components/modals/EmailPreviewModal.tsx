import React from "react";

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderOption: "support" | "noreply";
  subject: string;
  headline: string;
  message: string;
  ctaText: string;
  ctaUrl: string;
}

export default function EmailPreviewModal({
  isOpen,
  onClose,
  senderOption,
  subject,
  headline,
  message,
  ctaText,
  ctaUrl,
}: EmailPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="admin-modal-overlay"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="admin-modal-container email-preview"
      >
        {/* Modal Header */}
        <div className="admin-modal-header">
          <div>
            <h3 className="admin-modal-header-title">
              <i className="fas fa-envelope"></i> Live Email Template Preview
            </h3>
            <div className="admin-modal-header-sub">
              From: Campus Tent &lt;{senderOption === "support" ? "support@campustent.com" : "noreply@campustent.com"}&gt; • Subject: {subject || "(Untitled Subject)"}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="admin-modal-close-btn"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Email Canvas Preview */}
        <div className="email-preview-scroll-body">
          <div className="email-preview-card">
            {/* Banner */}
            <div className="email-preview-banner">
              <div className="email-preview-logo-text">
                ⛺ Campus Tent
              </div>
              <div className="email-preview-tagline">
                Verified Student Accommodation & Roommates
              </div>
              {headline && (
                <div className="email-preview-banner-headline">
                  {headline}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="email-preview-content-box">
              <p className="email-preview-salutation">
                Hello [Recipient Name],
              </p>
              <div className="email-preview-message-body">
                {message || "Your announcement message body will appear here..."}
              </div>

              {ctaText && ctaUrl && (
                <div className="email-preview-cta-center">
                  <a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="email-preview-cta-button"
                  >
                    {ctaText}
                  </a>
                </div>
              )}

              <div className="email-preview-signoff-box">
                Warm regards,<br/>
                <strong className="email-preview-signoff-team">The Campus Tent Team</strong><br/>
                <span className="email-preview-signoff-url">campustent.com</span>
              </div>
            </div>

            {/* Footer */}
            <div className="email-preview-footer-note">
              <p className="email-preview-footer-line">
                You are receiving this official communication as a registered member of Campus Tent.
              </p>
              <p className="email-preview-footer-line-last">
                Questions or support? Reach us at support@campustent.com
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="admin-modal-footer">
          <button 
            onClick={onClose}
            className="doc-close-btn"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
