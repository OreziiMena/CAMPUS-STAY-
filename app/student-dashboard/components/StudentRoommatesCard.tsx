"use client";

import React from "react";
import Link from "next/link";

interface StudentRoommatesCardProps {
  listings: any[];
  onEdit: (listing: any) => void;
  onToggleStatus: (listingId: string) => void;
  onDelete: (listingId: string) => void;
  actionLoadingId: string | null;
}

export default function StudentRoommatesCard({
  listings,
  onEdit,
  onToggleStatus,
  onDelete,
  actionLoadingId,
}: StudentRoommatesCardProps) {
  return (
    <div className="roommates-dashboard-section">
      <div className="section-title-row roommates-title-row">
        <div>
          <h3 className="roommates-section-title">
            <i className="fas fa-user-friends"></i> My Roommate & Co-Renting Listings
          </h3>
          <p className="roommates-section-subtitle">
            Manage your roommate spaces, co-renting requests, view metrics, and update live availability status.
          </p>
        </div>
        <div className="roommates-header-actions">
          <Link href="/student-dashboard/add-roommate-listing" className="btn-add-roommate">
            <i className="fas fa-plus-circle"></i> Post New Listing
          </Link>
          <span className="badge-count roommates-badge-count">
            {listings.length} {listings.length === 1 ? "Listing" : "Listings"}
          </span>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="empty-section-state roommates-empty-state">
          <i className="fas fa-handshake roommates-empty-icon"></i>
          <p>You haven&apos;t posted any roommate or co-renting listings yet.</p>
          <p className="empty-subtext">
            Need someone to share your rent or looking to pool budget for an apartment?
          </p>
          <Link href="/student-dashboard/add-roommate-listing" className="btn-create-first-listing">
            <i className="fas fa-plus"></i> List Space / Find Roommate
          </Link>
        </div>
      ) : (
        <div className="student-roommates-grid">
          {listings.map((item) => {
            const isPairing = item.roommateIntent === "LOOKING_TO_PAIR";
            const isLoading = actionLoadingId === item.id;
            const primaryMedia = item.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3";
            const isVideo = primaryMedia.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
            const posterImg = item.images?.find((img: string) => !img.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i)) || primaryMedia;

            return (
              <div key={item.id} className="student-roommate-item-card">
                <div className="item-card-top">
                  <div className="item-media-thumb">
                    {isVideo ? (
                      <div className="item-video-wrapper">
                        <img src={posterImg} alt={item.title} className="thumb-img" />
                        <span className="video-tour-tag">
                          <i className="fas fa-video"></i> Video Tour
                        </span>
                      </div>
                    ) : (
                      <img src={primaryMedia} alt={item.title} className="thumb-img" />
                    )}
                    <span className={`status-badge-corner ${item.isAvailable ? "open" : "paired"}`}>
                      {item.isAvailable ? (
                        <><i className="fas fa-check-circle"></i> Active / Open</>
                      ) : (
                        <><i className="fas fa-lock"></i> Paired / Closed</>
                      )}
                    </span>
                  </div>

                  <div className="item-details">
                    <div className="item-badges-row">
                      {isPairing ? (
                        <span className="badge-intent pairing">
                          <i className="fas fa-handshake"></i> Looking to Pair
                        </span>
                      ) : (
                        <span className="badge-intent sublet">
                          <i className="fas fa-door-open"></i> Have a Space
                        </span>
                      )}
                      <span className="badge-type">{item.hostelType}</span>
                    </div>

                    <h4 className="item-title">{item.title}</h4>
                    <p className="item-location">
                      <i className="fas fa-map-marker-alt"></i> {item.location}
                      {item.distance && <span> &bull; {item.distance}</span>}
                    </p>

                    <div className="item-financials">
                      {isPairing ? (
                        <>
                          <div className="financial-stat">
                            <span className="stat-label">Target Rent</span>
                            <span className="stat-val">₦{Number(item.targetTotalRent || item.price * 2).toLocaleString()}/yr</span>
                          </div>
                          <div className="financial-stat">
                            <span className="stat-label">Your Budget</span>
                            <span className="stat-val green">₦{Number(item.myBudget || item.price).toLocaleString()}/yr</span>
                          </div>
                          <div className="financial-stat">
                            <span className="stat-label">Partners</span>
                            <span className="stat-val">{item.slotsFilled || 1}/{item.slotsTotal || 2}</span>
                          </div>
                        </>
                      ) : (
                        <div className="financial-stat">
                          <span className="stat-label">Rent Share</span>
                          <span className="stat-val green">₦{Number(item.price).toLocaleString()}/yr</span>
                        </div>
                      )}
                    </div>

                    <div className="item-metrics-bar">
                      <span className="metric-pill">
                        <i className="fas fa-eye"></i> {item.views || 0} views
                      </span>
                      <span className="metric-pill">
                        <i className="fas fa-comments"></i> {item.inquiriesCount || 0} inquiries
                      </span>
                      <span className="metric-pill">
                        <i className="fas fa-venus-mars"></i> Pref: {item.genderPreference}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="item-card-actions">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(item.id)}
                    disabled={isLoading}
                    className={`btn-action-status ${item.isAvailable ? "mark-paired" : "mark-open"}`}
                    title={item.isAvailable ? "Mark listing as paired to stop receiving requests" : "Mark listing as active to receive requests"}
                  >
                    {isLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : item.isAvailable ? (
                      <><i className="fas fa-lock"></i> Mark as Paired</>
                    ) : (
                      <><i className="fas fa-unlock"></i> Mark as Open</>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    disabled={isLoading}
                    className="btn-action-edit"
                  >
                    <i className="fas fa-pen"></i> Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    disabled={isLoading}
                    className="btn-action-delete"
                    title="Delete listing"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>

                  <Link
                    href={`/roommates`}
                    className="btn-action-view"
                    title="View in Roommates Directory"
                  >
                    <i className="fas fa-external-link-alt"></i>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
