import React from "react";
import styles from "./InquiryList.module.css";

interface Inquiry {
  id: string;
  studentName: string;
  propertyName: string;
  message: string;
  phone: string;
  email: string;
  createdAt: string;
}

interface InquiryListProps {
  inquiries: Inquiry[];
}

export default function InquiryList({ inquiries }: InquiryListProps) {
  return (
    <div className="recent-section" id="inquiries-section">
      <div className="section-header">
        <h2>Recent Student Inquiries</h2>
        <a href="#" onClick={(e) => e.preventDefault()}>
          View All
        </a>
      </div>

      <div className="inquiry-list" id="inquiries-container">
        {inquiries.length === 0 ? (
          <p className={styles.emptyText}>
            No recent inquiries.
          </p>
        ) : (
          inquiries.map((inq) => (
            <div key={inq.id} className="inquiry-item">
              <div className="inquiry-info">
                <h4>
                  {inq.studentName} <strong>({inq.propertyName})</strong>
                </h4>
                <p className={styles.messageText}>
                  "{inq.message}"
                </p>
                <small className={styles.metaText}>
                  <i className="fas fa-phone"></i> {inq.phone} | <i className="fas fa-envelope"></i>{" "}
                  {inq.email}
                </small>
              </div>
              <div className="inquiry-time">
                {new Date(inq.createdAt).toLocaleDateString()}
              </div>
              <a
                href={`https://wa.me/${inq.phone.replace(/[^0-9+]/g, "")}?text=Hi%20${encodeURIComponent(
                  inq.studentName
                )},%20I%20am%20replying%20to%20your%20inquiry%20about%20"${encodeURIComponent(
                  inq.propertyName
                )}"%20on%20Campus%20Stay.`}
                target="_blank"
                rel="noopener noreferrer"
                className={`reply-btn ${styles.replyBtnLink}`}
              >
                Reply on WhatsApp
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
