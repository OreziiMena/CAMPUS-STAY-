"use client";

import React from "react";

export type RoommateIntentFilter = "ALL" | "LOOKING_TO_PAIR" | "HAVE_SPACE";

interface IntentTabsProps {
  currentFilter: RoommateIntentFilter;
  onFilterChange: (filter: RoommateIntentFilter) => void;
  countAll: number;
  countPairing: number;
  countHaveSpace: number;
}

export default function IntentTabs({
  currentFilter,
  onFilterChange,
  countAll,
  countPairing,
  countHaveSpace,
}: IntentTabsProps) {
  return (
    <div className="roommates-intent-tabs-wrapper">
      <button 
        type="button"
        className={`intent-tab-btn ${currentFilter === "ALL" ? "active" : ""}`}
        onClick={() => onFilterChange("ALL")}
      >
        <span><i className="fas fa-th-large"></i> All Listings</span>
        <span className="intent-tab-count">{countAll}</span>
      </button>
      
      <button 
        type="button"
        className={`intent-tab-btn ${currentFilter === "HAVE_SPACE" ? "active" : ""}`}
        onClick={() => onFilterChange("HAVE_SPACE")}
      >
        <span><i className="fas fa-door-open"></i>Available Spaces</span>
        <span className="intent-tab-count">{countHaveSpace}</span>
      </button>

      <button 
        type="button"
        className={`intent-tab-btn ${currentFilter === "LOOKING_TO_PAIR" ? "active" : ""}`}
        onClick={() => onFilterChange("LOOKING_TO_PAIR")}
      >
        <span><i className="fas fa-handshake"></i> Co-Renting / Pairing</span>
        <span className="intent-tab-count">{countPairing}</span>
      </button>
      
    </div>
  );
}
