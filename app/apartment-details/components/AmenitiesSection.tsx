import React from "react";

interface AmenitiesSectionProps {
  amenities: string[];
}

export default function AmenitiesSection({
  amenities,
}: AmenitiesSectionProps) {
  return (
    <section id="amenities" className="content-card">
      <h3 className="card-title-heading">
        <i className="fas fa-check-double"></i> Key Features & Amenities
      </h3>
      <div className="amenities-pill-grid">
        {amenities.map((amenity: string, i: number) => (
          <div key={i} className="amenity-pill-item">
            <i className="fas fa-check-circle"></i> {amenity}
          </div>
        ))}
      </div>
    </section>
  );
}
