"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { addProperty, getMediaUploadPresignedUrl } from "@/app/actions/properties";
import { extractVideoThumbnail } from "@/lib/video-helper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";
import SearchableSelect from "@/components/SearchableSelect";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 20;

export default function AddRoommateListing() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [hostelType, setHostelType] = useState("Bedsitter");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [description, setDescription] = useState("");
  const [genderPreference, setGenderPreference] = useState("Any");

  const [amenities, setAmenities] = useState({
    fencedCompound: false,
    gatedCompound: true,
    wardrobe: false,
    pvc: false,
    pop: false,
    prepaidMeter: false,
    runningWater: true,
  });

  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser || currentUser.role !== "STUDENT") {
        router.push("/auth/login");
        return;
      }
      setUser(currentUser);
    };
    checkUser();
  }, [router]);

  const handleCheckboxChange = (name: keyof typeof amenities) => {
    setAmenities((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newFiles: File[] = [];
      const newUrls: string[] = [];

      for (const file of filesArray) {
        const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|mkv|avi)$/i);
        const limitMb = isVideo ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB;
        const sizeMb = file.size / (1024 * 1024);

        if (sizeMb > limitMb) {
          setError(`File "${file.name}" (${sizeMb.toFixed(1)} MB) exceeds the ${limitMb} MB limit. Please compress or choose a smaller file.`);
          return;
        }

        newFiles.push(file);
        newUrls.push(URL.createObjectURL(file));
      }

      setImageFiles((prev) => [...prev, ...newFiles]);
      setImages((prev) => [...prev, ...newUrls]);
      setError("");
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
    if (amenities.fencedCompound) activeAmenities.push("Fenced compound");
    if (amenities.gatedCompound) activeAmenities.push("Gated compound");
    if (amenities.wardrobe) activeAmenities.push("Wardrobe");
    if (amenities.pvc) activeAmenities.push("PVC");
    if (amenities.pop) activeAmenities.push("POP");
    if (amenities.prepaidMeter) activeAmenities.push("Prepaid meter");
    if (amenities.runningWater) activeAmenities.push("running water");

    try {
      const uploadedUrls: string[] = [];
      if (imageFiles.length > 0) {
        // Place video on Slide 1 and synthesized photo on Slide 2
        const filesToProcess: File[] = [];
        for (const file of imageFiles) {
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
            setError(`File "${file.name}" (${sizeMb.toFixed(1)} MB) has exceeded the ${limitMb} MB limit. Please choose a smaller file.`);
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
                uploadedUrls.push(presignedRes.publicUrl);
                uploaded = true;
              } else {
                console.warn("Direct R2 upload response error:", uploadPutRes.status);
              }
            }
          } catch (presignedErr) {
            console.warn("Direct presigned upload error, trying same-origin /api/upload:", presignedErr);
          }

          // Tier 2: Same-Origin /api/upload
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
            setError(`Failed to upload "${file.name}". Please check your internet connection and try again.`);
            setIsLoading(false);
            return;
          }
        }
      }

      const res = await addProperty({
        title,
        hostelType,
        price,
        location,
        distance,
        description,
        amenities: activeAmenities,
        images: uploadedUrls.length > 0 ? uploadedUrls : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3"],
        genderPreference,
      });

      setIsLoading(false);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/student-dashboard");
        }, 1500);
      } else {
        setError(res.error || "Failed to list roommate option.");
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  if (!user) {
    return (
      <div className="roommate-loader">
        <i className="fas fa-spinner fa-spin"></i> Loading form...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="roommate-listing-layout">
        <div className="roommate-welcome-banner">
          <div>
            <h1>
              <i className="fas fa-user-friends"></i> List Roommate Space
            </h1>
            <p>Upload details and video tours of your apartment to find compatible student roommates.</p>
          </div>
          <Link href="/student-dashboard" className="back-to-dash-btn">
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </Link>
        </div>

        {success ? (
          <div className="success-banner-card">
            <i className="fas fa-check-circle"></i>
            <h2>Roommate Listing Uploaded!</h2>
            <p>Your roommate space is now live. Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form className="property-form-card" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message-bar">
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            )}

            {!user.studentProfile?.isVerified && (
              <div className="verification-warning-banner">
                <i className="fas fa-exclamation-triangle"></i>
                <p>
                  <strong>Note:</strong> Your profile is unverified. While you can upload listings, agents and students will not be able to contact you directly until you verify your profile in settings.
                </p>
              </div>
            )}

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="title">Listing Title *</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter roommate listing title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="hostel-type">Roommate Space Type *</label>
                <SearchableSelect
                  options={[
                    { code: "Bedsitter", name: "Bedsitter" },
                    { code: "Self-Contain", name: "Self-Contain" },
                    { code: "1-Bedroom Flat", name: "1-Bedroom Flat" },
                    { code: "2-Bedroom Flat", name: "2-Bedroom Flat" }
                  ]}
                  value={hostelType}
                  onChange={(val) => setHostelType(val)}
                  placeholder="Select space type..."
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="price">Shared Rent Cost (₦ per year) *</label>
                <input
                  type="number"
                  id="price"
                  placeholder="Shared rent amount"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="location">Apartment Location *</label>
                <input
                  type="text"
                  id="location"
                  placeholder="Apartment street address or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="input-group full-width-group">
                <label htmlFor="genderPreference">Preferred Roommate Gender *</label>
                <SearchableSelect
                  options={[
                    { code: "Any", name: "Any Gender" },
                    { code: "Male", name: "Male Only" },
                    { code: "Female", name: "Female Only" }
                  ]}
                  value={genderPreference}
                  onChange={(val) => setGenderPreference(val)}
                  placeholder="Select preferred gender..."
                  required
                />
              </div>

              <div className="input-group full-width-group">
                <label htmlFor="distance">Walking Distance to Campus Gate *</label>
                <input
                  type="text"
                  id="distance"
                  placeholder="Estimated walking time to campus gate"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  required
                />
              </div>

              <div className="input-group full-width-group">
                <label htmlFor="description">About the Apartment & Roommate Preferences *</label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="Describe your current apartment, utilities, rules, and what kind of roommate you are looking for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-section-title">Amenities Included</div>
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

            <div className="form-section-title">Apartment Photos & Video Tours</div>
            <div className="image-upload-section">
              <div className="upload-box-wrapper">
                <i className="fas fa-cloud-upload-alt upload-icon-green"></i>
                <p>Drag and drop media or <span className="upload-browse-highlight">Browse files</span></p>
                <p className="upload-subtext">
                  Supports JPG, PNG, WEBP (Max 5MB) & MP4, MOV, WebM videos (Max 20MB)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                />
              </div>

              {images.length > 0 && (
                <div className="uploaded-previews-grid">
                  {images.map((img, index) => {
                    const isVideo = img.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i) || (imageFiles[index] && imageFiles[index].type.startsWith("video/"));
                    return (
                      <div key={index} className="preview-image-card">
                        {isVideo ? (
                          <video src={img} className="preview-video" controls />
                        ) : (
                          <img src={img} alt={`Preview ${index + 1}`} />
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="delete-preview-btn"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="submit-listing-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Uploading & Publishing...
                </>
              ) : (
                "Publish Roommate Listing"
              )}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </>
  );
}
