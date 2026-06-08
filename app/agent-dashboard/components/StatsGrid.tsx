import React from "react";

interface StatsGridProps {
  totalProperties: number;
  activeListings: number;
  newInquiries: number;
}

export default function StatsGrid({
  totalProperties,
  activeListings,
  newInquiries,
}: StatsGridProps) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-home"></i>
        </div>
        <div className="stat-details">
          <h3 id="stat-total-properties">{totalProperties}</h3>
          <p>Total Properties</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <div className="stat-details">
          <h3 id="stat-active-listings">{activeListings}</h3>
          <p>Active Listings</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-comments"></i>
        </div>
        <div className="stat-details">
          <h3 id="stat-new-inquiries">{newInquiries}</h3>
          <p>Total Inquiries</p>
        </div>
      </div>
    </div>
  );
}
