"use client";
import React, { useState, useEffect } from "react";

interface GuideModalProps {
  onClose?: () => void;
  isOpen: boolean;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Campus Unit Onboarding! 🏠",
      icon: "fas fa-home",
      badge: "Welcome",
      content: (
        <>
          <p>This quick 5-step interactive guide will show you how to list, manage, and verify your university accommodations for students.</p>
          <div className="guide-alert-info">
            <i className="fas fa-info-circle"></i>
            <span>Real-life video tours increase student engagement and trust by up to <strong>75%</strong>!</span>
          </div>
        </>
      ),
    },
    {
      title: "🗺️ How to Navigate to Add Property",
      icon: "fas fa-directions",
      badge: "Step 1",
      content: (
        <>
          <p>Getting to the listing area is simple. You have two main routes:</p>
          <ul className="guide-steps-list">
            <li>
              <i className="fas fa-check-circle"></i>
              <span><strong>Dashboard Button:</strong> Click the orange <strong>"+ Add New Property"</strong> button at the top right of your dashboard homepage.</span>
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              <span><strong>Sidebar Menu:</strong> Expand the <strong>"Properties"</strong> menu item in the left sidebar and select <strong>"Add Property"</strong>.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "📝 Fill Out Property Details",
      icon: "fas fa-edit",
      badge: "Step 2",
      content: (
        <>
          <p>Fill in the form fields to make your listing descriptive and attractive to students:</p>
          <ul className="guide-steps-list">
            <li>
              <i className="fas fa-check-circle"></i>
              <span><strong>Required:</strong> Set a catchy Title, Location, and annual rent price in Naira (₦).</span>
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              <span><strong>Distance:</strong> Specify the exact walking/driving distance to the university campus (e.g. <em>"5 mins walk"</em>).</span>
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              <span><strong>Amenities:</strong> Check boxes for compound features like Prepaid Meter, Borehole Water, and Gated Security.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "📸 Upload High-Quality Media",
      icon: "fas fa-camera",
      badge: "Step 3",
      content: (
        <>
          <p>Show students their potential home! You can upload both images and video tours:</p>
          <div className="guide-file-rules">
            <div className="file-rule-item picture-rule">
              <i className="far fa-image"></i>
              <div>
                <strong>Pictures (Max 2MB per image)</strong>
                <p>Upload clear PNG, JPG, or WebP images showing rooms, toilet, kitchen, and exterior.</p>
              </div>
            </div>
            <div className="file-rule-item video-rule">
              <i className="fas fa-video"></i>
              <div>
                <strong>Video Walkthroughs (Max 10MB per video)</strong>
                <p>MP4, MOV, or WebM clips showing a walk-through tour of the space.</p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "💬 Receive Student Inquiries",
      icon: "fas fa-comments",
      badge: "Step 4",
      content: (
        <>
          <p>Once you submit your property, it will go live for students to search and view!</p>
          <ul className="guide-steps-list">
            <li>
              <i className="fas fa-check-circle"></i>
              <span><strong>Inquiry Alerts:</strong> Students can click "Contact Agent" on your listing, which sends an instant notification to your dashboard.</span>
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              <span><strong>Real-Time Chat:</strong> Navigate to the <strong>"Chat"</strong> room to reply to students, arrange house viewings, and close deals directly!</span>
            </li>
          </ul>
        </>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    localStorage.setItem("cs_agent_onboarding_completed", "true");
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="guide-modal-overlay">
      <div className="guide-modal-card">
        {/* Header */}
        <div className="guide-modal-header">
          <span className="guide-modal-badge">{steps[currentStep].badge}</span>
          <button className="guide-modal-close-btn" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body Content */}
        <div className="guide-modal-body">
          <div className="guide-icon-wrapper">
            <i className={steps[currentStep].icon}></i>
          </div>
          <h2>{steps[currentStep].title}</h2>
          <div className="guide-modal-content-inner">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Footer & Controls */}
        <div className="guide-modal-footer">
          <div className="guide-indicators">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`guide-dot ${index === currentStep ? "active" : ""}`}
                onClick={() => setCurrentStep(index)}
              ></span>
            ))}
          </div>

          <div className="guide-buttons">
            {currentStep > 0 ? (
              <button className="guide-btn-secondary" onClick={handleBack}>
                <i className="fas fa-arrow-left"></i> Back
              </button>
            ) : (
              <button className="guide-btn-text" onClick={handleClose}>
                Skip Tour
              </button>
            )}

            <button className="guide-btn-primary" onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                <>Finish <i className="fas fa-check"></i></>
              ) : (
                <>Next <i className="fas fa-arrow-right"></i></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
