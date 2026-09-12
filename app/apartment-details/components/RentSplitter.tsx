import React from "react";
import Link from "next/link";

interface RentSplitterProps {
  occupantsCount: number;
  setOccupantsCount: (n: number) => void;
  rentPerPerson: number;
  agentFeePerPerson: number;
  totalPerPerson: number;
}

export default function RentSplitter({
  occupantsCount,
  setOccupantsCount,
  rentPerPerson,
  agentFeePerPerson,
  totalPerPerson,
}: RentSplitterProps) {
  return (
    <section id="splitter" className="content-card rent-splitter-card">
      <div className="splitter-header">
        <div>
          <h3 className="card-title-heading" style={{ margin: "0 0 4px 0" }}>
             Split Rent with Roommates
          </h3>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#4b5563" }}>
            Calculate exactly how much each person pays when sharing this hostel.
          </p>
        </div>
        <span className="splitter-badge">Interactive Tool</span>
      </div>

      {/* Occupant Counter */}
      <div className="occupant-selector-group">
        <span className="occupant-selector-label">Number of Roommates:</span>
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            type="button"
            className={`occupant-btn ${occupantsCount === num ? "active" : ""}`}
            onClick={() => setOccupantsCount(num)}
          >
            <i className="fas fa-user"></i> {num} {num === 1 ? "Person (Solo)" : "Roommates"}
          </button>
        ))}
      </div>

      {/* Live Cost Splitter Grid */}
      <div className="splitter-results-grid">
        <div className="splitter-result-box highlight">
          <div className="splitter-result-label">Your Rent Share</div>
          <div className="splitter-result-amount">
            ₦{rentPerPerson.toLocaleString()}
            <span style={{ fontSize: "0.75rem", fontWeight: "400", color: "#64748b" }}> / yr</span>
          </div>
        </div>

        <div className="splitter-result-box">
          <div className="splitter-result-label">Your Agent Fee Share</div>
          <div className="splitter-result-amount orange">
            ₦{agentFeePerPerson.toLocaleString()}
          </div>
        </div>

        <div className="splitter-result-box highlight">
          <div className="splitter-result-label">Your Total Initial Outlay</div>
          <div className="splitter-result-amount" style={{ color: "rgb(2, 53, 28)" }}>
            ₦{totalPerPerson.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Find Roommate Link */}
      <div className="find-roommate-callout">
        <p className="find-roommate-text">
          <i className="fas fa-handshake" style={{ marginRight: "6px" }}></i>
          Need someone to split this exact room with? Connect with verified students looking for roommates.
        </p>
        <Link href="/roommates" className="find-roommate-link">
          Browse Roommates &rarr;
        </Link>
      </div>
    </section>
  );
}
