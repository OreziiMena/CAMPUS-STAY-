import React from "react";

interface AdminStatCardsProps {
  verifiedStudentsCount: number;
  totalStudentsCount: number;
  unverifiedStudentsCount: number;
  verifiedAgentsCount: number;
  totalAgentsCount: number;
  unverifiedAgentsCount: number;
  verifiedPropertiesCount: number;
  totalPropertiesCount: number;
  unverifiedPropertiesCount: number;
  pendingQueueCount: number;
  pendingStudentsQueueCount: number;
  pendingAgentsQueueCount: number;
}

export default function AdminStatCards({
  verifiedStudentsCount,
  totalStudentsCount,
  unverifiedStudentsCount,
  verifiedAgentsCount,
  totalAgentsCount,
  unverifiedAgentsCount,
  verifiedPropertiesCount,
  totalPropertiesCount,
  unverifiedPropertiesCount,
  pendingQueueCount,
  pendingStudentsQueueCount,
  pendingAgentsQueueCount,
}: AdminStatCardsProps) {
  return (
    <div className="admin-metrics-grid">
      {/* Verified Students Card */}
      <div className="admin-stat-card">
        <div className="stat-icon-wrapper student">
          <i className="fas fa-user-graduate"></i>
        </div>
        <div>
          <div className="stat-value-group">
            <span className="stat-number text-green">
              {verifiedStudentsCount}
            </span>
            <span className="stat-total-label">
              / {totalStudentsCount} total
            </span>
          </div>
          <div className="stat-title">
            Verified Students
          </div>
          {unverifiedStudentsCount > 0 && (
            <span className="stat-subtext text-amber">
              {unverifiedStudentsCount} unverified
            </span>
          )}
        </div>
      </div>

      {/* Verified Agents Card */}
      <div className="admin-stat-card">
        <div className="stat-icon-wrapper agent">
          <i className="fas fa-user-tie"></i>
        </div>
        <div>
          <div className="stat-value-group">
            <span className="stat-number text-blue">
              {verifiedAgentsCount}
            </span>
            <span className="stat-total-label">
              / {totalAgentsCount} total
            </span>
          </div>
          <div className="stat-title">
            Verified Agents
          </div>
          {unverifiedAgentsCount > 0 && (
            <span className="stat-subtext text-amber">
              {unverifiedAgentsCount} unverified
            </span>
          )}
        </div>
      </div>

      {/* Verified Properties Card */}
      <div className="admin-stat-card">
        <div className="stat-icon-wrapper property">
          <i className="fas fa-building"></i>
        </div>
        <div>
          <div className="stat-value-group">
            <span className="stat-number text-amber">
              {verifiedPropertiesCount}
            </span>
            <span className="stat-total-label">
              / {totalPropertiesCount} total
            </span>
          </div>
          <div className="stat-title">
            Verified Listings
          </div>
          {unverifiedPropertiesCount > 0 && (
            <span className="stat-subtext text-amber">
              {unverifiedPropertiesCount} pending review
            </span>
          )}
        </div>
      </div>

      {/* Pending Action Queue Card */}
      <div className="admin-stat-card">
        <div className="stat-icon-wrapper queue">
          <i className="fas fa-tasks"></i>
        </div>
        <div>
          <div className="stat-value-group">
            <span className="stat-number text-red">
              {pendingQueueCount}
            </span>
            <span className="stat-total-label">
              pending
            </span>
          </div>
          <div className="stat-title">
            Approvals Queue
          </div>
          <span className="stat-subtext text-muted">
            {pendingStudentsQueueCount} students, {pendingAgentsQueueCount} agents
          </span>
        </div>
      </div>
    </div>
  );
}
