import React from "react";
import Link from "next/link";
import styles from "./InquiryList.module.css";

interface Inquiry {
  id: string;
  studentName: string;
  propertyName: string;
  message: string;
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
        <Link href="/chat">
          View All
        </Link>
      </div>

      <div className="inquiry-list" id="inquiries-container">
        {inquiries.length === 0 ? (
          <p className={styles.emptyText}>
            No recent inquiries.
          </p>
        ) : (
          inquiries.map((inq) => (
            <Link 
              key={inq.id} 
              href={`/chat?roomId=${inq.id}`} 
              className="inquiry-item"
              style={{ textDecoration: "none", color: "inherit", width: "100%" }}
            >
              <div className="inquiry-info">
                <h4>
                  {inq.studentName} <strong>({inq.propertyName})</strong>
                </h4>
                <p className={styles.messageText}>
                  "{inq.message}"
                </p>
              </div>
              <div className="inquiry-time">
                {new Date(inq.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
