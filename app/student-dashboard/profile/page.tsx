"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { 
  updateStudentProfile, 
  uploadStudentVerification, 
  instantToggleVerification, 
  saveStudentPreferences 
} from "@/app/actions/student";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";

export default function StudentProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [activeTab, setActiveTab] = useState("details-section");

  // Verification document states
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [feesReceiptFile, setFeesReceiptFile] = useState<File | null>(null);
  const [portalScreenshotFile, setPortalScreenshotFile] = useState<File | null>(null);

  // Verification status tracking
  const [isVerified, setIsVerified] = useState(false);
  const [idCardDoc, setIdCardDoc] = useState<string | null>(null);
  const [feesReceiptDoc, setFeesReceiptDoc] = useState<string | null>(null);
  const [portalScreenshotDoc, setPortalScreenshotDoc] = useState<string | null>(null);

  // Roommate Preferences state
  const [openToRoommates, setOpenToRoommates] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState("");

  // Status/saving helpers
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [prefLoading, setPrefLoading] = useState(false);
  const [prefStatus, setPrefStatus] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user || user.role !== "STUDENT") {
        router.push("/auth/login");
        return;
      }

      const profile = user.studentProfile as any;
      setEmail(user.email);
      setPhone(user.phone);
      setUniversity(profile?.university || "");
      setIsVerified(profile?.isVerified || false);
      setIdCardDoc(profile?.idCardDoc || null);
      setFeesReceiptDoc(profile?.feesReceiptDoc || null);
      setPortalScreenshotDoc(profile?.portalScreenshotDoc || null);

      const names = (profile?.fullName || "").trim().split(/\s+/);
      setFirstName(names[0] || "");
      setLastName(names.slice(1).join(" ") || "");

      // Load preferences
      const prefs = profile?.preferences as any;
      if (prefs) {
        setOpenToRoommates(prefs.openToRoommates || false);
        setBudgetLimit(prefs.budgetLimit ? String(prefs.budgetLimit) : "");
      }

      setLoading(false);
    };
    loadProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveStatus("");

    const res = await updateStudentProfile({
      firstName,
      lastName,
      phone,
      university,
    });

    if (res.success) {
      setSaveStatus("Profile saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } else {
      setSaveStatus(`Error: ${res.error}`);
    }
    setSaveLoading(false);
  };

  const handleUploadVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idCardFile && !feesReceiptFile && !portalScreenshotFile) {
      setUploadStatus("Error: Please select at least one document to upload.");
      return;
    }

    setUploadLoading(true);
    setUploadStatus("");

    const formData = new FormData();
    if (idCardFile) formData.append("idCard", idCardFile);
    if (feesReceiptFile) formData.append("feesReceipt", feesReceiptFile);
    if (portalScreenshotFile) formData.append("portalScreenshot", portalScreenshotFile);

    const res = await uploadStudentVerification(formData);
    if (res.success) {
      setUploadStatus("Verification documents submitted successfully!");
      if (res.paths?.idCardDoc) setIdCardDoc(res.paths.idCardDoc);
      if (res.paths?.feesReceiptDoc) setFeesReceiptDoc(res.paths.feesReceiptDoc);
      if (res.paths?.portalScreenshotDoc) setPortalScreenshotDoc(res.paths.portalScreenshotDoc);
      
      setIdCardFile(null);
      setFeesReceiptFile(null);
      setPortalScreenshotFile(null);
      setIsVerified(false); // Reset to pending (not verified yet)
      
      setTimeout(() => setUploadStatus(""), 3000);
    } else {
      setUploadStatus(`Error: ${res.error}`);
    }
    setUploadLoading(false);
  };

  const handleInstantToggleVerify = async () => {
    const res = await instantToggleVerification();
    if (res.success) {
      setIsVerified(res.isVerified ?? false);
    } else {
      alert("Failed to toggle verification status.");
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefLoading(true);
    setPrefStatus("");

    const parsedBudget = budgetLimit ? parseFloat(budgetLimit) : 0;
    const res = await saveStudentPreferences({
      openToRoommates,
      budgetLimit: parsedBudget,
    });

    if (res.success) {
      setPrefStatus("Preferences updated successfully!");
      setTimeout(() => setPrefStatus(""), 3000);
    } else {
      setPrefStatus(`Error: ${res.error}`);
    }
    setPrefLoading(false);
  };

  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "--";
  const hasUploadedDocs = idCardDoc || feesReceiptDoc || portalScreenshotDoc;

  return (
    <>
      <Navbar />

      <main className="student-profile-layout">
        {loading ? (
          <div className="student-profile-loader">
            <i className="fas fa-spinner fa-spin"></i> Loading profile...
          </div>
        ) : (
          <div className="profile-layout">
            {/* Header Card */}
            <div className="profile-header-card">
              <div className="profile-avatar-large">
                <span>{initials}</span>
              </div>
              <div className="profile-title">
                <h2>
                  <span>{firstName} {lastName}</span>
                  {isVerified && (
                    <span className="verified-badge" title="Verified Campus Stay Student">
                      <i className="fas fa-check-circle"></i>
                    </span>
                  )}
                </h2>
                <p><span>{email}</span></p>
                <span className={`status-pill ${isVerified ? "verified" : hasUploadedDocs ? "pending" : "unverified"}`}>
                  {isVerified ? "Verified Student" : hasUploadedDocs ? "Pending Review" : "Unverified Student"}
                </span>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="profile-tabs">
              <button className={`tab-btn ${activeTab === "details-section" ? "active" : ""}`} onClick={() => setActiveTab("details-section")}>Personal Details</button>
              <button className={`tab-btn ${activeTab === "verification-section" ? "active" : ""}`} onClick={() => setActiveTab("verification-section")}>Identity Verification</button>
              <button className={`tab-btn ${activeTab === "roommate-section" ? "active" : ""}`} onClick={() => setActiveTab("roommate-section")}>Roommate Preferences</button>
            </div>

            {/* personal details */}
            {activeTab === "details-section" && (
              <section id="details-section" className="tab-content active">
                <h3 className="h-header">Update Information</h3>
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>First Name</label>
                      <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                      <label>Last Name</label>
                      <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                      <label>Phone Number</label>
                      <input type="tel" placeholder="+234 --- --- ----" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="input-group">
                      <label>University / Campus</label>
                      <input type="text" placeholder="e.g. FUPRE" value={university} onChange={(e) => setUniversity(e.target.value)} required />
                    </div>
                  </div>

                  {saveStatus && (
                    <p className={`status-message-text ${saveStatus.startsWith("Error") ? "error" : "success"}`}>
                      {saveStatus}
                    </p>
                  )}

                  <button type="submit" className="primary-btn" disabled={saveLoading}>
                    {saveLoading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </section>
            )}

            {/* identity verification */}
            {activeTab === "verification-section" && (
              <section id="verification-section" className="tab-content active">
                {isVerified ? (
                  <div className="verification-banner success">
                    <i className="fas fa-check-circle"></i>
                    <div>
                      <h4>Identity Verified</h4>
                      <p>Your student profile is verified. You now have complete access to agent phone numbers, viewing booking features, and direct inquiry messaging.</p>
                    </div>
                  </div>
                ) : hasUploadedDocs ? (
                  <div className="verification-banner warning">
                    <i className="fas fa-clock"></i>
                    <div>
                      <h4>Verification Under Review</h4>
                      <p>We've received your verification document(s) and our admin team is reviewing them. Check back soon!</p>
                    </div>
                  </div>
                ) : (
                  <div className="verification-banner warning unverified-alert">
                    <i className="fas fa-exclamation-triangle"></i>
                    <div>
                      <h4>Verification Required</h4>
                      <p>You must upload **at least one** document below (Student ID, current session fees receipt, or portal screenshot) to verify your student status and contact agents.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleUploadVerification} className="verification-upload-form">
                  <h3 className="h-header">Document Submission</h3>
                  <p className="p-header">Please upload at least one of the following methods of verification:</p>

                  <div className="upload-group-row">
                    <div className="upload-field-card">
                      <label>1. Valid Student ID Card</label>
                      <div className="file-upload">
                        <i className="fas fa-id-card"></i>
                        <p>{idCardFile ? <span>Selected: {idCardFile.name}</span> : <>Upload ID Card</>}</p>
                        <input type="file" accept=".pdf, .jpg, .jpeg, .png" onChange={(e) => e.target.files && setIdCardFile(e.target.files[0])} />
                      </div>
                      {idCardDoc && <span className="doc-link-label"><i className="fas fa-file-alt"></i> ID Card Uploaded</span>}
                    </div>

                    <div className="upload-field-card">
                      <label>2. School Fees Receipt</label>
                      <div className="file-upload">
                        <i className="fas fa-receipt"></i>
                        <p>{feesReceiptFile ? <span>Selected: {feesReceiptFile.name}</span> : <>Upload Fees Receipt</>}</p>
                        <input type="file" accept=".pdf, .jpg, .jpeg, .png" onChange={(e) => e.target.files && setFeesReceiptFile(e.target.files[0])} />
                      </div>
                      {feesReceiptDoc && <span className="doc-link-label"><i className="fas fa-file-alt"></i> Fees Receipt Uploaded</span>}
                    </div>

                    <div className="upload-field-card">
                      <label>3. School Portal Screenshot</label>
                      <div className="file-upload">
                        <i className="fas fa-desktop"></i>
                        <p>{portalScreenshotFile ? <span>Selected: {portalScreenshotFile.name}</span> : <>Upload Portal Screenshot</>}</p>
                        <input type="file" accept=".pdf, .jpg, .jpeg, .png" onChange={(e) => e.target.files && setPortalScreenshotFile(e.target.files[0])} />
                      </div>
                      {portalScreenshotDoc && <span className="doc-link-label"><i className="fas fa-file-alt"></i> Screenshot Uploaded</span>}
                    </div>
                  </div>

                  {uploadStatus && (
                    <p className={`status-message-text ${uploadStatus.startsWith("Error") ? "error" : "success"}`}>
                      {uploadStatus}
                    </p>
                  )}

                  <button type="submit" className="primary-btn" disabled={(!idCardFile && !feesReceiptFile && !portalScreenshotFile) || uploadLoading}>
                    {uploadLoading ? "Uploading..." : "Submit Documents"}
                  </button>
                </form>

                {/* Dev test toggle utility */}
                <div className="dev-test-verification-card">
                  <div className="dev-test-info">
                    <h4><i className="fas fa-flask"></i> Testing Tool (Instant Verification)</h4>
                    <p>Toggle verification on/off immediately to test the student permissions, masked phone numbers, locked WhatsApp button, and viewing scheduler.</p>
                  </div>
                  <button type="button" className="dev-verify-toggle-btn" onClick={handleInstantToggleVerify}>
                    {isVerified ? "Instant Unverify" : "Instant Verify"}
                  </button>
                </div>
              </section>
            )}

            {/* roommate preferences */}
            {activeTab === "roommate-section" && (
              <section id="roommate-section" className="tab-content active">
                <h3 className="h-header">Roommate & Budget Settings</h3>
                <p className="p-header">Manage your roommate search status and preferences.</p>

                <form onSubmit={handleSavePreferences}>
                  <div className="settings-group">
                    <div className="settings-item-checkbox">
                      <div className="settings-info">
                        <h4>Open to Roommate Matching</h4>
                        <p>Allow other students on Campus Stay to find you when looking for sharing roommates.</p>
                      </div>
                      <label className="checkbox-toggle">
                        <input 
                          type="checkbox" 
                          checked={openToRoommates} 
                          onChange={(e) => setOpenToRoommates(e.target.checked)} 
                        />
                        <span className="checkbox-toggle-slider"></span>
                      </label>
                    </div>

                    <div className="input-group font-bold">
                      <label>Maximum Yearly Rent Budget (₦)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 150000" 
                        value={budgetLimit} 
                        onChange={(e) => setBudgetLimit(e.target.value)} 
                      />
                    </div>
                  </div>

                  {prefStatus && (
                    <p className={`status-message-text ${prefStatus.startsWith("Error") ? "error" : "success"}`}>
                      {prefStatus}
                    </p>
                  )}

                  <button type="submit" className="primary-btn" disabled={prefLoading}>
                    {prefLoading ? "Saving Preferences..." : "Save Preferences"}
                  </button>
                </form>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
