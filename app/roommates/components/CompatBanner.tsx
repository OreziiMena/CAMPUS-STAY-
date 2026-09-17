"use client";

import React from "react";

interface CompatBannerProps {
  preferences?: {
    department?: string;
    level?: string;
    gender?: string;
  } | null;
  onOpenCompatModal: () => void;
}

export default function CompatBanner({ preferences, onOpenCompatModal }: CompatBannerProps) {
  const isConfigured = Boolean(preferences?.department && preferences?.level);

  if (isConfigured) {
    return (
      <div className="compat-setup-banner compat-active-banner">
        <div className="compat-setup-left">
          <div className="compat-profile-icon">
            <i className="fas fa-sliders-h"></i>
          </div>
          <div>
            <h4 className="compat-setup-title">Your Compatibility Match Profile</h4>
            <p className="compat-setup-desc">
              Matching as: <strong>{preferences?.department}</strong> &bull; Level: <strong>{preferences?.level}</strong> &bull; Gender: <strong>{preferences?.gender || "Any"}</strong>
            </p>
          </div>
        </div>
        <button 
          type="button" 
          className="compat-setup-btn compat-edit-btn"
          onClick={onOpenCompatModal}
          title="Edit your department, level, or gender if there is a mistake"
        >
          <i className="fas fa-pen"></i> Edit Profile
        </button>
      </div>
    );
  }

  return (
    <div className="compat-setup-banner">
      <div className="compat-setup-left">
        <i className="fas fa-magic"></i>
        <div>
          <h4 className="compat-setup-title">Unlock Academic & Compatibility Matching</h4>
          <p className="compat-setup-desc">
            Set your Department, Academic Level & Gender to instantly see your compatibility score with students listing roommate spaces.
          </p>
        </div>
      </div>
      <button 
        type="button" 
        className="compat-setup-btn"
        onClick={onOpenCompatModal}
      >
        <i className="fas fa-sliders-h"></i> Set Up Match Info
      </button>
    </div>
  );
}
