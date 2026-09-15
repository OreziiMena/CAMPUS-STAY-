import React from "react";
import Link from "next/link";

interface StudentVerificationAlertProps {
  profile: any;
}

export default function StudentVerificationAlert({ profile }: StudentVerificationAlertProps) {
  if (profile?.isVerified) {
    return (
      <div className="verification-alert verified">
        <i className="fas fa-check-circle verified-icon"></i>
        <div className="alert-details">
          <h4>Student Identity Verified</h4>
          <p>All student features are unlocked! You can now contact agents directly and schedule physical viewings.</p>
        </div>
      </div>
    );
  }

  if (profile?.idCardDoc || profile?.feesReceiptDoc || profile?.portalScreenshotDoc) {
    return (
      <div className="verification-alert pending">
        <i className="fas fa-clock pending-icon"></i>
        <div className="alert-details">
          <h4>Verification Review Pending</h4>
          <p>We are reviewing your uploaded document(s). You will unlock full permissions once verified by our admin team.</p>
        </div>
        <Link href="/student-dashboard/profile" className="alert-action-btn">
          Check Status
        </Link>
      </div>
    );
  }

  return (
    <div className="verification-alert unverified">
      <i className="fas fa-exclamation-triangle unverified-icon"></i>
      <div className="alert-details">
        <h4>Verification Required</h4>
        <p>Your profile is unverified. Please upload at least one document (Student ID, current fees receipt, or portal screenshot) to unlock agent contacts, direct messaging, and physical viewings.</p>
      </div>
      <Link href="/student-dashboard/profile" className="alert-action-btn verify">
        Verify Now
      </Link>
    </div>
  );
}
