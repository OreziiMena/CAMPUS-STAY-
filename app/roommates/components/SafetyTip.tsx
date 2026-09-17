"use client";

import React from "react";
import Link from "next/link";

interface SafetyTipProps {
  showSafetyTip: boolean;
  onClose: () => void;
}

export default function SafetyTip({ showSafetyTip, onClose }: SafetyTipProps) {
  if (!showSafetyTip) return null;

  return (
    <div className="safety-tip-card">
      <div className="safety-tip-icon-container">
        <div className="safety-tip-icon-bg">
          <i className="fas fa-certificate safety-tip-icon-cert"></i>
          <i className="fas fa-check safety-tip-icon-check"></i>
        </div>
      </div>
      
      <div className="safety-tip-content">
        <h4 className="safety-tip-title">Safety Tip</h4>
        <p className="safety-tip-text">
          For your safety, always check for the <span className="roommate-safety-badge-wrap">
            <i className="fas fa-certificate roommate-safety-cert-icon"></i>
            <i className="fas fa-check roommate-safety-check-icon"></i>
          </span> verification badge, it means the student has completed ID verification.
        </p>
        <Link href="/student-dashboard/profile" className="safety-tip-link">
          Verify your account now for added trust.
        </Link>
      </div>

      <button 
        type="button"
        onClick={onClose} 
        className="roommate-safety-close-btn"
        title="Close safety tip"
      >
        &times;
      </button>
    </div>
  );
}
