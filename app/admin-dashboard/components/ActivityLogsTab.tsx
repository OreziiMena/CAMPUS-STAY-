import React from "react";

interface ActivityLogsTabProps {
  filteredActivityLogs: any[];
  activityFilter: string;
  setActivityFilter: (filter: string) => void;
}

export default function ActivityLogsTab({
  filteredActivityLogs,
  activityFilter,
  setActivityFilter,
}: ActivityLogsTabProps) {
  return (
    <div className="admin-card">
      <div className="card-header activity-header">
        <div>
          <h4 className="activity-title">
            <i className="fas fa-history activity-history-icon"></i> Agent Activity & Audit Logs
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
  );
}
