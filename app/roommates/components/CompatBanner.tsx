"use client";

import React from "react";

interface CompatBannerProps {
  onOpenCompatModal: () => void;
}

export default function CompatBanner({ onOpenCompatModal }: CompatBannerProps) {
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
