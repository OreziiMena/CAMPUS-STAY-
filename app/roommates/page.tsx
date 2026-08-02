"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getRoommateListings } from "@/app/actions/student";
import { getOrCreateRoommateChatRoom } from "@/app/actions/chat";
import { getCurrentUser } from "@/app/actions/auth";
import { addProperty, uploadPropertyImages } from "@/app/actions/properties";
import { submitReport } from "@/app/actions/reports";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./roommates.css";

export default function RoommatesDirectory() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSafetyTip, setShowSafetyTip] = useState(true);
  const [selectedRoommateDetails, setSelectedRoommateDetails] = useState<any | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSafetyTip(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [university, setUniversity] = useState("All");
  const [gender, setGender] = useState("All");
  const [maxBudget, setMaxBudget] = useState("");

  // Upload Roommate Listing Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formHostelType, setFormHostelType] = useState("Shared Room");
  const [formPrice, setFormPrice] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDistance, setFormDistance] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAmenities, setFormAmenities] = useState({
    bed: true,
    bath: false,
    prepaid: true,
    water: true,
    gated: true,
    security: false
  });
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formImageFiles, setFormImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Report States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<any>("FRAUD_SCAM");
  const [reportCustomReason, setReportCustomReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState("");
  const [reportError, setReportError] = useState("");

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportError("");
    setReportSuccess("");

    const activeUser = await getCurrentUser();
    if (!activeUser) {
      alert("Please log in to submit a report.");
      router.push("/auth/login");
      return;
    }
    setCurrentUser(activeUser);

    if (!selectedRoommateDetails) return;

    if (!reportDescription || reportDescription.trim().length < 10) {
      setReportError("Please provide a detailed description (minimum 10 characters).");
      return;
    }

    setIsSubmittingReport(true);

    try {
      const res = await submitReport({
        roommateId: selectedRoommateDetails.student?.id,
        reason: reportReason,
        customReason: reportReason === "OTHER" ? reportCustomReason : undefined,
        description: reportDescription,
      });

      setIsSubmittingReport(false);

      if (res.success) {
        setReportSuccess("Roommate listing reported successfully. Thank you!");
        setTimeout(() => {
          setIsReportModalOpen(false);
          setReportReason("FRAUD_SCAM");
          setReportCustomReason("");
          setReportDescription("");
          setReportSuccess("");
          setSelectedRoommateDetails(null); // Close details modal too
        }, 2000);
      } else {
        setReportError(res.error || "Failed to submit report.");
      }
    } catch (err: any) {
      setIsSubmittingReport(false);
      setReportError(err.message || "An unexpected error occurred.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const user = await getCurrentUser();
    setCurrentUser(user);

    const res = await getRoommateListings();
    if (res.success && res.listings) {
      setListings(res.listings);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormCheckboxChange = (name: keyof typeof formAmenities) => {
    setFormAmenities((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleFormUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFormImageFiles((prev) => [...prev, ...selectedFiles]);
      const fileUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setFormImages((prev) => [...prev, ...fileUrls]);
    }
  };

  const removeFormImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
    setFormImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formTitle || !formPrice || !formLocation || !formDistance || !formDescription) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const activeAmenities: string[] = [];
    if (formAmenities.bed) activeAmenities.push("Shared Bedspace");
    if (formAmenities.bath) activeAmenities.push("Shared Bathroom");
    if (formAmenities.prepaid) activeAmenities.push("Prepaid Meter");
    if (formAmenities.water) activeAmenities.push("Borehole Water");
    if (formAmenities.gated) activeAmenities.push("Gated Compound");
    if (formAmenities.security) activeAmenities.push("Security Guard");

    try {
      let uploadedUrls: string[] = [];
      if (formImageFiles.length > 0) {
        const formData = new FormData();
        formImageFiles.forEach((file) => {
          formData.append("images", file);
        });
        const uploadRes = await uploadPropertyImages(formData);
        if (!uploadRes.success) {
          setFormError(uploadRes.error || "Failed to upload images.");
          setIsSubmitting(false);
          return;
        }
        uploadedUrls = uploadRes.urls || [];
      }

      const finalImages = uploadedUrls.length > 0 ? uploadedUrls : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3"];

      const res = await addProperty({
        title: formTitle,
        hostelType: formHostelType,
        price: formPrice,
        location: formLocation,
        distance: formDistance,
        description: formDescription,
        university: currentUser?.studentProfile?.university || "FUPRE",
        amenities: activeAmenities,
        images: finalImages,
      });

      setIsSubmitting(false);

      if (res.success) {
        setFormSuccess(true);
        fetchData();
        
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess(false);
          setFormTitle("");
          setFormPrice("");
          setFormLocation("");
          setFormDistance("");
          setFormDescription("");
          setFormImages([]);
          setFormImageFiles([]);
        }, 1500);
      } else {
        setFormError(res.error || "Failed to list roommate option.");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setFormError(err.message || "An unexpected error occurred.");
    }
  };

  const handleMessageRoommate = async (roommateUserId: string) => {
    const activeUser = await getCurrentUser();
    if (!activeUser) {
      alert("Please log in to contact potential roommates.");
      router.push("/auth/login");
      return;
    }
    setCurrentUser(activeUser);

    if (activeUser.role !== "STUDENT") {
      alert("Only students can message roommate partners.");
      return;
    }

    if (!activeUser.studentProfile?.isVerified) {
      alert("Verification required. Please verify your student profile to message potential roommates.");
      router.push("/student-dashboard/profile");
      return;
    }

    const res = await getOrCreateRoommateChatRoom(roommateUserId);
    if (res.success && res.chatRoomId) {
      router.push(`/chat?roomId=${res.chatRoomId}`);
    } else {
      alert(res.error || "Failed to initialize conversation.");
    }
  };

  // Filter Logic
  const filteredListings = listings.filter((l) => {
    // 1. Search Query (title / location / roommate username)
    const roommateUsername = l.student?.username || "";
    const roommateName = l.student?.fullName || "";
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roommateUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roommateName.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. University
    const matchesUni = university === "All" || l.university === university;

    // 3. Gender
    const roommateGender = l.student?.gender || "Any";
    const matchesGender =
      gender === "All" ||
      roommateGender.toLowerCase() === gender.toLowerCase();

    // 4. Budget
    const matchesBudget =
      !maxBudget || l.price <= parseFloat(maxBudget);

    return matchesSearch && matchesUni && matchesGender && matchesBudget;
  });

  return (
    <>
      <Navbar />

      <main className="roommates-layout">
        {/* Hero Banner */}
        <section className="roommates-hero">
          <h1>Find Roommates</h1>
          <p>
            Connect with verified students near your campus to share hostel apartments,
            split rent bills, and build great roommate compatibility relationships.
          </p>
          <div className="hero-actions">
            <button 
              onClick={async () => {
                const activeUser = await getCurrentUser();
                if (!activeUser) {
                  alert("Please log in to upload roommate listings.");
                  router.push("/auth/login");
                  return;
                }
                setCurrentUser(activeUser);

                if (activeUser.role !== "STUDENT") {
                  alert("Only students can upload roommate requests.");
                } else {
                  setIsModalOpen(true);
                }
              }} 
              className="list-roommate-hero-btn"
            >
              <i className="fas fa-plus-circle"></i> List Your Roommate Space
            </button>
          </div>
        </section>

        {/* Filters Box */}
        <section className="roommates-search-section">
          <div className="roommates-search-card">
            <div className="roommates-filters-grid">
              {/* Search input */}
              <div className="filter-item">
                <label>Search Listings</label>
                <input
                  type="text"
                  placeholder="Search by title, location, or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="filter-input"
                />
              </div>

              {/* University Selector */}
              <div className="filter-item">
                <label>Campus</label>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Universities</option>
                  <option value="FUPRE">FUPRE</option>
                  <option value="DSUST">DSUST</option>
                  <option value="DOU">DOU</option>
                  <option value="UNIDEL">UNIDEL</option>
                  <option value="WDU">WDU</option>
                  <option value="NOVENA">NOVENA</option>
                  <option value="PTI">PTI</option>
                  <option value="FEPO">FEPO</option>
                  <option value="DSPG">DSPG</option>
                  <option value="DESPO">DESPO</option>
                  <option value="COE_WARRI">COE WARRI</option>
                  <option value="COE_MOSOGAR">COE MOSOGAR</option>
                </select>
              </div>

              {/* Gender Selector */}
              <div className="filter-item">
                <label>Roommate Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Budget Limit input */}
              <div className="filter-item">
                <label>Max Rent (₦)</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Directory Grid */}
        <section className="roommates-container">
          {loading ? (
            <div className="roommates-loading">
              <i className="fas fa-spinner fa-spin"></i> Loading Roommates...
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="no-roommates-found">
              <i className="fas fa-user-slash"></i>
              <h3>No roommate listings match your filters</h3>
              <p>
                Try widening your budget, choosing another campus location, or
                resetting your search query.
              </p>
            </div>
          ) : (
            <div className="roommates-grid">
              {filteredListings.map((listing) => {
                const student = listing.student;
                const initials = student?.fullName
                  ? (student.fullName.split(" ")[0]?.charAt(0) || "") +
                    (student.fullName.split(" ")[1]?.charAt(0) || "")
                  : "ST";

                return (
                  <div key={listing.id} className="roommate-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", background: "white", borderRadius: "16px", padding: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
                    <div>
                      {/* Roommate Header on top */}
                      <div className="roommate-card-header" style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 12px 0" }}>
                        <div className="roommate-avatar" style={{ 
                          width: "36px", 
                          height: "36px", 
                          borderRadius: "50%", 
                          backgroundColor: "#e8f0fe", 
                          color: "#1a73e8", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          fontSize: "0.85rem", 
                          fontWeight: "bold" 
                        }}>
                          {initials.toUpperCase()}
                        </div>
                        <div className="roommate-header-info" style={{ display: "flex", flexDirection: "column" }}>
                          <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#333", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                            {student ? `@${student.username}` : "Student"}
                            {student?.isVerified && (
                              <i className="fas fa-check-circle verified-badge" style={{ color: "#2e7d32", fontSize: "0.85rem" }} title="Verified Student"></i>
                            )}
                          </h3>
                          <span style={{ fontSize: "0.75rem", color: "#666" }}>
                            <i className="fas fa-graduation-cap"></i> {listing.university}
                          </span>
                        </div>
                        <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
                          <span style={{ background: "#e6f4ea", color: "#137333", padding: "2px 6px", borderRadius: "4px", fontSize: "0.65rem", fontWeight: "bold" }}>ACTIVE</span>
                          <span style={{ background: "#f1f3f4", color: "#3c4043", padding: "2px 6px", borderRadius: "4px", fontSize: "0.65rem", fontWeight: "bold" }}>ROOMMATE</span>
                        </div>
                      </div>

                      {/* Image / Video in middle */}
                      {listing.images && listing.images.length > 0 && (
                        <div style={{ position: "relative", width: "100%", height: "160px", borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
                          <img 
                            src={listing.images[0]} 
                            alt={listing.title} 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                          />
                          <span style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(2, 53, 28, 0.85)", color: "white", padding: "4px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: "bold" }}>
                            {listing.hostelType}
                          </span>
                        </div>
                      )}

                      {/* Price large and bold */}
                      <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#000", margin: "0 0 6px 0" }}>
                        ₦{listing.price.toLocaleString()}
                      </h3>

                      {/* Title & Duration */}
                      <p style={{ fontSize: "0.85rem", color: "#333", fontWeight: "600", margin: "0 0 4px 0", lineBreak: "anywhere" }}>
                        {listing.title}
                      </p>

                      <p style={{ fontSize: "0.75rem", color: "#777", margin: "0 0 10px 0" }}>
                        {new Date(listing.createdAt).toLocaleDateString()} - 12 Months
                      </p>

                      {/* Location Pill Container */}
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", backgroundColor: "#f1f3f4", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", color: "#444", margin: "0 0 12px 0" }}>
                        <i className="fas fa-map-marker-alt" style={{ color: "#7e6b01" }}></i>
                        <span>{listing.location} ({listing.distance})</span>
                      </div>

                      {student && (
                         <div className="roommate-compatibility-section" style={{ padding: "5px 0", margin: "0 0 15px 0" }}>
                           <div className="compatibility-tags" style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                             <span className="comp-tag" style={{ fontSize: "0.7rem", padding: "2px 6px" }}>
                               <i className="fas fa-venus-mars"></i> {student.gender}
                             </span>
                             <span className="comp-tag" style={{ fontSize: "0.7rem", padding: "2px 6px" }}>
                               <i className="fas fa-sparkles"></i> {student.cleanliness}
                             </span>
                             <span className="comp-tag" style={{ fontSize: "0.7rem", padding: "2px 6px" }}>
                               <i className="fas fa-moon"></i> {student.sleepSchedule}
                             </span>
                           </div>
                         </div>
                      )}
                    </div>

                    <div className="roommate-card-footer" style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                      <button
                        onClick={() => setSelectedRoommateDetails(listing)}
                        className="message-roommate-btn"
                        style={{ backgroundColor: "#f1f3f4", color: "#333", border: "1px solid #ddd", width: "50%" }}
                      >
                        <i className="fas fa-info-circle"></i> View Details
                      </button>
                      <button
                        onClick={() =>
                          student && handleMessageRoommate(student.userId)
                        }
                        className="message-roommate-btn"
                        disabled={!student}
                        style={{ width: "50%" }}
                      >
                        <i className="fas fa-comments"></i> Message
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {showSafetyTip && (
        <>
          <style>{`
            .safety-tip-card {
              position: fixed;
              bottom: 24px;
              right: 24px;
              width: calc(100% - 48px);
              max-width: 380px;
              background-color: white;
              border: 1.5px solid #d4edda;
              border-radius: 16px;
              padding: 20px;
              box-shadow: 0 8px 30px rgba(0,0,0,0.12);
              z-index: 1000;
              display: flex;
              gap: 16px;
              font-family: 'Poppins', sans-serif;
            }
            .safety-tip-icon-container {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }
            .safety-tip-icon-bg {
              position: relative;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background-color: #e8f7f5;
            }
            .safety-tip-icon-cert {
              color: rgb(2, 53, 28);
              font-size: 2.2rem;
            }
            .safety-tip-icon-check {
              position: absolute;
              color: white;
              font-size: 0.9rem;
            }
            .safety-tip-content {
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            .safety-tip-title {
              margin: 0;
              font-size: 0.95rem;
              font-weight: bold;
              color: #1a1a1a;
            }
            .safety-tip-text {
              margin: 0;
              font-size: 0.8rem;
              color: #555;
              line-height: 1.4;
            }
            .safety-tip-link {
              margin: 4px 0 0 0;
              font-size: 0.85rem;
              font-weight: bold;
              color: rgb(2, 53, 28);
              text-decoration: none;
            }
            
            @media (max-width: 576px) {
              .safety-tip-card {
                bottom: 12px;
                right: 12px;
                width: calc(100% - 24px);
                max-width: 300px;
                padding: 12px;
                gap: 10px;
                border-radius: 12px;
              }
              .safety-tip-icon-bg {
                width: 36px;
                height: 36px;
              }
              .safety-tip-icon-cert {
                font-size: 1.6rem;
              }
              .safety-tip-icon-check {
                font-size: 0.65rem;
              }
              .safety-tip-content {
                gap: 3px;
              }
              .safety-tip-title {
                font-size: 0.85rem;
              }
              .safety-tip-text {
                font-size: 0.72rem;
              }
              .safety-tip-link {
                font-size: 0.75rem;
                margin-top: 2px;
              }
            }
          `}</style>
          <div className="safety-tip-card">
            <div className="safety-tip-icon-container">
              <div className="safety-tip-icon-bg">
                <i className="fas fa-certificate safety-tip-icon-cert"></i>
                <i className="fas fa-check safety-tip-icon-check"></i>
              </div>
            </div>
            
            <div className="safety-tip-content">
              <h4 className="safety-tip-title">Safety Tip</h4>
              <p className="safety-tip-text">
                For your safety, always check for the <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", verticalAlign: "middle", margin: "0 2px" }}>
                  <i className="fas fa-certificate" style={{ color: "rgb(2, 53, 28)", fontSize: "1.1rem" }}></i>
                  <i className="fas fa-check" style={{ position: "absolute", color: "white", fontSize: "0.45rem" }}></i>
                </span> verification badge, it means the user has completed ID verification.
              </p>
              <Link href="/student-dashboard/profile" className="safety-tip-link">
                Verify your account now for added trust.
              </Link>
            </div>

            <button 
              onClick={() => setShowSafetyTip(false)} 
              style={{ 
                position: "absolute", 
                top: "10px", 
                right: "10px", 
                border: "none", 
                background: "none", 
                cursor: "pointer", 
                color: "#888", 
                fontSize: "1rem" 
              }}
            >
              &times;
            </button>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-user-friends"></i> List Roommate Space</h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <div className="modal-body">
              {formSuccess ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <i className="fas fa-check-circle" style={{ color: "#2e7d32", fontSize: "3.5rem", marginBottom: "15px" }}></i>
                  <h3 style={{ color: "rgb(2, 53, 28)", margin: "0 0 10px 0" }}>Listing Posted Successfully!</h3>
                  <p style={{ color: "#666", margin: 0 }}>Your roommate listing is now active in the directory.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  {formError && (
                    <div style={{ backgroundColor: "#fde8e8", border: "1px solid #f8b4b4", color: "#9b1c1c", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
                      <i className="fas fa-exclamation-circle"></i> {formError}
                    </div>
                  )}

                  {currentUser && !currentUser.studentProfile?.isVerified && (
                    <div style={{ backgroundColor: "#fff8e1", border: "1px solid #ffe082", color: "#b78103", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.85rem", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <i className="fas fa-exclamation-triangle" style={{ marginTop: "3px" }}></i>
                      <p style={{ margin: 0 }}>
                        <strong>Note:</strong> Your student profile is currently unverified. While you can post listings, you must verify your profile in settings before other students can message you.
                      </p>
                    </div>
                  )}

                  <div className="form-group-custom">
                    <label htmlFor="form-title">Listing Title *</label>
                    <input 
                      type="text" 
                      id="form-title" 
                      placeholder="e.g. Need a neat roommate to split rent at Ugbomro" 
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="form-input-custom"
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-custom">
                      <label htmlFor="form-type">Space Type *</label>
                      <select 
                        id="form-type" 
                        value={formHostelType} 
                        onChange={(e) => setFormHostelType(e.target.value)}
                        className="form-select-custom"
                        required
                      >
                        <option value="Shared Room">Shared Room</option>
                        <option value="Self-Contain">Self-Contain</option>
                        <option value="1-Bedroom Flat">1-Bedroom Flat</option>
                        <option value="2-Bedroom Flat">2-Bedroom Flat</option>
                      </select>
                    </div>

                    <div className="form-group-custom">
                      <label htmlFor="form-price">Your Share of Rent (₦/yr) *</label>
                      <input 
                        type="number" 
                        id="form-price" 
                        placeholder="e.g. 75000" 
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        className="form-input-custom"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-custom">
                      <label htmlFor="form-location">Hostel Location *</label>
                      <input 
                        type="text" 
                        id="form-location" 
                        placeholder="e.g. FUPRE Road, Effurun" 
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        className="form-input-custom"
                        required
                      />
                    </div>

                    <div className="form-group-custom">
                      <label htmlFor="form-distance">Proximity Walk Time *</label>
                      <input 
                        type="text" 
                        id="form-distance" 
                        placeholder="e.g. 5 mins walk to campus" 
                        value={formDistance}
                        onChange={(e) => setFormDistance(e.target.value)}
                        className="form-input-custom"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-custom">
                    <label htmlFor="form-desc">Apartment & Roommate Description *</label>
                    <textarea 
                      id="form-desc" 
                      placeholder="Describe the apartment layout, utility bills, lifestyle, and clean/noise compatibility expectations..." 
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="form-textarea-custom"
                      required
                    />
                  </div>

                  <div className="form-group-custom">
                    <label>Included Features & Amenities</label>
                    <div className="checkbox-grid-custom">
                      <label className="checkbox-label-custom">
                        <input type="checkbox" checked={formAmenities.bed} onChange={() => handleFormCheckboxChange("bed")} />
                        Shared Bedspace
                      </label>
                      <label className="checkbox-label-custom">
                        <input type="checkbox" checked={formAmenities.bath} onChange={() => handleFormCheckboxChange("bath")} />
                        Shared Bath
                      </label>
                      <label className="checkbox-label-custom">
                        <input type="checkbox" checked={formAmenities.prepaid} onChange={() => handleFormCheckboxChange("prepaid")} />
                        Prepaid Meter
                      </label>
                      <label className="checkbox-label-custom">
                        <input type="checkbox" checked={formAmenities.water} onChange={() => handleFormCheckboxChange("water")} />
                        Running Water
                      </label>
                      <label className="checkbox-label-custom">
                        <input type="checkbox" checked={formAmenities.gated} onChange={() => handleFormCheckboxChange("gated")} />
                        Gated Compound
                      </label>
                      <label className="checkbox-label-custom">
                        <input type="checkbox" checked={formAmenities.security} onChange={() => handleFormCheckboxChange("security")} />
                        Security Guard
                      </label>
                    </div>
                  </div>

                  <div className="form-group-custom">
                    <label>Upload Room/Hostel Images</label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleFormUpload}
                      style={{ fontSize: "0.85rem", color: "#666" }}
                    />
                    
                    {formImages.length > 0 && (
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                        {formImages.map((src, i) => (
                          <div key={i} style={{ position: "relative", width: "70px", height: "70px", borderRadius: "6px", overflow: "hidden", border: "1px solid #ddd" }}>
                            <img src={src} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button 
                              type="button" 
                              onClick={() => removeFormImage(i)}
                              style={{ position: "absolute", top: "2px", right: "2px", backgroundColor: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%", width: "16px", height: "16px", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-actions-custom">
                    <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
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
      )}

      {selectedRoommateDetails && (
        <div className="modal-overlay" onClick={() => setSelectedRoommateDetails(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-user-circle"></i> Roommate & Space Details
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <button 
                  title="Report Listing" 
                  onClick={() => setIsReportModalOpen(true)}
                  style={{ background: "none", border: "none", color: "#d9534f", cursor: "pointer", fontSize: "1.15rem", display: "flex", alignItems: "center" }}
                >
                  <i className="fas fa-flag"></i>
                </button>
                <button className="modal-close-btn" onClick={() => setSelectedRoommateDetails(null)}>
                  &times;
                </button>
              </div>
            </div>
            <div className="modal-body" style={{ padding: "24px" }}>
              {/* Profile Card Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "#e8f0fe",
                  color: "#1a73e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  fontWeight: "bold"
                }}>
                  {((selectedRoommateDetails.student?.fullName?.split(" ")[0]?.charAt(0) || "") +
                    (selectedRoommateDetails.student?.fullName?.split(" ")[1]?.charAt(0) || "") || "ST").toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                    {selectedRoommateDetails.student?.fullName || "Student"}
                    {selectedRoommateDetails.student?.isVerified && (
                      <i className="fas fa-check-circle verified-badge" style={{ color: "#2e7d32", fontSize: "0.95rem" }}></i>
                    )}
                  </h3>
                  <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#666" }}>
                    @{selectedRoommateDetails.student?.username || "student"} &bull; {selectedRoommateDetails.university}
                  </p>
                </div>
              </div>

              {/* Space details */}
              <div style={{ marginBottom: "20px" }}>
                {selectedRoommateDetails.images && selectedRoommateDetails.images.length > 0 && (
                  <div style={{ width: "100%", height: "220px", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
                    <img 
                      src={selectedRoommateDetails.images[0]} 
                      alt={selectedRoommateDetails.title} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  </div>
                )}
                
                <span style={{ background: "#e8f7f5", color: "rgb(2, 53, 28)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "bold" }}>
                  {selectedRoommateDetails.hostelType}
                </span>
                
                <h4 style={{ margin: "8px 0 4px 0", fontSize: "1.15rem", fontWeight: "700", color: "#333" }}>
                  {selectedRoommateDetails.title}
                </h4>
                
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1.4rem", fontWeight: "800", color: "rgb(2, 53, 28)" }}>
                  ₦{selectedRoommateDetails.price.toLocaleString()} <span style={{ fontSize: "0.85rem", fontWeight: "normal", color: "#666" }}>/ year</span>
                </h3>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f1f3f4", padding: "6px 12px", borderRadius: "20px", fontSize: "0.8rem", color: "#444" }}>
                    <i className="fas fa-map-marker-alt" style={{ color: "#7e6b01" }}></i>
                    <span>{selectedRoommateDetails.location}</span>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f1f3f4", padding: "6px 12px", borderRadius: "20px", fontSize: "0.8rem", color: "#444" }}>
                    <i className="far fa-clock" style={{ color: "#1a73e8" }}></i>
                    <span>{selectedRoommateDetails.distance}</span>
                  </div>
                </div>

                <h5 style={{ margin: "0 0 6px 0", fontSize: "0.85rem", textTransform: "uppercase", color: "#888", letterSpacing: "0.5px" }}>Description</h5>
                <p style={{ margin: "0 0 20px 0", fontSize: "0.9rem", color: "#444", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                  {selectedRoommateDetails.description}
                </p>
              </div>

              {/* Roommate compatibility preferences */}
              {selectedRoommateDetails.student && (
                <div style={{ backgroundColor: "#fcfcfc", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
                  <h5 style={{ margin: "0 0 10px 0", fontSize: "0.8rem", textTransform: "uppercase", color: "#888", letterSpacing: "0.5px" }}>Roommate Preference</h5>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <span style={{ backgroundColor: "white", border: "1px solid #e0e0e0", color: "#444", padding: "6px 12px", borderRadius: "8px", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <i className="fas fa-venus-mars" style={{ color: "rgb(2, 53, 28)" }}></i> Gender: {selectedRoommateDetails.student.gender}
                    </span>
                    <span style={{ backgroundColor: "white", border: "1px solid #e0e0e0", color: "#444", padding: "6px 12px", borderRadius: "8px", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <i className="fas fa-sparkles" style={{ color: "rgb(2, 53, 28)" }}></i> Cleanliness: {selectedRoommateDetails.student.cleanliness}
                    </span>
                    <span style={{ backgroundColor: "white", border: "1px solid #e0e0e0", color: "#444", padding: "6px 12px", borderRadius: "8px", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <i className="fas fa-moon" style={{ color: "rgb(2, 53, 28)" }}></i> Sleep: {selectedRoommateDetails.student.sleepSchedule}
                    </span>
                  </div>
                </div>
              )}

              {/* Included Amenities */}
              {selectedRoommateDetails.amenities && selectedRoommateDetails.amenities.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <h5 style={{ margin: "0 0 8px 0", fontSize: "0.85rem", textTransform: "uppercase", color: "#888", letterSpacing: "0.5px" }}>Included Amenities</h5>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedRoommateDetails.amenities.map((amenity: string, idx: number) => (
                      <span key={idx} style={{ backgroundColor: "#f8f9fa", border: "1px solid #eef0f2", color: "#555", padding: "4px 10px", borderRadius: "6px", fontSize: "0.78rem" }}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer action buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button 
                  type="button" 
                  onClick={() => setSelectedRoommateDetails(null)} 
                  style={{ flex: 1, backgroundColor: "#f1f3f4", color: "#3c4043", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
                >
                  Close Details
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    if (selectedRoommateDetails.student) {
                      handleMessageRoommate(selectedRoommateDetails.student.userId);
                      setSelectedRoommateDetails(null);
                    }
                  }} 
                  disabled={!selectedRoommateDetails.student}
                  style={{ flex: 2, backgroundColor: "rgb(2, 53, 28)", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <i className="fas fa-comments"></i> Message Roommate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isReportModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1200,
          padding: "20px",
          fontFamily: "'Poppins', sans-serif"
        }} onClick={() => setIsReportModalOpen(false)}>
          <div style={{
            background: "white",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.15)",
            border: "1px solid #eaeaea",
            overflow: "hidden"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid #eaeaea",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 10
            }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#d9534f", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="fas fa-flag"></i> Report Roommate
              </h2>
              <button style={{ background: "none", border: "none", fontSize: "1.5rem", color: "#888", cursor: "pointer" }} onClick={() => setIsReportModalOpen(false)}>&times;</button>
            </div>

            <div style={{ padding: "24px" }}>
              {reportSuccess ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <i className="fas fa-check-circle" style={{ color: "#2e7d32", fontSize: "3rem", marginBottom: "15px" }}></i>
                  <p style={{ margin: 0, color: "#2e7d32", fontWeight: "bold" }}>{reportSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {reportError && (
                    <div style={{ backgroundColor: "#fde8e8", border: "1px solid #f8b4b4", color: "#9b1c1c", padding: "12px", borderRadius: "8px", fontSize: "0.85rem" }}>
                      {reportError}
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#444" }}>Reason for Flagging *</label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", outline: "none", backgroundColor: "#fafafa" }}
                      required
                    >
                      <option value="FRAUD_SCAM">Fraud or Scam Profile</option>
                      <option value="INACCURATE_DETAILS">Inaccurate preferences/information</option>
                      <option value="INAPPROPRIATE_CONTENT">Inappropriate content/abuse</option>
                      <option value="SPAM">Spam or Duplicate Profile</option>
                      <option value="OTHER">Other Reason</option>
                    </select>
                  </div>

                  {reportReason === "OTHER" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#444" }}>Specify Reason *</label>
                      <input
                        type="text"
                        placeholder="Specify the reason..."
                        value={reportCustomReason}
                        onChange={(e) => setReportCustomReason(e.target.value)}
                        style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" }}
                        required
                      />
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#444" }}>Describe the issue *</label>
                    <textarea
                      placeholder="Please describe why you are reporting this roommate profile..."
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", minHeight: "100px", resize: "vertical", outline: "none" }}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                    <button type="button" style={{ flex: 1, backgroundColor: "#f1f3f4", color: "#3c4043", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }} onClick={() => setIsReportModalOpen(false)}>Cancel</button>
                    <button type="submit" disabled={isSubmittingReport} style={{ flex: 2, backgroundColor: "#d9534f", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      {isSubmittingReport ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : "Submit Report"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
