"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { addProperty } from "@/app/actions/properties";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";

export default function AddRoommateListing() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [hostelType, setHostelType] = useState("Shared Room");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [description, setDescription] = useState("");

  const [amenities, setAmenities] = useState({
    bed: true,
    bath: false,
    prepaid: true,
    water: true,
    gated: true,
    security: false
  });

  const [images, setImages] = useState<string[]>([]);
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

  const handleMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...fileNames]);
    }
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
    if (amenities.bed) activeAmenities.push("Shared Bedspace");
    if (amenities.bath) activeAmenities.push("Shared Bathroom");
    if (amenities.prepaid) activeAmenities.push("Prepaid Meter");
    if (amenities.water) activeAmenities.push("Borehole Water");
    if (amenities.gated) activeAmenities.push("Gated Compound");
    if (amenities.security) activeAmenities.push("Security Guard");

    try {
      const res = await addProperty({
        title,
        hostelType,
        price,
        location,
        distance,
        description,
        amenities: activeAmenities,
        images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3"],
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
    } catch {
      setIsLoading(false);
      setError("An unexpected error occurred.");
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
            <p>Upload details of your current apartment to find roommate sharing partners.</p>
          </div>
          <Link href="/student-dashboard" className="back-to-dash-btn">
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </Link>
        </div>

        {success ? (
          <div className="success-banner-card">
            <i className="fas fa-check-circle"></i>
            <h2>Roommate Listing Uploaded!</h2>
            <p>Your roommate request listing is now live. Redirecting to your dashboard...</p>
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
                  placeholder="e.g. Need 1 roommate for Self-Con sharing near South Gate"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="hostel-type">Roommate Space Type *</label>
                <select
                  id="hostel-type"
                  value={hostelType}
                  onChange={(e) => setHostelType(e.target.value)}
                  required
                >
                  <option value="Shared Room">Shared Room (Single Room)</option>
                  <option value="Roommate Sharing (Self-Contain)">Roommate Sharing (Self-Contain)</option>
                  <option value="Roommate Sharing (1-Bedroom Flat)">Roommate Sharing (1-Bedroom Flat)</option>
                  <option value="Roommate Sharing (2-Bedroom Flat)">Roommate Sharing (2-Bedroom Flat)</option>
                  <option value="Shared Hostel Room">Shared Hostel Room</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="price">Shared Rent Cost (₦ per year) *</label>
                <input
                  type="number"
                  id="price"
                  placeholder="e.g. 75000 (your roommate's share)"
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
                  placeholder="e.g. South Gate Area, Effurun"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="input-group full-width-group">
                <label htmlFor="distance">Walking Distance to Campus Gate *</label>
                <input
                  type="text"
                  id="distance"
                  placeholder="e.g. 5 mins walk to South Gate"
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
                  placeholder="Describe your current apartment, utilities, rules, and what kind of roommate you are looking for (e.g. clean, studious, gender preference)..."
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
                  checked={amenities.bed}
                  onChange={() => handleCheckboxChange("bed")}
                />
                <span>Shared Bedspace</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={amenities.bath}
                  onChange={() => handleCheckboxChange("bath")}
                />
                <span>Shared Bathroom</span>
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

            <div className="form-section-title">Apartment Images</div>
            <div className="image-upload-section">
              <div className="upload-box-wrapper">
                <i className="fas fa-images"></i>
                <p>Drag and drop images or click to select files</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMockUpload}
                />
              </div>

              {images.length > 0 && (
                <div className="uploaded-previews-grid">
                  {images.map((img, index) => (
                    <div key={index} className="preview-image-card">
                      <img src={img} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                        className="delete-preview-btn"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  ))}
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
                  <i className="fas fa-spinner fa-spin"></i> Submitting...
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
