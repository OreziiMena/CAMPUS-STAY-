"use client";

import React from "react";

interface HeroBannerProps {
  onListRoommateClick: () => void;
}

export default function HeroBanner({ onListRoommateClick }: HeroBannerProps) {
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
          <i className="fas fa-plus-circle"></i>Find or List Your Roommate Space
        </button>
      </div>
    </section>
  );
}
