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
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [description, setDescription] = useState("");

  const [amenities, setAmenities] = useState({
    bed: true,
    bath: true,
    prepaid: false,
    water: true,
    gated: false,
    security: false
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

    if (!title || !price || !location || !distance || !description) {
      setError("Please fill in all required fields.");
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
        price,
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

            <div className="input-group">
              <label htmlFor="price">Rent Price (₦ per year) *</label>
              <input
                type="number"
                id="price"
                placeholder="e.g. 150000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
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
              <span>Borehole Water</span>
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
          </div>

          <div className="form-section-title">Property Media</div>
          <div className="upload-container">
            <div className="file-upload-zone">
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Drag and drop property images or <span>Browse files</span></p>
              <input type="file" multiple accept="image/*" onChange={handleMockUpload} />
            </div>

            {images.length > 0 && (
              <div className="uploaded-previews">
                {images.map((url, i) => (
                  <div key={i} className="preview-img-wrapper">
                    <img src={url} alt="preview" />
                    <button type="button" onClick={() => removeImage(i)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
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
