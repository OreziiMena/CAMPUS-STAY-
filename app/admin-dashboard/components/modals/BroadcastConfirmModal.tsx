import React from "react";

interface BroadcastConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  audience: "ALL" | "STUDENTS" | "AGENTS" | "VERIFIED_STUDENTS" | "VERIFIED_AGENTS";
  stats: {
    all: number;
    students: number;
    agents: number;
    verifiedStudents: number;
    verifiedAgents: number;
  };
  subject: string;
  senderOption: "support" | "noreply";
}

export default function BroadcastConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  audience,
  stats,
  subject,
  senderOption,
}: BroadcastConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="admin-modal-overlay"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="admin-modal-container confirm-dialog"
      >
        <div className="confirm-dialog-top">
          <div className="confirm-dialog-icon">
            <i className="fas fa-paper-plane"></i>
          </div>
          <div>
            <h3 className="confirm-dialog-title">
              Confirm Broadcast Dispatch
            </h3>
            <div className="confirm-dialog-sub">
              Official Email Announcement via Resend
            </div>
          </div>
        </div>

        <div className="confirm-summary-box">
          <div className="confirm-summary-row">
            <span className="confirm-summary-label">Target Audience:</span>{" "}
            <strong>
              {audience === "ALL"
                ? `All Users (${stats.all} recipients)`
                : audience === "STUDENTS"
                  ? `All Students (${stats.students} recipients)`
                  : audience === "AGENTS"
                    ? `All Agents (${stats.agents} recipients)`
                    : audience === "VERIFIED_STUDENTS"
                      ? `Verified Students (${stats.verifiedStudents} recipients)`
                      : `Verified Agents (${stats.verifiedAgents} recipients)`}
            </strong>
          </div>
          <div className="confirm-summary-row">
            <span className="confirm-summary-label">Subject:</span>{" "}
            <strong>{subject}</strong>
          </div>
          <div>
            <span className="confirm-summary-label">Sender:</span>{" "}
            <span>Campus Tent &lt;{senderOption === "support" ? "support@campustent.com" : "noreply@campustent.com"}&gt;</span>
          </div>
        </div>

        <p className="confirm-warning-text">
          Are you sure you want to broadcast this announcement email to all targeted users immediately?
        </p>

        <div className="confirm-actions-row">
          <button
            type="button"
            onClick={onClose}
            className="confirm-btn-cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="confirm-btn-submit"
          >
            Yes, Send Broadcast Now
          </button>
        </div>
      </div>
    </div>
  );
}
