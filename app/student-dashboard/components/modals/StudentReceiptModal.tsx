import React from "react";

interface StudentReceiptModalProps {
  payment: any | null;
  onClose: () => void;
}

export default function StudentReceiptModal({
  payment,
  onClose,
}: StudentReceiptModalProps) {
  if (!payment) return null;

  const statusClass = 
    payment.status === "PAID"
      ? "paid"
      : payment.status === "PENDING"
      ? "pending"
      : payment.status === "DISPUTED"
      ? "disputed"
      : "default";

  return (
    <div className="student-modal-overlay" onClick={onClose}>
      <div className="student-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="student-modal-header">
          <div>
            <h3 className="receipt-modal-title">Inspection Payment Receipt</h3>
            <span className="receipt-modal-subtitle">Campus Tent Official Student Copy</span>
          </div>
          <button onClick={onClose} className="student-modal-close-btn">&times;</button>
        </div>
        <div className="receipt-body">
          <div className={`receipt-status-banner ${statusClass}`}>
            <div>
              <div className={`receipt-status-label ${statusClass}`}>
                {payment.status === "PAID"
                  ? "Payment Confirmed"
                  : payment.status === "PENDING"
                  ? "Payment Pending Verification"
                  : payment.status === "DISPUTED"
                  ? "Payment Disputed"
                  : `Payment ${payment.status}`}
              </div>
              <div className={`receipt-amount ${statusClass}`}>
                ₦{payment.amount.toLocaleString()} {payment.currency}
              </div>
              <div className={`receipt-ref ${statusClass}`}>
                Ref: <span className="receipt-ref-code">{payment.reference}</span>
              </div>
            </div>
            {payment.status === "PAID" ? (
              <i className="fas fa-check-circle receipt-icon-paid"></i>
            ) : payment.status === "PENDING" ? (
              <i className="fas fa-hourglass-half receipt-icon-pending"></i>
            ) : payment.status === "DISPUTED" ? (
              <i className="fas fa-exclamation-triangle receipt-icon-disputed"></i>
            ) : (
              <i className="fas fa-info-circle receipt-icon-default"></i>
            )}
          </div>

          {payment.status === "PENDING" && (
            <div className="receipt-pending-notice">
              <i className="fas fa-clock"></i>
              <span>This payment reference is currently pending verification. Once confirmed by Paystack, your inspection booking and direct chat are immediately validated.</span>
            </div>
          )}

          <div className="receipt-details-list">
            <div><strong>Date & Time:</strong> {new Date(payment.paidAt || payment.createdAt).toLocaleString()}</div>
            <div><strong>Property:</strong> {payment.property.title}</div>
            <div><strong>Location:</strong> {payment.property.location}</div>
            <div><strong>Assigned Agent:</strong> {payment.agent.name}</div>
            <div><strong>Agent Contact:</strong> {payment.agent.phone}</div>
          </div>

          <div className="receipt-guarantee-box">
            <strong className="receipt-guarantee-title">
              <i className="fas fa-shield-alt receipt-guarantee-icon"></i>
              Inspection Guarantee
            </strong>
            This fee covers the physical tour of "{payment.property.title}" and any additional options within the area and budget.
          </div>

          <div className="receipt-actions-row">
            <button
              onClick={() => window.print()}
              className="receipt-btn receipt-print-btn"
            >
              <i className="fas fa-print"></i> Print Receipt
            </button>
            <button
              onClick={onClose}
              className="receipt-secondary-btn"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
