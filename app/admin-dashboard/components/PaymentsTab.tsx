"use client";

import React, { useState } from "react";
import { disburseAgentPayout, refundInspectionPayment } from "@/app/actions/admin";

export interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  reference: string;
  paidAt: string;
  createdAt: string;
  payoutStatus?: string;
  payoutReference?: string | null;
  payoutDisbursedAt?: string | null;
  disputeReason?: string | null;
  disputedAt?: string | null;
  refundReason?: string | null;
  refundedAt?: string | null;
  student: {
    id: string;
    name: string;
    email: string;
    phone: string;
    university?: string;
  };
  agent: {
    id: string;
    name: string;
    agencyName?: string;
    email: string;
    phone: string;
    address?: string;
    bankName?: string | null;
    accountNumber?: string | null;
    accountName?: string | null;
    recipientCode?: string | null;
  };
  property: {
    id: string;
    title: string;
    location: string;
    university?: string;
    price: number;
    rentAmount?: number | null;
    agentFee?: number | null;
    cautionFee?: number | null;
    hostelType?: string;
    thumbnail?: string | null;
  };
}

export interface PaymentMetrics {
  totalGross: number;
  platformShare: number;
  agentEscrowLiability: number;
  totalTransactions: number;
  paidCount: number;
}

interface PaymentsTabProps {
  payments: PaymentRecord[];
  filteredPayments: PaymentRecord[];
  metrics: PaymentMetrics;
  onRefresh?: () => void;
}

export default function PaymentsTab({
  payments,
  filteredPayments,
  metrics,
  onRefresh,
}: PaymentsTabProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleDisbursePayout = async (paymentId: string) => {
    if (!window.confirm("Are you sure you want to disburse ₦5,020 payout to the agent's verified bank account?")) {
      return;
    }
    setActionLoading(true);
    setActionMsg("");
    try {
      const res = await disburseAgentPayout(paymentId);
      if (res.success) {
        alert("Agent payout of ₦5,020 successfully disbursed!");
        if (selectedPayment && selectedPayment.id === paymentId) {
          setSelectedPayment({
            ...selectedPayment,
            payoutStatus: "DISBURSED",
            payoutReference: res.reference || "DISBURSED",
            payoutDisbursedAt: new Date().toISOString(),
          });
        }
        if (onRefresh) onRefresh();
      } else {
        alert(`Payout failed: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message || "Failed to disburse payout."}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefund = async (paymentId: string) => {
    const amountLabel = selectedPayment ? `₦${selectedPayment.amount.toLocaleString()}` : "₦7,500";
    const reason = window.prompt(`Please enter the reason for this ${amountLabel} refund to the student:`);
    if (!reason || reason.trim() === "") return;

    setActionLoading(true);
    try {
      const res = await refundInspectionPayment(paymentId, reason.trim());
      if (res.success) {
        alert(`Refund of ${amountLabel} processed successfully! Student has been notified.`);
        if (selectedPayment && selectedPayment.id === paymentId) {
          setSelectedPayment({
            ...selectedPayment,
            status: "REFUNDED",
            refundReason: reason.trim(),
            refundedAt: new Date().toISOString(),
          });
        }
        if (onRefresh) onRefresh();
      } else {
        alert(`Refund failed: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message || "Failed to process refund."}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="payments-tab-container">
      {/* 1. Metric KPI Cards */}
      <div className="admin-metrics-grid">
        <div className="admin-stat-card">
          <div className="stat-icon-wrapper student">
            <i className="fas fa-wallet"></i>
          </div>
          <div>
            <div className="stat-value-group">
              <span className="stat-number text-green">
                ₦{metrics.totalGross.toLocaleString()}
              </span>
            </div>
            <div className="stat-title">Total Gross Volume</div>
            <span className="stat-subtext text-muted">
              {metrics.totalTransactions} verified payment{metrics.totalTransactions !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper agent">
            <i className="fas fa-chart-pie"></i>
          </div>
          <div>
            <div className="stat-value-group">
              <span className="stat-number text-blue">
                ₦{metrics.platformShare.toLocaleString()}
              </span>
            </div>
            <div className="stat-title">Platform Revenue (₦2,480/fee)</div>
            <span className="stat-subtext text-muted">
              Campus Tent platform fee
            </span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper property">
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <div>
            <div className="stat-value-group">
              <span className="stat-number text-amber">
                ₦{metrics.agentEscrowLiability.toLocaleString()}
              </span>
            </div>
            <div className="stat-title">Agent Escrow Pool (₦5,020/fee)</div>
            <span className="stat-subtext text-muted">
              Allocated for agent payouts
            </span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper queue">
            <i className="fas fa-check-circle"></i>
          </div>
          <div>
            <div className="stat-value-group">
              <span className="stat-number text-green">
                {metrics.paidCount}
              </span>
              <span className="stat-total-label">/ {metrics.totalTransactions}</span>
            </div>
            <div className="stat-title">Confirmed Paid Tours</div>
            <span className="stat-subtext text-green">
              100% verified transactions
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Card with Table */}
      <div className="admin-card">
        <div className="card-header activity-header">
          <div>
            <h4 className="activity-title">
              <i className="fas fa-credit-card activity-history-icon"></i> Inspection Payments Ledger
            </h4>
            <p className="activity-sub">
              Auditable transaction logs for confirmed student inspection fees (₦7,500 each: ₦5,020 agent payout, ₦2,480 platform fee) with Paystack & Direct Transfer audit records.
            </p>
          </div>

          {/* Action Tools */}
          <div className="activity-filter-group">
            <span className="activity-filter-pill active payment-filter-pill-active">
              All Paid Inspections ({payments.length})
            </span>

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="activity-filter-pill payment-refresh-btn"
                title="Refresh payments"
              >
                <i className="fas fa-sync-alt"></i> Refresh
              </button>
            )}
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="no-data-text">
            <i className="fas fa-receipt activity-empty-icon"></i>
            {payments.length === 0
              ? "No verified inspection payments recorded in the database yet."
              : "No payments match your search query."}
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Transaction Reference</th>
                  <th>Property Listing</th>
                  <th>Student (Payer)</th>
                  <th>Agent (Host)</th>
                  <th>Amount</th>
                  <th>Split Breakdown</th>
                  <th>Status</th>
                  <th>Agent Payout</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const feeAmount = payment.amount || 10000;
                  const platformCut = feeAmount * 0.5;
                  const agentCut = feeAmount * 0.5;
                  const isDisbursed = payment.payoutStatus === "DISBURSED";

                  return (
                    <tr key={payment.id}>
                      {/* Date */}
                      <td className="activity-date-cell">
                        <div className="activity-date-main">
                          {new Date(payment.paidAt || payment.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <span className="activity-time-sub">
                          {new Date(payment.paidAt || payment.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Reference */}
                      <td>
                        <div className="payment-ref-container">
                          <span className="payment-ref-code">
                            {payment.reference}
                          </span>
                          <button
                            onClick={() => handleCopyRef(payment.reference)}
                            title="Copy Reference"
                            className={`payment-copy-btn ${copiedRef === payment.reference ? "copied" : ""}`}
                          >
                            <i className={copiedRef === payment.reference ? "fas fa-check" : "fas fa-copy"}></i>
                          </button>
                        </div>
                        {copiedRef === payment.reference && (
                          <span className="payment-copied-text">Copied!</span>
                        )}
                      </td>

                      {/* Property */}
                      <td>
                        <div className="payment-prop-row">
                          {payment.property.thumbnail ? (
                            <img
                              src={payment.property.thumbnail}
                              alt={payment.property.title}
                              className="payment-prop-thumb"
                            />
                          ) : (
                            <div className="payment-prop-thumb-placeholder">
                              <i className="fas fa-building"></i>
                            </div>
                          )}
                          <div>
                            <strong className="activity-property-title payment-prop-title">
                              {payment.property.title}
                            </strong>
                            <span className="payment-prop-loc">
                              {payment.property.location}
                            </span>
                            {payment.property.id && (
                              <a
                                href={`/apartment-details?id=${payment.property.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="activity-details-link payment-prop-link"
                              >
                                View Listing <i className="fas fa-external-link-alt activity-link-icon"></i>
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Student */}
                      <td>
                        <div className="activity-user-name">{payment.student.name}</div>
                        <div className="activity-user-email">{payment.student.email}</div>
                        <div className="payment-user-phone">
                          <i className="fas fa-phone-alt payment-phone-icon"></i>
                          {payment.student.phone}
                        </div>
                        {payment.student.university && (
                          <span className="activity-role-tag payment-student-uni">
                            {payment.student.university}
                          </span>
                        )}
                      </td>

                      {/* Agent */}
                      <td>
                        <div className="activity-user-name">{payment.agent.name}</div>
                        {payment.agent.agencyName && (
                          <div className="payment-agent-agency">
                            {payment.agent.agencyName}
                          </div>
                        )}
                        <div className="activity-user-email">{payment.agent.email}</div>
                        <div className="payment-user-phone">
                          <i className="fas fa-phone-alt payment-phone-icon"></i>
                          {payment.agent.phone}
                        </div>
                      </td>

                      {/* Amount */}
                      <td>
                        <div className="payment-amount-val">
                          ₦{feeAmount.toLocaleString()}
                        </div>
                        <span className="payment-currency-sub">{payment.currency}</span>
                      </td>

                      {/* Split Breakdown (50-50) */}
                      <td>
                        <div className="payment-split-box">
                          <div className="payment-split-platform">
                            50% Platform: ₦{platformCut.toLocaleString()}
                          </div>
                          <div className="payment-split-agent">
                            50% Agent: ₦{agentCut.toLocaleString()}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`activity-action-tag payment-status-tag ${
                            payment.status === "REFUNDED"
                              ? "deleted"
                              : payment.status === "DISPUTED"
                              ? "pending"
                              : "created"
                          }`}
                        >
                          <i
                            className={
                              payment.status === "REFUNDED"
                                ? "fas fa-undo"
                                : payment.status === "DISPUTED"
                                ? "fas fa-exclamation-triangle"
                                : "fas fa-check-circle"
                            }
                          ></i>
                          {payment.status}
                        </span>
                      </td>

                      {/* Payout Status */}
                      <td>
                        {isDisbursed ? (
                          <span className="payment-payout-disbursed">
                            <i className="fas fa-check-double"></i> Disbursed
                          </span>
                        ) : payment.status === "REFUNDED" ? (
                          <span className="payment-payout-refunded">N/A (Refunded)</span>
                        ) : (
                          <button
                            onClick={() => handleDisbursePayout(payment.id)}
                            disabled={actionLoading}
                            className="payment-payout-action-btn"
                            title="Disburse ₦5,000 to Agent"
                          >
                            <i className="fas fa-paper-plane"></i> Disburse ₦5,000
                          </button>
                        )}
                      </td>

                      {/* Action */}
                      <td>
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="verify-btn payment-receipt-action-btn"
                        >
                          <i className="fas fa-file-invoice"></i> Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Detailed Receipt Modal */}
      {selectedPayment && (
        <div className="admin-modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div
            className="admin-modal-container payment-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="admin-modal-header payment-modal-header-custom">
              <div className="payment-modal-header-left">
                <i className="fas fa-receipt payment-modal-header-icon"></i>
                <div>
                  <h3 className="admin-modal-header-title payment-modal-title-custom">
                    Inspection Fee Receipt
                  </h3>
                  <span className="payment-modal-subtitle">
                    Campus Tent 50-50 Escrow & Payment Breakdown
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="admin-modal-close-btn payment-modal-close-btn-custom"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="payment-modal-body">
              {/* Reference & Status Banner */}
              <div
                className={`payment-modal-banner ${
                  selectedPayment.status === "REFUNDED"
                    ? "refunded"
                    : selectedPayment.status === "DISPUTED"
                    ? "disputed"
                    : "paid"
                }`}
              >
                <div>
                  <div
                    className={`payment-banner-label ${
                      selectedPayment.status === "REFUNDED"
                        ? "refunded"
                        : selectedPayment.status === "DISPUTED"
                        ? "disputed"
                        : "paid"
                    }`}
                  >
                    Payment Status
                  </div>
                  <div
                    className={`payment-banner-amount ${
                      selectedPayment.status === "REFUNDED"
                        ? "refunded"
                        : selectedPayment.status === "DISPUTED"
                        ? "disputed"
                        : "paid"
                    }`}
                  >
                    ₦{selectedPayment.amount.toLocaleString()} {selectedPayment.currency} {selectedPayment.status}
                  </div>
                  <div
                    className={`payment-banner-ref ${
                      selectedPayment.status === "REFUNDED"
                        ? "refunded"
                        : selectedPayment.status === "DISPUTED"
                        ? "disputed"
                        : "paid"
                    }`}
                  >
                    Ref: <span className="payment-banner-ref-code">{selectedPayment.reference}</span>
                  </div>
                </div>
                <div
                  className={`payment-banner-icon-circle ${
                    selectedPayment.status === "REFUNDED"
                      ? "refunded"
                      : selectedPayment.status === "DISPUTED"
                      ? "disputed"
                      : "paid"
                  }`}
                >
                  <i
                    className={
                      selectedPayment.status === "REFUNDED"
                        ? "fas fa-undo"
                        : selectedPayment.status === "DISPUTED"
                        ? "fas fa-exclamation-triangle"
                        : "fas fa-check"
                    }
                  ></i>
                </div>
              </div>

              {/* Dispute Warning Banner */}
              {selectedPayment.disputeReason && (
                <div className="payment-dispute-box">
                  <strong className="payment-dispute-title">
                    <i className="fas fa-exclamation-circle payment-dispute-icon"></i>
                    Student Dispute / Issue Reported:
                  </strong>
                  <p className="payment-dispute-desc">
                    {selectedPayment.disputeReason}
                  </p>
                </div>
              )}

              {/* Refund Info Banner */}
              {selectedPayment.refundReason && (
                <div className="payment-refund-box">
                  <strong className="payment-refund-title">
                    <i className="fas fa-undo-alt payment-refund-icon"></i>
                    Refund Processed:
                  </strong>
                  <p className="payment-refund-desc">
                    Reason: {selectedPayment.refundReason}
                  </p>
                </div>
              )}

              {/* Timestamp */}
              <div className="payment-timestamp-row">
                <i className="far fa-calendar-alt payment-cal-icon"></i>
                <strong>Paid At:</strong>{" "}
                {new Date(selectedPayment.paidAt || selectedPayment.createdAt).toLocaleString("en-US", {
                  dateStyle: "full",
                  timeStyle: "medium",
                })}
              </div>

              {/* 50/50 Revenue Split Breakdown */}
              <div className="payment-split-card">
                <div className="payment-split-header">
                  <i className="fas fa-calculator payment-split-header-icon"></i>
                  Fee Split Distribution (50-50)
                </div>
                <div className="payment-split-row bordered">
                  <span>Total Fee Paid by Student</span>
                  <strong>₦{selectedPayment.amount.toLocaleString()}</strong>
                </div>
                <div className="payment-split-row bordered">
                  <span className="payment-split-platform-title">
                    <i className="fas fa-shield-alt"></i> Campus Tent Platform Fee (50%)
                  </span>
                  <strong className="payment-split-platform-val">
                    ₦{((selectedPayment.amount || 10000) * 0.5).toLocaleString()}
                  </strong>
                </div>
                <div className="payment-split-row">
                  <span className="payment-split-agent-title">
                    <i className="fas fa-user-tie"></i> Agent Escrow Payout (50%)
                  </span>
                  <strong className="payment-split-agent-val">
                    ₦{((selectedPayment.amount || 10000) * 0.5).toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Agent Payout Status Details */}
              <div className="payment-bank-card">
                <div className="payment-bank-header">
                  <i className="fas fa-university payment-bank-header-icon"></i>
                  Agent Bank Account & Payout Status
                </div>
                {selectedPayment.agent.accountNumber ? (
                  <div className="payment-bank-body">
                    <div>
                      <strong>Bank:</strong> {selectedPayment.agent.bankName || "Nigerian Bank"}
                    </div>
                    <div>
                      <strong>Account Number:</strong> {selectedPayment.agent.accountNumber}
                    </div>
                    <div>
                      <strong>Account Name:</strong> {selectedPayment.agent.accountName || selectedPayment.agent.name}
                    </div>
                    <div className="payment-bank-status-row">
                      <strong>Payout Status:</strong>{" "}
                      <span
                        className={`payment-bank-status-val ${
                          selectedPayment.payoutStatus === "DISBURSED" ? "disbursed" : "pending"
                        }`}
                      >
                        {selectedPayment.payoutStatus === "DISBURSED" ? "DISBURSED" : "PENDING DISBURSEMENT"}
                      </span>
                      {selectedPayment.payoutReference && ` (Ref: ${selectedPayment.payoutReference})`}
                    </div>
                  </div>
                ) : (
                  <div className="payment-bank-empty">
                    Agent has not linked their Nigerian bank account yet.
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="payment-accom-card">
                <div className="payment-accom-header">
                  <i className="fas fa-building payment-accom-header-icon"></i>
                  Accommodated Property
                </div>
                <div className="payment-accom-title">
                  {selectedPayment.property.title}
                </div>
                <div className="payment-accom-loc">
                  {selectedPayment.property.location} {selectedPayment.property.university && `• ${selectedPayment.property.university}`}
                </div>
                <div className="payment-accom-link-wrap">
                  <a
                    href={`/apartment-details?id=${selectedPayment.property.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="payment-accom-link"
                  >
                    Open Listing Page <i className="fas fa-external-link-alt payment-accom-link-icon"></i>
                  </a>
                </div>
              </div>

              {/* Student & Agent Grid */}
              <div className="payment-parties-grid">
                {/* Student */}
                <div className="payment-party-card">
                  <div className="payment-party-role">
                    Student (Payer)
                  </div>
                  <div className="payment-party-name">
                    {selectedPayment.student.name}
                  </div>
                  <div className="payment-party-sub">{selectedPayment.student.email}</div>
                  <div className="payment-party-sub">{selectedPayment.student.phone}</div>
                </div>

                {/* Agent */}
                <div className="payment-party-card">
                  <div className="payment-party-role">
                    Agent (Payee)
                  </div>
                  <div className="payment-party-name">
                    {selectedPayment.agent.name}
                  </div>
                  {selectedPayment.agent.agencyName && (
                    <div className="payment-party-agency">{selectedPayment.agent.agencyName}</div>
                  )}
                  <div className="payment-party-sub">{selectedPayment.agent.email}</div>
                  <div className="payment-party-sub">{selectedPayment.agent.phone}</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="admin-modal-footer payment-modal-footer-custom">
              <div className="payment-modal-actions-left">
                {selectedPayment.status === "PAID" && selectedPayment.payoutStatus !== "DISBURSED" && (
                  <button
                    onClick={() => handleDisbursePayout(selectedPayment.id)}
                    disabled={actionLoading}
                    className="verify-btn payment-disburse-footer-btn"
                  >
                    <i className="fas fa-paper-plane"></i> Disburse ₦5,020 Payout
                  </button>
                )}

                {selectedPayment.status !== "REFUNDED" && (
                  <button
                    onClick={() => handleRefund(selectedPayment.id)}
                    disabled={actionLoading}
                    className="delete-user-btn payment-refund-footer-btn"
                  >
                    <i className="fas fa-undo"></i> Issue ₦{selectedPayment.amount.toLocaleString()} Refund
                  </button>
                )}
              </div>

              <div className="payment-modal-actions-right">
                <button
                  onClick={() => window.print()}
                  className="doc-open-link-btn payment-print-btn"
                >
                  <i className="fas fa-print"></i> Print Receipt
                </button>
                <button onClick={() => setSelectedPayment(null)} className="doc-close-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
