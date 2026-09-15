import React from "react";
import Link from "next/link";

interface StudentViewingsCardProps {
  viewings: any[];
  confirmingViewingId: string | null;
  onInquiryClick: (propertyId: string) => void;
  onConfirmTour: (e: React.MouseEvent, viewingId: string) => void;
}

export default function StudentViewingsCard({
  viewings,
  confirmingViewingId,
  onInquiryClick,
  onConfirmTour,
}: StudentViewingsCardProps) {
  return (
    <div className="dashboard-card-section">
      <div className="section-title-row">
        <h3><i className="fas fa-calendar-alt"></i> Scheduled Viewings</h3>
        <span className="badge-count">{viewings.length}</span>
      </div>

      {viewings.length === 0 ? (
        <div className="empty-section-state">
          <i className="far fa-calendar-times"></i>
          <p>No physical viewings scheduled yet.</p>
          <Link href="/explore" className="inline-link">Browse apartments &rarr;</Link>
        </div>
      ) : (
        <div className="viewings-list-wrapper">
          <div className="dashboard-list">
            {viewings.map((viewing) => (
              <div 
                key={viewing.id} 
                className="dashboard-list-item clickable viewing-card-item"
                onClick={() => onInquiryClick(viewing.propertyId)}
                title="Click to message listing owner"
              >
                <div className="viewing-card-header">
                  <div className="item-main">
                    <h5>{viewing.propertyTitle}</h5>
                    <p className="item-meta">
                      <span className="viewing-agent-meta">
                        <i className="fas fa-user-tie"></i>
                        {viewing.agentName}
                        {viewing.agentVerified && (
                          <i className="fas fa-check-circle verified-icon verified-agent-icon" title="Verified Owner"></i>
                        )}
                      </span>
                      <span><i className="far fa-clock"></i> {new Date(viewing.dateTime).toLocaleString()}</span>
                    </p>
                  </div>
                  <span className={`status-tag ${viewing.status.toLowerCase()}`}>
                    {viewing.status}
                  </span>
                </div>

                {/* Agent post-inspection status notice */}
                {viewing.agentInspectionStatus === "INSPECTED" && (
                  <div className="viewing-status-inspected">
                    <i className="fas fa-check-circle"></i>
                    Agent confirmed: Client successfully inspected the properties
                    {viewing.agentInspectionNotes && <span> ({viewing.agentInspectionNotes})</span>}
                  </div>
                )}
                {viewing.agentInspectionStatus === "RESCHEDULED" && (
                  <div className="viewing-status-rescheduled">
                    <i className="fas fa-redo"></i>
                    Agent noted: Client rescheduled
                    {viewing.agentInspectionNotes && <span> ({viewing.agentInspectionNotes})</span>}
                  </div>
                )}

                {/* Student Confirmation of Tour */}
                {viewing.studentConfirmedTour ? (
                  <div className="tour-confirmed-badge">
                    <i className="fas fa-shield-check"></i>
                    You confirmed: Agent met you and conducted the inspection tour.
                  </div>
                ) : (
                  <button
                    type="button"
                    className="confirm-tour-btn"
                    disabled={confirmingViewingId === viewing.id}
                    onClick={(e) => onConfirmTour(e, viewing.id)}
                  >
                    <i className="fas fa-user-check"></i>
                    {confirmingViewingId === viewing.id
                      ? "Confirming..."
                      : "Confirm the agent met me and conducted the inspection tour."}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
