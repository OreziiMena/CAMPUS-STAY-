import React from "react";

interface StudentInquiriesCardProps {
  inquiries: any[];
  onInquiryClick: (propertyId: string) => void;
}

export default function StudentInquiriesCard({
  inquiries,
  onInquiryClick,
}: StudentInquiriesCardProps) {
  return (
    <div className="dashboard-card-section">
      <div className="section-title-row">
        <h3><i className="fas fa-comment-dots"></i> Sent Inquiries</h3>
        <span className="badge-count">{inquiries.length}</span>
      </div>

      {inquiries.length === 0 ? (
        <div className="empty-section-state">
          <i className="far fa-comments"></i>
          <p>You haven't sent any messages to agents yet.</p>
        </div>
      ) : (
        <div className="inquiries-list-wrapper">
          <div className="dashboard-list">
             {inquiries.map((inquiry) => (
              <div 
                key={inquiry.id} 
                className="dashboard-list-item clickable"
                onClick={() => onInquiryClick(inquiry.propertyId)}
                title="Click to message listing owner"
              >
                <div className="item-main">
                  <h5>{inquiry.propertyTitle}</h5>
                  <p className="inquiry-msg">"{inquiry.message}"</p>
                  <p className="item-meta">
                    <span className="viewing-agent-meta">
                      <i className="fas fa-user-tie"></i>
                      {inquiry.agentName}
                      {inquiry.agentVerified && (
                        <i className="fas fa-check-circle verified-icon verified-agent-icon" title="Verified Owner"></i>
                      )}
                    </span>
                    <span><i className="far fa-calendar-alt"></i> {new Date(inquiry.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
