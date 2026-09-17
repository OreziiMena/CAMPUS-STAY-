"use client";

import React from "react";
import Link from "next/link";
import { calculateRoommateCompatibility } from "@/lib/roommate-helper";

interface CardProps {
  listing: any;
  currentUser: any;
  playingVideoId: string | null;
  onPlayVideo: (listingId: string) => void;
  onStopVideo: () => void;
  onViewDetails: (listing: any) => void;
  onPairUp: (listing: any) => void;
  onMessage: (studentUserId: string) => void;
}

export default function Card({
  listing,
  currentUser,
  playingVideoId,
  onPlayVideo,
  onStopVideo,
  onViewDetails,
  onPairUp,
  onMessage,
}: CardProps) {
  const student = listing.student;
  const initials = student?.fullName
    ? (student.fullName.split(" ")[0]?.charAt(0) || "") +
      (student.fullName.split(" ")[1]?.charAt(0) || "")
    : "ST";

  const isLookingToPair = listing.roommateIntent === "LOOKING_TO_PAIR";
  const isOwner = Boolean(
    listing.isOwner || (currentUser && student?.userId === currentUser?.id)
  );

  // Dynamic progress calculation
  const targetRent = listing.targetTotalRent || (listing.myBudget || listing.price) * 2;
  const pledgedRent = listing.myBudget || listing.price;
  const splitPct = Math.min(100, Math.round((pledgedRent / targetRent) * 100));
  const neededRent = Math.max(0, targetRent - pledgedRent);

  // Compatibility matching (Strictly Dept, Level, Gender)
  const viewerPrefs = currentUser?.studentProfile?.preferences as any;
  const compat = calculateRoommateCompatibility(viewerPrefs, {
    department: listing.department,
    level: listing.level,
    gender: student?.gender,
    genderPreference: listing.genderPreference,
  });

  return (
    <div className="roommate-card roommate-card-custom">
      <div>
        {/* Roommate Header */}
        <div className="roommate-card-header roommate-card-header-row">
          <div className="roommate-avatar roommate-avatar-custom">
            {initials.toUpperCase()}
          </div>
          <div className="roommate-header-info roommate-header-info-col">
            <h3 className="roommate-owner-name">
              {student ? `@${student.username}` : "Student"}
              {student?.isVerified && (
                <i className="fas fa-check-circle verified-badge roommate-verified-badge" title="Verified Student"></i>
              )}
            </h3>
            <span className="roommate-gender-dept">
              <i className="fas fa-graduation-cap"></i> {listing.university}
            </span>
          </div>
          <div className="roommate-badges-right">
            {!listing.isAvailable ? (
              <span className="roommate-paired-badge" title="Roommate listing paired">
                <i className="fas fa-lock"></i> PAIRED
              </span>
            ) : isLookingToPair ? (
              <span className="roommate-corent-badge">
                <i className="fas fa-handshake"></i> CO-RENTING
              </span>
            ) : (
              <span className="roommate-sublet-badge">
                <i className="fas fa-door-open"></i> HAS SPACE
              </span>
            )}
          </div>
        </div>

        {/* Media Box */}
        {listing.images && listing.images.length > 0 && (
          <div className="roommate-media-box">
            {(() => {
              const mediaUrl = listing.images[0];
              const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
              const posterUrl = listing.images.find((img: string) => !img.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i));
              const defaultImg = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
              const isPlaying = playingVideoId === listing.id;

              if (isVideo) {
                return (
                  <>
                    {isPlaying ? (
                      <>
                        <video 
                          src={mediaUrl} 
                          className="roommate-media-img" 
                          controls
                          autoPlay
                          playsInline 
                          preload="metadata"
                        />
                        <button
                          type="button"
                          className="roommate-video-close-btn"
                          title="Close Video"
                          aria-label="Close Video"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onStopVideo();
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    ) : (
                      <>
                        <img 
                          src={posterUrl || defaultImg} 
                          alt={listing.title} 
                          className="roommate-media-img" 
                          loading="lazy"
                        />
                        <div className="roommate-video-tour-badge">
                          <i className="fas fa-video"></i> Video Tour
                        </div>
                        <button
                          type="button"
                          className="roommate-video-play-btn"
                          title="Play Video Tour"
                          aria-label="Play Video Tour"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onPlayVideo(listing.id);
                          }}
                        >
                          <i className="fas fa-play"></i>
                        </button>
                      </>
                    )}
                  </>
                );
              }

              return (
                <img 
                  src={mediaUrl} 
                  alt={listing.title} 
                  className="roommate-media-img" 
                  loading="lazy"
                />
              );
            })()}
            <span className="roommate-media-type-badge">
              {listing.hostelType}
            </span>
          </div>
        )}

        {/* Price & Target Row */}
        {isLookingToPair ? (
          <div className="roommate-price-row">
            <h3 className="roommate-price-title">
              ₦{pledgedRent.toLocaleString()}
              <span className="roommate-price-subtext">/ person</span>
            </h3>
            <span className="roommate-target-badge" title="Target total apartment rent">
              Target: ₦{targetRent.toLocaleString()}
            </span>
          </div>
        ) : (
          <div className="roommate-price-row">
            <h3 className="roommate-price-title">
              ₦{listing.price.toLocaleString()}
              <span className="roommate-price-subtext">/ share</span>
            </h3>
          </div>
        )}

        {/* Title & Location */}
        <h4 className="roommate-listing-title">
          {listing.title}
        </h4>

        <div className="roommate-location-pill">
          <i className="fas fa-map-marker-alt roommate-map-icon"></i>
          <span>{listing.location} {listing.distance ? `(${listing.distance})` : ""}</span>
        </div>

        {/* Academic & Gender Pills */}
        <div className="roommate-dept-level-row">
          {listing.department && (
            <span className="roommate-dept-pill">
              <i className="fas fa-book-reader"></i> {listing.department}
            </span>
          )}
          {listing.level && (
            <span className="roommate-level-pill">
              <i className="fas fa-user-graduate"></i> {listing.level}
            </span>
          )}
          {student?.gender && (
            <span className="roommate-dept-pill roommate-pill-pink">
              <i className="fas fa-venus-mars"></i> {student.gender}
            </span>
          )}
          {listing.genderPreference && listing.genderPreference !== "Any" && (
            <span className="roommate-dept-pill roommate-pill-amber">
              <i className="fas fa-heart"></i> Prefers: {listing.genderPreference}
            </span>
          )}
        </div>

        {/* Compact Compatibility / Status Badge */}
        {isOwner ? (
          <div className="roommate-compat-pill verified">
            <i className="fas fa-check-circle"></i>
            <span>{listing.isVerified ? "Verified & Live" : "Pending Admin Approval"}</span>
          </div>
        ) : (
          <div className={`roommate-compat-pill ${compat.badgeClass}`}>
            <i className="fas fa-shield-heart"></i>
            <span>
              {compat.badgeClass !== "guest" ? `${compat.score}% Match • ${compat.label}` : compat.label}
            </span>
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="roommate-card-footer roommate-card-footer-row">
        <button
          type="button"
          onClick={() => onViewDetails(listing)}
          className="message-roommate-btn roommate-chat-btn-custom"
        >
          <i className="fas fa-info-circle"></i> Details
        </button>
        {isOwner ? (
          <Link
            href="/student-dashboard"
            className="message-roommate-btn roommate-manage-btn"
          >
            <i className="fas fa-tasks"></i> Manage Listing
          </Link>
        ) : !listing.isAvailable ? (
          <button
            type="button"
            className="message-roommate-btn roommate-paired-btn"
            disabled
          >
            <i className="fas fa-lock"></i> Paired
          </button>
        ) : isLookingToPair ? (
          <button
            type="button"
            onClick={() => onPairUp(listing)}
            className="message-roommate-btn roommate-pairup-btn"
          >
            <i className="fas fa-handshake"></i> Pair Up
          </button>
        ) : (
          <button
            type="button"
            onClick={() => student && onMessage(student.userId)}
            className="message-roommate-btn roommate-view-btn-custom"
            disabled={!student}
          >
            <i className="fas fa-comments"></i> Message
          </button>
        )}
      </div>
    </div>
  );
}
