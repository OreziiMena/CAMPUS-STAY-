"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPropertyDetails, createInquiry } from "@/app/actions/properties";
import { getCurrentUser } from "@/app/actions/auth";
import { scheduleViewing } from "@/app/actions/student";
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
  const id = searchParams.get("id") || "1";

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Student verification and scheduling states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [viewingDateTime, setViewingDateTime] = useState("");
  const [schedulingStatus, setSchedulingStatus] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);

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
          agent: {
            name: prop.agent ? prop.agent.fullName : (prop.student ? prop.student.fullName : "Campus Stay Official"),
            role: prop.agent ? (prop.agent.isVerified ? "Verified Agent" : "Agent/Landlord") : "Student (Roommate Option)",
            phone: prop.agent ? (prop.agent.user?.phone || "+2349161863877") : (prop.student?.user?.phone || "+2349161863877"),
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
              <span><i className="far fa-eye"></i> 124 views</span>
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
                <h5>{property.agent.name} <i className="fas fa-check-circle verified-icon"></i></h5>
                <p className="agent-role">{property.agent.role}</p>
                <p className="agent-phone-display">
                  Phone: {!currentUser || (currentUser.role === "STUDENT" && !currentUser.studentProfile?.isVerified) ? "+234 916 *** ****" : property.agent.phone}
                </p>
              </div>
            </div>

            {!currentUser || (currentUser.role === "STUDENT" && !currentUser.studentProfile?.isVerified) ? (
              <>
                <div className="verification-lock-banner">
                  <p><i className="fas fa-lock"></i> Verification Required</p>
                  <small>Please verify your student profile to view phone numbers and contact agents.</small>
                  <Link href={currentUser ? "/student-dashboard/profile" : "/auth/login"} className="verify-link-btn">
                    {currentUser ? "Verify Now" : "Log In to Verify"}
                  </Link>
                </div>
                <button className="whatsapp-btn full-width locked" disabled>
                  <i className="fab fa-whatsapp"></i> Chat on WhatsApp (Locked)
                </button>
              </>
            ) : (
              <a 
                href={`https://wa.me/${property.agent.phone.replace(/[^0-9+]/g, "")}?text=Hi%20${encodeURIComponent(property.agent.name)},%20I%20am%20interested%20in%20your%20listing%20"${encodeURIComponent(property.title)}"%20on%20Campus%20Stay.`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="whatsapp-btn full-width"
                onClick={handleWhatsAppClick}
              >
                <i className="fab fa-whatsapp"></i> Chat on WhatsApp
              </a>
            )}
            <Link href="/explore" className="view-listings-link">View all listings &rarr;</Link>
          </div>

          <div className="sidebar-card">
            <h4 className="card-heading">Actions</h4>
            <div className="action-buttons">
              <button className="action-btn" onClick={() => alert("Link copied to clipboard!")}><i className="fas fa-share-alt"></i> Share</button>
              <button className="action-btn" onClick={() => alert("Listing reported. Thank you.")}><i className="far fa-flag"></i> Report</button>
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
