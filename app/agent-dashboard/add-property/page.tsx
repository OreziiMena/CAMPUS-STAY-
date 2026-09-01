"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { addProperty, uploadPropertyImages } from "@/app/actions/properties";
import styles from "./add-property.module.css";
import "./styles.css";
import { NIGERIAN_UNIVERSITIES } from "@/lib/universities";
import SearchableSelect from "@/components/SearchableSelect";

export default function AddProperty() {
  const router = useRouter();
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
    bed: true,
    bath: true,
    prepaid: false,
    water: true,
    gated: false,
    security: false,
    wardrobe: false,
    kitchen: false
  });

  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user || user.role !== "AGENT") {
        router.push("/auth/login");
        return;
      }
    };
    checkUser();
  }, [router]);

  const handleCheckboxChange = (name: keyof typeof amenities) => {
    setAmenities((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...selectedFiles]);
      const fileNames = selectedFiles.map(file => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...fileNames]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
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
    if (amenities.bed) activeAmenities.push("Bed included");
    if (amenities.bath) activeAmenities.push("Private Bathroom");
    if (amenities.prepaid) activeAmenities.push("Prepaid Meter");
    if (amenities.water) activeAmenities.push("Borehole Water");
    if (amenities.gated) activeAmenities.push("Gated Compound");
    if (amenities.security) activeAmenities.push("Security Guard");
    if (amenities.wardrobe) activeAmenities.push("Wardrobe");
    if (amenities.kitchen) activeAmenities.push("Kitchen");

    try {
      let uploadedUrls: string[] = [];
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append("images", file);
        });
        const uploadRes = await uploadPropertyImages(formData);
        if (!uploadRes.success) {
          setError(uploadRes.error || "Failed to upload images.");
          setIsLoading(false);
          return;
        }
        uploadedUrls = uploadRes.urls || [];
      }

      // Fallback if no images uploaded
      const finalImages = uploadedUrls.length > 0 ? uploadedUrls : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3"];

      const res = await addProperty({
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
        setError(res.error || "Failed to list property.");
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="welcome-banner">
        <div>
          <h1 className={styles.h1Title}>
            <i className={`fas fa-plus-circle ${styles.plusIcon}`}></i> Add New Property
          </h1>
          <p className={styles.pSub}>List a new student hostel, apartment, or flat near campus.</p>
        </div>
        <Link href="/agent-dashboard" className="back-to-dash-btn">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
      </div>

      {success ? (
        <div className={`success-banner-card ${styles.successCard}`}>
          <i className={`fas fa-check-circle ${styles.checkIcon}`}></i>
          <h2 className={styles.successTitle}>Property Listed Successfully!</h2>
          <p className={styles.successDesc}>Your listing is now live. Redirecting you to dashboard...</p>
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
                placeholder="e.g. Standard Self-Con near FUPRE Main Gate"
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
                  { code: "Single Room", name: "Single Room" },
                  { code: "1-Bedroom Flat", name: "1-Bedroom Flat" },
                  { code: "2-Bedroom Flat", name: "2-Bedroom Flat" },
                  { code: "Shared Hostel Room", name: "Shared Hostel Room" }
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <label style={{ fontWeight: "700", color: "rgb(2, 53, 28)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                  <i className="fas fa-tag"></i> Pricing & Fee Breakdown
                </label>
                {((parseFloat(rentAmount) || 0) + (parseFloat(agentFee) || 0) + (parseFloat(cautionFee) || 0)) > 0 && (
                  <span style={{
                    fontSize: "0.88rem",
                    fontWeight: "700",
                    color: "rgb(2, 53, 28)",
                    background: "rgba(2, 53, 28, 0.08)",
                    padding: "4px 12px",
                    borderRadius: "20px"
                  }}>
                    Total Tenant Cost: ₦{((parseFloat(rentAmount) || 0) + (parseFloat(agentFee) || 0) + (parseFloat(cautionFee) || 0)).toLocaleString()} / yr
                  </span>
                )}
              </div>

              <div className="pricing-inputs-grid">
                <div>
                  <label htmlFor="rentAmount" style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>
                    House Rent (₦ per year) *
                  </label>
                  <input
                    type="number"
                    id="rentAmount"
                    placeholder="e.g. 150000"
                    value={rentAmount}
                    onChange={(e) => setRentAmount(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db" }}
                  />
                </div>

                <div>
                  <label htmlFor="agentFee" style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>
                    Agent Fee (₦) *
                  </label>
                  <input
                    type="number"
                    id="agentFee"
                    placeholder="e.g. 15000"
                    value={agentFee}
                    onChange={(e) => setAgentFee(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db" }}
                  />
                </div>

                <div>
                  <label htmlFor="cautionFee" style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>
                    Caution Fee (₦) <span style={{ color: "#6b7280", fontWeight: "normal" }}>(Optional)</span>
                  </label>
                  <input
                    type="number"
                    id="cautionFee"
                    placeholder="e.g. 10000 (0 if none)"
                    value={cautionFee}
                    onChange={(e) => setCautionFee(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                <input
                  type="checkbox"
                  id="isNegotiable"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "rgb(2, 53, 28)", cursor: "pointer" }}
                />
                <label htmlFor="isNegotiable" style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151", cursor: "pointer", margin: 0 }}>
                  Agent fee is negotiable with student tenants
                </label>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="location">Property Location *</label>
              <input
                type="text"
                id="location"
                placeholder="e.g. FUPRE Road, Effurun"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className={`input-group ${styles.fullWidthGroup}`}>
              <label htmlFor="distance">Distance from Campus Gate *</label>
              <input
                type="text"
                id="distance"
                placeholder="e.g. 5 mins walk to campus, 10 mins drive to FUPRE gate"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
              />
            </div>

            <div className={`input-group ${styles.fullWidthGroup}`}>
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
                checked={amenities.bed}
                onChange={() => handleCheckboxChange("bed")}
              />
              <span>Bed included</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={amenities.bath}
                onChange={() => handleCheckboxChange("bath")}
              />
              <span>Private Bathroom</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={amenities.prepaid}
                onChange={() => handleCheckboxChange("prepaid")}
              />
              <span>Prepaid Meter</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={amenities.water}
                onChange={() => handleCheckboxChange("water")}
              />
              <span>Borehole/Running Water</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={amenities.gated}
                onChange={() => handleCheckboxChange("gated")}
              />
              <span>Gated Compound</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={amenities.security}
                onChange={() => handleCheckboxChange("security")}
              />
              <span>Security Guard</span>
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
                checked={amenities.kitchen}
                onChange={() => handleCheckboxChange("kitchen")}
              />
              <span>Kitchen</span>
            </label>
          </div>

          <div className="form-section-title">Property Media</div>
          <div className="upload-container">
            <div className="file-upload-zone">
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Drag and drop property media or <span>Browse files</span></p>
              <input type="file" multiple accept="image/*,video/*" onChange={handleMockUpload} />
            </div>

            {images.length > 0 && (
              <div className="uploaded-previews">
                {images.map((url, i) => {
                  const isVideo = url.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i) || (imageFiles[i] && imageFiles[i].type.startsWith("video/"));
                  return (
                    <div key={i} className="preview-img-wrapper">
                      {isVideo ? (
                        <video src={url} className="w-full h-full object-cover" controls style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                      ) : (
                        <img src={url} alt="preview" />
                      )}
                      <button type="button" onClick={() => removeImage(i)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Listing Property..." : "List Property"}
          </button>
        </form>
      )}
    </>
  );
}
