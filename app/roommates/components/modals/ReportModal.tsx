"use client";

import React, { useState } from "react";
import SearchableSelect from "@/components/SearchableSelect";
import { submitReport } from "@/app/actions/reports";
import { getCurrentUser } from "@/app/actions/auth";
import { useToast } from "@/components/ToastProvider";
import { useRouter } from "next/navigation";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  roommateStudentId?: string;
  reportReasons: Array<{ code: string; name: string }>;
}

export default function ReportModal({
  isOpen,
  onClose,
  roommateStudentId,
  reportReasons,
}: ReportModalProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [reportReason, setReportReason] = useState<any>("FRAUD_SCAM");
  const [reportCustomReason, setReportCustomReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState("");
  const [reportError, setReportError] = useState("");

  if (!isOpen) return null;

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportError("");
    setReportSuccess("");

    const activeUser = await getCurrentUser();
    if (!activeUser) {
      showToast("Please log in to submit a report.", "error");
      router.push("/auth/login");
      return;
    }

    if (!roommateStudentId) return;

    if (!reportDescription || reportDescription.trim().length < 10) {
      setReportError("Please provide a detailed description (minimum 10 characters).");
      return;
    }

    setIsSubmittingReport(true);

    try {
      const res = await submitReport({
        roommateId: roommateStudentId,
        reason: reportReason,
        customReason: reportReason === "OTHER" ? reportCustomReason : undefined,
        description: reportDescription,
      });

      setIsSubmittingReport(false);

      if (res.success) {
        setReportSuccess("Roommate listing reported successfully. Thank you!");
        setTimeout(() => {
          onClose();
          setReportReason("FRAUD_SCAM");
          setReportCustomReason("");
          setReportDescription("");
          setReportSuccess("");
        }, 2000);
      } else {
        setReportError(res.error || "Failed to submit report.");
      }
    } catch (err: any) {
      setIsSubmittingReport(false);
      setReportError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="roommate-report-overlay" onClick={onClose}>
      <div className="roommate-report-card" onClick={(e) => e.stopPropagation()}>
        <div className="roommate-report-header">
          <h2 className="roommate-report-title">
            <i className="fas fa-flag"></i> Report Roommate
          </h2>
          <button type="button" className="roommate-report-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="roommate-report-body">
          {reportSuccess ? (
            <div className="roommate-report-success-box">
              <i className="fas fa-check-circle roommate-report-success-icon"></i>
              <p className="roommate-report-success-msg">{reportSuccess}</p>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="roommate-report-form">
              {reportError && (
                <div className="roommate-report-error">
                  {reportError}
                </div>
              )}

              <div className="roommate-report-field">
                <label className="roommate-report-label">Reason for Flagging *</label>
                <SearchableSelect
                  options={reportReasons}
                  value={reportReason}
                  onChange={(val) => setReportReason(val)}
                  placeholder="Select reason for flagging..."
                  required
                />
              </div>

              {reportReason === "OTHER" && (
                <div className="roommate-report-field">
                  <label className="roommate-report-label">Specify Reason *</label>
                  <input
                    type="text"
                    placeholder="Specify the reason..."
                    value={reportCustomReason}
                    onChange={(e) => setReportCustomReason(e.target.value)}
                    className="roommate-report-input"
                    required
                  />
                </div>
              )}

              <div className="roommate-report-field">
                <label className="roommate-report-label">Describe the issue *</label>
                <textarea
                  placeholder="Please describe why you are reporting this roommate profile..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="roommate-report-textarea"
                  required
                />
              </div>

              <div className="roommate-report-actions">
                <button type="button" className="roommate-report-cancel-btn" onClick={onClose}>Cancel</button>
                <button type="submit" disabled={isSubmittingReport} className="roommate-report-submit-btn">
                  {isSubmittingReport ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : "Submit Report"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
