"use client";

import React, { useState } from "react";

interface ActivityLogsTabProps {
  filteredActivityLogs: any[];
  activityFilter: string;
  setActivityFilter: (filter: string) => void;
  adminAuditLogs?: any[];
}

export default function ActivityLogsTab({
  filteredActivityLogs,
  activityFilter,
  setActivityFilter,
  adminAuditLogs = [],
}: ActivityLogsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"AUDIT" | "AGENT_ACTIVITY">("AUDIT");
  const [auditFilter, setAuditFilter] = useState("ALL");
  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null);

  const filteredAuditList = adminAuditLogs.filter((log) => {
    if (auditFilter === "ALL") return true;
    if (auditFilter === "PAYOUTS") return log.action === "PAYOUT_DISBURSED";
    if (auditFilter === "REFUNDS") return log.action === "INSPECTION_REFUNDED";
    if (auditFilter === "VERIFICATIONS") return log.action.includes("VERIFIED");
    if (auditFilter === "DELETIONS") return log.action.includes("DELETED");
    if (auditFilter === "SECURITY") return log.action.includes("2FA");
    if (auditFilter === "BROADCAST") return log.action === "BROADCAST_EMAIL_SENT";
    return log.action === auditFilter;
  });

  return (
    <div className="admin-card">
      {/* Top Switcher Between System Audit Trail and Agent Property Activities */}
      <div className="activity-tabs-switch-bar">
        <button
          type="button"
          onClick={() => setActiveSubTab("AUDIT")}
          className={`activity-switch-btn ${activeSubTab === "AUDIT" ? "active" : ""}`}
        >
          <i className="fas fa-shield-alt"></i> Administrative Audit Trail
          <span className="activity-switch-badge">
            {adminAuditLogs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("AGENT_ACTIVITY")}
          className={`activity-switch-btn ${activeSubTab === "AGENT_ACTIVITY" ? "active" : ""}`}
        >
          <i className="fas fa-history"></i> Agent Listing Activities
          <span className="activity-switch-badge">
            {filteredActivityLogs.length}
          </span>
        </button>
      </div>

      {activeSubTab === "AUDIT" ? (
        /* Sub-tab 1: Administrative Audit Trail */
        <div>
          <div className="card-header activity-header">
            <div>
              <h4 className="activity-title audit-title-text">
                <i className="fas fa-file-shield audit-title-icon"></i>
                Immutable Administrative Audit Trail
              </h4>
              <p className="activity-sub">
                Official security and financial event log recording all payouts, refunds, user verifications, account modifications, and 2FA security actions.
              </p>
            </div>

            {/* Audit Filter Pills */}
            <div className="activity-filter-group activity-filter-group-wrap">
              {[
                { id: "ALL", label: "All Audit Events" },
                { id: "PAYOUTS", label: "Agent Payouts" },
                { id: "REFUNDS", label: "Refunds" },
                { id: "VERIFICATIONS", label: "Verifications" },
                { id: "SECURITY", label: "2FA Security" },
                { id: "DELETIONS", label: "Deletions" },
                { id: "BROADCAST", label: "Broadcasts" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setAuditFilter(f.id)}
                  className={`activity-filter-pill ${auditFilter === f.id ? "active" : ""}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredAuditList.length === 0 ? (
            <div className="no-data-text">
              <i className="fas fa-clipboard-check activity-empty-icon"></i>
              No administrative audit logs found.
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Actor / Administrator</th>
                    <th>Action Type</th>
                    <th>Target / Reference</th>
                    <th>Event Details</th>
                    <th>Metadata</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditList.map((log) => {
                    let badgeClass = "default";
                    let badgeIcon = "fas fa-info-circle";

                    if (log.action === "PAYOUT_DISBURSED") {
                      badgeClass = "payout";
                      badgeIcon = "fas fa-money-bill-wave";
                    } else if (log.action === "INSPECTION_REFUNDED") {
                      badgeClass = "refund";
                      badgeIcon = "fas fa-undo";
                    } else if (log.action.includes("VERIFIED")) {
                      badgeClass = "verified";
                      badgeIcon = "fas fa-user-check";
                    } else if (log.action.includes("2FA")) {
                      badgeClass = "security";
                      badgeIcon = "fas fa-shield-alt";
                    } else if (log.action.includes("DELETED")) {
                      badgeClass = "deleted";
                      badgeIcon = "fas fa-trash-alt";
                    } else if (log.action.includes("BROADCAST")) {
                      badgeClass = "broadcast";
                      badgeIcon = "fas fa-bullhorn";
                    }

                    return (
                      <tr key={log.id}>
                        <td className="activity-date-cell">
                          <div className="activity-date-main">
                            {new Date(log.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <span className="activity-time-sub">
                            {new Date(log.createdAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>
                        <td>
                          <div className="activity-user-name">{log.actorName || log.actorEmail}</div>
                          <div className="activity-user-email">{log.actorEmail}</div>
                          <div className="audit-actor-meta-row">
                            <span className="activity-role-tag">{log.actorRole || "ADMIN"}</span>
                            {log.ipAddress && (
                              <span className="audit-actor-ip">
                                IP: {log.ipAddress}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`audit-action-badge ${badgeClass}`}>
                            <i className={badgeIcon}></i>
                            {log.action.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td>
                          {log.targetLabel ? (
                            <strong className="audit-target-strong">
                              {log.targetLabel}
                            </strong>
                          ) : (
                            <span className="activity-no-target">{log.targetType || "-"}</span>
                          )}
                        </td>
                        <td className="activity-details-cell">
                          <div className="activity-details-text audit-details-text-custom">
                            {log.details}
                          </div>
                        </td>
                        <td>
                          {log.metadata ? (
                            <button
                              type="button"
                              onClick={() => setSelectedAuditLog(log)}
                              className="audit-meta-btn"
                            >
                              <i className="fas fa-code"></i> View JSON
                            </button>
                          ) : (
                            <span className="audit-meta-empty">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Sub-tab 2: Agent Listing Activities */
        <div>
          <div className="card-header activity-header">
            <div>
              <h4 className="activity-title">
                <i className="fas fa-history activity-history-icon"></i> Agent Listing Activities
              </h4>
              <p className="activity-sub">
                Real-time timeline and audit history of every action taken by agents (creating, updating, pricing edits, status changes, and deletions).
              </p>
            </div>

            {/* Filter Pills */}
            <div className="activity-filter-group">
              {[
                { id: "ALL", label: "All Activities" },
                { id: "PROPERTY_CREATED", label: "Created" },
                { id: "PROPERTY_UPDATED", label: "Updated" },
                { id: "PROPERTY_AVAILABILITY_TOGGLED", label: "Status Toggled" },
                { id: "PROPERTY_DELETED", label: "Deleted" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActivityFilter(filter.id)}
                  className={`activity-filter-pill ${activityFilter === filter.id ? "active" : ""}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {filteredActivityLogs.length === 0 ? (
            <div className="no-data-text">
              <i className="fas fa-clipboard-list activity-empty-icon"></i>
              No activity logs found matching your criteria.
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>User / Agent</th>
                    <th>Action Type</th>
                    <th>Property Target</th>
                    <th>Activity Details & Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivityLogs.map((log: any) => {
                    let actionIcon = "fas fa-info-circle";
                    let actionLabel = "Updated";
                    let actionClass = "updated";

                    if (log.action === "PROPERTY_CREATED") {
                      actionIcon = "fas fa-plus-circle";
                      actionLabel = "Listing Created";
                      actionClass = "created";
                    } else if (log.action === "PROPERTY_UPDATED") {
                      actionIcon = "fas fa-edit";
                      actionLabel = "Listing Edited";
                      actionClass = "updated";
                    } else if (log.action === "PROPERTY_AVAILABILITY_TOGGLED") {
                      actionIcon = "fas fa-toggle-on";
                      actionLabel = "Status Changed";
                      actionClass = "status-toggled";
                    } else if (log.action === "PROPERTY_DELETED") {
                      actionIcon = "fas fa-trash-alt";
                      actionLabel = "Listing Deleted";
                      actionClass = "deleted";
                    }

                    return (
                      <tr key={log.id}>
                        <td className="activity-date-cell">
                          <div className="activity-date-main">
                            {new Date(log.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <span className="activity-time-sub">
                            {new Date(log.createdAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>
                        <td>
                          <div className="activity-user-name">{log.userName}</div>
                          <div className="activity-user-email">{log.userEmail}</div>
                          <span className="activity-role-tag">
                            {log.userRole || "AGENT"}
                          </span>
                        </td>
                        <td>
                          <span className={`activity-action-tag ${actionClass}`}>
                            <i className={actionIcon}></i>
                            {actionLabel}
                          </span>
                        </td>
                        <td>
                          {log.propertyTitle ? (
                            <div>
                              <strong className="activity-property-title">
                                {log.propertyTitle}
                              </strong>
                              {log.propertyId && log.action !== "PROPERTY_DELETED" && (
                                <a
                                  href={`/apartment-details?id=${log.propertyId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="activity-details-link"
                                >
                                  View Details <i className="fas fa-external-link-alt activity-link-icon"></i>
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="activity-no-target">-</span>
                          )}
                        </td>
                        <td className="activity-details-cell">
                          <div className="activity-details-text">
                            {log.description}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal for Raw Metadata Inspection */}
      {selectedAuditLog && (
        <div
          className="audit-modal-overlay"
          onClick={() => setSelectedAuditLog(null)}
        >
          <div
            className="audit-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="audit-modal-header">
              <h4 className="audit-modal-title">Audit Log Context Metadata</h4>
              <button
                type="button"
                onClick={() => setSelectedAuditLog(null)}
                className="audit-modal-close-btn"
              >
                &times;
              </button>
            </div>
            <pre className="audit-modal-pre">
              {JSON.stringify(selectedAuditLog.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
