import React from "react";
import SearchableSelect from "@/components/SearchableSelect";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportReason: string;
  setReportReason: (reason: string) => void;
  reportCustomReason: string;
  setReportCustomReason: (reason: string) => void;
  reportDescription: string;
  setReportDescription: (desc: string) => void;
  isSubmittingReport: boolean;
  reportSuccess: string;
  reportError: string;
  onReportSubmit: (e: React.FormEvent) => void;
}

const REPORT_OPTIONS = [
  { code: "FRAUD_SCAM", name: "Fraudulent or Scam Listing" },
  { code: "INACCURATE_PRICE", name: "Inaccurate or Hidden Price" },
  { code: "FAKE_PHOTOS", name: "Fake or Misleading Photos" },
  { code: "UNAVAILABLE", name: "Apartment Already Taken / Unavailable" },
  { code: "HARASSMENT_UNPROFESSIONAL", name: "Unprofessional Behavior by Agent" },
  { code: "OTHER", name: "Other Reason" },
];

export default function ReportModal({
  isOpen,
  onClose,
  reportReason,
  setReportReason,
  reportCustomReason,
  setReportCustomReason,
  reportDescription,
  setReportDescription,
  isSubmittingReport,
  reportSuccess,
  reportError,
  onReportSubmit,
}: ReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-flex">
          <h3 className="modal-title-danger">
            <i className="fas fa-flag"></i> Report Listing
          </h3>
          <button 
            onClick={onClose} 
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {reportSuccess ? (
          <div className="modal-success-box">
            <i className="fas fa-check-circle modal-success-icon"></i>
            <p className="modal-success-text">{reportSuccess}</p>
          </div>
        ) : (
          <form onSubmit={onReportSubmit}>
            {reportError && (
              <div className="modal-error-box">
                {reportError}
              </div>
            )}

            <div className="modal-form-group">
              <label className="modal-label">
                Reason for Report:
              </label>
              <SearchableSelect
                options={REPORT_OPTIONS}
                value={reportReason}
                onChange={setReportReason}
                placeholder="Select reason..."
                searchable={false}
              />
            </div>

            {reportReason === "OTHER" && (
              <div className="modal-form-group">
                <label className="modal-label">
                  Specify Reason:
                </label>
                <input 
                  type="text" 
                  value={reportCustomReason} 
                  onChange={(e) => setReportCustomReason(e.target.value)}
                  placeholder="Briefly state the reason..."
                  className="modal-input"
                  required
                />
              </div>
            )}

            <div className="modal-form-group">
              <label className="modal-label">
                Detailed Description:
              </label>
              <textarea 
                rows={4} 
                value={reportDescription} 
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Please describe why this listing is problematic..."
                className="modal-textarea"
                required
              ></textarea>
            </div>

            <div className="modal-footer-flex">
              <button 
                type="button" 
                onClick={onClose}
                className="modal-cancel-btn"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmittingReport}
                className="modal-danger-btn"
              >
                {isSubmittingReport ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

