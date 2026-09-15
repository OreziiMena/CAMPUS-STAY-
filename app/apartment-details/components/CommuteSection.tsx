import React from "react";

interface CommuteSectionProps {
  distance?: string;
  location?: string;
}

export default function CommuteSection({ distance, location }: CommuteSectionProps) {
  return (
    <section id="commute" className="content-card">
      <h3 className="card-title-heading">
        <i className="fas fa-walking"></i> Campus Commute & Convenience
      </h3>
      <div className="commute-grid">
        <div className="commute-card-item">
          <div className="commute-icon-box">
            <i className="fas fa-walking"></i>
          </div>
          <div>
            <h5 className="commute-title">{distance || "Near Campus Gate"}</h5>
            <p className="commute-sub">Direct walking distance to lectures</p>
          </div>
        </div>

        <div className="commute-card-item">
          <div className="commute-icon-box">
            <i className="fas fa-bus-alt"></i>
          </div>
          <div>
            <h5 className="commute-title">Campus Shuttle / Keke</h5>
            <p className="commute-sub">Accessible transport route to faculties</p>
          </div>
        </div>

        <div className="commute-card-item">
          <div className="commute-icon-box">
            <i className="fas fa-shopping-basket"></i>
          </div>
          <div>
            <h5 className="commute-title">{location || "Neighborhood Markets"}</h5>
            <p className="commute-sub">Groceries, Food & Student Eateries</p>
          </div>
        </div>
      </div>

      <h4 className="trust-scorecard-heading">
        Campus Tent Verification Scorecard
      </h4>
      <div className="trust-scorecard-grid">
        <div className="trust-item-box">
          <div className="trust-icon-box">
            <i className="fas fa-bolt"></i>
          </div>
          <div>
            <h5 className="trust-item-title">Prepaid Electricity Meter</h5>
            <p className="trust-item-desc">Dedicated meter for independent power tracking.</p>
          </div>
        </div>

        <div className="trust-item-box">
          <div className="trust-icon-box">
            <i className="fas fa-tint"></i>
          </div>
          <div>
            <h5 className="trust-item-title">24/7 Borehole Water</h5>
            <p className="trust-item-desc">Constant overhead water tank with steady pressure.</p>
          </div>
        </div>

        <div className="trust-item-box">
          <div className="trust-icon-box">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div>
            <h5 className="trust-item-title">Gated Perimeter Security</h5>
            <p className="trust-item-desc">Fenced compound, secure lock, night watchman.</p>
          </div>
        </div>

        <div className="trust-item-box">
          <div className="trust-icon-box">
            <i className="fas fa-file-contract"></i>
          </div>
          <div>
            <h5 className="trust-item-title">Verified Tenancy Agreement</h5>
            <p className="trust-item-desc">Standard legal agreement issued directly by landlord.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
