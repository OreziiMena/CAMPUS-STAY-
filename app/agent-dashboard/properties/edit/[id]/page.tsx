"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { getPropertyDetails, updateProperty, uploadPropertyImages } from "@/app/actions/properties";
import "./styles.css";
import { NIGERIAN_UNIVERSITIES } from "@/lib/universities";
import SearchableSelect from "@/components/SearchableSelect";

export default function EditProperty() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [hostelType, setHostelType] = useState("Self-Contain");
  const [university, setUniversity] = useState("FUPRE");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [description, setDescription] = useState("");

  const [amenities, setAmenities] = useState({
    bed: false,
    bath: false,
    prepaid: false,
    water: false,
    gated: false,
    security: false,
    wardrobe: false,
    kitchen: false
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
        setPrice(String(prop.price));
        setLocation(prop.location);
        setDistance(prop.distance);
        setDescription(prop.description);
        setExistingImages(prop.images || []);

        // Parse amenities
        const parsedAmenities = {
          bed: prop.amenities.includes("Bed included") || prop.amenities.includes("Shared Bedspace"),
          bath: prop.amenities.includes("Private Bathroom") || prop.amenities.includes("Shared Bathroom"),
          prepaid: prop.amenities.includes("Prepaid Meter"),
          water: prop.amenities.includes("Borehole Water"),
          gated: prop.amenities.includes("Gated Compound"),
          security: prop.amenities.includes("Security Guard"),
          wardrobe: prop.amenities.includes("Wardrobe"),
          kitchen: prop.amenities.includes("Kitchen")
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

  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setNewImageFiles((prev) => [...prev, ...selectedFiles]);
      const fileNames = selectedFiles.map(file => URL.createObjectURL(file));
      setNewImagePreviews((prev) => [...prev, ...fileNames]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
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
    if (amenities.wardrobe) activeAmenities.push("Wardrobe");
    if (amenities.kitchen) activeAmenities.push("Kitchen");

    try {
      let newlyUploadedUrls: string[] = [];
      if (newImageFiles.length > 0) {
        const formData = new FormData();
        newImageFiles.forEach((file) => {
          formData.append("images", file);
        });
        const uploadRes = await uploadPropertyImages(formData);
        if (!uploadRes.success) {
          setError(uploadRes.error || "Failed to upload new images.");
          setIsLoading(false);
          return;
        }
        newlyUploadedUrls = uploadRes.urls || [];
      }

      // Combined images: remaining existing ones + newly uploaded ones
      const finalImages = [...existingImages, ...newlyUploadedUrls];
      
      if (finalImages.length === 0) {
        finalImages.push("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3");
      }

      const res = await updateProperty(id, {
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
        setError(res.error || "Failed to update property.");
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "An unexpected error occurred.");
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
        <div className="success-banner-card" style={{ background: "#fff", padding: "35px", borderRadius: "12px", textAlign: "center", border: "1px solid #eaeaea" }}>
          <i className="fas fa-check-circle" style={{ fontSize: "48px", color: "#2e7d32", marginBottom: "15px" }}></i>
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

            <div className="input-group" style={{ gridColumn: "1 / -1" }}>
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

            <div className="input-group" style={{ gridColumn: "1 / -1" }}>
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
            {/* Existing Media */}
            {existingImages.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontFamily: "Open Sans", fontSize: "14px", fontWeight: "600", color: "rgb(2,53,28)", marginBottom: "10px" }}>Existing Media</p>
                <div className="uploaded-previews">
                  {existingImages.map((url, i) => {
                    const isVideo = url.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
                    return (
                      <div key={i} className="preview-img-wrapper">
                        {isVideo ? (
                          <video src={url} className="w-full h-full object-cover" controls style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
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
              <p style={{ fontFamily: "Open Sans", fontSize: "14px", fontWeight: "600", color: "rgb(2,53,28)", marginBottom: "10px" }}>Upload New Media</p>
              <div className="file-upload-zone">
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Drag and drop property media or <span>Browse files</span></p>
                <input type="file" multiple accept="image/*,video/*" onChange={handleNewImageUpload} />
              </div>

              {newImagePreviews.length > 0 && (
                <div className="uploaded-previews">
                  {newImagePreviews.map((url, i) => {
                    const isVideo = url.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i) || (newImageFiles[i] && newImageFiles[i].type.startsWith("video/"));
                    return (
                      <div key={i} className="preview-img-wrapper">
                        {isVideo ? (
                          <video src={url} className="w-full h-full object-cover" controls style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
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
        </form>
      )}
    </>
  );
}
