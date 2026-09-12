import React from "react";

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3 style={{ margin: 0, color: "#c53030", fontFamily: "'Poppins', sans-serif" }}>
            <i className="fas fa-flag"></i> Report Listing
          </h3>
          <button 
            onClick={onClose} 
            style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
            aria-label="Close modal"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {reportSuccess ? (
          <div style={{ padding: "20px", background: "#f0fff4", color: "#276749", borderRadius: "8px", textAlign: "center" }}>
            <i className="fas fa-check-circle" style={{ fontSize: "30px", marginBottom: "10px" }}></i>
            <p style={{ margin: 0, fontWeight: 600 }}>{reportSuccess}</p>
          </div>
        ) : (
          <form onSubmit={onReportSubmit}>
            {reportError && (
              <div style={{ padding: "10px", background: "#fff5f5", color: "#c53030", borderRadius: "6px", marginBottom: "15px", fontSize: "14px" }}>
                {reportError}
              </div>
            )}

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                Reason for Report:
              </label>
              <select 
                value={reportReason} 
                onChange={(e) => setReportReason(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }}
              >
                <option value="FRAUD_SCAM">Fraudulent or Scam Listing</option>
                <option value="INACCURATE_PRICE">Inaccurate or Hidden Price</option>
                <option value="FAKE_PHOTOS">Fake or Misleading Photos</option>
                <option value="UNAVAILABLE">Apartment Already Taken / Unavailable</option>
                <option value="HARASSMENT_UNPROFESSIONAL">Unprofessional Behavior by Agent</option>
                <option value="OTHER">Other Reason</option>
              </select>
            </div>

            {reportReason === "OTHER" && (
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                  Specify Reason:
                </label>
                <input 
                  type="text" 
                  value={reportCustomReason} 
                  onChange={(e) => setReportCustomReason(e.target.value)}
                  placeholder="Briefly state the reason..."
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", boxSizing: "border-box" }}
                  required
                />
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                Detailed Description:
              </label>
              <textarea 
                rows={4} 
                value={reportDescription} 
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Please describe why this listing is problematic..."
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", boxSizing: "border-box" }}
                required
              ></textarea>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button 
                type="button" 
                onClick={onClose}
                style={{ padding: "10px 18px", border: "1px solid #ccc", background: "#f7fafc", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmittingReport}
                style={{ padding: "10px 20px", border: "none", background: "#c53030", color: "#fff", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
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
