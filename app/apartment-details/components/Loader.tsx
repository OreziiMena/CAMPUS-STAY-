import React from "react";

interface LoaderProps {
  title?: string;
  subtitle?: string;
}

export default function Loader({
  title = "Campus Tent",
  subtitle = "Loading hostel details...",
}: LoaderProps) {
  return (
    <div className="details-loading-screen">
      <div className="loader-card-box">
        <div className="brand-spinner-wrapper">
          <div className="brand-spinner-orbit"></div>
          <div className="brand-spinner-center">
            <i className="fas fa-campground"></i>
          </div>
        </div>
        <h3 className="loader-title">{title}</h3>
        <p className="loader-subtitle">{subtitle}</p>
        <div className="loader-progress-track">
          <div className="loader-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
