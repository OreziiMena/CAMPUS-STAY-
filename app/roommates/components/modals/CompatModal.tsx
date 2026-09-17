"use client";

import React, { useState, useEffect } from "react";
import SearchableSelect from "@/components/SearchableSelect";
import { saveStudentPreferences } from "@/app/actions/student";
import { useToast } from "@/components/ToastProvider";

interface CompatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDept?: string;
  initialLevel?: string;
  initialGender?: string;
  levelOptions: Array<{ code: string; name: string }>;
}

export default function CompatModal({
  isOpen,
  onClose,
  onSuccess,
  initialDept = "",
  initialLevel = "100L",
  initialGender = "Male",
  levelOptions,
}: CompatModalProps) {
  const { showToast } = useToast();
  const [compatDept, setCompatDept] = useState(initialDept);
  const [compatLevel, setCompatLevel] = useState(initialLevel);
  const [compatGender, setCompatGender] = useState(initialGender);
  const [isSavingCompat, setIsSavingCompat] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCompatDept(initialDept || "");
      setCompatLevel(initialLevel || "100L");
      setCompatGender(initialGender || "Male");
    }
  }, [isOpen, initialDept, initialLevel, initialGender]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compatDept.trim()) {
      showToast("Please enter your academic department.", "error");
      return;
    }

    setIsSavingCompat(true);

    try {
      const res = await saveStudentPreferences({
        department: compatDept.trim(),
        level: compatLevel,
        gender: compatGender,
      });

      setIsSavingCompat(false);

      if (res.success) {
        showToast("Compatibility profile updated successfully!", "success");
        onSuccess();
        onClose();
      } else {
        showToast(res.error || "Failed to update profile.", "error");
      }
    } catch (err: any) {
      setIsSavingCompat(false);
      showToast(err.message || "An error occurred.", "error");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-compat" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-sliders-h"></i>{" "}
            {initialDept ? "Edit Compatibility Profile" : "Compatibility Profile"}
          </h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body modal-body-padded">
          <p className="compat-modal-desc">
            Campus Tent calculates your roommate compatibility score strictly using your <strong>Department, Academic Level, and Gender</strong>. If anything was entered incorrectly, update it below at any time.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group-custom form-group-mb-14">
              <label className="proposal-form-label">Your Department *</label>
              <input 
                type="text" 
                className="proposal-input"
                placeholder="e.g. Computer Science, Accounting, Law"
                value={compatDept}
                onChange={(e) => setCompatDept(e.target.value)}
                required
              />
            </div>

            <div className="form-group-custom form-group-mb-14">
              <label className="proposal-form-label">Academic Level *</label>
              <SearchableSelect
                options={levelOptions}
                value={compatLevel}
                onChange={(val) => setCompatLevel(val)}
                placeholder="Select level..."
                required
              />
            </div>

            <div className="form-group-custom form-group-mb-20">
              <label className="proposal-form-label">Gender *</label>
              <SearchableSelect
                options={[
                  { code: "Male", name: "Male" },
                  { code: "Female", name: "Female" }
                ]}
                value={compatGender}
                onChange={(val) => setCompatGender(val)}
                placeholder="Select gender..."
                required
              />
            </div>

            <div className="proposal-actions-row">
              <button 
                type="button" 
                onClick={onClose}
                className="proposal-cancel-btn"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="proposal-submit-btn"
                disabled={isSavingCompat}
              >
                {isSavingCompat ? (
                  <><i className="fas fa-spinner fa-spin"></i> Saving Changes...</>
                ) : (
                  <><i className="fas fa-check"></i> Save & Update Matches</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
