"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { getPropertyDetails, updateProperty, uploadPropertyImages, getMediaUploadPresignedUrl } from "@/app/actions/properties";
import "./styles.css";
import { NIGERIAN_UNIVERSITIES } from "@/lib/universities";
import SearchableSelect from "@/components/SearchableSelect";
import { extractVideoThumbnail } from "@/lib/video-helper";

export default function EditProperty() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [hostelType, setHostelType] = useState("Self-Contain");
  const [university, setUniversity] = useState("FUPRE");
  const [rentAmount, setRentAmount] = useState("");
  const [agentFee, setAgentFee] = useState("");
  const [cautionFee, setCautionFee] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [description, setDescription] = useState("");

  const [amenities, setAmenities] = useState({
    fencedCompound: false,
    gatedCompound: false,
    wardrobe: false,
    pvc: false,
    pop: false,
    prepaidMeter: false,
    runningWater: false,
  });

  // Stored URL strings in DB
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // Newly added Files
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  // Preview blob URLs for new files
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initData = async () => {
      setIsPageLoading(true);
      setError("");

      const user = await getCurrentUser();
      if (!user || user.role !== "AGENT") {
        router.push("/auth/login");
        return;
      }

      if (!id) {
        setError("Invalid Property ID.");
        setIsPageLoading(false);
        return;
      }

      const res = await getPropertyDetails(id);
      if (res.success && res.property) {
        const prop = res.property;
        setTitle(prop.title);
        setHostelType(prop.hostelType);
        setUniversity(prop.university || "FUPRE");
        setRentAmount(prop.rentAmount !== null && prop.rentAmount !== undefined ? String(prop.rentAmount) : String(prop.price));
        setAgentFee(prop.agentFee !== null && prop.agentFee !== undefined ? String(prop.agentFee) : "0");
        setCautionFee(prop.cautionFee !== null && prop.cautionFee !== undefined ? String(prop.cautionFee) : "0");
        setIsNegotiable(Boolean(prop.isNegotiable));
        setLocation(prop.location);
        setDistance(prop.distance);
        setDescription(prop.description);
        setExistingImages(prop.images || []);

        // Parse amenities
        const parsedAmenities = {
          fencedCompound: prop.amenities.includes("Fenced compound"),
          gatedCompound: prop.amenities.includes("Gated compound"),
          wardrobe: prop.amenities.includes("Wardrobe"),
          pvc: prop.amenities.includes("PVC"),
          pop: prop.amenities.includes("POP"),
          prepaidMeter: prop.amenities.includes("Prepaid meter"),
          runningWater: prop.amenities.includes("running water"),
        };
        setAmenities(parsedAmenities);
      } else {
        setError(res.error || "Failed to load property details.");
      }
      setIsPageLoading(false);
    };

    initData();
  }, [id, router]);

  const handleCheckboxChange = (name: keyof typeof amenities) => {
    setAmenities((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const MAX_IMAGE_SIZE_MB = 5;
  const MAX_VIDEO_SIZE_MB = 20;

  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles: File[] = [];
      const validUrls: string[] = [];

      for (const file of selectedFiles) {
        const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|mkv|avi)$/i);
        const limitMb = isVideo ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB;
        const sizeMb = file.size / (1024 * 1024);

        if (sizeMb > limitMb) {
          setError(`File "${file.name}" (${sizeMb.toFixed(1)} MB) has exceeded the ${limitMb} MB limit. Please choose a smaller or compressed file.`);
          continue;
        }

        validFiles.push(file);
        validUrls.push(URL.createObjectURL(file));
      }

      if (validFiles.length > 0) {
        setNewImageFiles((prev) => [...prev, ...validFiles]);
        setNewImagePreviews((prev) => [...prev, ...validUrls]);
      }
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    setError("");
  };

  const removeNewImage = (index: number) => {
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !rentAmount || !agentFee || !location || !distance || !description) {
      setError("Please fill in all required fields (including house rent and agent fee).");
      return;
    }

    setIsLoading(true);

    const activeAmenities: string[] = [];
    if (amenities.fencedCompound) activeAmenities.push("Fenced compound");
    if (amenities.gatedCompound) activeAmenities.push("Gated compound");
    if (amenities.wardrobe) activeAmenities.push("Wardrobe");
    if (amenities.pvc) activeAmenities.push("PVC");
    if (amenities.pop) activeAmenities.push("POP");
    if (amenities.prepaidMeter) activeAmenities.push("Prepaid meter");
    if (amenities.runningWater) activeAmenities.push("running water");

    try {
      const newlyUploadedUrls: string[] = [];
      if (newImageFiles.length > 0) {
        // Place video on Slide 1 and synthesized photo on Slide 2
        const filesToProcess: File[] = [];
        for (const file of newImageFiles) {
          const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|mkv|avi)$/i);
          filesToProcess.push(file);
          if (isVideo) {
            try {
              const posterFile = await extractVideoThumbnail(file);
              if (posterFile) {
                filesToProcess.push(posterFile);
              }
            } catch (thumbErr) {
              console.warn("Edit video thumbnail extraction skipped:", thumbErr);
            }
          }
        }

        for (let i = 0; i < filesToProcess.length; i++) {
          const file = filesToProcess[i];
          const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|mkv|avi)$/i);
          const limitMb = isVideo ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB;
          const sizeMb = file.size / (1024 * 1024);

          if (sizeMb > limitMb) {
            setError(`File "${file.name}" (${sizeMb.toFixed(1)} MB) has exceeded the ${limitMb} MB limit. Please choose a smaller or compressed file.`);
            setIsLoading(false);
            return;
          }

          // Tier 1: Direct browser-to-R2 upload
          let uploaded = false;
          try {
            const presignedRes = await getMediaUploadPresignedUrl(
              file.name,
              file.type || (isVideo ? "video/mp4" : "image/jpeg"),
              file.size
            );

            if (presignedRes.success && presignedRes.uploadUrl && presignedRes.publicUrl) {
              const uploadPutRes = await fetch(presignedRes.uploadUrl, {
                method: "PUT",
                body: file,
              });

              if (uploadPutRes.ok) {
                newlyUploadedUrls.push(presignedRes.publicUrl);
                uploaded = true;
              } else {
                console.warn("Direct edit R2 upload response error:", uploadPutRes.status);
              }
            }
          } catch (presignedErr) {
            console.warn("Direct edit presigned upload error (likely CORS/network), trying same-origin /api/upload:", presignedErr);
          }

          // Tier 2: Same-Origin /api/upload (Guaranteed 0 CORS issues)
          if (!uploaded) {
            try {
              const apiFormData = new FormData();
              apiFormData.append("file", file);

              const apiRes = await fetch("/api/upload", {
                method: "POST",
                body: apiFormData,
              });

              const apiJson = await apiRes.json();
              if (apiRes.ok && apiJson.success && apiJson.url) {
                newlyUploadedUrls.push(apiJson.url);
                uploaded = true;
              } else {
                console.warn("/api/upload response error:", apiJson.error);
              }
            } catch (apiErr) {
              console.warn("/api/upload fetch error:", apiErr);
            }
          }

          // Tier 3: Server Action fallback for files <= 4MB
          if (!uploaded && file.size <= 4 * 1024 * 1024) {
            const formData = new FormData();
            formData.append("images", file);

            try {
              const uploadRes = await uploadPropertyImages(formData);
              if (uploadRes && uploadRes.success && uploadRes.urls && uploadRes.urls.length > 0) {
                newlyUploadedUrls.push(...uploadRes.urls);
                uploaded = true;
              }
            } catch (uploadErr: any) {
              console.warn("Edit server action upload fallback failed:", uploadErr);
            }
          }

          if (!uploaded) {
            setError(`Failed to upload "${file.name}" (${sizeMb.toFixed(1)} MB). Please try again.`);
            setIsLoading(false);
            return;
          }
        }
      }

      // Combined images: remaining existing ones + newly uploaded ones
      const finalImages = [...existingImages, ...newlyUploadedUrls];
      
      if (finalImages.length === 0) {
        finalImages.push("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3");
      }

      const res = await updateProperty(id, {
        title,
        hostelType,
        rentAmount,
        agentFee: agentFee || "0",
        cautionFee: cautionFee || "0",
        isNegotiable,
        location,
        distance,
        description,
        university,
        amenities: activeAmenities,
        images: finalImages,
      });

      setIsLoading(false);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/agent-dashboard/properties");
        }, 1500);
      } else {
        setError(res.error || "Failed to update property.");
      }
    } catch (err: any) {
      setIsLoading(false);
      const msg = err?.message || "";
      if (msg.includes("unexpected response") || msg.includes("Failed to fetch") || msg.includes("413")) {
        setError("Upload failed: One or more media files exceeded the allowed server size. Please ensure photos are under 5MB and videos under 15MB.");
      } else {
        setError(msg || "An unexpected error occurred while updating the property.");
      }
    }
  };

  if (isPageLoading) {
    return (
      <div className="loader">
        <i className="fas fa-spinner fa-spin"></i> Loading property details...
      </div>
    );
  }

  return (
    <>
      <div className="welcome-banner">
        <div>
          <h1>
            <i className="fas fa-edit"></i> Edit Property Listing
          </h1>
          <p>Modify listings details, prices, amenities, and media.</p>
        </div>
        <Link href="/agent-dashboard/properties" className="back-to-dash-btn">
          <i className="fas fa-arrow-left"></i> Cancel & Go Back
        </Link>
      </div>

      {success ? (
        <div className="success-banner-card">
          <i className="fas fa-check-circle success-icon"></i>
          <h2>Property Updated Successfully!</h2>
          <p>Your updates are now live. Redirecting to properties listing...</p>
        </div>
      ) : (
        <form className="property-form-card" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message-bar">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="title">Property Title *</label>
              <input
                type="text"
                id="title"
                placeholder="Enter property title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="hostel-type">Property Type *</label>
              <SearchableSelect
                options={[
                  { code: "Self-Contain", name: "Self-Contain" },
                  { code: "Bedsitter", name: "Bedsitter" },
                  { code: "1-Bedroom Flat", name: "1-Bedroom Flat" },
                  { code: "2-Bedroom Flat", name: "2-Bedroom Flat" },
                ]}
                value={hostelType}
                onChange={(val) => setHostelType(val)}
                placeholder="Select property type..."
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="university">Nearest University *</label>
              <SearchableSelect
                options={NIGERIAN_UNIVERSITIES}
                value={university}
                onChange={(val) => setUniversity(val)}
                placeholder="Select nearest university..."
                required
              />
            </div>

            {/* Pricing Breakdown Section */}
            <div className="input-group pricing-breakdown-card">
              <div className="pricing-card-header">
                <label className="pricing-card-title">
                  <i className="fas fa-tag"></i> Pricing & Fee Breakdown
                </label>
                {((parseFloat(rentAmount) || 0) + (parseFloat(agentFee) || 0) + (parseFloat(cautionFee) || 0)) > 0 && (
                  <span className="pricing-total-badge">
                    Total Tenant Cost: ₦{((parseFloat(rentAmount) || 0) + (parseFloat(agentFee) || 0) + (parseFloat(cautionFee) || 0)).toLocaleString()} / yr
                  </span>
                )}
              </div>

              <div className="pricing-inputs-grid">
                <div>
                  <label htmlFor="rentAmount" className="pricing-input-label">
                    House Rent (₦ per year) *
                  </label>
                  <input
                    type="number"
                    id="rentAmount"
                    placeholder="Annual rent amount"
                    value={rentAmount}
                    onChange={(e) => setRentAmount(e.target.value)}
                    required
                    className="pricing-input-field"
                  />
                </div>

                <div>
                  <label htmlFor="agentFee" className="pricing-input-label">
                    Agent Fee (₦) *
                  </label>
                  <input
                    type="number"
                    id="agentFee"
                    placeholder="Agency fee"
                    value={agentFee}
                    onChange={(e) => setAgentFee(e.target.value)}
                    required
                    className="pricing-input-field"
                  />
                </div>

                <div>
                  <label htmlFor="cautionFee" className="pricing-input-label">
                    Caution/others (₦) <span className="pricing-input-optional">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    id="cautionFee"
                    placeholder="Caution/others (0 if none)"
                    value={cautionFee}
                    onChange={(e) => setCautionFee(e.target.value)}
                    className="pricing-input-field"
                  />
                </div>
              </div>

              <div className="negotiable-row">
                <input
                  type="checkbox"
                  id="isNegotiable"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="negotiable-checkbox"
                />
                <label htmlFor="isNegotiable" className="negotiable-label">
                  Agent fee is negotiable with student tenants
                </label>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="location">Property Location *</label>
              <input
                type="text"
                id="location"
                placeholder="Property street address or area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="input-group grid-full-width">
              <label htmlFor="distance">Distance from Campus Gate *</label>
              <input
                type="text"
                id="distance"
                placeholder="Distance or estimated walking time to campus"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
              />
            </div>

            <div className="input-group grid-full-width">
              <label htmlFor="description">Property Description *</label>
              <textarea
                id="description"
                rows={5}
                placeholder="Describe the apartment layout, environment safety, transport options..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          <div className="form-section-title">Amenities Vetted</div>
          <div className="amenities-grid">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={amenities.fencedCompound}
                onChange={() => handleCheckboxChange("fencedCompound")}
              />
              <span>Fenced compound</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={amenities.gatedCompound}
                onChange={() => handleCheckboxChange("gatedCompound")}
              />
              <span>Gated compound</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={amenities.wardrobe}
                onChange={() => handleCheckboxChange("wardrobe")}
              />
              <span>Wardrobe</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={amenities.pvc}
                onChange={() => handleCheckboxChange("pvc")}
              />
              <span>PVC</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={amenities.pop}
                onChange={() => handleCheckboxChange("pop")}
              />
              <span>POP</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={amenities.prepaidMeter}
                onChange={() => handleCheckboxChange("prepaidMeter")}
              />
              <span>Prepaid meter</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={amenities.runningWater}
                onChange={() => handleCheckboxChange("runningWater")}
              />
              <span>running water</span>
            </label>
          </div>

          <div className="form-section-title">Property Media</div>
          <div className="upload-container">
            {/* Existing Media */}
            {existingImages.length > 0 && (
              <div className="existing-media-section">
                <p className="media-section-heading">Existing Media</p>
                <div className="uploaded-previews">
                  {existingImages.map((url, i) => {
                    const isVideo = url.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
                    return (
                      <div key={i} className="preview-img-wrapper">
                        {isVideo ? (
                          <video src={url} className="preview-video-element" controls />
                        ) : (
                          <img src={url} alt="existing preview" />
                        )}
                        <button type="button" onClick={() => removeExistingImage(i)}>
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upload Zone for New Media */}
            <div>
              <p className="media-section-heading">Upload New Media</p>
              <div className="file-upload-zone">
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Drag and drop property media or <span>Browse files</span></p>
                <p className="media-upload-help-text">
                  Supports JPG, PNG, WEBP (Max 5MB each) & MP4, MOV, WebM videos (Max 20MB)
                </p>
                <input type="file" multiple accept="image/*,video/*" onChange={handleNewImageUpload} />
              </div>

              {newImagePreviews.length > 0 && (
                <div className="uploaded-previews">
                  {newImagePreviews.map((url, i) => {
                    const isVideo = url.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i) || (newImageFiles[i] && newImageFiles[i].type.startsWith("video/"));
                    return (
                      <div key={i} className="preview-img-wrapper">
                        {isVideo ? (
                          <video src={url} className="preview-video-element" controls />
                        ) : (
                          <img src={url} alt="new preview" />
                        )}
                        <button type="button" onClick={() => removeNewImage(i)}>
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Saving changes..." : "Save Changes"}
          </button>

          {error && (
            <div className="upload-error-box">
              <i className="fas fa-exclamation-triangle upload-error-icon"></i>
              <div>
                <strong className="upload-error-title">Upload / Update Error:</strong>
                <span>{error}</span>
              </div>
            </div>
          )}
        </form>
      )}
    </>
  );
}
