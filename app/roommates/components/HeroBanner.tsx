"use client";

import React from "react";

interface HeroBannerProps {
  onListRoommateClick: () => void;
  onEditCompatClick?: () => void;
  isStudent?: boolean;
}

export default function HeroBanner({ onListRoommateClick, onEditCompatClick, isStudent }: HeroBannerProps) {
  return (
    <section className="roommates-hero">
      <h1>Find Roommates</h1>
      <p>
        Connect with verified students near your campus to share hostel apartments,
        split rent bills, and build great roommate compatibility relationships.
      </p>
      <div className="hero-actions">
        <button 
          type="button"
          onClick={onListRoommateClick} 
          className="list-roommate-hero-btn"
        >
          <i className="fas fa-plus-circle"></i> Find or List Roommate Space
        </button>
        {isStudent && onEditCompatClick && (
          <button
            type="button"
            onClick={onEditCompatClick}
            className="hero-compat-edit-btn"
            title="Edit your Department, Level or Gender if there is a mistake"
          >
            <i className="fas fa-sliders-h"></i> Edit Match Profile
          </button>
        )}
      </div>
    </section>
  );
}
