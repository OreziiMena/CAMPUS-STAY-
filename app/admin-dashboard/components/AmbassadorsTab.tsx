"use client";

import React, { useState } from "react";
import { adminUpdateAmbassadorStatus, adminDisburseAmbassadorPayout } from "@/app/actions/ambassador";

interface AmbassadorRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  level: string;
  socialHandle?: string | null;
  pitch: string;
  referralCode: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  referralCount: number;
  earnings: number;
  createdAt: string | Date;
  bankCode?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  recipientCode?: string | null;
}

interface AmbassadorsTabProps {
  ambassadors: AmbassadorRecord[];
  onRefresh: () => void;
}

export default function AmbassadorsTab({ ambassadors, onRefresh }: AmbassadorsTabProps) {
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedAmbassador, setSelectedAmbassador] = useState<AmbassadorRecord | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Payout Modal State
  const [payoutAmbassador, setPayoutAmbassador] = useState<AmbassadorRecord | null>(null);
  const [payoutAmount, setPayoutAmount] = useState<string>("");
  const [payoutNote, setPayoutNote] = useState<string>("");
  const [isDisbursing, setIsDisbursing] = useState<boolean>(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);

  const totalCount = ambassadors.length;
  const pendingCount = ambassadors.filter((a) => a.status === "PENDING").length;
  const approvedCount = ambassadors.filter((a) => a.status === "APPROVED").length;
  const totalEarnings = ambassadors.reduce((sum, a) => sum + (a.earnings || 0), 0);

  const filteredAmbassadors = ambassadors.filter((a) => {
    if (filter !== "ALL" && a.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.fullName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.university.toLowerCase().includes(q) ||
        a.referralCode.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusUpdate = async (
    id: string,
    status: "PENDING" | "APPROVED" | "REJECTED",
    earningsIncrement?: number
  ) => {
    setUpdatingId(id);
    setFeedback(null);
    try {
      const res = await adminUpdateAmbassadorStatus({ id, status, earningsIncrement });
      if (res.success) {
        setFeedback(
          earningsIncrement
            ? `Successfully credited ₦${earningsIncrement.toLocaleString()} commission!`
            : `Ambassador status updated to ${status}.`
        );
        setTimeout(() => setFeedback(null), 4000);
        onRefresh();
      } else {
        alert(res.error || "Failed to update ambassador status.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenPayoutModal = (amb: AmbassadorRecord) => {
    setPayoutAmbassador(amb);
    setPayoutAmount(amb.earnings > 0 ? amb.earnings.toString() : "1000");
    setPayoutNote("");
    setPayoutError(null);
  };

  const handleDisbursePayout = async () => {
    if (!payoutAmbassador) return;
    const amt = Number(payoutAmount);
    if (!amt || amt <= 0) {
      setPayoutError("Please enter a valid payout amount.");
      return;
    }

    setIsDisbursing(true);
    setPayoutError(null);

    try {
      const res = await adminDisburseAmbassadorPayout({
        ambassadorId: payoutAmbassador.id,
        amount: amt,
        note: payoutNote,
      });

      if (res.success) {
        setFeedback(
          `Payout of ₦${amt.toLocaleString()} successfully disbursed to ${payoutAmbassador.fullName}! (Ref: ${res.reference})`
        );
        setTimeout(() => setFeedback(null), 6000);
        setPayoutAmbassador(null);
        onRefresh();
      } else {
        setPayoutError(res.error || "Failed to disburse payout.");
      }
    } catch (err: any) {
      setPayoutError(err.message || "An unexpected error occurred.");
    } finally {
      setIsDisbursing(false);
    }
  };

  return (
    <div className="ambassadors-container">
      {/* Header Metrics */}
      <div className="ambassadors-metrics-grid">
        <div className="ambassador-metric-card">
          <div className="ambassador-metric-label">Total Applicants</div>
          <div className="ambassador-metric-val">{totalCount}</div>
        </div>

        <div className="ambassador-metric-card">
          <div className="ambassador-metric-label ambassador-metric-label-pending">Pending Applications</div>
          <div className="ambassador-metric-val ambassador-metric-val-pending">{pendingCount}</div>
        </div>

        <div className="ambassador-metric-card">
          <div className="ambassador-metric-label ambassador-metric-label-active">Active Ambassadors</div>
          <div className="ambassador-metric-val ambassador-metric-val-active">{approvedCount}</div>
        </div>

        <div className="ambassador-metric-card">
          <div className="ambassador-metric-label ambassador-metric-label-commissions">Commissions Tracked</div>
          <div className="ambassador-metric-val">₦{totalEarnings.toLocaleString()}</div>
        </div>
      </div>

      {feedback && (
        <div className="ambassador-feedback-banner">
          <i className="fas fa-check-circle"></i> {feedback}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="ambassadors-filter-bar">
        <div className="ambassadors-tabs-group">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={`ambassador-tab-btn ${filter === t ? "active" : ""}`}
            >
              {t === "ALL" ? `All (${totalCount})` : t === "PENDING" ? `Pending (${pendingCount})` : t === "APPROVED" ? `Approved (${approvedCount})` : `Rejected`}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, campus, email or code..."
          className="ambassador-search-input"
        />
      </div>

      {/* Ambassador Cards & Table */}
      {filteredAmbassadors.length === 0 ? (
        <div className="ambassadors-empty-card">
          <i className="fas fa-users ambassadors-empty-icon"></i>
          <p className="ambassadors-empty-text">
            No campus ambassador applications match the selected criteria.
          </p>
        </div>
      ) : (
        <div className="ambassadors-list-wrapper">
          {filteredAmbassadors.map((amb) => (
            <div
              key={amb.id}
              className={`ambassador-item-card ${amb.status === "PENDING" ? "pending-border" : ""}`}
            >
              <div className="ambassador-item-header">
                <div>
                  <div className="ambassador-header-info">
                    <h4 className="ambassador-name-title">
                      {amb.fullName}
                    </h4>
                    <span className="ambassador-uni-pill">
                      {amb.university} ({amb.level})
                    </span>
                    <span className="ambassador-code-pill">
                      Code: {amb.referralCode}
                    </span>
                  </div>
                  <div className="ambassador-meta-row">
                    <span><i className="fas fa-envelope"></i> {amb.email}</span>
                    <span><i className="fas fa-phone"></i> {amb.phone}</span>
                    <span><i className="fas fa-graduation-cap"></i> {amb.department}</span>
                    {amb.socialHandle && <span><i className="fab fa-instagram"></i> {amb.socialHandle}</span>}
                  </div>
                </div>

                {/* Status & Stats */}
                <div>
                  {amb.status === "APPROVED" && (
                    <span className="ambassador-badge-approved">
                      <i className="fas fa-check-circle"></i> Approved
                    </span>
                  )}
                  {amb.status === "PENDING" && (
                    <span className="ambassador-badge-pending">
                      <i className="fas fa-clock"></i> Pending Review
                    </span>
                  )}
                  {amb.status === "REJECTED" && (
                    <span className="ambassador-badge-rejected">
                      <i className="fas fa-times-circle"></i> Rejected
                    </span>
                  )}
                </div>
              </div>

              {/* Pitch */}
              <div className="ambassador-pitch-box">
                <strong>Pitch:</strong> "{amb.pitch}"
              </div>

              {/* Bank Details */}
              <div className="ambassador-bank-info-box">
                {amb.bankName && amb.accountNumber ? (
                  <div className="ambassador-bank-configured">
                    <i className="fas fa-university"></i>
                    <span>
                      <strong>{amb.bankName}</strong> &bull; {amb.accountNumber} ({amb.accountName})
                    </span>
                    <span className="ambassador-bank-badge-verified">
                      <i className="fas fa-check-circle"></i> Bank Verified
                    </span>
                  </div>
                ) : (
                  <div className="ambassador-bank-missing">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>No bank payout details added yet</span>
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div className="ambassador-footer-row">
                <div className="ambassador-stats-text">
                  Referrals: <strong>{amb.referralCount}</strong> &bull; Total Commissions: <strong className="ambassador-comm-green">₦{(amb.earnings || 0).toLocaleString()}</strong>
                </div>

                <div className="ambassador-actions-wrap">
                  {amb.status !== "APPROVED" && (
                    <button
                      type="button"
                      disabled={updatingId === amb.id}
                      onClick={() => handleStatusUpdate(amb.id, "APPROVED")}
                      className="ambassador-btn-approve"
                    >
                      <i className="fas fa-check"></i> Approve Ambassador
                    </button>
                  )}

                  {amb.status === "APPROVED" && (
                    <>
                      <button
                        type="button"
                        disabled={updatingId === amb.id}
                        onClick={() => handleStatusUpdate(amb.id, "APPROVED", 2000)}
                        className="ambassador-btn-credit"
                        title="Credit ₦2,000 commission for a successful booking"
                      >
                        <i className="fas fa-plus"></i> Credit +₦2,000 Comm
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === amb.id || !amb.bankName || !amb.accountNumber}
                        onClick={() => handleOpenPayoutModal(amb)}
                        className="ambassador-btn-payout"
                        title={
                          !amb.bankName || !amb.accountNumber
                            ? "Ambassador has not added bank details yet"
                            : `Disburse payout to ${amb.accountName}`
                        }
                      >
                        <i className="fas fa-paper-plane"></i> Disburse Payout
                      </button>
                    </>
                  )}

                  {amb.status !== "REJECTED" && (
                    <button
                      type="button"
                      disabled={updatingId === amb.id}
                      onClick={() => handleStatusUpdate(amb.id, "REJECTED")}
                      className="ambassador-btn-reject"
                    >
                      <i className="fas fa-ban"></i> Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payout Modal */}
      {payoutAmbassador && (
        <div
          className="ambassador-modal-overlay"
          onClick={() => !isDisbursing && setPayoutAmbassador(null)}
        >
          <div
            className="ambassador-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ambassador-modal-header">
              <h3>
                <i className="fas fa-money-bill-wave"></i> Disburse Commission Payout
              </h3>
              <button
                type="button"
                className="ambassador-modal-close"
                disabled={isDisbursing}
                onClick={() => setPayoutAmbassador(null)}
              >
                &times;
              </button>
            </div>

            <div className="ambassador-modal-body">
              <div className="ambassador-modal-beneficiary">
                <div><strong>Ambassador:</strong> {payoutAmbassador.fullName} ({payoutAmbassador.referralCode})</div>
                <div><strong>Destination Bank:</strong> {payoutAmbassador.bankName}</div>
                <div><strong>Account Number:</strong> {payoutAmbassador.accountNumber}</div>
                <div><strong>Account Name:</strong> {payoutAmbassador.accountName}</div>
                <div><strong>Total Tracked Earnings:</strong> ₦{(payoutAmbassador.earnings || 0).toLocaleString()}</div>
              </div>

              <div className="ambassador-modal-field">
                <label>Payout Amount (₦) *</label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="ambassador-modal-input"
                />
              </div>

              <div className="ambassador-modal-field">
                <label>Transaction / Disbursement Note (Optional)</label>
                <input
                  type="text"
                  value={payoutNote}
                  onChange={(e) => setPayoutNote(e.target.value)}
                  placeholder="e.g. Commission payout for September 2026 bookings"
                  className="ambassador-modal-input"
                />
              </div>

              {payoutError && (
                <div className="ambassador-modal-error">
                  <i className="fas fa-exclamation-circle"></i> {payoutError}
                </div>
              )}
            </div>

            <div className="ambassador-modal-footer">
              <button
                type="button"
                disabled={isDisbursing}
                onClick={() => setPayoutAmbassador(null)}
                className="ambassador-modal-btn-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDisbursing || !payoutAmount || Number(payoutAmount) <= 0}
                onClick={handleDisbursePayout}
                className="ambassador-modal-btn-confirm"
              >
                {isDisbursing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Processing Disbursement...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i> Confirm & Disburse ₦{Number(payoutAmount || 0).toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
