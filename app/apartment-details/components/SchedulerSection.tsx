import React from "react";
import Link from "next/link";

interface SchedulerSectionProps {
  propertyId: string;
  currentUser: any;
  isUnlocked: boolean;
  onUnlockClick: () => void;
  viewingDate: string;
  setViewingDate: (date: string) => void;
  viewingTime: string;
  setViewingTime: (time: string) => void;
  viewingNote: string;
  setViewingNote: (note: string) => void;
  schedulingStatus: string;
  isScheduling: boolean;
  onScheduleViewing: (e: React.FormEvent) => void;
}

export default function SchedulerSection({
  propertyId,
  currentUser,
  isUnlocked,
  onUnlockClick,
  viewingDate,
  setViewingDate,
  viewingTime,
  setViewingTime,
  viewingNote,
  setViewingNote,
  schedulingStatus,
  isScheduling,
  onScheduleViewing,
}: SchedulerSectionProps) {
  return (
    <section id="scheduler" className="content-card scheduling-card">
      <div className="scheduling-header">
        <div>
          <h3 className="scheduling-header-title">
            Schedule an In-Person Inspection
          </h3>
          <p className="scheduling-header-sub">
            Select your preferred date and time to meet the verified agent at the hostel.
          </p>
        </div>
      </div>
      
      {!currentUser ? (
        <div className="scheduling-locked-overlay">
          <h4>Ready to Inspect in Person?</h4>
          <p>Log in or sign up to schedule an in-person viewing appointment with the agent.</p>
          <Link href={`/auth/login?redirect=/apartment-details?id=${propertyId}`} className="primary-btn btn-sm">
            <i className="fas fa-sign-in-alt"></i> Log in to Schedule Viewing
          </Link>
        </div>
      ) : !isUnlocked ? (
        <div className="scheduler-locked-box">
          <div className="scheduler-lock-icon-wrap">
            <i className="fas fa-lock"></i>
          </div>
          <h4>₦7,500 Inspection Fee Required</h4>
          <p>
            To protect students and verified agents against ghost visits, an inspection fee of ₦7,500 is required before booking in-person physical inspections. It is fully refundable if the inspection was cancelled by the agent.
          </p>
          <div className="inspection-bonus-card inspection-bonus-card-adjusted">
            <div className="inspection-bonus-title">
              <i className="fas fa-sparkles"></i> Package Bonus
            </div>
            <p className="inspection-bonus-text">
              "Your ₦7,500 fee covers a physical inspection of this property, plus any alternative options the agent has available in the same area/budget."
            </p>
          </div>
          <button
            type="button"
            className="pay-inspection-btn pay-inspection-btn-adjusted"
            onClick={onUnlockClick}
          >
            <i className="fas fa-bolt"></i> Check Availability & Pay ₦7,500
          </button>
        </div>
      ) : (
        <form onSubmit={onScheduleViewing} className="scheduling-form">
          <div className="scheduling-inputs-grid">
            <div className="input-group">
              <label htmlFor="viewing-date">
                1. Select Inspection Date *
              </label>
              <input 
                type="date" 
                id="viewing-date" 
                value={viewingDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setViewingDate(e.target.value)}
                required 
                className="scheduling-time-input"
              />
            </div>

            <div className="input-group">
              <label htmlFor="viewing-time">
                2. Select Time
              </label>
              <input 
                type="time" 
                id="viewing-time" 
                value={viewingTime}
                onChange={(e) => setViewingTime(e.target.value)}
                required 
                className="scheduling-time-input"
              />
            </div>
          </div>

          {/* Popular Quick Time Chips */}
          <div className="time-chips-container">
            <span className="time-chips-label">Quick select time:</span>
            <div className="time-chips-list">
              {[
                { label: "10:00 AM", value: "10:00" },
                { label: "12:00 PM", value: "12:00" },
                { label: "02:00 PM", value: "14:00" },
                { label: "04:00 PM", value: "16:00" },
                { label: "05:30 PM", value: "17:30" },
              ].map((slot) => (
                <button
                  type="button"
                  key={slot.value}
                  className={`time-chip-btn ${viewingTime === slot.value ? "active" : ""}`}
                  onClick={() => setViewingTime(slot.value)}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div className="input-group">
            <label htmlFor="viewing-note" className="viewing-note-label">
              <i className="fas fa-comment-alt"></i> Notes for Agent (optional)
            </label>
            <input
              type="text"
              id="viewing-note"
              placeholder="Add any specific questions or inspection requests (optional)..."
              value={viewingNote}
              onChange={(e) => setViewingNote(e.target.value)}
              className="scheduling-time-input"
            />
          </div>

          {/* Selected Appointment Preview Banner */}
          {viewingDate && viewingTime && (
            <div className="appointment-preview-badge">
              <i className="fas fa-check-circle"></i>
              <span>
                Selected: <strong>{new Date(`${viewingDate}T${viewingTime}`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</strong> at <strong>{new Date(`${viewingDate}T${viewingTime}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</strong>
              </span>
            </div>
          )}

          {/* Feedback Banner */}
          {schedulingStatus && (
            <div className={`scheduling-feedback ${schedulingStatus.startsWith("Error") ? "error" : "success"}`}>
              <i className={schedulingStatus.startsWith("Error") ? "fas fa-exclamation-circle" : "fas fa-check-circle"}></i>
              <span>{schedulingStatus}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="primary-btn" 
            disabled={isScheduling || !viewingDate || !viewingTime}
          >
            {isScheduling ? (
              <><i className="fas fa-spinner fa-spin"></i> Requesting Appointment...</>
            ) : !viewingDate || !viewingTime ? (
              <><i className="fas fa-calendar"></i> Select Date & Time to Book</>
            ) : (
              <><i className="fas fa-calendar-check"></i> Confirm & Schedule Viewing Appointment</>
            )}
          </button>
        </form>
      )}
      
    </section>
    
  );
}
