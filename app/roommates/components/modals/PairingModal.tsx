"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SearchableSelect from "@/components/SearchableSelect";
import { sendPairingProposal } from "@/app/actions/student";
import { useToast } from "@/components/ToastProvider";

interface PairingModalProps {
  isOpen: boolean;
  listing: any | null;
  currentUser: any;
  onClose: () => void;
  levelOptions: Array<{ code: string; name: string }>;
}

export default function PairingModal({
  isOpen,
  listing,
  currentUser,
  onClose,
  levelOptions,
}: PairingModalProps) {
  const { showToast } = useToast();
  const [pairingBudget, setPairingBudget] = useState("");
  const [pairingDept, setPairingDept] = useState("");
  const [pairingLevel, setPairingLevel] = useState("100L");
  const [pairingMessage, setPairingMessage] = useState("");
  const [isSubmittingPairing, setIsSubmittingPairing] = useState(false);
  const [pairingSuccessRoomId, setPairingSuccessRoomId] = useState<string | null>(null);
  const [pairingError, setPairingError] = useState("");

  useEffect(() => {
    if (listing) {
      const prefs = (currentUser?.studentProfile?.preferences as any) || {};
      const target = listing.targetTotalRent || (listing.myBudget || listing.price) * 2;
      const posterPledge = listing.myBudget || listing.price;
      const remainingNeeded = Math.max(0, target - posterPledge);

      setPairingBudget(remainingNeeded > 0 ? remainingNeeded.toString() : (target / 2).toString());
      setPairingDept(prefs.department || "");
      setPairingLevel(prefs.level || "100L");
      setPairingMessage(
        `Hi ${listing.student?.fullName?.split(" ")[0] || "there"}, I saw your co-renting request for "${listing.title}". I'm looking for a place and would love to pair up with you!`
      );
      setPairingError("");
      setPairingSuccessRoomId(null);
    }
  }, [listing, currentUser]);

  if (!isOpen || !listing) return null;

  const targetRent = listing.targetTotalRent || (listing.myBudget || listing.price) * 2;
  const posterPledge = listing.myBudget || listing.price;
  const myPledge = parseFloat(pairingBudget) || 0;
  const posterPct = Math.min(100, Math.round((posterPledge / targetRent) * 100));
  const myPct = Math.min(100 - posterPct, Math.round((myPledge / targetRent) * 100));
  const totalPct = Math.min(100, posterPct + myPct);
  const neededSplit = Math.max(0, targetRent - posterPledge);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPairingError("");

    if (isNaN(myPledge) || myPledge <= 0) {
      setPairingError("Please enter a valid budget contribution (₦).");
      return;
    }

    setIsSubmittingPairing(true);

    try {
      const res = await sendPairingProposal({
        listingId: listing.id,
        recipientUserId: listing.student?.userId,
        listingTitle: listing.title,
        proposedBudget: myPledge,
        introMessage: pairingMessage,
        senderDepartment: pairingDept || undefined,
        senderLevel: pairingLevel || undefined,
      });

      setIsSubmittingPairing(false);

      if (res.success && res.chatRoomId) {
        setPairingSuccessRoomId(res.chatRoomId);
        showToast("Pairing proposal sent! Conversation initiated.", "success");
      } else {
        setPairingError(res.error || "Failed to submit pairing proposal.");
      }
    } catch (err: any) {
      setIsSubmittingPairing(false);
      setPairingError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card proposal-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-handshake"></i> Request to Pair Up</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body modal-body-padded">
          {pairingSuccessRoomId ? (
            <div className="proposal-success-box">
              <i className="fas fa-check-circle proposal-success-icon"></i>
              <h3>Proposal Sent Successfully!</h3>
              <p>
                Your co-renting offer and compatibility profile have been sent to{" "}
                <strong>{listing.student?.fullName || "the student"}</strong>. A private chat room has been opened for you to coordinate.
              </p>
              <div className="proposal-success-actions">
                <Link href={`/chat?roomId=${pairingSuccessRoomId}`} className="proposal-chat-link-btn">
                  <i className="fas fa-comments"></i> Open Chat Conversation
                </Link>
                <button 
                  type="button" 
                  onClick={onClose}
                  className="proposal-cancel-btn btn-done-compact"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {pairingError && (
                <div className="roommate-form-error-banner form-banner-mb-16">
                  <i className="fas fa-exclamation-circle"></i> {pairingError}
                </div>
              )}

              {/* Apartment Summary Box */}
              <div className="proposal-summary-box">
                <div className="proposal-summary-title">
                  {listing.title}
                </div>
                <div className="proposal-summary-sub">
                  <i className="fas fa-map-marker-alt"></i> {listing.location} &bull; Poster: @{listing.student?.username || "student"}
                </div>

                <div className="proposal-grid-metrics">
                  <div className="proposal-metric">
                    <span className="proposal-metric-lbl">Target Rent</span>
                    <span className="proposal-metric-val">₦{targetRent.toLocaleString()}</span>
                  </div>
                  <div className="proposal-metric">
                    <span className="proposal-metric-lbl">Poster Pledged</span>
                    <span className="proposal-metric-val green">₦{posterPledge.toLocaleString()}</span>
                  </div>
                  <div className="proposal-metric">
                    <span className="proposal-metric-lbl">Needed Split</span>
                    <span className="proposal-metric-val amber">₦{neededSplit.toLocaleString()}</span>
                  </div>
                </div>

                {/* Dynamic Combined Coverage Meter */}
                <div className="proposal-calc-bar-wrap">
                  <div className="proposal-calc-bar-bg">
                    <div className="proposal-calc-bar-poster" style={{ width: `${posterPct}%` }} title={`Poster: ${posterPct}%`} />
                    <div className="proposal-calc-bar-viewer" style={{ width: `${myPct}%` }} title={`Your Pledge: ${myPct}%`} />
                  </div>
                  <div className="proposal-calc-bar-legend">
                    <span className="legend-item">
                      <span className="legend-dot poster"></span> Poster: ₦{posterPledge.toLocaleString()}
                    </span>
                    <span className="legend-item">
                      <span className="legend-dot viewer"></span> You: ₦{myPledge.toLocaleString()}
                    </span>
                    <span className="legend-item">
                      <strong>{totalPct}% Covered</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-group-custom form-group-mb-16">
                <label className="proposal-form-label">Your Proposed Contribution (₦/yr) *</label>
                <input 
                  type="number" 
                  className="proposal-input"
                  placeholder="e.g. 200000"
                  value={pairingBudget}
                  onChange={(e) => setPairingBudget(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-2 form-group-mb-16">
                <div className="form-group-custom">
                  <label className="proposal-form-label">Your Department</label>
                  <input 
                    type="text" 
                    className="proposal-input"
                    placeholder="e.g. Computer Science"
                    value={pairingDept}
                    onChange={(e) => setPairingDept(e.target.value)}
                  />
                </div>
                <div className="form-group-custom">
                  <label className="proposal-form-label">Your Academic Level</label>
                  <SearchableSelect
                    options={levelOptions}
                    value={pairingLevel}
                    onChange={(val) => setPairingLevel(val)}
                    placeholder="Select level..."
                  />
                </div>
              </div>

              <div className="form-group-custom form-group-mb-20">
                <label className="proposal-form-label">Message / Note to {listing.student?.fullName?.split(" ")[0] || "Student"} *</label>
                <textarea 
                  className="proposal-textarea"
                  placeholder="Introduce yourself and suggest an inspection date or talk about pairing preferences..."
                  value={pairingMessage}
                  onChange={(e) => setPairingMessage(e.target.value)}
                  required
                />
              </div>

              <div className="proposal-actions-row">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="proposal-cancel-btn"
                  disabled={isSubmittingPairing}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="proposal-submit-btn"
                  disabled={isSubmittingPairing}
                >
                  {isSubmittingPairing ? (
                    <><i className="fas fa-spinner fa-spin"></i> Submitting...</>
                  ) : (
                    <><i className="fas fa-paper-plane"></i> Send Pair Proposal</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
