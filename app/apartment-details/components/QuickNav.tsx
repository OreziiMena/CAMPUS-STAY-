import React from "react";

interface QuickNavProps {
  activeNavSection: string;
  onScrollToSection: (sectionId: string) => void;
}

export default function QuickNav({
  activeNavSection,
  onScrollToSection,
}: QuickNavProps) {
  return (
    <nav className="quick-nav-bar" aria-label="Apartment Quick Navigation">
      <div className="quick-nav-list">
        <button 
          className={`quick-nav-item ${activeNavSection === "overview" ? "active" : ""}`}
          onClick={() => onScrollToSection("overview")}
        >
          <i className="fas fa-home"></i> Overview
        </button>
        <button 
          className={`quick-nav-item ${activeNavSection === "amenities" ? "active" : ""}`}
          onClick={() => onScrollToSection("amenities")}
        >
          <i className="fas fa-check-double"></i> Amenities
        </button>
        <button 
          className={`quick-nav-item ${activeNavSection === "commute" ? "active" : ""}`}
          onClick={() => onScrollToSection("commute")}
        >
          <i className="fas fa-walking"></i> Commute & Specs
        </button>
        <button 
          className={`quick-nav-item ${activeNavSection === "scheduler" ? "active" : ""}`}
          onClick={() => onScrollToSection("scheduler")}
        >
          <i className="fas fa-calendar-alt"></i> Book Inspection
        </button>
        <button 
          className={`quick-nav-item ${activeNavSection === "splitter" ? "active" : ""}`}
          onClick={() => onScrollToSection("splitter")}
        >
          <i className="fas fa-calculator"></i> Rent Splitter
        </button>
      </div>
    </nav>
  );
}
