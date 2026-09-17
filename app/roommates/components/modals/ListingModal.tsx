"use client";

import React, { useState } from "react";
import SearchableSelect from "@/components/SearchableSelect";
import { addProperty, getMediaUploadPresignedUrl } from "@/app/actions/properties";
import { extractVideoThumbnail } from "@/lib/video-helper";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 20;

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onSuccess: () => void;
  spaceTypes: Array<{ code: string; name: string }>;
  levelOptions: Array<{ code: string; name: string }>;
}

export default function ListingModal({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
  spaceTypes,
  levelOptions,
}: ListingModalProps) {
  const [formRoommateIntent, setFormRoommateIntent] = useState<"HAVE_SPACE" | "LOOKING_TO_PAIR">("HAVE_SPACE");
  const [formTargetTotalRent, setFormTargetTotalRent] = useState("");
  const [formMyBudget, setFormMyBudget] = useState("");
  const [formDepartment, setFormDepartment] = useState(
    (currentUser?.studentProfile?.preferences as any)?.department || ""
  );
  const [formLevel, setFormLevel] = useState(
    (currentUser?.studentProfile?.preferences as any)?.level || "100L"
  );
  const [formSlotsTotal, setFormSlotsTotal] = useState(2);
  const [formTitle, setFormTitle] = useState("");
  const [formHostelType, setHostelType] = useState("Bedsitter");
  const [formPrice, setFormPrice] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDistance, setFormDistance] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAmenities, setFormAmenities] = useState({
    fencedCompound: false,
    gatedCompound: false,
    wardrobe: false,
    pvc: false,
    pop: false,
    prepaidMeter: false,
    runningWater: false,
  });
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formImageFiles, setFormImageFiles] = useState<File[]>([]);
  const [formGenderPreference, setFormGenderPreference] = useState("Any");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const handleFormCheckboxChange = (name: keyof typeof formAmenities) => {
    setFormAmenities((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleFormUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles: File[] = [];
      const validUrls: string[] = [];

      for (const file of selectedFiles) {
        const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|mkv|avi)$/i);
        const limitMb = isVideo ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB;
        const sizeMb = file.size / (1024 * 1024);

        if (sizeMb > limitMb) {
          setFormError(`File "${file.name}" (${sizeMb.toFixed(1)} MB) exceeds the ${limitMb} MB limit. Please choose a smaller file.`);
          return;
        }

        validFiles.push(file);
        validUrls.push(URL.createObjectURL(file));
      }

      setFormImageFiles((prev) => [...prev, ...validFiles]);
      setFormImages((prev) => [...prev, ...validUrls]);
      setFormError("");
    }
  };

  const removeFormImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
    setFormImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (formRoommateIntent === "LOOKING_TO_PAIR") {
      if (!formTitle || !formTargetTotalRent || !formMyBudget || !formLocation) {
        setFormError("Please fill in required fields: Listing Title, Target Rent, Your Budget, and Preferred Location.");
        return;
      }
    } else {
      if (!formTitle || !formPrice || !formLocation) {
        setFormError("Please fill in required fields: Listing Title, Price, and Location.");
        return;
      }
    }

    setIsSubmitting(true);

    const activeAmenities: string[] = [];
    if (formAmenities.fencedCompound) activeAmenities.push("Fenced compound");
    if (formAmenities.gatedCompound) activeAmenities.push("Gated compound");
    if (formAmenities.wardrobe) activeAmenities.push("Wardrobe");
    if (formAmenities.pvc) activeAmenities.push("PVC");
    if (formAmenities.pop) activeAmenities.push("POP");
    if (formAmenities.prepaidMeter) activeAmenities.push("Prepaid meter");
    if (formAmenities.runningWater) activeAmenities.push("running water");

    try {
      let uploadedUrls: string[] = [];
      if (formImageFiles.length > 0) {
        // Handle thumbnail extraction for videos
        const filesToProcess: File[] = [];
        for (const file of formImageFiles) {
          const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|mkv|avi)$/i);
          filesToProcess.push(file);
          if (isVideo) {
            try {
              const posterFile = await extractVideoThumbnail(file);
              if (posterFile) {
                filesToProcess.push(posterFile);
              }
            } catch (thumbErr) {
              console.warn("Roommate video thumbnail extraction skipped:", thumbErr);
            }
          }
        }

        for (let i = 0; i < filesToProcess.length; i++) {
          const file = filesToProcess[i];
          const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|mkv|avi)$/i);
          const limitMb = isVideo ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB;
          const sizeMb = file.size / (1024 * 1024);

          if (sizeMb > limitMb) {
            setFormError(`File "${file.name}" (${sizeMb.toFixed(1)} MB) has exceeded the ${limitMb} MB limit.`);
            setIsSubmitting(false);
            return;
          }

          // Tier 1: Direct presigned R2 upload
          let uploaded = false;
          try {
            const presignedRes = await getMediaUploadPresignedUrl(
              file.name,
              file.type || (isVideo ? "video/mp4" : "image/jpeg"),
              file.size
            );

            if (presignedRes.success && presignedRes.uploadUrl && presignedRes.publicUrl) {
              const putRes = await fetch(presignedRes.uploadUrl, {
                method: "PUT",
                body: file,
              });

              if (putRes.ok) {
                uploadedUrls.push(presignedRes.publicUrl);
                uploaded = true;
              } else {
                console.warn("Direct presigned upload response error:", putRes.status);
              }
            }
          } catch (presignedErr) {
            console.warn("Direct presigned upload error, trying /api/upload fallback:", presignedErr);
          }

          // Tier 2: Same-origin /api/upload fallback
          if (!uploaded) {
            try {
              const apiFormData = new FormData();
              apiFormData.append("file", file);
              const apiRes = await fetch("/api/upload", {
                method: "POST",
                body: apiFormData,
              });
              if (apiRes.ok) {
                const apiData = await apiRes.json();
                if (apiData.success && apiData.publicUrl) {
                  uploadedUrls.push(apiData.publicUrl);
                  uploaded = true;
                }
              }
            } catch (apiErr) {
              console.error("Same-origin /api/upload error:", apiErr);
            }
          }

          if (!uploaded) {
            setFormError(`Failed to upload "${file.name}". Please check your internet connection and try again.`);
            setIsSubmitting(false);
            return;
          }
        }
      }

      const defaultPlaceholder = formRoommateIntent === "LOOKING_TO_PAIR"
        ? "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
      const finalImages = uploadedUrls.length > 0 ? uploadedUrls : [defaultPlaceholder];

      const propertyData: any = {
        title: formTitle,
        hostelType: formHostelType,
        price: formRoommateIntent === "LOOKING_TO_PAIR" ? formMyBudget : formPrice,
        location: formLocation,
        distance: formDistance ? formDistance.trim() : "",
        description: formDescription.trim() || (formRoommateIntent === "LOOKING_TO_PAIR" 
          ? "Looking for a compatible roommate to pool budget and co-rent an apartment together." 
          : "Roommate accommodation space available."),
        university: currentUser?.studentProfile?.university || "FUPRE",
        amenities: activeAmenities,
        images: finalImages,
        genderPreference: formGenderPreference,
        roommateIntent: formRoommateIntent,
      };

      if (formRoommateIntent === "LOOKING_TO_PAIR") {
        propertyData.targetTotalRent = formTargetTotalRent;
        propertyData.myBudget = formMyBudget;
        propertyData.department = formDepartment || (currentUser?.studentProfile?.preferences as any)?.department || "General Studies";
        propertyData.level = formLevel || (currentUser?.studentProfile?.preferences as any)?.level || "100L";
        propertyData.slotsTotal = formSlotsTotal || 2;
        propertyData.slotsFilled = 1;
      }

      const res = await addProperty(propertyData);

      setIsSubmitting(false);

      if (res.success) {
        setFormSuccess(true);
        onSuccess();
        setTimeout(() => {
          onClose();
          setFormSuccess(false);
          setFormTitle("");
          setFormPrice("");
          setFormTargetTotalRent("");
          setFormMyBudget("");
          setFormLocation("");
          setFormDistance("");
          setFormDescription("");
          setFormImages([]);
          setFormImageFiles([]);
          setFormGenderPreference("Any");
        }, 1500);
      } else {
        setFormError(res.error || "Failed to list roommate option.");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setFormError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-user-friends"></i> Find or List Roommate Space</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          {formSuccess ? (
            <div className="roommate-form-success-box">
              <i className="fas fa-check-circle roommate-form-success-icon"></i>
              <h3 className="roommate-form-success-title">Listing Posted Successfully!</h3>
              <p className="roommate-form-success-sub">Your roommate listing is now active in the directory.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit}>
              {formError && (
                <div className="roommate-form-error-banner form-banner-mb-16">
                  <i className="fas fa-exclamation-circle"></i> {formError}
                </div>
              )}

              {/* Mode Switch Bar */}
              <div className="listing-intent-switch-bar">
                <button
                  type="button"
                  className={`intent-mode-option ${formRoommateIntent === "HAVE_SPACE" ? "active" : ""}`}
                  onClick={() => setFormRoommateIntent("HAVE_SPACE")}
                >
                  <i className="fas fa-door-open"></i>
                  <strong>I Have a Space / Room</strong>
                  <small>Sublet or invite a roommate to move in</small>
                </button>
                <button
                  type="button"
                  className={`intent-mode-option ${formRoommateIntent === "LOOKING_TO_PAIR" ? "active" : ""}`}
                  onClick={() => setFormRoommateIntent("LOOKING_TO_PAIR")}
                >
                  <i className="fas fa-handshake"></i>
                  <strong>Looking to Pair Up (Unpaid House)</strong>
                  <small>Pool budget before paying for a new house</small>
                </button>
              </div>

              {formRoommateIntent === "LOOKING_TO_PAIR" && (
                <div className="pairing-calc-banner">
                  <p>
                    <i className="fas fa-handshake"></i> <strong>Unpaid Co-Renting Mode:</strong> List an apartment you want to rent so other students can pair with you to pool the rent together.
                  </p>
                  {formTargetTotalRent && formMyBudget && (
                    <p className="pairing-calc-summary">
                      Target Rent: ₦{Number(formTargetTotalRent).toLocaleString()} | Your Share: ₦{Number(formMyBudget).toLocaleString()} | Roommate(s) Needed: ₦{Math.max(0, Number(formTargetTotalRent) - Number(formMyBudget)).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              <div className="form-group-custom">
                <label htmlFor="form-title">
                  {formRoommateIntent === "LOOKING_TO_PAIR" ? "Co-Renting Listing Title *" : "Listing Title *"}
                </label>
                <input 
                  type="text" 
                  id="form-title" 
                  placeholder={formRoommateIntent === "LOOKING_TO_PAIR" ? "e.g. Need 1 roommate to pair up for 2-bedroom flat at Gate" : "Enter roommate listing title"} 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="form-input-custom"
                  required
                />
              </div>

              {formRoommateIntent === "LOOKING_TO_PAIR" ? (
                <>
                  <div className="form-grid-2">
                    <div className="form-group-custom">
                      <label htmlFor="form-target-rent">Target Total Apartment Rent (₦/yr) *</label>
                      <input 
                        type="number" 
                        id="form-target-rent" 
                        placeholder="Total rent for the whole flat" 
                        value={formTargetTotalRent}
                        onChange={(e) => setFormTargetTotalRent(e.target.value)}
                        className="form-input-custom"
                        required
                      />
                    </div>

                    <div className="form-group-custom">
                      <label htmlFor="form-my-budget">Your Budget Contribution (₦/yr) *</label>
                      <input 
                        type="number" 
                        id="form-my-budget" 
                        placeholder="Your max pledge towards total rent" 
                        value={formMyBudget}
                        onChange={(e) => setFormMyBudget(e.target.value)}
                        className="form-input-custom"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-custom">
                      <label htmlFor="form-dept">Your Academic Department *</label>
                      <input 
                        type="text" 
                        id="form-dept" 
                        placeholder="e.g. Computer Science, Accounting" 
                        value={formDepartment}
                        onChange={(e) => setFormDepartment(e.target.value)}
                        className="form-input-custom"
                        required
                      />
                    </div>

                    <div className="form-group-custom">
                      <label htmlFor="form-level">Your Academic Level *</label>
                      <SearchableSelect
                        options={levelOptions}
                        value={formLevel}
                        onChange={(val) => setFormLevel(val)}
                        placeholder="Select level..."
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-custom">
                      <label htmlFor="form-type">Space Type *</label>
                      <SearchableSelect
                        options={spaceTypes}
                        value={formHostelType}
                        onChange={(val) => setHostelType(val)}
                        placeholder="Select space type..."
                        required
                      />
                    </div>

                    <div className="form-group-custom">
                      <label htmlFor="form-slots">Total Students in Flat *</label>
                      <input 
                        type="number" 
                        id="form-slots" 
                        min="2"
                        max="6"
                        placeholder="e.g. 2" 
                        value={formSlotsTotal}
                        onChange={(e) => setFormSlotsTotal(parseInt(e.target.value, 10) || 2)}
                        className="form-input-custom"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="form-grid-2">
                  <div className="form-group-custom">
                    <label htmlFor="form-type">Space Type *</label>
                    <SearchableSelect
                      options={spaceTypes}
                      value={formHostelType}
                      onChange={(val) => setHostelType(val)}
                      placeholder="Select space type..."
                      required
                    />
                  </div>

                  <div className="form-group-custom">
                    <label htmlFor="form-price">Your Share of Rent (₦/yr) *</label>
                    <input 
                      type="number" 
                      id="form-price" 
                      placeholder="Shared rent amount" 
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="form-input-custom"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-grid-2">
                <div className="form-group-custom">
                  <label htmlFor="form-location">Hostel Location *</label>
                  <input 
                    type="text" 
                    id="form-location" 
                    placeholder="Apartment street address or area" 
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="form-input-custom"
                    required
                  />
                </div>

                <div className="form-group-custom">
                  <label htmlFor="form-distance">
                    {formRoommateIntent === "LOOKING_TO_PAIR" ? "Preferred Proximity (Optional)" : "Proximity Walk Time (Optional)"}
                  </label>
                  <input 
                    type="text" 
                    id="form-distance" 
                    placeholder={formRoommateIntent === "LOOKING_TO_PAIR" ? "e.g. 5-10 mins walk to campus gate (Optional)" : "Estimated walking time to campus gate (Optional)"} 
                    value={formDistance}
                    onChange={(e) => setFormDistance(e.target.value)}
                    className="form-input-custom"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group-custom">
                  <label htmlFor="form-gender-pref">Preferred Roommate Gender *</label>
                  <SearchableSelect
                    options={[
                      { code: "Any", name: "Any Gender" },
                      { code: "Male", name: "Male Only" },
                      { code: "Female", name: "Female Only" }
                    ]}
                    value={formGenderPreference}
                    onChange={(val) => setFormGenderPreference(val)}
                    placeholder="Select preferred gender..."
                    required
                  />
                </div>
              </div>

              <div className="form-group-custom">
                <label htmlFor="form-desc">
                  {formRoommateIntent === "LOOKING_TO_PAIR" 
                    ? "Roommate & Lifestyle Preferences (Optional)" 
                    : "Apartment & Roommate Description (Optional)"}
                </label>
                <textarea 
                  id="form-desc" 
                  placeholder={formRoommateIntent === "LOOKING_TO_PAIR" 
                    ? "Optional: Describe what you are looking for in a co-renter, your lifestyle, quiet hours, or target area..." 
                    : "Optional: Describe the apartment layout, utility bills, lifestyle, and clean/noise compatibility expectations..."} 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="form-textarea-custom"
                />
              </div>

              <div className="form-group-custom">
                <label>
                  {formRoommateIntent === "LOOKING_TO_PAIR" 
                    ? "Desired Features & Amenities (Optional)" 
                    : "Included Features & Amenities (Optional)"}
                </label>
                <div className="checkbox-grid-custom">
                  <label className="checkbox-label-custom">
                    <input type="checkbox" checked={formAmenities.fencedCompound} onChange={() => handleFormCheckboxChange("fencedCompound")} />
                    Fenced compound
                  </label>
                  <label className="checkbox-label-custom">
                    <input type="checkbox" checked={formAmenities.gatedCompound} onChange={() => handleFormCheckboxChange("gatedCompound")} />
                    Gated compound
                  </label>
                  <label className="checkbox-label-custom">
                    <input type="checkbox" checked={formAmenities.wardrobe} onChange={() => handleFormCheckboxChange("wardrobe")} />
                    Wardrobe
                  </label>
                  <label className="checkbox-label-custom">
                    <input type="checkbox" checked={formAmenities.pvc} onChange={() => handleFormCheckboxChange("pvc")} />
                    PVC
                  </label>
                  <label className="checkbox-label-custom">
                    <input type="checkbox" checked={formAmenities.pop} onChange={() => handleFormCheckboxChange("pop")} />
                    POP
                  </label>
                  <label className="checkbox-label-custom">
                    <input type="checkbox" checked={formAmenities.prepaidMeter} onChange={() => handleFormCheckboxChange("prepaidMeter")} />
                    Prepaid meter
                  </label>
                  <label className="checkbox-label-custom">
                    <input type="checkbox" checked={formAmenities.runningWater} onChange={() => handleFormCheckboxChange("runningWater")} />
                    running water
                  </label>
                </div>
              </div>

              <div className="form-group-custom">
                <label>Room Photos & Video Tour (Optional)</label>
                <p className="roommate-upload-hint">
                  {formRoommateIntent === "LOOKING_TO_PAIR"
                    ? "Optional if you don't have an apartment on ground yet. Supports JPG, PNG, WEBP (Max 5MB) & MP4, MOV, WebM (Max 20MB)"
                    : "Supports JPG, PNG, WEBP (Max 5MB) & MP4, MOV, WebM videos (Max 20MB)"}
                </p>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*,video/*"
                  onChange={handleFormUpload}
                  className="roommate-file-input"
                />
                
                {formImages.length > 0 && (
                  <div className="roommate-preview-grid">
                    {formImages.map((src, i) => {
                      const isVideo = src.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i) || (formImageFiles[i] && formImageFiles[i].type.startsWith("video/"));
                      return (
                        <div key={i} className="roommate-preview-wrap">
                          {isVideo ? (
                            <div className="roommate-preview-video-box">
                              <video src={src} controls className="roommate-preview-img" playsInline />
                              <span className="roommate-video-pill">
                                <i className="fas fa-video"></i> Video Tour
                              </span>
                            </div>
                          ) : (
                            <img src={src} alt={`Preview ${i + 1}`} className="roommate-preview-img" />
                          )}
                          <button 
                            type="button" 
                            onClick={() => removeFormImage(i)}
                            className="roommate-preview-del-btn"
                            title="Remove media"
                            aria-label="Remove media"
                          >
                            &times;
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="form-actions-custom">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><i className="fas fa-spinner fa-spin"></i> Uploading...</>
                  ) : (
                    "Upload Space Listing"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
