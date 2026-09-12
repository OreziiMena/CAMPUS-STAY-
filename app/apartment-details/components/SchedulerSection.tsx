import React from "react";
import Link from "next/link";

interface SchedulerSectionProps {
  propertyId: string;
  currentUser: any;
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
          <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "700", color: "rgb(2, 53, 28)" }}>
            Schedule an In-Person Inspection
          </h3>
          <p style={{ margin: "3px 0 0 0", fontSize: "0.83rem", color: "#64748b" }}>
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
            <label htmlFor="viewing-note" style={{ fontSize: "0.82rem", color: "#64748b" }}>
              <i className="fas fa-comment-alt"></i> Notes for Agent (optional)
            </label>
            <input
              type="text"
              id="viewing-note"
              placeholder="e.g. Inspecting with a coursemate, question about gate closing time..."
              value={viewingNote}
              onChange={(e) => setViewingNote(e.target.value)}
              className="scheduling-time-input"
            />
          </div>

          {/* Selected Appointment Preview Banner */}
          {viewingDate && viewingTime && (
            <div className="appointment-preview-badge">
              <i className="fas fa-check-circle" style={{ color: "#16a34a" }}></i>
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
