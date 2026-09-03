"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAgentProperties, togglePropertyAvailability, deleteProperty } from "@/app/actions/properties";
import "./properties.css";

export default function AgentPropertiesListing() {
  const router = useRouter();
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
          <Link href="/agent-dashboard/add-property" className="add-prop-btn" style={{ display: "inline-flex" }}>
            List Your First Property
          </Link>
        </div>
      ) : (
        <div className="properties-list">
          {properties.map((property) => (
            <div key={property.id} className="property-row-card">
              {(() => {
                const mediaUrl = property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3";
                const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
                return (
                  <div style={{ position: "relative", width: "100px", height: "80px", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                    {isVideo ? (
                      <video
                        src={mediaUrl}
                        className="property-row-img"
                        muted
                        playsInline
                        preload="metadata"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={property.title}
                        className="property-row-img"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                    {isVideo && (
                      <span style={{
                        position: "absolute",
                        bottom: "4px",
                        right: "4px",
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        fontSize: "9px",
                        borderRadius: "3px",
                        padding: "1px 4px",
                        lineHeight: 1,
                      }}>
                        ▶ Video
                      </span>
                    )}
                  </div>
                );
              })()}
              
              <div className="property-row-info">
                <h3 style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  {property.title}
                  {property.isVerified ? (
                    <span style={{ color: "#2e7d32", background: "rgba(46, 125, 50, 0.08)", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                      <i className="fas fa-check-circle"></i> Active / Verified
                    </span>
                  ) : (
                    <span style={{ color: "#d35400", background: "rgba(211, 84, 0, 0.08)", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
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

              <div className="property-price" style={{ minWidth: "160px" }}>
                <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "rgb(2, 53, 28)" }}>
                  ₦{property.price.toLocaleString()} <span style={{ fontSize: "0.75rem", color: "#666", fontWeight: "normal" }}>/ yr</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#4b5563", lineHeight: "1.35", marginTop: "4px", backgroundColor: "#f9fafb", padding: "4px 8px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                  <div><span style={{ color: "#6b7280" }}>Rent:</span> ₦{(property.rentAmount ?? property.price).toLocaleString()}</div>
                  <div>
                    <span style={{ color: "#6b7280" }}>Fee:</span> ₦{(property.agentFee ?? 0).toLocaleString()}{" "}
                    {property.isNegotiable ? (
                      <span style={{ color: "#047857", fontWeight: "700", fontSize: "0.68rem" }}>(Negotiable)</span>
                    ) : (
                      <span style={{ color: "#6b7280", fontSize: "0.68rem" }}>(Fixed)</span>
                    )}
                  </div>
                  {property.cautionFee !== null && property.cautionFee !== undefined && property.cautionFee > 0 && (
                    <div><span style={{ color: "#6b7280" }}>Caution:</span> ₦{property.cautionFee.toLocaleString()}</div>
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
