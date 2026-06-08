"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser, updateAgentProfile, uploadAgentVerification, updateAgentPassword } from "@/app/actions/auth";
import { getAgentDashboardData } from "@/app/actions/properties";
import DashboardClientLogic from "../DashboardClientLogic";
import "../agent-dashboard.css";
import "./styles.css";

export default function AgentProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [agentName, setAgentName] = useState("Agent");
  const [stats, setStats] = useState({ totalProperties: 0, activeListings: 0, newInquiries: 0 });

  // Profile data state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [ninDocument, setNinDocument] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState("details-section");

  // Form loading/status states
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passStatus, setPassStatus] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user || user.role !== "AGENT") {
        router.push("/auth/login");
        return;
      }
      
      const profile = user.agentProfile;
      setAgentName(profile?.fullName || "Agent");
      setEmail(user.email);
      setPhone(user.phone);
      setAddress(profile?.address || "");
      setAgencyName(profile?.agencyName || "");
      setBio(profile?.bio || "");
      setIsVerified(profile?.isVerified || false);
      setNinDocument(profile?.ninDocument || null);
      
      const names = (profile?.fullName || "").trim().split(/\s+/);
      setFirstName(names[0] || "");
      setLastName(names.slice(1).join(" ") || "");

      // Theme
      const savedTheme = localStorage.getItem("campus_stay_theme") || "light";
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }

      // Fetch dashboard stats for inquiry badge
      const dashData = await getAgentDashboardData();
      if (dashData.success && dashData.stats) {
        setStats(dashData.stats);
      }
      
      setLoading(false);
    };
    loadProfile();
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveStatus("");

    const res = await updateAgentProfile({
      firstName,
      lastName,
      phone,
      agencyName,
      bio,
      address,
    });

    if (res.success) {
      setSaveStatus("Profile saved successfully!");
      setAgentName(`${firstName.trim()} ${lastName.trim()}`);
      setTimeout(() => {
        setSaveStatus("");
      }, 3000);
    } else {
      setSaveStatus(`Error: ${res.error}`);
    }
    setSaveLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadLoading(true);
    setUploadStatus("");

    const formData = new FormData();
    formData.append("ninDocument", uploadFile);

    const res = await uploadAgentVerification(formData);
    if (res.success) {
      setUploadStatus("Document submitted successfully for review!");
      setNinDocument(res.filePath || null);
      setUploadFile(null);
      setTimeout(() => {
        setUploadStatus("");
      }, 3000);
    } else {
      setUploadStatus(`Error: ${res.error}`);
    }
    setUploadLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }
    setPassLoading(true);
    setPassStatus("");

    const res = await updateAgentPassword({
      currentPassword,
      newPassword,
    });

    if (res.success) {
      setPassStatus("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => {
        setPassStatus("");
      }, 3000);
    } else {
      setPassStatus(`Error: ${res.error}`);
    }
    setPassLoading(false);
  };

  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "--";

  return (
    <>
      <DashboardClientLogic />
      <div className="dashboard-layout">
        <aside className="sidebar" id="sidebar">
          <div className="sidebar-header">
            <h2 className="logo-text">Campus Stay</h2>
            <button className="close-sidebar-btn" id="close-sidebar"><i className="fas fa-times"></i></button>
          </div>
          <ul className="sidebar-nav">
            <li><Link href="/agent-dashboard"><i className="fas fa-th-large"></i> Dashboard</Link></li>
            <li><a href="#"><i className="fas fa-building"></i> My Properties</a></li>
            <li><a href="#"><i className="fas fa-envelope"></i> Inquiries <span className="badge" id="nav-inquiry-badge">{stats.newInquiries}</span></a></li>
            <li><Link href="/agent-dashboard/analytics"><i className="fas fa-chart-line"></i> Analytics</Link></li>
            <li><Link href="/agent-dashboard/settings"><i className="fas fa-cog"></i> Settings</Link></li>
          </ul>

          <div className="sidebar-footer">
            <button id="logout-btn" className="logout-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Log Out</button>
          </div>
        </aside>

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

          <div className="dashboard-content" style={{ position: "relative" }}>
            <Link href="/agent-dashboard" className="back-link" style={{ position: "relative", top: "0", left: "0", display: "inline-flex", marginBottom: "20px" }}>
              <i className="fas fa-arrow-left"></i> Go back
            </Link>

            {loading ? (
              <div style={{ textAlign: "center", padding: "50px", fontFamily: "Poppins", color: "rgb(2, 53, 28)", fontSize: "18px" }}>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: "10px" }}></i> Loading profile...
              </div>
            ) : (
              <div className="profile-layout" style={{ margin: "0 auto", padding: "0" }}>
                <div className="profile-header-card">
                  <div className="profile-avatar-large">
                    <span id="avatar-initials">{initials}</span>
                  </div>
                  <div className="profile-title">
                    <h2>
                      <span id="display-name">{agentName}</span>
                      {isVerified && (
                        <span className="verified-badge" id="agent-badge" title="Verified Campus Stay Agent">
                          <i className="fas fa-check-circle" style={{ color: "var(--success-green)" }}></i>
                        </span>
                      )}
                    </h2>
                    <p><span id="display-email">{email}</span></p>
                    <span className={`status-pill ${isVerified ? "verified" : "pending"}`} id="status-pill">
                      {isVerified ? "Verified Agent" : "Unverified Agent"}
                    </span>
                  </div>
                </div>

                <div className="profile-tabs">
                  <button className={`tab-btn ${activeTab === "details-section" ? "active" : ""}`} onClick={() => setActiveTab("details-section")}>Personal Details</button>
                  <button className={`tab-btn ${activeTab === "verification-section" ? "active" : ""}`} onClick={() => setActiveTab("verification-section")}>Identity Verification</button>
                  <button className={`tab-btn ${activeTab === "security-section" ? "active" : ""}`} onClick={() => setActiveTab("security-section")}>Security</button>
                </div>

                <section id="details-section" className={`tab-content ${activeTab === "details-section" ? "active" : ""}`}>
                  <h3 className="h-header">Update Information</h3>
                  <form id="profile-form" onSubmit={handleUpdateProfile}>
                    <div className="form-grid">
                      <div className="input-group">
                        <label>First Name</label>
                        <input type="text" id="input-first-name" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                      </div>
                      <div className="input-group">
                        <label>Last Name</label>
                        <input type="text" id="input-last-name" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                      </div>
                      <div className="input-group">
                        <label>Phone Number</label>
                        <input type="tel" id="input-phone" placeholder="+234 --- --- ----" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                      </div>
                      <div className="input-group">
                        <label>Agency Name (Optional)</label>
                        <input type="text" id="input-agency" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Bio / About Me</label>
                      <textarea rows={4} id="input-bio" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                    </div>
                    <div className="input-group">
                      <label>Office Address (Optional)</label>
                      <input type="text" id="input-address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>

                    {saveStatus && (
                      <p style={{ 
                        color: saveStatus.startsWith("Error") ? "#e74c3c" : "#28a745", 
                        fontFamily: "Poppins", 
                        fontSize: "14px", 
                        margin: "15px 0" 
                      }}>
                        {saveStatus}
                      </p>
                    )}

                    <button type="submit" className="primary-btn" disabled={saveLoading}>
                      {saveLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </section>

                <section id="verification-section" className={`tab-content ${activeTab === "verification-section" ? "active" : ""}`}>
                  {isVerified ? (
                    <div className="verification-banner success" id="banner-verified" style={{ display: "flex" }}>
                      <i className="fas fa-check-circle"></i>
                      <div>
                        <h4>Identity Verified</h4>
                        <p>Your account is fully verified. Your listings are public and you bear the verified agent badge.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="verification-banner warning" id="banner-unverified" style={{ display: "flex" }}>
                        <i className="fas fa-exclamation-triangle"></i>
                        <div>
                          <h4>Verification Required</h4>
                          <p>Your account is unverified. You must upload your NIN or government ID before your property listings can go public.</p>
                        </div>
                      </div>

                      <form id="verification-form" onSubmit={handleFileUpload}>
                        <h3 className="h-header">Document Upload</h3>
                        <p className="p-header">Upload your National Identification Number (NIN) slip or government-issued ID.</p>

                        <div className="file-upload">
                          <i className="fas fa-cloud-upload-alt"></i>
                          <p>
                            {uploadFile ? (
                              <span>Selected file: <strong>{uploadFile.name}</strong></span>
                            ) : (
                              <>Drag and drop your document here, or <span>browse</span></>
                            )}
                          </p>
                          <input type="file" id="nin-upload" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} />
                        </div>

                        {ninDocument && (
                          <p style={{ fontSize: "14px", color: "#666", marginTop: "15px" }}>
                            Currently uploaded document: <a href={ninDocument} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-orange)", fontWeight: "600", textDecoration: "underline" }}>View File</a>
                          </p>
                        )}

                        {uploadStatus && (
                          <p style={{ 
                            color: uploadStatus.startsWith("Error") ? "#e74c3c" : "#28a745", 
                            fontFamily: "Poppins", 
                            fontSize: "14px", 
                            margin: "15px 0" 
                          }}>
                            {uploadStatus}
                          </p>
                        )}

                        <button type="submit" className="primary-btn" style={{ marginTop: "20px" }} disabled={!uploadFile || uploadLoading}>
                          {uploadLoading ? "Uploading..." : "Submit for Review"}
                        </button>
                      </form>
                    </>
                  )}
                </section>

                <section id="security-section" className={`tab-content ${activeTab === "security-section" ? "active" : ""}`}>
                  <h3 className="h-header">Change Password</h3>
                  <form id="security-form" onSubmit={handleUpdatePassword}>
                    <div className="input-group">
                      <label>Current Password</label>
                      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                    </div>
                    <div className="input-group">
                      <label>New Password</label>
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>

                    {passStatus && (
                      <p style={{ 
                        color: passStatus.startsWith("Error") ? "#e74c3c" : "#28a745", 
                        fontFamily: "Poppins", 
                        fontSize: "14px", 
                        margin: "15px 0" 
                      }}>
                        {passStatus}
                      </p>
                    )}

                    <button type="submit" className="primary-btn" disabled={passLoading}>
                      {passLoading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </section>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
