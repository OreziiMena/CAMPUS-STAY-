"use client";
import React, { useState, useEffect } from "react";

interface WelcomeTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeTour({ isOpen, onClose }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Suppress scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const tourSteps = [
    {
      badge: "Welcome",
      icon: "fa-solid fa-house-chimney",
      title: "Welcome to Campus Unit! 🏠",
      text: "Finding secure, close-to-campus student housing and vetted roommates has never been this simple. Let us take you on a quick tour of our features!"
    },
    {
      badge: "Smart Distance",
      icon: "fa-solid fa-walking",
      title: "Proximity First 📍",
      text: "No more long, stressful walks. Search student hostels filtered and sorted by their exact walking distance (minutes) from your school's gate!"
    },
    {
      badge: "Vetted Listings",
      icon: "fa-solid fa-user-shield",
      title: "No Scams, Verified Hosts 🔒",
      text: "Student safety is our top priority. We verify Identification documents to eliminate fraudulent listings completely."
    },
    {
      badge: "Roommates",
      icon: "fa-solid fa-user-group",
      title: "Find Roommates & Split Rent 👥",
      text: "Connect and split bills with fellow students. Match based on department, clean habits, sleeping cycles, and budget preferences!"
    }
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("cs_site_tour_completed", "true");
    onClose();
  };

  const stepData = tourSteps[currentStep];

  return (
    <div className="welcome-tour-overlay" onClick={handleComplete}>
      <div className="tour-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tour-header">
          <span className="tour-badge">{stepData.badge}</span>
          <button className="tour-skip-btn" onClick={handleComplete}>
            Skip Tour <i className="fas fa-chevron-right" style={{ fontSize: "0.75rem", marginLeft: "2px" }}></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="tour-slides-container">
          <div className="tour-slide-icon-wrapper">
            <i className={stepData.icon}></i>
          </div>
          <h2 className="tour-slide-title">{stepData.title}</h2>
          <p className="tour-slide-text">{stepData.text}</p>
        </div>

        {/* Footer Navigation */}
        <div className="tour-footer">
          {/* Pagination Indicators */}
          <div className="tour-pagination-dots">
            {tourSteps.map((_, index) => (
              <span
                key={index}
                className={`tour-dot ${index === currentStep ? "active" : ""}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="tour-nav-buttons">
            {currentStep > 0 && (
              <button className="tour-nav-btn prev" onClick={handlePrev}>
                Back
              </button>
            )}
            <button className="tour-nav-btn next" onClick={handleNext}>
              {currentStep === tourSteps.length - 1 ? "Start Exploring" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
