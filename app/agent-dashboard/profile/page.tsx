"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, updateAgentProfile, uploadAgentVerification, updateAgentPassword } from "@/app/actions/auth";
import styles from "./profile.module.css";
import "./styles.css";

export default function AgentProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [agentName, setAgentName] = useState("Agent");

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
      
      setLoading(false);
    };
    loadProfile();
  }, [router]);

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
      <Link href="/agent-dashboard" className={`back-link ${styles.backLinkCustom}`}>
        <i className="fas fa-arrow-left"></i> Go back
      </Link>

      {loading ? (
        <div className={styles.loader}>
          <i className={`fas fa-spinner fa-spin ${styles.spinnerIcon}`}></i> Loading profile...
        </div>
      ) : (
        <div className={`profile-layout ${styles.profileLayoutCustom}`}>
          <div className="profile-header-card">
            <div className="profile-avatar-large">
              <span id="avatar-initials">{initials}</span>
            </div>
            <div className="profile-title">
              <h2>
                <span id="display-name">{agentName}</span>
                {isVerified && (
                  <span className="verified-badge" id="agent-badge" title="Verified Campus Stay Agent">
                    <i className={`fas fa-check-circle ${styles.successGreen}`}></i>
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
                <p className={`${styles.saveStatusText} ${saveStatus.startsWith("Error") ? styles.errorColor : styles.successColor}`}>
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
              <div className={`verification-banner success ${styles.displayFlex}`} id="banner-verified">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h4>Identity Verified</h4>
                  <p>Your account is fully verified. Your listings are public and you bear the verified agent badge.</p>
                </div>
              </div>
            ) : (
              <>
                <div className={`verification-banner warning ${styles.displayFlex}`} id="banner-unverified">
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
                    <p className={styles.fileMeta}>
                      Currently uploaded document: <a href={ninDocument} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>View File</a>
                    </p>
                  )}

                  {uploadStatus && (
                    <p className={`${styles.saveStatusText} ${uploadStatus.startsWith("Error") ? styles.errorColor : styles.successColor}`}>
                      {uploadStatus}
                    </p>
                  )}

                  <button type="submit" className={`primary-btn ${styles.btnMarginTop}`} disabled={!uploadFile || uploadLoading}>
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
                <p className={`${styles.saveStatusText} ${passStatus.startsWith("Error") ? styles.errorColor : styles.successColor}`}>
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
    </>
  );
}
