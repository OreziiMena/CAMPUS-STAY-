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
          <h3 className="card-title-heading">
             Split Rent with Roommates
          </h3>
          <p className="splitter-subheading">
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
            <span className="splitter-per-year"> / yr</span>
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
          <div className="splitter-result-amount">
            ₦{totalPerPerson.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Find Roommate Link */}
      <div className="find-roommate-callout">
        <p className="find-roommate-text">
          <i className="fas fa-handshake"></i>
          Need someone to split this exact room with? Connect with verified students looking for roommates.
        </p>
        <Link href="/roommates" className="find-roommate-link">
          Browse Roommates &rarr;
        </Link>
      </div>
    </section>
  );
}
