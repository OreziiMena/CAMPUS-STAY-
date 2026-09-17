"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAgentProperties, togglePropertyAvailability, deleteProperty } from "@/app/actions/properties";
import "./properties.css";

export default function AgentPropertiesListing() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    const res = await getAgentProperties();
    if (res.success && res.properties) {
      setProperties(res.properties);
    } else {
      setError(res.error || "Failed to load properties.");
    }
    setLoading(false);
  };

  const fetchPropertiesSilent = async () => {
    const res = await getAgentProperties();
    if (res.success && res.properties) {
      setProperties(res.properties);
    }
  };

  useEffect(() => {
    fetchProperties();

    // Poll silently every 5 seconds for real-time views and updates
    const interval = setInterval(() => {
      fetchPropertiesSilent();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleAvailability = async (id: string) => {
    setActionLoading(id);
    const res = await togglePropertyAvailability(id);
    if (res.success) {
      setProperties((prev) =>
        prev.map((prop) =>
          prop.id === id ? { ...prop, isAvailable: res.isAvailable } : prop
        )
      );
    } else {
      alert(res.error || "Failed to update availability.");
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete "${title}"?`);
    if (!confirmDelete) return;

    setActionLoading(id);
    const res = await deleteProperty(id);
    if (res.success) {
      setProperties((prev) => prev.filter((prop) => prop.id !== id));
    } else {
      alert(res.error || "Failed to delete property.");
    }
    setActionLoading(null);
  };

  return (
    <>
      <div className="properties-header">
        <div>
          <h1>My Listed Properties</h1>
          <p>View, edit details, toggle public visibility, or remove your hostel listings.</p>
        </div>
        <Link href="/agent-dashboard/add-property" className="add-prop-btn">
          <i className="fas fa-plus"></i> Add New Property
        </Link>
      </div>

      {error && (
        <div className="error-banner">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {loading ? (
        <div className="loader">
          <i className="fas fa-spinner fa-spin"></i> Loading your properties...
        </div>
      ) : properties.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-building"></i>
          <h3>No properties listed yet</h3>
          <p>You haven't listed any student accommodations. Click the button below to publish your first hostel listing!</p>
          <Link href="/agent-dashboard/add-property" className="add-prop-btn add-prop-btn-inline">
            List Your First Property
          </Link>
        </div>
      ) : (
        <div className="properties-list">
          {properties.map((property) => (
            <div key={property.id} className="property-row-card">
              {(() => {
                const videoUrl = property.images?.find((img: string) => img.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i));
                const posterUrl = property.images?.find((img: string) => !img.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i));
                const defaultImg = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3";

                return (
                  <div className="property-media-thumbnail-box">
                    {videoUrl ? (
                      <video
                        ref={(el) => {
                          if (el) {
                            el.muted = true;
                            el.defaultMuted = true;
                            el.play().catch(() => {});
                          }
                        }}
                        src={videoUrl}
                        poster={posterUrl}
                        className="property-row-img property-media-element"
                        muted
                        playsInline
                        preload="auto"
                        autoPlay
                        loop
                      />
                    ) : (
                      <img
                        src={posterUrl || property.images?.[0] || defaultImg}
                        alt={property.title}
                        className="property-row-img property-media-element"
                      />
                    )}
                    {videoUrl && (
                      <span className="property-video-badge">
                        ▶ Video
                      </span>
                    )}
                  </div>
                );
              })()}
              
              <div className="property-row-info">
                <h3 className="property-title-flex">
                  {property.title}
                  {property.isVerified ? (
                    <span className="verified-status-tag">
                      <i className="fas fa-check-circle"></i> Active / Verified
                    </span>
                  ) : (
                    <span className="pending-status-tag">
                      <i className="fas fa-hourglass-half"></i> Pending Approval
                    </span>
                  )}
                </h3>
                <div className="property-meta-tags">
                  <span>
                    <i className="fas fa-home"></i> {property.hostelType}
                  </span>
                  <span>
                    <i className="fas fa-map-marker-alt"></i> {property.location}
                  </span>
                  <span>
                    <i className="fas fa-walking"></i> {property.distance}
                  </span>
                  <span>
                    <i className="far fa-eye"></i> {property.views} views
                  </span>
                </div>
              </div>

              <div className="property-price property-price-box">
                <div className="property-price-main">
                  ₦{property.price.toLocaleString()} <span className="property-price-unit">/ yr</span>
                </div>
                <div className="property-price-breakdown">
                  <div><span className="breakdown-label">Rent:</span> ₦{(property.rentAmount ?? property.price).toLocaleString()}</div>
                  <div>
                    <span className="breakdown-label">Fee:</span> ₦{(property.agentFee ?? 0).toLocaleString()}{" "}
                    {property.isNegotiable ? (
                      <span className="fee-negotiable-tag">(Negotiable)</span>
                    ) : (
                      <span className="fee-fixed-tag">(Fixed)</span>
                    )}
                  </div>
                  {property.cautionFee !== null && property.cautionFee !== undefined && property.cautionFee > 0 && (
                    <div><span className="breakdown-label">Caution/others:</span> ₦{property.cautionFee.toLocaleString()}</div>
                  )}
                </div>
              </div>

              <div className="property-row-controls">
                <div className="availability-control">
                  <span className="status-label">Availability</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={property.isAvailable}
                      onChange={() => handleToggleAvailability(property.id)}
                      disabled={actionLoading === property.id}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className={`status-label ${property.isAvailable ? "available" : "taken"}`}>
                    {property.isAvailable ? "Available" : "Taken / Hidden"}
                  </span>
                </div>

                <div className="action-buttons">
                  <Link
                    href={`/agent-dashboard/properties/edit/${property.id}`}
                    className="edit-btn"
                  >
                    <i className="fas fa-edit"></i> Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(property.id, property.title)}
                    disabled={actionLoading === property.id}
                    className="delete-btn"
                  >
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
