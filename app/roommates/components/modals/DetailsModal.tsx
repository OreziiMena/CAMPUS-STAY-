"use client";

import React from "react";
import Link from "next/link";

interface DetailsModalProps {
  listing: any | null;
  onClose: () => void;
  onReportClick: () => void;
  onPairUpClick: (listing: any) => void;
  onMessageClick: (studentUserId: string) => void;
}

export default function DetailsModal({
  listing,
  onClose,
  onReportClick,
  onPairUpClick,
  onMessageClick,
}: DetailsModalProps) {
  if (!listing) return null;

  const student = listing.student;
  const initials = (
    (student?.fullName?.split(" ")[0]?.charAt(0) || "") +
    (student?.fullName?.split(" ")[1]?.charAt(0) || "") || "ST"
  ).toUpperCase();

  const isLookingToPair = listing.roommateIntent === "LOOKING_TO_PAIR";
  const isOwner = Boolean(listing.isOwner);
  const targetRent = listing.targetTotalRent || (listing.myBudget || listing.price) * 2;
  const pledgedRent = listing.myBudget || listing.price;
  const neededRent = Math.max(0, targetRent - pledgedRent);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card roommate-details-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-user-circle"></i> Roommate & Space Details
          </h2>
          <div className="roommate-header-actions">
            {!isOwner && (
              <button 
                type="button"
                title="Report Listing" 
                onClick={onReportClick}
                className="roommate-report-trigger-btn"
              >
                <i className="fas fa-flag"></i>
              </button>
            )}
            <button type="button" className="modal-close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        <div className="modal-body roommate-details-body">
          {/* Profile Card Header */}
          <div className="roommate-details-header-row">
            <div className="roommate-details-avatar">
              {initials}
            </div>
            <div>
              <h3 className="roommate-details-name">
                {student?.fullName || "Student"}
                {student?.isVerified && (
                  <i className="fas fa-check-circle verified-badge roommate-verified-badge" title="Verified Student"></i>
                )}
              </h3>
              <p className="roommate-details-handle">
                @{student?.username || "student"} &bull; {listing.university}
              </p>
            </div>
          </div>

          {/* Space details */}
          <div className="roommate-details-amenities-wrap">
            {listing.images && listing.images.length > 0 && (
              <div className="roommate-details-media-box">
                {(() => {
                  const mediaUrl = listing.images[0];
                  const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
                  return isVideo ? (
                    <video 
                      src={mediaUrl} 
                      className="roommate-details-media-el" 
                      controls
                      playsInline 
                    />
                  ) : (
                    <img 
                      src={mediaUrl} 
                      alt={listing.title} 
                      className="roommate-details-media-el" 
                    />
                  );
                })()}
              </div>
            )}
            
            <span className="roommate-details-hostel-tag">
              {listing.hostelType}
            </span>
            
            <h4 className="roommate-details-title">
              {listing.title}
            </h4>
            
            {isLookingToPair ? (
              <div className="proposal-summary-box proposal-summary-box-spaced">
                <div className="proposal-summary-header">
                  <span className="roommate-corent-badge">
                    <i className="fas fa-handshake"></i> Unpaid Co-Renting Flat
                  </span>
                  <span className="proposal-slots-indicator">
                    {listing.slotsFilled || 1} of {listing.slotsTotal || 2} students
                  </span>
                </div>
                <div className="proposal-grid-metrics">
                  <div className="proposal-metric">
                    <span className="proposal-metric-lbl">Target Rent Needed</span>
                    <span className="proposal-metric-val">₦{targetRent.toLocaleString()}</span>
                  </div>
                  <div className="proposal-metric">
                    <span className="proposal-metric-lbl">My Budget</span>
                    <span className="proposal-metric-val green">₦{pledgedRent.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <h3 className="roommate-details-price">
                ₦{listing.price.toLocaleString()} <span className="roommate-details-price-unit">/ year</span>
              </h3>
            )}

            <div className="roommate-details-pill-row">
              <div className="roommate-details-pill">
                <i className="fas fa-map-marker-alt roommate-details-pill-icon-loc"></i>
                <span>{listing.location}</span>
              </div>
              <div className="roommate-details-pill">
                <i className="far fa-clock roommate-details-pill-icon-clock"></i>
                <span>{listing.distance}</span>
              </div>
            </div>

            <h5 className="roommate-details-sec-heading">Description</h5>
            <p className="roommate-details-desc-text">
              {listing.description}
            </p>
          </div>

          {/* Academic & Compatibility Profile */}
          <div className="roommate-details-pref-box">
            <h5 className="roommate-details-pref-heading">Academic & Compatibility Profile</h5>
            <div className="roommate-details-pref-wrap">
              {listing.department && (
                <span className="roommate-details-pref-tag">
                  <i className="fas fa-book-reader"></i> Dept: {listing.department}
                </span>
              )}
              {listing.level && (
                <span className="roommate-details-pref-tag">
                  <i className="fas fa-user-graduate"></i> Level: {listing.level}
                </span>
              )}
              {student?.gender && (
                <span className="roommate-details-pref-tag">
                  <i className="fas fa-venus-mars"></i> Gender: {student.gender}
                </span>
              )}
              {listing.genderPreference && (
                <span className="roommate-details-pref-tag">
                  <i className="fas fa-heart"></i> Prefers: {listing.genderPreference}
                </span>
              )}
            </div>
          </div>

          {/* Included Amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="roommate-details-amenities-wrap">
              <h5 className="roommate-details-amenities-heading">Included Amenities</h5>
              <div className="roommate-details-pref-wrap">
                {listing.amenities.map((amenity: string, idx: number) => (
                  <span key={idx} className="roommate-details-amenity-pill">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer action buttons */}
          <div className="roommate-details-footer">
            <button 
              type="button" 
              onClick={onClose} 
              className="roommate-details-close-btn"
            >
              Close Details
            </button>
            {isOwner ? (
              <Link 
                href="/student-dashboard" 
                className="roommate-details-msg-btn roommate-manage-btn"
              >
                <i className="fas fa-tasks"></i> Manage in Dashboard
              </Link>
            ) : !listing.isAvailable ? (
              <button 
                type="button" 
                disabled
                className="roommate-details-msg-btn roommate-paired-btn"
              >
                <i className="fas fa-lock"></i> Roommate Paired
              </button>
            ) : isLookingToPair ? (
              <button 
                type="button" 
                onClick={() => {
                  onClose();
                  onPairUpClick(listing);
                }} 
                disabled={!student}
                className="roommate-details-msg-btn roommate-pairup-btn"
              >
                <i className="fas fa-handshake"></i> Request to Pair Up
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => {
                  if (student) {
                    onClose();
                    onMessageClick(student.userId);
                  }
                }} 
                disabled={!student}
                className="roommate-details-msg-btn"
              >
                <i className="fas fa-comments"></i> Message Roommate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
