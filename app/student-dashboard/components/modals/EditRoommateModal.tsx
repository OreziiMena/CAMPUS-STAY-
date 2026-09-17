"use client";

import React, { useState, useEffect } from "react";
import SearchableSelect from "@/components/SearchableSelect";
import { updateStudentRoommateListing, toggleRoommateListingAvailability } from "@/app/actions/student";

const SPACE_TYPES = [
  { code: "Bedsitter", name: "Bedsitter" },
  { code: "Self-Contain", name: "Self-Contain" },
  { code: "1-Bedroom Flat", name: "1-Bedroom Flat" },
  { code: "2-Bedroom Flat", name: "2-Bedroom Flat" },
];

const LEVEL_OPTIONS = [
  { code: "100L", name: "100 Level (Freshman)" },
  { code: "200L", name: "200 Level" },
  { code: "300L", name: "300 Level" },
  { code: "400L", name: "400 Level" },
  { code: "500L", name: "500 Level (Finalist)" },
  { code: "Postgraduate", name: "Postgraduate" },
];

const GENDER_OPTIONS = [
  { code: "Any", name: "Any Gender" },
  { code: "Male", name: "Male Only" },
  { code: "Female", name: "Female Only" },
];

interface EditRoommateModalProps {
  listing: any | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function EditRoommateModal({
  listing,
  onClose,
  onSaveSuccess,
}: EditRoommateModalProps) {
  const [title, setTitle] = useState("");
  const [hostelType, setHostelType] = useState("Bedsitter");
  const [price, setPrice] = useState("");
  const [targetTotalRent, setTargetTotalRent] = useState("");
  const [myBudget, setMyBudget] = useState("");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [description, setDescription] = useState("");
  const [genderPreference, setGenderPreference] = useState("Any");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("100L");
  const [slotsTotal, setSlotsTotal] = useState(2);
  const [isAvailable, setIsAvailable] = useState(true);

  const [amenities, setAmenities] = useState({
    fencedCompound: false,
    gatedCompound: false,
    wardrobe: false,
    pvc: false,
    pop: false,
    prepaidMeter: false,
    runningWater: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLookingToPair = listing?.roommateIntent === "LOOKING_TO_PAIR";

  useEffect(() => {
    if (listing) {
      setTitle(listing.title || "");
      setHostelType(listing.hostelType || "Bedsitter");
      setPrice(listing.price ? String(listing.price) : "");
      setTargetTotalRent(listing.targetTotalRent ? String(listing.targetTotalRent) : "");
      setMyBudget(listing.myBudget ? String(listing.myBudget) : (listing.price ? String(listing.price) : ""));
      setLocation(listing.location || "");
      setDistance(listing.distance || "");
      setDescription(listing.description || "");
      setGenderPreference(listing.genderPreference || "Any");
      setDepartment(listing.department || "");
      setLevel(listing.level || "100L");
      setSlotsTotal(listing.slotsTotal || 2);
      setIsAvailable(listing.isAvailable ?? true);

      const amList = listing.cleanAmenities || listing.amenities || [];
      const amLower = amList.map((a: string) => a.toLowerCase());
      setAmenities({
        fencedCompound: amLower.some((a: string) => a.includes("fence")),
        gatedCompound: amLower.some((a: string) => a.includes("gate")),
        wardrobe: amLower.some((a: string) => a.includes("wardrobe")),
        pvc: amLower.some((a: string) => a.includes("pvc")),
        pop: amLower.some((a: string) => a.includes("pop")),
        prepaidMeter: amLower.some((a: string) => a.includes("prepaid") || a.includes("meter")),
        runningWater: amLower.some((a: string) => a.includes("water")),
      });
      setError("");
    }
  }, [listing]);

  if (!listing) return null;

  const handleCheckboxChange = (name: keyof typeof amenities) => {
    setAmenities((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !location.trim()) {
      setError("Listing title and location are required.");
      return;
    }

    if (isLookingToPair) {
      if (!targetTotalRent || !myBudget) {
        setError("Target total rent and your budget pledge are required.");
        return;
      }
    } else {
      if (!price) {
        setError("Price is required.");
        return;
      }
    }

    setLoading(true);

    const activeAmenities: string[] = [];
    if (amenities.fencedCompound) activeAmenities.push("Fenced compound");
    if (amenities.gatedCompound) activeAmenities.push("Gated compound");
    if (amenities.wardrobe) activeAmenities.push("Wardrobe");
    if (amenities.pvc) activeAmenities.push("PVC");
    if (amenities.pop) activeAmenities.push("POP");
    if (amenities.prepaidMeter) activeAmenities.push("Prepaid meter");
    if (amenities.runningWater) activeAmenities.push("running water");

    try {
      const updateData: any = {
        title,
        hostelType,
        location,
        distance,
        description,
        genderPreference,
        amenities: activeAmenities,
        roommateIntent: listing.roommateIntent,
      };

      if (isLookingToPair) {
        updateData.targetTotalRent = targetTotalRent;
        updateData.myBudget = myBudget;
        updateData.department = department;
        updateData.level = level;
        updateData.slotsTotal = slotsTotal;
        updateData.price = myBudget;
      } else {
        updateData.price = price;
      }

      const res = await updateStudentRoommateListing(listing.id, updateData);

      if (!res.success) {
        setError(res.error || "Failed to update listing.");
        setLoading(false);
        return;
      }

      // If availability toggle changed
      if (isAvailable !== listing.isAvailable) {
        await toggleRoommateListingAvailability(listing.id);
      }

      setLoading(false);
      onSaveSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="student-modal-overlay" onClick={onClose}>
      <div className="student-modal-container edit-roommate-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="student-modal-header">
          <div>
            <h3 className="receipt-modal-title">
              <i className="fas fa-edit"></i> Edit Roommate Listing
            </h3>
            <span className="dispute-ref-subtitle">
              {isLookingToPair ? "Co-Renting / Pairing Request" : "Have a Space / Room Sublet"}
            </span>
          </div>
          <button onClick={onClose} className="student-modal-close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-roommate-form">
          {error && (
            <div className="edit-roommate-error-alert">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <div className="edit-roommate-grid">
            <div className="edit-roommate-field edit-col-span-2">
              <label className="edit-roommate-label">Listing Title *</label>
              <input
                type="text"
                className="edit-roommate-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Spacious Self-Contained Apartment near Gate"
                required
              />
            </div>

            <div className="edit-roommate-field">
              <label className="edit-roommate-label">Accommodation Type *</label>
              <SearchableSelect
                options={SPACE_TYPES}
                value={hostelType}
                onChange={setHostelType}
                placeholder="Select space type..."
                searchable={false}
              />
            </div>

            <div className="edit-roommate-field">
              <label className="edit-roommate-label">Gender Preference *</label>
              <SearchableSelect
                options={GENDER_OPTIONS}
                value={genderPreference}
                onChange={setGenderPreference}
                placeholder="Select gender preference..."
                searchable={false}
              />
            </div>

            {isLookingToPair ? (
              <>
                <div className="edit-roommate-field">
                  <label className="edit-roommate-label">Target Total House Rent (₦/yr) *</label>
                  <input
                    type="number"
                    className="edit-roommate-input"
                    value={targetTotalRent}
                    onChange={(e) => setTargetTotalRent(e.target.value)}
                    placeholder="e.g. 500000"
                    required
                  />
                </div>

                <div className="edit-roommate-field">
                  <label className="edit-roommate-label">Your Budget Pledge (₦/yr) *</label>
                  <input
                    type="number"
                    className="edit-roommate-input"
                    value={myBudget}
                    onChange={(e) => setMyBudget(e.target.value)}
                    placeholder="e.g. 250000"
                    required
                  />
                </div>

                <div className="edit-roommate-field">
                  <label className="edit-roommate-label">Department *</label>
                  <input
                    type="text"
                    className="edit-roommate-input"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Engineering"
                    required
                  />
                </div>

                <div className="edit-roommate-field">
                  <label className="edit-roommate-label">Academic Level *</label>
                  <SearchableSelect
                    options={LEVEL_OPTIONS}
                    value={level}
                    onChange={setLevel}
                    placeholder="Select academic level..."
                    searchable={false}
                  />
                </div>

                <div className="edit-roommate-field">
                  <label className="edit-roommate-label">Total Roommates Needed *</label>
                  <select
                    className="edit-roommate-select"
                    value={slotsTotal}
                    onChange={(e) => setSlotsTotal(parseInt(e.target.value, 10))}
                  >
                    <option value={2}>2 Students (1 partner)</option>
                    <option value={3}>3 Students (2 partners)</option>
                    <option value={4}>4 Students (3 partners)</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="edit-roommate-field">
                <label className="edit-roommate-label">Rent / Share Amount (₦/yr) *</label>
                <input
                  type="number"
                  className="edit-roommate-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 200000"
                  required
                />
              </div>
            )}

            <div className="edit-roommate-field">
              <label className="edit-roommate-label">Location / Area *</label>
              <input
                type="text"
                className="edit-roommate-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Main Gate, Campus Road"
                required
              />
            </div>

            <div className="edit-roommate-field">
              <label className="edit-roommate-label">Distance to Campus (Optional)</label>
              <input
                type="text"
                className="edit-roommate-input"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 5 mins walk"
              />
            </div>

            <div className="edit-roommate-field edit-col-span-2">
              <label className="edit-roommate-label">
                {isLookingToPair ? "Roommate & Lifestyle Preferences (Optional)" : "Description & Expectations (Optional)"}
              </label>
              <textarea
                className="edit-roommate-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isLookingToPair
                  ? "Optional: Describe what you are looking for in a co-renter, your lifestyle, quiet hours, or target area..."
                  : "Optional: Describe the house, utilities, quiet hours, and what you are looking for in a roommate..."}
                rows={4}
              />
            </div>

            <div className="edit-roommate-field edit-col-span-2">
              <label className="edit-roommate-label">
                {isLookingToPair ? "Desired Features & Amenities (Optional)" : "Amenities Included (Optional)"}
              </label>
              <div className="edit-roommate-amenities-grid">
                <label className="edit-checkbox-item">
                  <input
                    type="checkbox"
                    checked={amenities.fencedCompound}
                    onChange={() => handleCheckboxChange("fencedCompound")}
                  />
                  <span>Fenced Compound</span>
                </label>
                <label className="edit-checkbox-item">
                  <input
                    type="checkbox"
                    checked={amenities.gatedCompound}
                    onChange={() => handleCheckboxChange("gatedCompound")}
                  />
                  <span>Gated Compound</span>
                </label>
                <label className="edit-checkbox-item">
                  <input
                    type="checkbox"
                    checked={amenities.wardrobe}
                    onChange={() => handleCheckboxChange("wardrobe")}
                  />
                  <span>Wardrobe</span>
                </label>
                <label className="edit-checkbox-item">
                  <input
                    type="checkbox"
                    checked={amenities.pvc}
                    onChange={() => handleCheckboxChange("pvc")}
                  />
                  <span>PVC</span>
                </label>
                <label className="edit-checkbox-item">
                  <input
                    type="checkbox"
                    checked={amenities.pop}
                    onChange={() => handleCheckboxChange("pop")}
                  />
                  <span>POP</span>
                </label>
                <label className="edit-checkbox-item">
                  <input
                    type="checkbox"
                    checked={amenities.prepaidMeter}
                    onChange={() => handleCheckboxChange("prepaidMeter")}
                  />
                  <span>Prepaid Meter</span>
                </label>
                <label className="edit-checkbox-item">
                  <input
                    type="checkbox"
                    checked={amenities.runningWater}
                    onChange={() => handleCheckboxChange("runningWater")}
                  />
                  <span>Running Water</span>
                </label>
              </div>
            </div>

            <div className="edit-roommate-field edit-col-span-2">
              <label className="edit-roommate-label">Listing Live Status</label>
              <div className="status-toggle-wrapper">
                <button
                  type="button"
                  className={`status-toggle-btn ${isAvailable ? "active-open" : ""}`}
                  onClick={() => setIsAvailable(true)}
                >
                  <i className="fas fa-check-circle"></i> Active / Open for Pairing
                </button>
                <button
                  type="button"
                  className={`status-toggle-btn ${!isAvailable ? "active-closed" : ""}`}
                  onClick={() => setIsAvailable(false)}
                >
                  <i className="fas fa-lock"></i> Paired / Closed
                </button>
              </div>
            </div>
          </div>

          <div className="edit-roommate-actions">
            <button
              type="button"
              className="edit-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="edit-btn-save"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
