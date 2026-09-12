import React from "react";

interface ReportsTabProps {
  filteredReports: any[];
  actionLoading: string | null;
  onModerateReport: (reportId: string, action: "DISMISS" | "RESOLVE", deleteListing?: boolean) => void;
}

export default function ReportsTab({
  filteredReports,
  actionLoading,
  onModerateReport,
}: ReportsTabProps) {
  return (
    <div className="admin-card">
      <div className="card-header reports-header">
        <h4 className="reports-header-title">
          <i className="fas fa-flag report-flag-icon"></i> User Flagged Reports Queue
        </h4>
        <p className="reports-header-sub">
          Review and moderate reports submitted by students against properties or roommate profiles.
        </p>
      </div>

      {filteredReports.length === 0 ? (
        <div className="no-data-text">
          <i className="fas fa-check-circle report-check-icon"></i>
          No pending flagged reports found matching your criteria.
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date Reported</th>
                <th>Reporter</th>
                <th>Target Details</th>
                <th>Reason for Report</th>
                <th>Description Details</th>
                <th>Moderation Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((r: any) => {
                const targetType = r.propertyId ? "Property Listing" : "Roommate Profile";
                const targetName = r.property ? r.property.title : (r.roommate ? r.roommate.fullName : "Unknown Target");
                const targetId = r.propertyId || r.roommateId;
                const targetLink = r.propertyId 
                  ? `/apartment-details?id=${r.propertyId}` 
                  : `/roommates`;

                return (
                  <tr key={r.id}>
                    <td className="report-date-cell">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <div className="report-reporter-email">{r.reporter?.email}</div>
                      <span className="report-id-sub">ID: {r.reporter?.id.substring(0, 8)}</span>
                    </td>
                    <td>
                      <span className={`report-type-badge ${r.propertyId ? "property" : "roommate"}`}>
                        {targetType}
                      </span>
                      <div className="report-target-title">
                        <a href={targetLink} target="_blank" rel="noopener noreferrer" className="report-target-link">
                          {targetName}
                        </a>
                      </div>
                      <span className="report-id-sub">ID: {targetId?.substring(0, 8)}</span>
                    </td>
                    <td>
                      <span className="report-danger-badge">
                        <i className="fas fa-exclamation-triangle"></i>
                        {r.reason === "OTHER" ? (r.customReason || "OTHER") : r.reason.replace("_", " ")}
                      </span>
                    </td>
                    <td className="report-desc-cell">
                      <div className="report-desc-box">
                        {r.description}
                      </div>
                    </td>
                    <td>
                      <div className="admin-action-btns report-actions-col">
                        <div className="report-actions-row">
                          <button
                            onClick={() => onModerateReport(r.id, "DISMISS")}
                            disabled={actionLoading !== null}
                            className="reject-btn report-action-half-btn"
                          >
                            Dismiss Report
                          </button>
                          <button
                            onClick={() => onModerateReport(r.id, "RESOLVE", false)}
                            disabled={actionLoading !== null}
                            className="approve-btn report-action-half-btn"
                          >
                            Resolve (Keep)
                          </button>
                        </div>
                        <button
                          onClick={() => onModerateReport(r.id, "RESOLVE", true)}
                          disabled={actionLoading !== null}
                          className="reject-btn report-delete-listing-btn"
                        >
                          Resolve & Delete Flagged Listing
                        </button>
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
