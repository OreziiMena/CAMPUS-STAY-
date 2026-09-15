"use client";

import React, { useState } from "react";
import { updateAgentInspectionStatus } from "@/app/actions/inspection";
import SearchableSelect from "@/components/SearchableSelect";

interface ViewingLead {
  id: string;
  propertyId: string;
  propertyTitle: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  dateTime: string;
  status: string;
  agentInspectionStatus?: string | null;
  agentInspectionNotes?: string | null;
  studentConfirmedTour?: boolean;
  studentConfirmedAt?: string | null;
}

interface InspectionPaymentLead {
  id: string;
  propertyId: string;
  propertyTitle: string;
  studentName: string;
  studentPhone: string;
  amount: number;
  reference: string;
  status?: string;
  payoutStatus?: string;
  payoutReference?: string | null;
  payoutDisbursedAt?: string | null;
  disputeReason?: string | null;
  paidAt: string;
}

interface InspectionsLeadsListProps {
  viewings: ViewingLead[];
  inspectionPayments: InspectionPaymentLead[];
  onStatusUpdated?: () => void;
}

const LEAD_OUTCOME_OPTIONS = [
  { code: "INSPECTED", name: "Client successfully inspected the properties" },
  { code: "RESCHEDULED", name: "Client rescheduled" },
];

export default function InspectionsLeadsList({
  viewings,
  inspectionPayments,
  onStatusUpdated,
}: InspectionsLeadsListProps) {
  const [activeTab, setActiveTab] = useState<"viewings" | "payments">("viewings");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal State for adding notes / updating status
  const [selectedViewing, setSelectedViewing] = useState<ViewingLead | null>(null);
  const [modalStatus, setModalStatus] = useState<"INSPECTED" | "RESCHEDULED">("INSPECTED");
  const [modalNotes, setModalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickUpdate = async (
    viewingId: string,
    status: "INSPECTED" | "RESCHEDULED",
    notes?: string
  ) => {
    try {
      setUpdatingId(viewingId);
      const res = await updateAgentInspectionStatus({
        viewingId,
        status,
        notes,
      });
      if (res.success) {
        setFeedback("Lead inspection status updated.");
        if (onStatusUpdated) onStatusUpdated();
        setTimeout(() => setFeedback(null), 4000);
      } else {
        alert(res.error || "Failed to update lead status.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedViewing) return;

    try {
      setIsSubmitting(true);
      const res = await updateAgentInspectionStatus({
        viewingId: selectedViewing.id,
        status: modalStatus,
        notes: modalNotes,
      });
      if (res.success) {
        setFeedback("Lead inspection status updated.");
        setSelectedViewing(null);
        setModalNotes("");
        if (onStatusUpdated) onStatusUpdated();
        setTimeout(() => setFeedback(null), 4000);
      } else {
        alert(res.error || "Failed to update lead status.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="recent-section leads-section-wrapper">
      <div className="section-header leads-section-header">
        <div>
          <h2 className="leads-title">
            Physical Inspections & ₦10k Paid Leads
          </h2>
          <p className="leads-subtitle">
            Track viewing appointments, student tour confirmations, and ₦5,000 escrow payouts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="leads-tab-switcher">
          <button
            type="button"
            onClick={() => setActiveTab("viewings")}
            className={`leads-tab-btn ${activeTab === "viewings" ? "active" : ""}`}
          >
            <i className="far fa-calendar-alt"></i>
            Appointments ({viewings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("payments")}
            className={`leads-tab-btn ${activeTab === "payments" ? "active" : ""}`}
          >
            <i className="fas fa-hand-holding-usd"></i>
            Paid Leads & Escrow ({inspectionPayments.length})
          </button>
        </div>
      </div>

      {feedback && (
        <div className="receipt-pending-notice leads-feedback-notice">
          <i className="fas fa-check-circle leads-feedback-icon"></i>
          <span>{feedback}</span>
        </div>
      )}

      {/* VIEWINGS TAB */}
      {activeTab === "viewings" && (
        viewings.length === 0 ? (
          <div className="leads-empty-card">
            <i className="far fa-calendar-check leads-empty-icon"></i>
            <p className="leads-empty-text">
              No inspection appointments yet. Once students check availability and book viewings, they will appear here.
            </p>
          </div>
        ) : (
          <div className="leads-list-container">
            {viewings.map((viewing) => {
              const isPendingAction = !viewing.agentInspectionStatus;
              const isInspected = viewing.agentInspectionStatus === "INSPECTED";
              const isRescheduled = viewing.agentInspectionStatus === "RESCHEDULED";

              return (
                <div
                  key={viewing.id}
                  className={`lead-card ${isPendingAction ? "pending-action" : ""}`}
                >
                  <div className="lead-card-header">
                    <div>
                      <h4 className="lead-property-title">
                        {viewing.propertyTitle}
                      </h4>
                      <div className="lead-meta-row">
                        <span><i className="fas fa-user"></i> <strong>{viewing.studentName}</strong></span>
                        <span><i className="fas fa-phone"></i> {viewing.studentPhone}</span>
                        <span><i className="far fa-clock"></i> {new Date(viewing.dateTime).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="lead-badges-row">
                      {isInspected && (
                        <span className="badge-inspected">
                          <i className="fas fa-check-circle"></i> Inspected
                        </span>
                      )}
                      {isRescheduled && (
                        <span className="badge-rescheduled">
                          <i className="fas fa-history"></i> Rescheduled
                        </span>
                      )}
                      {isPendingAction && (
                        <span className="badge-action-required">
                          <i className="fas fa-exclamation-circle"></i> Action Required
                        </span>
                      )}
                      {viewing.studentConfirmedTour && (
                        <span className="badge-student-confirmed" title="Student confirmed the physical inspection tour took place">
                          <i className="fas fa-shield-alt"></i> Tour Confirmed by Student
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Prompt agent to update lead status */}
                  <div className="lead-card-footer">
                    <div className="lead-status-summary">
                      {isInspected ? (
                        <span className="lead-status-inspected">
                          <i className="fas fa-check"></i> "Client successfully inspected the properties"
                          {viewing.agentInspectionNotes && <span className="lead-note-text"> — Note: {viewing.agentInspectionNotes}</span>}
                        </span>
                      ) : isRescheduled ? (
                        <span className="lead-status-rescheduled">
                          <i className="fas fa-clock"></i> "Client rescheduled"
                          {viewing.agentInspectionNotes && <span className="lead-note-text"> — Note: {viewing.agentInspectionNotes}</span>}
                        </span>
                      ) : (
                        <span className="lead-status-prompt">
                          Prompt: Please update lead inspection status after meeting the client:
                        </span>
                      )}
                    </div>

                    {/* Action Selection Buttons */}
                    <div className="lead-actions-group">
                      <button
                        type="button"
                        disabled={updatingId === viewing.id}
                        onClick={() => handleQuickUpdate(viewing.id, "INSPECTED")}
                        className={`btn-quick-inspected ${isInspected ? "active" : ""}`}
                      >
                        <i className="fas fa-check"></i>
                        Client inspected properties
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === viewing.id}
                        onClick={() => handleQuickUpdate(viewing.id, "RESCHEDULED")}
                        className={`btn-quick-rescheduled ${isRescheduled ? "active" : ""}`}
                      >
                        <i className="fas fa-redo"></i>
                        Client rescheduled
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedViewing(viewing);
                          setModalStatus(viewing.agentInspectionStatus === "RESCHEDULED" ? "RESCHEDULED" : "INSPECTED");
                          setModalNotes(viewing.agentInspectionNotes || "");
                        }}
                        className="btn-lead-notes"
                        title="Add Notes"
                      >
                        <i className="fas fa-edit"></i> Notes
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* PAID LEADS & ESCROW PAYOUTS TAB */}
      {activeTab === "payments" && (
        inspectionPayments.length === 0 ? (
          <div className="leads-empty-card">
            <i className="fas fa-receipt leads-empty-icon"></i>
            <p className="leads-empty-text">
              No paid inspection fees recorded yet. When students pay ₦10,000 for your listings, the ₦5,000 escrow records will appear here.
            </p>
          </div>
        ) : (
          <div className="leads-list-container">
            {inspectionPayments.map((payment) => {
              const isDisbursed = payment.payoutStatus === "DISBURSED";
              const isDisputed = payment.status === "DISPUTED";
              const isRefunded = payment.status === "REFUNDED";

              return (
                <div
                  key={payment.id}
                  className="lead-card"
                >
                  <div className="lead-card-header">
                    <div>
                      <div className="lead-title-row">
                        <h4 className="lead-property-title">
                          {payment.propertyTitle}
                        </h4>
                        <span className="lead-ref-pill">
                          Ref: #{payment.reference}
                        </span>
                      </div>
                      <div className="lead-meta-row">
                        <span><i className="fas fa-user"></i> <strong>{payment.studentName}</strong></span>
                        <span><i className="fas fa-phone"></i> {payment.studentPhone}</span>
                        <span><i className="far fa-calendar-alt"></i> Paid on {new Date(payment.paidAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Escrow Payout Badge */}
                    <div>
                      {isDisbursed ? (
                        <div className="escrow-payout-col">
                          <span className="escrow-badge-disbursed">
                            <i className="fas fa-check-circle"></i> ₦5,000 Disbursed to Bank
                          </span>
                          {payment.payoutReference && (
                            <div className="escrow-trf-ref">
                              Trf: {payment.payoutReference}
                            </div>
                          )}
                        </div>
                      ) : isDisputed ? (
                        <span className="escrow-badge-disputed">
                          <i className="fas fa-exclamation-triangle"></i> Disputed by Student
                        </span>
                      ) : isRefunded ? (
                        <span className="escrow-badge-refunded">
                          <i className="fas fa-undo"></i> Refunded
                        </span>
                      ) : (
                        <span className="escrow-badge-pending">
                          <i className="fas fa-hourglass-half"></i> ₦5,000 in Escrow (Pending Tour)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="escrow-footer-line">
                    <span>
                      Student paid total fee: <strong>₦{payment.amount.toLocaleString()}</strong> (₦5,000 Platform / ₦5,000 Agent Share)
                    </span>
                    {!isDisbursed && !isDisputed && !isRefunded && (
                      <span className="escrow-disburse-hint">
                        Disburses automatically once you & the student confirm the tour
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Edit Notes & Status Modal */}
      {selectedViewing && (
        <div className="lead-modal-overlay">
          <div className="lead-modal-card">
            <h3 className="lead-modal-title">
              Update Inspection Lead Status
            </h3>
            <p className="lead-modal-subtitle">
              Student: <strong>{selectedViewing.studentName}</strong> &bull; Property: <strong>{selectedViewing.propertyTitle}</strong>
            </p>

            <form onSubmit={handleModalSubmit}>
              <div className="lead-modal-group">
                <label className="lead-modal-label">
                  Select Lead Outcome:
                </label>
                <SearchableSelect
                  options={LEAD_OUTCOME_OPTIONS}
                  value={modalStatus}
                  onChange={(val) => setModalStatus(val as any)}
                  searchable={false}
                />
              </div>

              <div className="lead-modal-group">
                <label className="lead-modal-label">
                  Optional Inspection Notes / Alternative Units Shown:
                </label>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Add any notes on tour outcome or alternative units shown..."
                  className="lead-modal-textarea"
                />
              </div>

              <div className="lead-modal-actions">
                <button
                  type="button"
                  onClick={() => setSelectedViewing(null)}
                  className="lead-modal-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="lead-modal-submit-btn"
                >
                  {isSubmitting ? "Saving..." : "Save Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
