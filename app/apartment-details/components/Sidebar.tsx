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
    isRoommateOption?: boolean;
    agent: {
      name: string;
      role: string;
      isVerified?: boolean;
    };
  };
  currentUser: any;
  rawTotal: number;
  inspectionStatus: {
    isPaid: boolean;
    isPendingApproval?: boolean;
    availabilityStatus: string;
    isOwner: boolean;
  };
  isCheckingAvailability: boolean;
  isPayingInspection: boolean;
  onCheckAvailability: () => void;
  onPayInspectionFee: () => void;
  onScrollToScheduler: () => void;
  onShare: () => void;
  onOpenReportModal: () => void;
}

export default function Sidebar({
  property,
  currentUser,
  rawTotal,
  inspectionStatus,
  isCheckingAvailability,
  isPayingInspection,
  onCheckAvailability,
  onPayInspectionFee,
  onScrollToScheduler,
  onShare,
  onOpenReportModal,
}: SidebarProps) {
  const isUnlocked =
    property.isRoommateOption ||
    inspectionStatus.isOwner ||
    currentUser?.role === "ADMIN" ||
    inspectionStatus.isPaid;

  return (
    <aside className="details-sidebar-column">
      <div className="details-sidebar-sticky">
        
        {/* 1. Pricing Package Card */}
        <div id="pricing-card" className="pricing-package-card">
          <div className="sidebar-price-tag">
            {property.price} <span>/ year</span>
          </div>
          <div className="sidebar-price-subtitle">
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
                Agent Fee {property.isNegotiable && <span className="negotiable-tag">(Negotiable)</span>}
              </span>
              <strong className={property.agentFee ? "sidebar-fee-regular" : "sidebar-fee-negotiable"}>
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

        {/* 2. Agent Profile & Inspection Action Card */}
        <div id="agent-card" className="agent-action-card">
          <div className="agent-profile-box">
            <div className="agent-avatar-circle">
              <i className="fas fa-user"></i>
            </div>
            <div className="agent-details-info">
              <h5>
                {property.agent.name}
                {property.agent.isVerified && (
                  <i className="fas fa-check-circle agent-verified-badge"></i>
                )}
              </h5>
              <p className="agent-role-text">{property.agent.role}</p>
              <div className="response-rate-pill">
                <i className="fas fa-bolt"></i> Responds fast (&lt; 30 mins)
              </div>
            </div>
          </div>

          {/* Verification & Inspection Flow */}
          {!currentUser ? (
            <div className="verification-lock-banner">
              <p><i className="fas fa-lock"></i> Student Login Required</p>
              <small>Log in to verify availability, pay inspection fee, and book viewings.</small>
              <Link href={`/auth/login?redirect=/apartment-details?id=${property.id}`} className="verify-link-btn">
                Log In to Continue
              </Link>
            </div>
          ) : currentUser.role === "AGENT" ? (
            inspectionStatus.isOwner ? (
              <div className="verification-lock-banner verification-banner-owner">
                <p><i className="fas fa-home"></i> Your Listing</p>
                <small>You are the managing agent for this property.</small>
                <Link href="/agent-dashboard/listings" className="verify-link-btn">
                  Manage in Agent Dashboard
                </Link>
              </div>
            ) : (
              <div className="verification-lock-banner verification-banner-agent-notice">
                <p><i className="fas fa-user-tie"></i> Agent Account Notice</p>
                <small>
                  Agents cannot book inspections or send inquiries on listings. Please sign in with a Student account to book viewings.
                </small>
              </div>
            )
          ) : (
            <div className="inspection-flow-wrapper">
              {/* If not paid yet, show Availability Check & Payment Step */}
              {!isUnlocked && (
                <div className="inspection-step-card">
                  <div className="inspection-step-header">
                    <i className="fas fa-shield-alt"></i>
                    <span>Pre-Inspection Verification</span>
                  </div>

                  {/* Step 1: Availability Query */}
                  <div className="availability-action-box">
                    {inspectionStatus.availabilityStatus === "NONE" && (
                      <>
                        <button
                          type="button"
                          className="availability-btn"
                          onClick={onCheckAvailability}
                          disabled={isCheckingAvailability}
                        >
                          {isCheckingAvailability ? (
                            <><i className="fas fa-spinner fa-spin"></i> Checking availability...</>
                          ) : (
                            <><i className="fas fa-bolt"></i> Check Availability Status with Agent</>
                          )}
                        </button>
                        <small className="availability-help-text">
                          Sends a 1-click confirmation request to the agent to ensure the house is still available right now.
                        </small>
                      </>
                    )}

                    {inspectionStatus.availabilityStatus === "PENDING" && (
                      <div className="availability-status-pill pending">
                        <i className="fas fa-hourglass-half status-pill-icon"></i>
                        <div>
                          <strong>Availability Check Sent!</strong>
                          <div className="status-pill-desc">
                            The agent received an instant confirmation link. This page will update once confirmed.
                          </div>
                          <button
                            type="button"
                            onClick={onCheckAvailability}
                            className="resend-query-btn"
                          >
                            Resend query
                          </button>
                        </div>
                      </div>
                    )}

                    {inspectionStatus.availabilityStatus === "UNAVAILABLE" && (
                      <div className="availability-status-pill unavailable">
                        <i className="fas fa-times-circle status-pill-icon"></i>
                        <div>
                          <strong>Currently Unavailable / Occupied</strong>
                          <div className="status-pill-desc">
                            The agent noted this listing is currently occupied.
                          </div>
                        </div>
                      </div>
                    )}

                    {inspectionStatus.availabilityStatus === "AVAILABLE" && (
                      <div className="availability-status-pill available">
                        <i className="fas fa-check-circle status-pill-icon"></i>
                        <div>
                          <strong>Confirmed: Property is Available!</strong>
                          <div className="status-pill-desc">
                            The agent confirmed this hostel is ready for inspection. (Valid for 24 hours)
                          </div>
                        </div>
                      </div>
                    )}

                    {inspectionStatus.availabilityStatus === "EXPIRED" && (
                      <div className="availability-status-pill unavailable">
                        <i className="fas fa-history status-pill-icon"></i>
                        <div>
                          <strong>Availability Expired (Over 24 hrs)</strong>
                          <div className="status-pill-desc">
                            The previous confirmation was valid for 24 hours. Please confirm with the agent again before paying.
                          </div>
                          <button
                            type="button"
                            className="availability-btn"
                            style={{ marginTop: "10px", fontSize: "13.5px", padding: "10px 16px" }}
                            onClick={onCheckAvailability}
                            disabled={isCheckingAvailability}
                          >
                            {isCheckingAvailability ? (
                              <><i className="fas fa-spinner fa-spin"></i> Checking availability...</>
                            ) : (
                              <><i className="fas fa-redo"></i> Confirm Availability Again</>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Bonus Copy and Payment CTA (Unlocked ONLY when availability is confirmed) */}
                  {inspectionStatus.isPendingApproval ? (
                    <div className="availability-status-pill pending" style={{ marginTop: '12px', background: '#fffbeb', border: '1.5px solid #fde68a', padding: '14px', borderRadius: '10px' }}>
                      <i className="fas fa-clock" style={{ color: '#d97706', fontSize: '18px' }}></i>
                      <div>
                        <strong style={{ color: '#92400e' }}>Bank Transfer Under Verification</strong>
                        <div className="status-pill-desc" style={{ color: '#78350f', marginTop: '4px' }}>
                          We have received your ₦7,500 bank transfer. Our admin team is verifying your deposit with the bank. Once confirmed, you will receive an approval email and tour scheduling will unlock automatically.
                        </div>
                      </div>
                    </div>
                  ) : inspectionStatus.availabilityStatus === "AVAILABLE" ? (
                    <>
                      <div className="inspection-bonus-card">
                        <div className="inspection-bonus-title">
                          <i className="fas fa-sparkles"></i> Campus Tent Bonus Value
                        </div>
                        <p className="inspection-bonus-text">
                          "Your ₦7,500 fee covers a physical inspection of this property, plus any alternative options the agent has available in the same area/budget. It is fully refundable if the inspection was cancelled by the agent"
                        </p>
                      </div>

                      <button
                        type="button"
                        className="pay-inspection-btn"
                        onClick={onPayInspectionFee}
                        disabled={isPayingInspection}
                      >
                        {isPayingInspection ? (
                          <><i className="fas fa-spinner fa-spin"></i> Processing Payment...</>
                        ) : (
                          <><i className="fas fa-credit-card"></i> Pay ₦7,500 Inspection Fee</>
                        )}
                      </button>
                    </>
                  ) : inspectionStatus.availabilityStatus === "EXPIRED" ? (
                    <div className="availability-prompt-pending">
                      <i className="fas fa-clock"></i>
                      <span><strong>Confirmation Expired:</strong> Availability was confirmed over 24 hours ago. Please tap "Confirm Availability Again" above to proceed.</span>
                    </div>
                  ) : inspectionStatus.availabilityStatus === "PENDING" ? (
                    <div className="availability-prompt-pending">
                      <i className="fas fa-hourglass-half"></i>
                      <span><strong>Waiting for Agent Confirmation:</strong> ₦7,500 payment unlocks immediately once the agent confirms availability.</span>
                    </div>
                  ) : inspectionStatus.availabilityStatus === "UNAVAILABLE" ? (
                    <div className="availability-prompt-unavailable">
                      <i className="fas fa-ban"></i>
                      <span>This property is currently occupied. Inspection fee payment is disabled.</span>
                    </div>
                  ) : (
                    <div className="availability-prompt-initial">
                      <i className="fas fa-shield-alt"></i>
                      <span><strong>Step 1:</strong> Check live availability with the agent above before paying the inspection fee.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Once unlocked (Paid or Roommate listing / Owner) */}
              {isUnlocked && (
                <>
                  {inspectionStatus.isPaid && (
                    <div className="inspection-unlocked-banner">
                      <i className="fas fa-check-circle"></i>
                      <span>₦7,500 Inspection Fee Paid &bull; Full Access Unlocked</span>
                    </div>
                  )}

                  <Link 
                    href={`/chat?propertyId=${property.id}`} 
                    className="chat-cta-btn"
                  >
                    <i className="fas fa-comments"></i> Message Agent Directly
                  </Link>

                  <button 
                    type="button" 
                    onClick={onScrollToScheduler}
                    className="schedule-shortcut-btn"
                  >
                    <i className="fas fa-calendar-alt"></i> Book Inspection Appointment
                  </button>
                </>
              )}
            </div>
          )}

          <div className="sidebar-actions-row">
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
            <li>Never pay full rent before inspecting the apartment physically in person.</li>
            <li>Always inspect properties during daylight hours.</li>
            <li>Your ₦7,500 inspection fee covers this hostel plus alternative options shown by the verified agent. It is fully refundable if the inspection was cancelled by the agent</li>
            <li>Keep negotiations and chats on Campus Tent to protect your tenancy records.</li>
            <li>Always inspect properties during daylight hours.</li>
          </ul>
        </div>

      </div>
    </aside>
  );
}
