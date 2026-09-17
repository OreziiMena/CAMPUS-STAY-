"use client";

import React from "react";
import Card from "./Card";

interface GridProps {
  loading: boolean;
  listings: any[];
  currentUser: any;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  playingVideoId: string | null;
  onPlayVideo: (id: string) => void;
  onStopVideo: () => void;
  onViewDetails: (listing: any) => void;
  onPairUp: (listing: any) => void;
  onMessage: (userId: string) => void;
}

export default function Grid({
  loading,
  listings,
  currentUser,
  currentPage,
  pageSize,
  onPageChange,
  playingVideoId,
  onPlayVideo,
  onStopVideo,
  onViewDetails,
  onPairUp,
  onMessage,
}: GridProps) {
  if (loading) {
    return (
      <section className="roommates-container">
        <div className="roommates-loading">
          <i className="fas fa-spinner fa-spin"></i> Loading Roommates...
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return (
      <section className="roommates-container">
        <div className="no-roommates-found">
          <i className="fas fa-user-slash"></i>
          <h3>No roommate listings match your filters</h3>
          <p>
            Try widening your budget, choosing another campus location, or
            resetting your search query.
          </p>
        </div>
      </section>
    );
  }

  const totalPages = Math.ceil(listings.length / pageSize);
  const paginatedListings = listings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <section className="roommates-container">
      <div className="roommates-grid">
        {paginatedListings.map((listing) => (
          <Card
            key={listing.id}
            listing={listing}
            currentUser={currentUser}
            playingVideoId={playingVideoId}
            onPlayVideo={onPlayVideo}
            onStopVideo={onStopVideo}
            onViewDetails={onViewDetails}
            onPairUp={onPairUp}
            onMessage={onMessage}
          />
        ))}
      </div>

      {/* Numbered Pagination */}
      {totalPages > 1 && (
        <div className="roommate-pagination-wrapper">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="roommate-page-nav-btn"
          >
            <i className="fas fa-chevron-left roommate-page-nav-icon"></i> Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`roommate-page-num-btn ${p === currentPage ? "active" : ""}`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="roommate-page-nav-btn"
          >
            Next <i className="fas fa-chevron-right roommate-page-nav-icon"></i>
          </button>
        </div>
      )}
    </section>
  );
}
