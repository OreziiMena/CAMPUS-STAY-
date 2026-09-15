"use client";

import React from "react";
import Link from "next/link";

interface EarningsData {
  disbursedEarnings: number;
  pendingEscrow: number;
  totalEarnings: number;
  totalInspections: number;
  disbursedCount: number;
  pendingCount: number;
  bankConfigured: boolean;
  bankInfo: {
    bankName: string | null;
    accountNumber: string | null;
    accountName: string | null;
  };
}

interface EarningsCardProps {
  earnings: EarningsData;
}

export default function EarningsCard({ earnings }: EarningsCardProps) {
  const maskedAcc = earnings.bankInfo?.accountNumber
    ? `•••• ${earnings.bankInfo.accountNumber.slice(-4)}`
    : "";

  return (
    <div className="earnings-overview-card">
      <div className="earnings-card-header">
        <div>
          <h2 className="earnings-card-title">
            Inspection Earnings Overview
          </h2>
          <p className="earnings-card-sub">
            Payouts are held safely in escrow and automatically disbursed when tours are confirmed.
          </p>
        </div>

        {/* Bank Connection Badge */}
        <div>
          {earnings.bankConfigured ? (
            <div className="bank-badge-active">
              <i className="fas fa-university bank-badge-icon"></i>
              <div>
                <div className="bank-badge-name">
                  {earnings.bankInfo?.bankName || "Bank Account"} {maskedAcc}
                </div>
                <div className="bank-badge-status">
                  Auto-Disbursement Active
                </div>
              </div>
              <Link
                href="/agent-dashboard/settings"
                className="bank-badge-edit"
              >
                Edit
              </Link>
            </div>
          ) : (
            <Link
              href="/agent-dashboard/settings"
              className="bank-badge-connect"
            >
              <i className="fas fa-exclamation-triangle"></i>
              <span>Connect Bank for Auto-Payouts</span>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Columns */}
      <div className="earnings-stats-grid">
        {/* Disbursed Earnings */}
        <div className="earnings-stat-box">
          <div className="earnings-stat-label green">
            Disbursed Payouts
          </div>
          <div className="earnings-stat-value">
            ₦{earnings.disbursedEarnings.toLocaleString()}
          </div>
          <div className="earnings-stat-sub">
            {earnings.disbursedCount} inspection{earnings.disbursedCount === 1 ? "" : "s"} paid out to bank
          </div>
        </div>

        {/* Pending Escrow */}
        <div className="earnings-stat-box">
          <div className="earnings-stat-label yellow">
            Pending in Escrow
          </div>
          <div className="earnings-stat-value yellow">
            ₦{earnings.pendingEscrow.toLocaleString()}
          </div>
          <div className="earnings-stat-sub">
            {earnings.pendingCount} tour{earnings.pendingCount === 1 ? "" : "s"} awaiting completion
          </div>
        </div>

        {/* Total Earned */}
        <div className="earnings-stat-box">
          <div className="earnings-stat-label blue">
            Total Generated
          </div>
          <div className="earnings-stat-value">
            ₦{earnings.totalEarnings.toLocaleString()}
          </div>
          <div className="earnings-stat-sub">
            From {earnings.totalInspections} paid student lead{earnings.totalInspections === 1 ? "" : "s"}
          </div>
        </div>
      </div>
    </div>
  );
}
