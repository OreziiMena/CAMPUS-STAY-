import React, { useState, useEffect } from "react";
import { PaymentRecord } from "../PaymentsTab";

interface RejectPaymentModalProps {
  isOpen: boolean;
  payment: PaymentRecord | null;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  loading: boolean;
}

const REJECTION_PRESETS = [
  "Deposit not found on bank statement",
  "Incorrect / partial transfer amount received",
  "Unclear sender name or reference code",
  "Duplicate payment submission",
  "Transfer receipt could not be verified",
];

export default function RejectPaymentModal({
  isOpen,
  payment,
  onClose,
  onConfirm,
  loading,
}: RejectPaymentModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError("");
    }
  }, [isOpen, payment]);

  if (!isOpen || !payment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for rejecting this bank transfer.");
      return;
    }
    setError("");
    await onConfirm(reason.trim());
  };

  const handleSelectPreset = (preset: string) => {
    setReason(preset);
    setError("");
  };

  const feeAmount = payment.amount || 7500;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal-container reject-payment-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="reject-payment-header">
          <div className="reject-payment-header-left">
            <div className="reject-payment-header-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div>
              <h3 className="reject-payment-header-title">Reject Bank Transfer</h3>
              <p className="reject-payment-header-sub">
                Decline unverified transfer & notify the student
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="reject-payment-close-btn"
            disabled={loading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="reject-payment-body">
          {/* Summary Card */}
          <div className="reject-payment-summary-card">
            <div className="reject-payment-summary-row">
              <span className="reject-payment-summary-label">Student:</span>
              <strong className="reject-payment-summary-val">{payment.student.name} ({payment.student.email})</strong>
            </div>
            <div className="reject-payment-summary-row">
              <span className="reject-payment-summary-label">Property:</span>
              <span className="reject-payment-summary-val">{payment.property.title}</span>
            </div>
            <div className="reject-payment-summary-row">
              <span className="reject-payment-summary-label">Amount:</span>
              <strong className="reject-payment-summary-val reject-amount-val">₦{feeAmount.toLocaleString()} {payment.currency}</strong>
            </div>
            <div className="reject-payment-summary-row">
              <span className="reject-payment-summary-label">Reference:</span>
              <span className="reject-payment-ref-pill">{payment.reference}</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="reject-payment-presets-section">
            <label className="reject-payment-field-label">
              <i className="fas fa-bolt"></i> Quick Reason Presets:
            </label>
            <div className="reject-payment-chips-wrap">
              {REJECTION_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`reject-preset-chip ${reason === preset ? "active" : ""}`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Textarea */}
          <div className="reject-payment-input-section">
            <label className="reject-payment-field-label" htmlFor="rejectionReason">
              Rejection Reason & Feedback <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="rejectionReason"
              rows={3}
              className={`reject-payment-textarea ${error ? "has-error" : ""}`}
              placeholder="Explain clearly why the transfer cannot be confirmed (e.g. sender name mismatch, transaction not in bank records)..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              disabled={loading}
            />
            {error && <div className="reject-payment-error-text">{error}</div>}
          </div>

          {/* Information Notice */}
          <div className="reject-payment-notice-box">
            <i className="fas fa-info-circle reject-payment-notice-icon"></i>
            <div className="reject-payment-notice-text">
              An email notification including this rejection reason will be automatically sent to <strong>{payment.student.email}</strong>.
            </div>
          </div>

          {/* Modal Footer */}
          <div className="reject-payment-footer">
            <button
              type="button"
              onClick={onClose}
              className="reject-payment-btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="reject-payment-btn-confirm"
              disabled={loading || !reason.trim()}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Rejecting...
                </>
              ) : (
                <>
                  <i className="fas fa-times-circle"></i> Confirm Rejection
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
