"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import DashboardClientLogic from "../DashboardClientLogic";
import { addProperty } from "@/app/actions/properties";
import "./styles.css";
import "../agent-dashboard.css";

export default function AddProperty() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [hostelType, setHostelType] = useState("Self-Contain");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [description, setDescription] = useState("");
  const [agentName, setAgentName] = useState("Agent");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const [amenities, setAmenities] = useState({
    bed: true,
    bath: true,
    prepaid: false,
    water: true,
    gated: false,
    security: false
  });

  const [images, setImages] = useState<string[]>([]);
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
      setAgentName(user.name || "Agent");

      const savedTheme = localStorage.getItem("campus_stay_theme") || "light";
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    document.body.classList.remove("dark-mode");
    router.push("/");
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("campus_stay_theme", nextTheme);
    if (nextTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

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
    if (amenities.bed) activeAmenities.push("Bed included");
    if (amenities.bath) activeAmenities.push("Private Bathroom");
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
        images,
      });

      setIsLoading(false);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/agent-dashboard");
        }, 1500);
      } else {
        setError(res.error || "Failed to list property.");
      }
    } catch {
      setIsLoading(false);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <>
      <DashboardClientLogic />
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="sidebar" id="sidebar">
          <div className="sidebar-header">
            <h2 className="logo-text">Campus Stay</h2>
            <button className="close-sidebar-btn" id="close-sidebar"><i className="fas fa-times"></i></button>
          </div>
          <ul className="sidebar-nav">
            <li><Link href="/agent-dashboard"><i className="fas fa-th-large"></i> Dashboard</Link></li>
            <li><Link href="/agent-dashboard/add-property" className="active"><i className="fas fa-building"></i> My Properties</Link></li>
            <li><a href="#"><i className="fas fa-envelope"></i> Inquiries <span className="badge" id="nav-inquiry-badge">0</span></a></li>
            <li><Link href="/agent-dashboard/analytics"><i className="fas fa-chart-line"></i> Analytics</Link></li>
            <li><Link href="/agent-dashboard/settings"><i className="fas fa-cog"></i> Settings</Link></li>
          </ul>

          <div className="sidebar-footer">
            <button id="logout-btn" className="logout-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Log Out</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <header className="dashboard-header">
            <button className="menu-toggle-btn" id="menu-toggle"><i className="fas fa-bars"></i></button>

            <div className="header-right">
              <button className="notification-btn" id="notification-btn"><i className="fas fa-bell"></i></button>
              <button className="notification-btn" onClick={handleThemeToggle}>
                <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`} style={theme === "dark" ? { color: "#f1c40f" } : undefined}></i>
              </button>
              <div 
                className="profile-dropdown" 
                onClick={(e) => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  e.stopPropagation();
                }}
              >
                <div className="profile-info">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(agentName)}&background=d35400&color=fff`} alt="Profile" className="profile-pic" />
                  <span className="profile-name">{agentName}</span>
                  <i className="fas fa-chevron-down" style={{ fontSize: "11px", color: "var(--text-main)", marginLeft: "2px" }}></i>
                </div>

                <div className={`dropdown-menu ${isProfileDropdownOpen ? "active" : ""}`} onClick={(e) => e.stopPropagation()}>
                  <Link href="/agent-dashboard/profile"><i className="fas fa-user"></i> My Profile</Link>
                  <Link href="/agent-dashboard/settings"><i className="fas fa-cog"></i> Settings</Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="logout-link" style={{ background: "none", border: "none", padding: "12px 20px", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "Poppins", fontSize: "13px", display: "flex", gap: "10px", alignItems: "center" }}>
                    <i className="fas fa-sign-out-alt"></i> Log Out
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="dashboard-content">
            <div className="welcome-banner">
              <div>
                <h1 style={{ margin: "0 0 5px 0" }}>
                  <i className="fas fa-plus-circle" style={{ marginRight: "10px" }}></i> Add New Property
                </h1>
                <p style={{ margin: "0" }}>List a new student hostel, apartment, or flat near campus.</p>
              </div>
              <Link href="/agent-dashboard" className="back-to-dash-btn">
                <i className="fas fa-arrow-left"></i> Back to Dashboard
              </Link>
            </div>

            {success ? (
              <div className="success-banner-card" style={{ textAlign: "center", padding: "50px 30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                <i className="fas fa-check-circle" style={{ fontSize: "60px", color: "#28a745", marginBottom: "20px" }}></i>
                <h2 style={{ fontFamily: "Poppins", color: "rgb(2, 53, 28)", marginBottom: "10px" }}>Property Listed Successfully!</h2>
                <p style={{ color: "#666" }}>Your listing is now live. Redirecting you to dashboard...</p>
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
                    <select
                      id="hostel-type"
                      value={hostelType}
                      onChange={(e) => setHostelType(e.target.value)}
                      required
                    >
                      <option value="Self-Contain">Self-Contain</option>
                      <option value="Single Room">Single Room</option>
                      <option value="1-Bedroom Flat">1-Bedroom Flat</option>
                      <option value="2-Bedroom Flat">2-Bedroom Flat</option>
                      <option value="Shared Hostel Room">Shared Hostel Room</option>
                    </select>
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
                          <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}>
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
          </div>
        </main>
      </div>
    </>
  );
}
