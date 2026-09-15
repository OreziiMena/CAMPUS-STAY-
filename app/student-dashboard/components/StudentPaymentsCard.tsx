import React from "react";
import Link from "next/link";

interface StudentPaymentsCardProps {
  payments: any[];
  onViewReceipt: (payment: any) => void;
  onDispute: (payment: any) => void;
}

export default function StudentPaymentsCard({
  payments,
  onViewReceipt,
  onDispute,
}: StudentPaymentsCardProps) {
  return (
    <div className="payments-section">
      <div className="section-title-row payments-title-row">
        <div>
          <h3 className="payments-title">
            <i className="fas fa-file-invoice-dollar"></i> Inspection Payments & Receipts
          </h3>
          <p className="payments-subtitle">
            Your official ₦10,000 inspection fee records, printable receipts, and tour protection.
          </p>
        </div>
        <span className="badge-count payments-badge-count">
          {payments.length} {payments.length === 1 ? "Payment" : "Payments"}
        </span>
      </div>

      {payments.length === 0 ? (
        <div className="empty-section-state payments-empty-state">
          <i className="fas fa-receipt payments-empty-icon"></i>
          <p>No inspection payments recorded yet.</p>
          <Link href="/explore" className="inline-link payments-explore-link">Explore apartments &rarr;</Link>
        </div>
      ) : (
        <div className="payment-history-grid">
          {payments.map((payment) => (
            <div key={payment.id} className="payment-card">
              <div>
                <div className="payment-card-header">
                  <div>
                    <span className="payment-card-date">
                      {new Date(payment.paidAt || payment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <h4 className="payment-card-amount">
                      ₦{payment.amount.toLocaleString()} {payment.currency}
                    </h4>
                  </div>
                  <span
                    className={`status-tag ${
                      payment.status === "PAID"
                        ? "confirmed"
                        : payment.status === "PENDING"
                        ? "pending"
                        : payment.status === "DISPUTED"
                        ? "disputed"
                        : "cancelled"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>

                <div className="payment-property-row">
                  {payment.property.thumbnail ? (
                    <img
                      src={payment.property.thumbnail}
                      alt={payment.property.title}
                      className="payment-property-thumb"
                    />
                  ) : (
                    <div className="payment-property-thumb-placeholder">
                      <i className="fas fa-building"></i>
                    </div>
                  )}
                  <div>
                    <strong className="payment-property-title">
                      {payment.property.title}
                    </strong>
                    <span className="payment-property-agent">
                      Agent: {payment.agent.name}
                    </span>
                  </div>
                </div>

                <div className="payment-reference-text">
                  Ref: {payment.reference}
                </div>
              </div>

              <div className="payment-card-footer">
                <button
                  type="button"
                  onClick={() => onViewReceipt(payment)}
                  className="receipt-btn receipt-btn-block"
                >
                  <i className="fas fa-file-invoice"></i> View Receipt
                </button>
                {payment.status === "PAID" && (
                  <button
                    type="button"
                    onClick={() => onDispute(payment)}
                    className="dispute-btn"
                    title="Report if tour did not happen"
                  >
                    <i className="fas fa-shield-alt"></i> Dispute
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
