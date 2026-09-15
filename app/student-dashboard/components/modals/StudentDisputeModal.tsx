import React from "react";
import SearchableSelect from "@/components/SearchableSelect";

interface StudentDisputeModalProps {
  payment: any | null;
  disputeReason: string;
  setDisputeReason: (reason: string) => void;
  disputeDesc: string;
  setDisputeDesc: (desc: string) => void;
  disputeLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const DISPUTE_OPTIONS = [
  { code: "Agent did not show up for inspection", name: "Agent did not show up for inspection" },
  { code: "Property was completely different from pictures", name: "Property was completely different from pictures" },
  { code: "Property already occupied / unavailable", name: "Property was already occupied / unavailable" },
  { code: "Agent was unresponsive or demanded extra fees", name: "Agent was unresponsive or demanded extra fees" },
  { code: "Other tour issue", name: "Other tour issue" },
];

export default function StudentDisputeModal({
  payment,
  disputeReason,
  setDisputeReason,
  disputeDesc,
  setDisputeDesc,
  disputeLoading,
  onSubmit,
  onClose,
}: StudentDisputeModalProps) {
  if (!payment) return null;

  return (
    <div className="student-modal-overlay" onClick={onClose}>
      <div className="student-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="student-modal-header dispute-modal-header">
          <div>
            <h3 className="receipt-modal-title">Report Tour Dispute / Request Refund</h3>
            <span className="dispute-ref-subtitle">Ref: {payment.reference}</span>
          </div>
          <button onClick={onClose} className="student-modal-close-btn">&times;</button>
        </div>
        <form onSubmit={onSubmit} className="dispute-form-body">
          <p className="dispute-intro-text">
            Did the scheduled inspection fail to occur or did you encounter an issue with the agent? File a dispute for admin review & refund evaluation.
          </p>

          <div className="dispute-form-group">
            <label className="dispute-form-label">
              Dispute Category
            </label>
            <SearchableSelect
              options={DISPUTE_OPTIONS}
              value={disputeReason}
              onChange={setDisputeReason}
              placeholder="Select dispute category..."
              searchable={false}
            />
          </div>

          <div className="dispute-form-group">
            <label className="dispute-form-label">
              Additional Details & Explanation
            </label>
            <textarea
              rows={4}
              placeholder="Please provide details about what happened during the scheduled appointment..."
              value={disputeDesc}
              onChange={(e) => setDisputeDesc(e.target.value)}
              className="dispute-textarea"
              required
            ></textarea>
          </div>

          <div className="receipt-actions-row">
            <button
              type="button"
              onClick={onClose}
              className="receipt-secondary-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={disputeLoading}
              className="dispute-submit-btn"
            >
              {disputeLoading ? "Submitting Dispute..." : "Submit Dispute to Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

