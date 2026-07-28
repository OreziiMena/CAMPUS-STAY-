"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getRoommateListings } from "@/app/actions/student";
import { getOrCreateRoommateChatRoom } from "@/app/actions/chat";
import { getCurrentUser } from "@/app/actions/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./roommates.css";

export default function RoommatesDirectory() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSafetyTip, setShowSafetyTip] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [university, setUniversity] = useState("All");
  const [gender, setGender] = useState("All");
  const [maxBudget, setMaxBudget] = useState("");

  useEffect(() => {
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
    fetchData();
  }, []);

  const handleMessageRoommate = async (roommateUserId: string, roommateName: string) => {
    if (!currentUser) {
      alert("Please log in to contact potential roommates.");
      router.push("/auth/login");
      return;
    }

    if (currentUser.role !== "STUDENT") {
      alert("Only students can message roommate partners.");
      return;
    }

    if (!currentUser.studentProfile?.isVerified) {
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

                    <div className="roommate-card-footer">
                      <button
                        onClick={() =>
                          student && handleMessageRoommate(student.userId, student.username)
                        }
                        className="message-roommate-btn"
                        disabled={!student}
                        style={{ width: "100%" }}
                      >
                        <i className="fas fa-comments"></i> Message Roommate
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
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "380px",
          backgroundColor: "white",
          border: "1.5px solid #d4edda",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          zIndex: 1000,
          display: "flex",
          gap: "16px",
          fontFamily: "'Poppins', sans-serif"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ 
              position: "relative", 
              display: "inline-flex", 
              alignItems: "center", 
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#e8f7f5"
            }}>
              <i className="fas fa-certificate" style={{ color: "rgb(2, 53, 28)", fontSize: "2.2rem" }}></i>
              <i className="fas fa-check" style={{ position: "absolute", color: "white", fontSize: "0.9rem" }}></i>
            </div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "bold", color: "#1a1a1a" }}>Safety Tip</h4>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#555", lineHeight: "1.4" }}>
              For your safety, always check for the <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", verticalAlign: "middle", margin: "0 2px" }}>
                <i className="fas fa-certificate" style={{ color: "rgb(2, 53, 28)", fontSize: "1.1rem" }}></i>
                <i className="fas fa-check" style={{ position: "absolute", color: "white", fontSize: "0.45rem" }}></i>
              </span> verification badge, it means the user has completed ID verification.
            </p>
            <Link href="/student-dashboard/profile" style={{ margin: "4px 0 0 0", fontSize: "0.85rem", fontWeight: "bold", color: "rgb(2, 53, 28)", textDecoration: "none" }}>
              Verify your account now for added trust.
            </Link>
          </div>

          <button 
            onClick={() => setShowSafetyTip(false)} 
            style={{ 
              position: "absolute", 
              top: "12px", 
              right: "12px", 
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
      )}

      <Footer />
    </>
  );
}
