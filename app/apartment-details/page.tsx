"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPropertyDetails, createInquiry } from "@/app/actions/properties";
import { getCurrentUser } from "@/app/actions/auth";
import { scheduleViewing } from "@/app/actions/student";
import { submitReport } from "@/app/actions/reports";
import "./styles.css";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  distance: string;
  description: string;
  amenities: string[];
  images: string[];
  views?: number;
  agent: {
    name: string;
    role: string;
    phone: string;
  };
}

const mockProperties: Record<string, Property> = {
  "1": {
    id: "1",
    title: "Standard Self-Con near FUPRE Main Gate",
    price: "₦150,000",
    location: "FUPRE Road, Effurun",
    distance: "5 mins walk to campus",
    description: "A neat and well-maintained self-contained apartment located just 5 minutes walk from the FUPRE main gate. Perfect for single students who desire proximity to lectures, featuring a serene study environment, strong security, and constant water supply.",
    amenities: ["1 Bed", "1 Bath", "Prepaid Meter", "Borehole Water", "Fenced Gate", "Security Guard"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    agent: {
      name: "Precious Olise",
      role: "Verified Agent",
      phone: "+2349161863877"
    }
  },
  "2": {
    id: "2",
    title: "2-Bedroom Flat for Roommate Sharing",
    price: "₦250,000",
    location: "PTI Road Junction",
    distance: "10 mins walk to campus",
    description: "Spacious 2-bedroom flat ideal for roommate sharing. Located close to PTI Road Junction with easy transport access. Secure gated compound, large kitchen, clean bathrooms, and parking space. Highly recommended for students who wish to split rent.",
    amenities: ["2 Beds", "2 Baths", "Gated Compound", "Prepaid Meter", "Generator Space", "Water Running"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    agent: {
      name: "Campus Stay Official",
      role: "Premium Partner",
      phone: "+2349161863877"
    }
  },
  "3": {
    id: "3",
    title: "Single Room Off-Campus",
    price: "₦80,000",
    location: "Ugbomro Community",
    distance: "12 mins walk to campus",
    description: "Budget-friendly single room in Ugbomro Community. Suitable for students looking for low-cost off-campus housing. The environment is quiet and study-friendly. Shared bathroom facility and 24/7 borehole water access.",
    amenities: ["1 Bed", "Shared Bath", "Borehole Water", "Kitchen Space", "Prepaid Meter"],
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    agent: {
      name: "Abed Jason",
      role: "Verified Landlord",
      phone: "+2349161863877"
    }
  }
};

function ApartmentDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") || "1";

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Student verification and scheduling states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [viewingDateTime, setViewingDateTime] = useState("");
  const [schedulingStatus, setSchedulingStatus] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Listing Report States
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

    if (!currentUser) {
      alert("Please log in to submit a report.");
      router.push("/auth/login");
      return;
    }

    if (!reportDescription || reportDescription.trim().length < 10) {
      setReportError("Please provide a detailed description (minimum 10 characters).");
      return;
    }

    setIsSubmittingReport(true);

    try {
      const res = await submitReport({
        propertyId: property.id,
        reason: reportReason,
        customReason: reportReason === "OTHER" ? reportCustomReason : undefined,
        description: reportDescription,
      });

      setIsSubmittingReport(false);

      if (res.success) {
        setReportSuccess("Listing reported successfully. Thank you for keeping Campus Stay safe!");
        setTimeout(() => {
          setIsReportModalOpen(false);
          setReportReason("FRAUD_SCAM");
          setReportCustomReason("");
          setReportDescription("");
          setReportSuccess("");
        }, 2000);
      } else {
        setReportError(res.error || "Failed to submit report.");
      }
    } catch (err: any) {
      setIsSubmittingReport(false);
      setReportError(err.message || "An unexpected error occurred.");
    }
  };

  const handleShare = async () => {
    if (!property) return;
    const shareUrl = window.location.href;
    const shareData = {
      title: property.title,
      text: `Check out this listing on Campus Stay: ${property.title}`,
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Web Share API error:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);

      // Fetch user session details
      const user = await getCurrentUser();
      setCurrentUser(user);

      const res = await getPropertyDetails(id);
      if (res.success && res.property) {
        const prop = res.property;
        setProperty({
          id: prop.id,
          title: prop.title,
          price: `₦${prop.price.toLocaleString()}`,
          location: prop.location,
          distance: prop.distance,
          description: prop.description,
          amenities: prop.amenities,
          images: prop.images,
          views: prop.views || 0,
          agent: {
            name: prop.agent ? prop.agent.fullName : (prop.student ? `@${prop.student.username}` : "Campus Stay Official"),
            role: prop.agent ? (prop.agent.isVerified ? "Verified Agent" : "Agent/Landlord") : (prop.student ? (prop.student.isVerified ? "Verified Student Roommate" : "Student (Roommate Option)") : "Campus Stay Partner"),
            phone: prop.agent ? (prop.agent.user?.phone || "+2349161863877") : (prop.student?.user?.phone || "+2349161863877"),
            isVerified: prop.agent ? prop.agent.isVerified : (prop.student ? prop.student.isVerified : true),
          }
        });
      } else {
        const mock = mockProperties[id] || mockProperties["1"];
        setProperty(mock);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  const handleWhatsAppClick = async () => {
    if (!property) return;
    await createInquiry({
      propertyId: property.id,
      message: `Hi, I am interested in your listing "${property.title}" on Campus Stay.`,
    });
  };

  const handleScheduleViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingDateTime || !property) return;
    setIsScheduling(true);
    setSchedulingStatus("");
    
    const res = await scheduleViewing({
      propertyId: property.id,
      dateTime: viewingDateTime,
    });
    
    if (res.success) {
      setSchedulingStatus("Viewing requested successfully! The agent has been notified.");
      setViewingDateTime("");
      setTimeout(() => setSchedulingStatus(""), 4000);
    } else {
      setSchedulingStatus(`Error: ${res.error}`);
    }
    setIsScheduling(false);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    if (property) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    if (property) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading || !property) {
    return (
      <div className="details-loading-screen">
        Loading property details...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="property-details-layout details-layout-margin">
        <div className="main-info">
          <div className="property-image-container">
            <img 
              src={property.images[currentImageIndex] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
              className="property-main-image" 
              alt={property.title} 
            />
            {property.images.length > 1 && (
              <>
                <div className="image-counter">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
                <button className="carousel-control-prev" type="button" onClick={prevSlide}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="carousel-control-next" type="button" onClick={nextSlide}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}
          </div>
          
          <div className="info-card">
            <h1 className="listing-title">{property.title}</h1>

            <div className="meta-row">
              <span><i className="far fa-eye"></i> {property.views || 0} views</span>
              <span><i className="fas fa-home"></i> Student Hostel</span>
              <span><i className="far fa-calendar-alt"></i> Listed recently</span>
            </div>

            <div className="location-row">
              <p><i className="fas fa-map-marker-alt"></i> <span>{property.location}</span></p>
              <p><i className="fas fa-walking"></i> {property.distance}</p>
            </div>

            <h2 className="listing-price">{property.price} <span>/ year</span></h2>

            <p className="desc-text">{property.description}</p>
          </div>

          <div className="info-card">
            <h3>Amenities</h3>
            <ul className="amenities-check-list">
              {property.amenities.map((amenity: string, i: number) => (
                <li key={i}>
                  <i className="fas fa-check-circle"></i> {amenity}
                </li>
              ))}
            </ul>
          </div>

          {/* Viewing Scheduler Card */}
          <div className="info-card scheduling-card">
            <h3><i className="fas fa-calendar-alt"></i> Schedule a Viewing</h3>
            
            {!currentUser || (currentUser.role === "STUDENT" && !currentUser.studentProfile?.isVerified) ? (
              <div className="scheduling-locked-overlay">
                <i className="fas fa-lock"></i>
                <h4>Viewing Scheduler Locked</h4>
                <p>You must be a logged-in, verified student to schedule physical viewing appointments.</p>
                {!currentUser ? (
                  <Link href="/auth/login" className="primary-btn btn-sm">Log in to view</Link>
                ) : (
                  <Link href="/student-dashboard/profile" className="primary-btn btn-sm">Verify Profile</Link>
                )}
              </div>
            ) : (
              <form onSubmit={handleScheduleViewing} className="scheduling-form">
                <p>Select a preferred date and time to inspect this hostel in person with the agent.</p>
                <div className="input-group">
                  <label htmlFor="viewing-time">Preferred Date & Time</label>
                  <input 
                    type="datetime-local" 
                    id="viewing-time" 
                    value={viewingDateTime}
                    onChange={(e) => setViewingDateTime(e.target.value)}
                    required 
                    className="scheduling-time-input"
                  />
                </div>
                {schedulingStatus && (
                  <p className={`status-message-text ${schedulingStatus.startsWith("Error") ? "error" : "success"}`}>
                    {schedulingStatus}
                  </p>
                )}
                <button type="submit" className="primary-btn" disabled={isScheduling || !viewingDateTime}>
                  {isScheduling ? "Requesting..." : "Schedule Viewing Appointment"}
                </button>
              </form>
            )}
          </div>
        </div>

        <aside className="property-sidebar">
          <div className="sidebar-card">
            <h4 className="card-heading">Listed by</h4>
            
            <div className="agent-profile">
              <div className="avatar-circle"><i className="fas fa-user"></i></div>
              <div className="agent-info">
                <h5 style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {property.agent.name}
                  {property.agent.isVerified && (
                    <i className="fas fa-check-circle verified-icon" style={{ color: "#2e7d32", fontSize: "0.9rem" }}></i>
                  )}
                </h5>
                <p className="agent-role">{property.agent.role}</p>
              </div>
            </div>

            {!currentUser || (currentUser.role === "STUDENT" && !currentUser.studentProfile?.isVerified) ? (
              <>
                <div className="verification-lock-banner">
                  <p><i className="fas fa-lock"></i> Verification Required</p>
                  <small>Please verify your student profile to message listing owners.</small>
                  <Link href={currentUser ? "/student-dashboard/profile" : "/auth/login"} className="verify-link-btn">
                    {currentUser ? "Verify Now" : "Log In to Verify"}
                  </Link>
                </div>
                <button className="whatsapp-btn full-width locked" disabled style={{ backgroundColor: "#888" }}>
                  <i className="fas fa-comments"></i> Message (Locked)
                </button>
              </>
            ) : (
              <Link 
                href={`/chat?propertyId=${property.id}`} 
                className="whatsapp-btn full-width"
                style={{ display: "flex", justifyContent: "center", alignItems: "center", textDecoration: "none", backgroundColor: "#d35400" }}
              >
                <i className="fas fa-comments" style={{ marginRight: "8px" }}></i> Message 
              </Link>
            )}
            <Link href="/explore" className="view-listings-link">View all listings &rarr;</Link>
          </div>

          <div className="sidebar-card">
            <h4 className="card-heading">Actions</h4>
            <div className="action-buttons">
              <button className="action-btn" onClick={handleShare}><i className="fas fa-share-alt"></i> Share</button>
              <button className="action-btn" onClick={() => setIsReportModalOpen(true)}><i className="far fa-flag"></i> Report</button>
            </div>
          </div>

          <div className="sidebar-card safety-card">
            <h4 className="safety-heading"><i className="fas fa-shield-alt"></i> Safety Tips</h4>
            <ul className="safety-list">
              <li><span>Never pay before inspecting the apartment.</span></li>
              <li><span>Always verify the agent's identity in person.</span></li>
              <li><span>Report suspicious listings immediately.</span></li>
              <li><span>Get a proper tenancy agreement.</span></li>
            </ul>
          </div>
        </aside>
      </main>

      {/* Premium Toast Notification */}
      {showToast && (
        <div style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#d35400",
          color: "white",
          padding: "12px 24px",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          zIndex: 9999,
          fontFamily: "'Poppins', sans-serif",
          fontWeight: "bold",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <i className="fas fa-check-circle"></i> Link copied!
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
          zIndex: 1100,
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
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#d35400", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="fas fa-flag"></i> Report Listing
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
                      <option value="FRAUD_SCAM">Fraud or Scam Listing</option>
                      <option value="INACCURATE_DETAILS">Inaccurate details/photos</option>
                      <option value="INAPPROPRIATE_CONTENT">Inappropriate content/abuse</option>
                      <option value="SPAM">Spam or Duplicate Listing</option>
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
                      placeholder="Please provide details about what makes this listing suspicious or incorrect..."
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", minHeight: "100px", resize: "vertical", outline: "none" }}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                    <button type="button" style={{ flex: 1, backgroundColor: "#f1f3f4", color: "#3c4043", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }} onClick={() => setIsReportModalOpen(false)}>Cancel</button>
                    <button type="submit" disabled={isSubmittingReport} style={{ flex: 2, backgroundColor: "#d35400", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
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

export default function ApartmentDetails() {
  return (
    <Suspense fallback={<div className="details-loading-screen">Loading...</div>}>
      <ApartmentDetailsContent />
    </Suspense>
  );
}
