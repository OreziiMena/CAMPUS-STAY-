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

const LEVEL_OPTIONS = [
  { code: "100L", name: "100 Level (Freshman)" },
  { code: "200L", name: "200 Level" },
  { code: "300L", name: "300 Level" },
  { code: "400L", name: "400 Level" },
  { code: "500L", name: "500 Level (Finalist)" },
  { code: "Postgraduate", name: "Postgraduate" }
];

export default function AddRoommateListing() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [roommateIntent, setRoommateIntent] = useState<"HAVE_SPACE" | "LOOKING_TO_PAIR">("HAVE_SPACE");
  const [targetTotalRent, setTargetTotalRent] = useState("");
  const [myBudget, setMyBudget] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("100L");
  const [slotsTotal, setSlotsTotal] = useState(2);
  const [title, setTitle] = useState("");
  const [hostelType, setHostelType] = useState("Bedsitter");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [description, setDescription] = useState("");
  const [genderPreference, setGenderPreference] = useState("Any");

  const [amenities, setAmenities] = useState({
    fencedCompound: false,
    gatedCompound: false,
    wardrobe: false,
    pvc: false,
    pop: false,
    prepaidMeter: false,
    runningWater: false,
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
      if (currentUser?.studentProfile?.preferences) {
        const p = currentUser.studentProfile.preferences as any;
        if (p.department) setDepartment(p.department);
        if (p.level) setLevel(p.level);
      }
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

    if (roommateIntent === "LOOKING_TO_PAIR") {
      if (!title || !targetTotalRent || !myBudget || !location) {
        setError("Please fill in required fields: Listing Title, Target Total Rent, Your Budget, and Target Area.");
        return;
      }
    } else {
      if (!title || !price || !location) {
        setError("Please fill in required fields: Listing Title, Price, and Location.");
        return;
      }
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
        price: roommateIntent === "LOOKING_TO_PAIR" ? myBudget : price,
        location,
        distance: distance ? distance.trim() : "",
        description: description.trim() || (roommateIntent === "LOOKING_TO_PAIR"
          ? "Looking for a compatible roommate to pool budget and co-rent an apartment together."
          : "Roommate accommodation space available."),
        amenities: activeAmenities,
        images: uploadedUrls.length > 0 ? uploadedUrls : [
          roommateIntent === "LOOKING_TO_PAIR"
            ? "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        genderPreference,
        roommateIntent,
        ...(roommateIntent === "LOOKING_TO_PAIR" ? {
          targetTotalRent,
          myBudget,
          department: department || (user.studentProfile?.preferences as any)?.department || "General Studies",
          level: level || (user.studentProfile?.preferences as any)?.level || "100L",
          slotsTotal,
          slotsFilled: 1,
        } : {}),
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



            {/* Mode toggle */}
            <div className="listing-intent-switch-bar">
              <button
                type="button"
                className={`intent-mode-option ${roommateIntent === "HAVE_SPACE" ? "active" : ""}`}
                onClick={() => setRoommateIntent("HAVE_SPACE")}
              >
                <i className="fas fa-door-open"></i>
                <strong>I Have a Space / Room</strong>
                <small>Sublet or find a roommate to move in</small>
              </button>
              <button
                type="button"
                className={`intent-mode-option ${roommateIntent === "LOOKING_TO_PAIR" ? "active" : ""}`}
                onClick={() => setRoommateIntent("LOOKING_TO_PAIR")}
              >
                <i className="fas fa-handshake"></i>
                <strong>Looking to Pair Up (Unpaid House)</strong>
                <small>Find a partner to pool budget and co-rent</small>
              </button>
            </div>

            {roommateIntent === "LOOKING_TO_PAIR" && (
              <div className="pairing-calc-banner">
                <p><i className="fas fa-handshake"></i> <strong>Unpaid Co-Renting Mode:</strong> List an apartment you want to rent so other students can pair with you to pool the rent together.</p>
                {targetTotalRent && myBudget && (
                  <p className="pairing-calc-summary">
                    Target Total Rent: ₦{Number(targetTotalRent).toLocaleString()} | Your Contribution: ₦{Number(myBudget).toLocaleString()} | Needed from Roommate(s): ₦{Math.max(0, Number(targetTotalRent) - Number(myBudget)).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="title">
                  {roommateIntent === "LOOKING_TO_PAIR" ? "Co-Renting Listing Title *" : "Listing Title *"}
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder={roommateIntent === "LOOKING_TO_PAIR" ? "e.g. Need 1 roommate to pair up for 2-bedroom flat at Gate" : "Enter roommate listing title"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {roommateIntent === "LOOKING_TO_PAIR" ? (
                <>
                  <div className="input-group">
                    <label htmlFor="targetTotalRent">Target Total Rent (₦ per year) *</label>
                    <input
                      type="number"
                      id="targetTotalRent"
                      placeholder="Total rent for whole apartment"
                      value={targetTotalRent}
                      onChange={(e) => setTargetTotalRent(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="myBudget">Your Budget Contribution (₦ per year) *</label>
                    <input
                      type="number"
                      id="myBudget"
                      placeholder="Your pledged contribution"
                      value={myBudget}
                      onChange={(e) => setMyBudget(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="department">Your Academic Department *</label>
                    <input
                      type="text"
                      id="department"
                      placeholder="e.g. Computer Science, Accounting"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="level">Your Academic Level *</label>
                    <SearchableSelect
                      options={LEVEL_OPTIONS}
                      value={level}
                      onChange={(val) => setLevel(val)}
                      placeholder="Select level..."
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="slotsTotal">Total Students in Flat *</label>
                    <input
                      type="number"
                      id="slotsTotal"
                      min="2"
                      max="6"
                      placeholder="e.g. 2"
                      value={slotsTotal}
                      onChange={(e) => setSlotsTotal(parseInt(e.target.value, 10) || 2)}
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
                </>
              ) : (
                <>
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
                </>
              )}

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
                <label htmlFor="distance">
                  {roommateIntent === "LOOKING_TO_PAIR" ? "Preferred Proximity to Campus (Optional)" : "Walking Distance to Campus Gate (Optional)"}
                </label>
                <input
                  type="text"
                  id="distance"
                  placeholder={roommateIntent === "LOOKING_TO_PAIR" ? "e.g. 5-10 mins walk to campus gate (Optional)" : "Estimated walking time to campus gate (Optional)"}
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                />
              </div>

              <div className="input-group full-width-group">
                <label htmlFor="description">
                  {roommateIntent === "LOOKING_TO_PAIR" ? "Roommate & Co-Renting Preferences (Optional)" : "About the Apartment & Roommate Preferences (Optional)"}
                </label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder={roommateIntent === "LOOKING_TO_PAIR"
                    ? "Optional: Describe what you are looking for in a co-renter, your lifestyle, quiet hours, or target area..."
                    : "Optional: Describe your current apartment, utilities, rules, and what kind of roommate you are looking for..."}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="form-section-title">
              {roommateIntent === "LOOKING_TO_PAIR" ? "Desired Features & Amenities (Optional)" : "Amenities Included (Optional)"}
            </div>
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

            <div className="form-section-title">Apartment Photos & Video Tours (Optional)</div>
            <div className="image-upload-section">
              <div className="upload-box-wrapper">
                <i className="fas fa-cloud-upload-alt upload-icon-green"></i>
                <p>Drag and drop media or <span className="upload-browse-highlight">Browse files</span></p>
                <p className="upload-subtext">
                  {roommateIntent === "LOOKING_TO_PAIR"
                    ? "Optional if you have no apartment on ground yet. Supports JPG, PNG, WEBP (Max 5MB) & MP4, MOV, WebM (Max 20MB)"
                    : "Supports JPG, PNG, WEBP (Max 5MB) & MP4, MOV, WebM videos (Max 20MB)"}
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
