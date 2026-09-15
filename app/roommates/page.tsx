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
import { useToast } from "@/components/ToastProvider";
import { NIGERIAN_UNIVERSITIES } from "@/lib/universities";
import SearchableSelect from "@/components/SearchableSelect";

const GENDER_OPTIONS = [
  { code: "All", name: "All Genders" },
  { code: "Male", name: "Male" },
  { code: "Female", name: "Female" }
];

const CAMPUS_OPTIONS = [
  { code: "All", name: "All Universities" },
  ...NIGERIAN_UNIVERSITIES
];

const SPACE_TYPES = [
  { code: "Bedsitter", name: "Bedsitter" },
  { code: "Self-Contain", name: "Self-Contain" },
  { code: "1-Bedroom Flat", name: "1-Bedroom Flat" },
  { code: "2-Bedroom Flat", name: "2-Bedroom Flat" }
];

const REPORT_REASONS = [
  { code: "FRAUD_SCAM", name: "Fraud or Scam Profile" },
  { code: "INACCURATE_DETAILS", name: "Inaccurate preferences/information" },
  { code: "INAPPROPRIATE_CONTENT", name: "Inappropriate content/abuse" },
  { code: "SPAM", name: "Spam or Duplicate Profile" },
  { code: "OTHER", name: "Other Reason" }
];

export default function RoommatesDirectory() {
  const { showToast } = useToast();
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 9;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, university, gender, maxBudget]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const element = document.querySelector(".roommates-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 350, behavior: "smooth" });
    }
  };

  // Upload Roommate Listing Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formHostelType, setFormHostelType] = useState("Bedsitter");
  const [formPrice, setFormPrice] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDistance, setFormDistance] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAmenities, setFormAmenities] = useState({
    fencedCompound: false,
    gatedCompound: true,
    wardrobe: false,
    pvc: false,
    pop: false,
    prepaidMeter: false,
    runningWater: true,
  });
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formImageFiles, setFormImageFiles] = useState<File[]>([]);
  const [formGenderPreference, setFormGenderPreference] = useState("Any");
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
      showToast("Please log in to submit a report.", "error");
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
        genderPreference: formGenderPreference,
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

  const handleMessageRoommate = async (roommateUserId: string) => {
    const activeUser = await getCurrentUser();
    if (!activeUser) {
      showToast("Please log in to contact potential roommates.", "error");
      router.push("/auth/login");
      return;
    }
    setCurrentUser(activeUser);

    if (activeUser.role !== "STUDENT") {
      showToast("Only students can message roommate partners.", "error");
      return;
    }

    if (!activeUser.studentProfile?.isVerified) {
      showToast("Verification required. Please verify your student profile to message potential roommates.", "error");
      router.push("/student-dashboard/profile");
      return;
    }

    const res = await getOrCreateRoommateChatRoom(roommateUserId);
    if (res.success && res.chatRoomId) {
      router.push(`/chat?roomId=${res.chatRoomId}`);
    } else {
      showToast(res.error || "Failed to initialize conversation.", "error");
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
                  showToast("Please log in to upload roommate listings.", "error");
                  router.push("/auth/login");
                  return;
                }
                setCurrentUser(activeUser);

                if (activeUser.role !== "STUDENT") {
                  showToast("Only students can upload roommate requests.", "error");
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
                <SearchableSelect
                  options={CAMPUS_OPTIONS}
                  value={university}
                  onChange={(val) => setUniversity(val)}
                />
              </div>

              {/* Gender Selector */}
              <div className="filter-item">
                <label>Roommate Gender</label>
                <SearchableSelect
                  options={GENDER_OPTIONS}
                  value={gender}
                  onChange={(val) => setGender(val)}
                />
              </div>

              {/* Budget Limit input */}
              <div className="filter-item">
                <label>Max Rent (₦)</label>
                <input
                  type="number"
                  placeholder="Max budget (₦)"
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
              {filteredListings
                .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                .map((listing) => {
                const student = listing.student;
                const initials = student?.fullName
                  ? (student.fullName.split(" ")[0]?.charAt(0) || "") +
                    (student.fullName.split(" ")[1]?.charAt(0) || "")
                  : "ST";

                return (
                  <div key={listing.id} className="roommate-card roommate-card-custom">
                    <div>
                      {/* Roommate Header on top */}
                      <div className="roommate-card-header roommate-card-header-row">
                        <div className="roommate-avatar roommate-avatar-custom">
                          {initials.toUpperCase()}
                        </div>
                        <div className="roommate-header-info roommate-header-info-col">
                          <h3 className="roommate-owner-name">
                            {student ? `@${student.username}` : "Student"}
                            {student?.isVerified && (
                              <i className="fas fa-check-circle verified-badge roommate-verified-badge" title="Verified Student"></i>
                            )}
                          </h3>
                          <span className="roommate-gender-dept">
                            <i className="fas fa-graduation-cap"></i> {listing.university}
                          </span>
                        </div>
                        <div className="roommate-badges-right">
                          <span className="roommate-badge-active">ACTIVE</span>
                          <span className="roommate-badge-tag">ROOMMATE</span>
                        </div>
                      </div>

                      {/* Image / Video in middle */}
                      {listing.images && listing.images.length > 0 && (
                        <div className="roommate-media-box">
                          {(() => {
                            const mediaUrl = listing.images[0];
                            const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
                            return isVideo ? (
                              <video 
                                src={mediaUrl} 
                                className="roommate-media-img" 
                                muted 
                                loop 
                                playsInline 
                                autoPlay
                              />
                            ) : (
                              <img 
                                src={mediaUrl} 
                                alt={listing.title} 
                                className="roommate-media-img" 
                              />
                            );
                          })()}
                          <span className="roommate-media-type-badge">
                            {listing.hostelType}
                          </span>
                        </div>
                      )}

                      {/* Price large and bold */}
                      <h3 className="roommate-price-title">
                        ₦{listing.price.toLocaleString()}
                      </h3>

                      {/* Title & Duration */}
                      <p className="roommate-listing-title">
                        {listing.title}
                      </p>

                      <p className="roommate-desc-snippet">
                        {new Date(listing.createdAt).toLocaleDateString()} - 12 Months
                      </p>

                      {/* Location Pill Container */}
                      <div className="roommate-location-pill">
                        <i className="fas fa-map-marker-alt roommate-map-icon"></i>
                        <span>{listing.location} ({listing.distance})</span>
                      </div>

                      {student && (
                         <div className="roommate-compatibility-section roommate-compat-section">
                           <div className="compatibility-tags roommate-compat-tags">
                             <span className="comp-tag roommate-comp-tag">
                               <i className="fas fa-venus-mars"></i> Gender: {student.gender}
                             </span>
                             <span className="comp-tag roommate-comp-tag danger">
                               <i className="fas fa-heart"></i> Prefers: {listing.genderPreference}
                             </span>
                             <span className="comp-tag roommate-comp-tag">
                               <i className="fas fa-sparkles"></i> {student.cleanliness}
                             </span>
                             <span className="comp-tag roommate-comp-tag">
                               <i className="fas fa-moon"></i> {student.sleepSchedule}
                             </span>
                           </div>
                         </div>
                      )}
                    </div>

                    <div className="roommate-card-footer roommate-card-footer-row">
                      <button
                        onClick={() => setSelectedRoommateDetails(listing)}
                        className="message-roommate-btn roommate-chat-btn-custom"
                      >
                        <i className="fas fa-info-circle"></i> View Details
                      </button>
                      <button
                        onClick={() =>
                          student && handleMessageRoommate(student.userId)
                        }
                        className="message-roommate-btn roommate-view-btn-custom"
                        disabled={!student}
                      >
                        <i className="fas fa-comments"></i> Message
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Numbered Pagination (9 per page) */}
          {Math.ceil(filteredListings.length / PAGE_SIZE) > 1 && (
            <div className="roommate-pagination-wrapper">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="roommate-page-nav-btn"
              >
                <i className="fas fa-chevron-left roommate-page-nav-icon"></i> Prev
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.ceil(filteredListings.length / PAGE_SIZE) }, (_, i) => i + 1).map((p) => {
                const isActive = p === currentPage;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={`roommate-page-num-btn ${isActive ? "active" : ""}`}
                  >
                    {p}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                type="button"
                onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(filteredListings.length / PAGE_SIZE)))}
                disabled={currentPage === Math.ceil(filteredListings.length / PAGE_SIZE)}
                className="roommate-page-nav-btn"
              >
                Next <i className="fas fa-chevron-right roommate-page-nav-icon"></i>
              </button>
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
                For your safety, always check for the <span className="roommate-safety-badge-wrap">
                  <i className="fas fa-certificate roommate-safety-cert-icon"></i>
                  <i className="fas fa-check roommate-safety-check-icon"></i>
                </span> verification badge, it means the student has completed ID verification.
              </p>
              <Link href="/student-dashboard/profile" className="safety-tip-link">
                Verify your account now for added trust.
              </Link>
            </div>

            <button 
              onClick={() => setShowSafetyTip(false)} 
              className="roommate-safety-close-btn"
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
                <div className="roommate-form-success-box">
                  <i className="fas fa-check-circle roommate-form-success-icon"></i>
                  <h3 className="roommate-form-success-title">Listing Posted Successfully!</h3>
                  <p className="roommate-form-success-sub">Your roommate listing is now active in the directory.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  {formError && (
                    <div className="roommate-form-error-banner">
                      <i className="fas fa-exclamation-circle"></i> {formError}
                    </div>
                  )}

                  {currentUser && !currentUser.studentProfile?.isVerified && (
                    <div className="roommate-form-unverified-banner">
                      <i className="fas fa-exclamation-triangle roommate-unverified-icon"></i>
                      <p className="roommate-unverified-p">
                        <strong>Note:</strong> Your student profile is currently unverified. While you can post listings, you must verify your profile in settings before other students can message you.
                      </p>
                    </div>
                  )}

                  <div className="form-group-custom">
                    <label htmlFor="form-title">Listing Title *</label>
                    <input 
                      type="text" 
                      id="form-title" 
                      placeholder="Enter roommate listing title" 
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="form-input-custom"
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-custom">
                      <label htmlFor="form-type">Space Type *</label>
                      <SearchableSelect
                        options={SPACE_TYPES}
                        value={formHostelType}
                        onChange={(val) => setFormHostelType(val)}
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
                      <label htmlFor="form-distance">Proximity Walk Time *</label>
                      <input 
                        type="text" 
                        id="form-distance" 
                        placeholder="Estimated walking time to campus gate" 
                        value={formDistance}
                        onChange={(e) => setFormDistance(e.target.value)}
                        className="form-input-custom"
                        required
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
                    <label>Upload Room/Hostel Images</label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleFormUpload}
                      className="roommate-file-input"
                    />
                    
                    {formImages.length > 0 && (
                      <div className="roommate-preview-grid">
                        {formImages.map((src, i) => (
                          <div key={i} className="roommate-preview-wrap">
                            <img src={src} alt="Preview" className="roommate-preview-img" />
                            <button 
                              type="button" 
                              onClick={() => removeFormImage(i)}
                              className="roommate-preview-del-btn"
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
          <div className="modal-card roommate-details-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-user-circle"></i> Roommate & Space Details
              </h2>
              <div className="roommate-header-actions">
                <button 
                  title="Report Listing" 
                  onClick={() => setIsReportModalOpen(true)}
                  className="roommate-report-trigger-btn"
                >
                  <i className="fas fa-flag"></i>
                </button>
                <button className="modal-close-btn" onClick={() => setSelectedRoommateDetails(null)}>
                  &times;
                </button>
              </div>
            </div>
            <div className="modal-body roommate-details-body">
              {/* Profile Card Header */}
              <div className="roommate-details-header-row">
                <div className="roommate-details-avatar">
                  {((selectedRoommateDetails.student?.fullName?.split(" ")[0]?.charAt(0) || "") +
                    (selectedRoommateDetails.student?.fullName?.split(" ")[1]?.charAt(0) || "") || "ST").toUpperCase()}
                </div>
                <div>
                  <h3 className="roommate-details-name">
                    {selectedRoommateDetails.student?.fullName || "Student"}
                    {selectedRoommateDetails.student?.isVerified && (
                      <i className="fas fa-check-circle verified-badge roommate-verified-badge"></i>
                    )}
                  </h3>
                  <p className="roommate-details-handle">
                    @{selectedRoommateDetails.student?.username || "student"} &bull; {selectedRoommateDetails.university}
                  </p>
                </div>
              </div>

              {/* Space details */}
              <div className="roommate-details-amenities-wrap">
                {selectedRoommateDetails.images && selectedRoommateDetails.images.length > 0 && (
                  <div className="roommate-details-media-box">
                    {(() => {
                      const mediaUrl = selectedRoommateDetails.images[0];
                      const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
                      return isVideo ? (
                        <video 
                          src={mediaUrl} 
                          className="roommate-details-media-el" 
                          controls
                          playsInline 
                        />
                      ) : (
                        <img 
                          src={mediaUrl} 
                          alt={selectedRoommateDetails.title} 
                          className="roommate-details-media-el" 
                        />
                      );
                    })()}
                  </div>
                )}
                
                <span className="roommate-details-hostel-tag">
                  {selectedRoommateDetails.hostelType}
                </span>
                
                <h4 className="roommate-details-title">
                  {selectedRoommateDetails.title}
                </h4>
                
                <h3 className="roommate-details-price">
                  ₦{selectedRoommateDetails.price.toLocaleString()} <span className="roommate-details-price-unit">/ year</span>
                </h3>

                <div className="roommate-details-pill-row">
                  <div className="roommate-details-pill">
                    <i className="fas fa-map-marker-alt roommate-details-pill-icon-loc"></i>
                    <span>{selectedRoommateDetails.location}</span>
                  </div>
                  <div className="roommate-details-pill">
                    <i className="far fa-clock roommate-details-pill-icon-clock"></i>
                    <span>{selectedRoommateDetails.distance}</span>
                  </div>
                </div>

                <h5 className="roommate-details-sec-heading">Description</h5>
                <p className="roommate-details-desc-text">
                  {selectedRoommateDetails.description}
                </p>
              </div>

              {/* Roommate compatibility preferences */}
              {selectedRoommateDetails.student && (
                <div className="roommate-details-pref-box">
                  <h5 className="roommate-details-pref-heading">Roommate Preference</h5>
                  <div className="roommate-details-pref-wrap">
                    <span className="roommate-details-pref-tag">
                      <i className="fas fa-venus-mars"></i> Gender: {selectedRoommateDetails.student.gender}
                    </span>
                    <span className="roommate-details-pref-tag">
                      <i className="fas fa-sparkles"></i> Cleanliness: {selectedRoommateDetails.student.cleanliness}
                    </span>
                    <span className="roommate-details-pref-tag">
                      <i className="fas fa-moon"></i> Sleep: {selectedRoommateDetails.student.sleepSchedule}
                    </span>
                  </div>
                </div>
              )}

              {/* Included Amenities */}
              {selectedRoommateDetails.amenities && selectedRoommateDetails.amenities.length > 0 && (
                <div className="roommate-details-amenities-wrap">
                  <h5 className="roommate-details-amenities-heading">Included Amenities</h5>
                  <div className="roommate-details-pref-wrap">
                    {selectedRoommateDetails.amenities.map((amenity: string, idx: number) => (
                      <span key={idx} className="roommate-details-amenity-pill">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer action buttons */}
              <div className="roommate-details-footer">
                <button 
                  type="button" 
                  onClick={() => setSelectedRoommateDetails(null)} 
                  className="roommate-details-close-btn"
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
                  className="roommate-details-msg-btn"
                >
                  <i className="fas fa-comments"></i> Message Roommate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isReportModalOpen && (
        <div className="roommate-report-overlay" onClick={() => setIsReportModalOpen(false)}>
          <div className="roommate-report-card" onClick={(e) => e.stopPropagation()}>
            <div className="roommate-report-header">
              <h2 className="roommate-report-title">
                <i className="fas fa-flag"></i> Report Roommate
              </h2>
              <button className="roommate-report-close-btn" onClick={() => setIsReportModalOpen(false)}>&times;</button>
            </div>

            <div className="roommate-report-body">
              {reportSuccess ? (
                <div className="roommate-report-success-box">
                  <i className="fas fa-check-circle roommate-report-success-icon"></i>
                  <p className="roommate-report-success-msg">{reportSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="roommate-report-form">
                  {reportError && (
                    <div className="roommate-report-error">
                      {reportError}
                    </div>
                  )}

                  <div className="roommate-report-field">
                    <label className="roommate-report-label">Reason for Flagging *</label>
                    <SearchableSelect
                      options={REPORT_REASONS}
                      value={reportReason}
                      onChange={(val) => setReportReason(val)}
                      placeholder="Select reason for flagging..."
                      required
                    />
                  </div>

                  {reportReason === "OTHER" && (
                    <div className="roommate-report-field">
                      <label className="roommate-report-label">Specify Reason *</label>
                      <input
                        type="text"
                        placeholder="Specify the reason..."
                        value={reportCustomReason}
                        onChange={(e) => setReportCustomReason(e.target.value)}
                        className="roommate-report-input"
                        required
                      />
                    </div>
                  )}

                  <div className="roommate-report-field">
                    <label className="roommate-report-label">Describe the issue *</label>
                    <textarea
                      placeholder="Please describe why you are reporting this roommate profile..."
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      className="roommate-report-textarea"
                      required
                    />
                  </div>

                  <div className="roommate-report-actions">
                    <button type="button" className="roommate-report-cancel-btn" onClick={() => setIsReportModalOpen(false)}>Cancel</button>
                    <button type="submit" disabled={isSubmittingReport} className="roommate-report-submit-btn">
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
