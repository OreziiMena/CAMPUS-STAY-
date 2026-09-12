import React from "react";

interface OverviewSectionProps {
  property: {
    title: string;
    hostelType?: string;
    isNegotiable?: boolean;
    views?: number;
    location: string;
    distance: string;
    description: string;
  };
}

export default function OverviewSection({
  property,
}: OverviewSectionProps) {
  return (
    <section id="overview" className="content-card">
      <div className="badge-chips-row">
        <span className="badge-chip verified">
          <i className="fas fa-shield-alt"></i> Physically Verified Hostel
        </span>
        <span className="badge-chip type">
          <i className="fas fa-door-open"></i> {property.hostelType || "Self-Contain"}
        </span>
        {property.isNegotiable && (
          <span className="badge-chip negotiable">
            <i className="fas fa-handshake"></i> Agent Fee Negotiable
          </span>
        )}
      </div>

      <h1 className="listing-title-main">{property.title}</h1>

      <div className="meta-stats-row">
        <span><i className="far fa-eye"></i> {property.views || 0} student views</span>
      </div>

      <div className="location-commute-line">
        <i className="fas fa-map-marker-alt"></i>
        <strong>Location:</strong> {property.location}
      </div>
      <div className="location-commute-line">
        <i className="fas fa-route"></i>
        <strong>Proximity:</strong> {property.distance}
      </div>

      <h4 style={{ margin: "20px 0 6px 0", fontSize: "1.05rem", fontWeight: "700", color: "rgb(2, 53, 28)", fontFamily: "'Poppins', sans-serif" }}>
        About this Accommodation
      </h4>
      <p className="description-body">{property.description}</p>
    </section>
  );
}
