import React from "react";
import { PaymentRecord } from "../PaymentsTab";

interface ApprovePaymentModalProps {
  isOpen: boolean;
  payment: PaymentRecord | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export default function ApprovePaymentModal({
  isOpen,
  payment,
  onClose,
  onConfirm,
  loading,
}: ApprovePaymentModalProps) {
  if (!isOpen || !payment) return null;

  const feeAmount = payment.amount || 7500;
  const platformCut = feeAmount === 7500 ? 2480 : feeAmount * 0.5;
  const agentCut = feeAmount === 7500 ? 5020 : feeAmount * 0.5;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal-container approve-payment-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="approve-payment-header">
          <div className="approve-payment-header-left">
            <div className="approve-payment-header-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <h3 className="approve-payment-header-title">Approve Direct Bank Transfer</h3>
              <p className="approve-payment-header-sub">
                Confirm receipt of funds & dispatch automated emails
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="approve-payment-close-btn"
            disabled={loading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="approve-payment-body">
          {/* Summary Card */}
          <div className="approve-payment-summary-card">
            <div className="approve-payment-summary-row">
              <span className="approve-payment-summary-label">Payer (Student):</span>
              <strong className="approve-payment-summary-val">{payment.student.name} ({payment.student.email})</strong>
            </div>
            <div className="approve-payment-summary-row">
              <span className="approve-payment-summary-label">Listing Host (Agent):</span>
              <span className="approve-payment-summary-val">{payment.agent.name} {payment.agent.agencyName ? `(${payment.agent.agencyName})` : ""}</span>
            </div>
            <div className="approve-payment-summary-row">
              <span className="approve-payment-summary-label">Accommodation:</span>
              <span className="approve-payment-summary-val">{payment.property.title}</span>
            </div>
            <div className="approve-payment-summary-row">
              <span className="approve-payment-summary-label">Total Verified Amount:</span>
              <strong className="approve-payment-summary-val approve-amount-val">₦{feeAmount.toLocaleString()} {payment.currency}</strong>
            </div>
            <div className="approve-payment-summary-row">
              <span className="approve-payment-summary-label">Bank Reference:</span>
              <span className="approve-payment-ref-pill">{payment.reference}</span>
            </div>
          </div>

          {/* Escrow Split Highlight */}
          <div className="approve-payment-split-box">
            <div className="approve-split-title">
              <i className="fas fa-balance-scale"></i> 50/50 Escrow Allocation
            </div>
            <div className="approve-split-grid">
              <div className="approve-split-col platform">
                <span className="approve-split-label">Campus Tent Fee</span>
                <strong className="approve-split-amount">₦{platformCut.toLocaleString()}</strong>
              </div>
              <div className="approve-split-col agent">
                <span className="approve-split-label">Agent Payout (Held in Escrow)</span>
                <strong className="approve-split-amount">₦{agentCut.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Action Consequences Checklist */}
          <div className="approve-payment-checklist">
            <div className="approve-checklist-title">Upon approval:</div>
            <div className="approve-checklist-item">
              <i className="fas fa-check-circle approve-checklist-icon"></i>
              <span>Inspection fee status will change to <strong>PAID</strong> immediately.</span>
            </div>
            <div className="approve-checklist-item">
              <i className="fas fa-check-circle approve-checklist-icon"></i>
              <span>Payment confirmation receipt email sent to <strong>{payment.student.email}</strong>.</span>
            </div>
            <div className="approve-checklist-item">
              <i className="fas fa-check-circle approve-checklist-icon"></i>
              <span>Physical tour scheduling unlocked for the student.</span>
            </div>
            <div className="approve-checklist-item">
              <i className="fas fa-check-circle approve-checklist-icon"></i>
              <span>Booking alert & student contact info emailed to <strong>{payment.agent.email}</strong>.</span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="approve-payment-footer">
            <button
              type="button"
              onClick={onClose}
              className="approve-payment-btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="approve-payment-btn-confirm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Approving...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i> Confirm & Send Emails
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
