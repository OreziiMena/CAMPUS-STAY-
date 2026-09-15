"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, updateAgentProfile, updateAgentPassword } from "@/app/actions/auth";
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

  // Tab State
  const [activeTab, setActiveTab] = useState("details-section");

  // Form loading/status states
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
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
                  <span className="verified-badge" id="agent-badge" title="Verified Campus Tent Agent">
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
                  <input type="tel" id="input-phone" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Agency Name (Optional)</label>
                  <input type="text" id="input-agency" placeholder="Agency or business name" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label>Bio / About Me</label>
                <textarea rows={4} id="input-bio" placeholder="Tell students about your agency experience..." value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
              </div>
              <div className="input-group">
                <label>Office Address (Optional)</label>
                <input type="text" id="input-address" placeholder="Office / Business address" value={address} onChange={(e) => setAddress(e.target.value)} />
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
                  <h4>Verified Agent Badge Active</h4>
                  <p>Your agent account is fully verified. Your listings are ranked first on the Explore feed and display the verified badge.</p>
                </div>
              </div>
            ) : (
              <>
                <div className={`verification-banner warning ${styles.displayFlex}`} id="banner-unverified">
                  <i className="fas fa-shield-alt"></i>
                  <div>
                    <h4>Optional: Get Verified Agent Priority Status</h4>
                    <p>You can publish properties immediately. Getting verified earns your listings top ranking on the Explore page and higher student trust.</p>
                  </div>
                </div>

                {/* Alternative Verification Methods Guide */}
                <div className={styles.vettingCard}>
                  <div className={styles.vettingHeader}>
                    <i className="fas fa-list-check"></i> Alternative Identity & Hostel Verification Methods
                  </div>
                  <p className={styles.vettingSubtitle}>
                    Don't have a government ID handy? Campus Tent supports 6 alternative verification processes to grant your Verified Agent status:
                  </p>

                  <div className={styles.vettingGrid}>
                    <div className={styles.vettingItem}>
                      <div className={styles.vettingItemTitle}>
                        <i className="fas fa-video"></i> 1. Live Video / Ambassador Walkthrough
                      </div>
                      <p className={styles.vettingItemDesc}>
                        Record a live 60-second video walkthrough inside the hostel holding a note with today's date, or request a visit from a student ambassador.
                      </p>
                    </div>

                    <div className={styles.vettingItem}>
                      <div className={styles.vettingItemTitle}>
                        <i className="fas fa-file-invoice"></i> 2. Utility Bill / Hostel Lease Proof
                      </div>
                      <p className={styles.vettingItemDesc}>
                        Submit an electricity (NEPA/BEDC/EKEDC) meter bill, water bill, or tenement rate receipt in your name or property address.
                      </p>
                    </div>

                    <div className={styles.vettingItem}>
                      <div className={styles.vettingItemTitle}>
                        <i className="fas fa-user-friends"></i> 3. Student / Caretaker Vouching
                      </div>
                      <p className={styles.vettingItemDesc}>
                        Provide contact referrals from 2 current student tenants or the resident hostel caretaker confirming your stewardship.
                      </p>
                    </div>

                    <div className={styles.vettingItem}>
                      <div className={styles.vettingItemTitle}>
                        <i className="fas fa-university"></i> 4. Bank Account & BVN Name Match
                      </div>
                      <p className={styles.vettingItemDesc}>
                        Link a registered Nigerian commercial bank account in your name to automatically verify your business identity.
                      </p>
                    </div>

                    <div className={styles.vettingItem}>
                      <div className={styles.vettingItemTitle}>
                        <i className="fas fa-graduation-cap"></i> 5. Campus SUG / Association Letter
                      </div>
                      <p className={styles.vettingItemDesc}>
                        Provide an endorsement letter from the Student Union Government (SUG), Dean of Student Affairs, or Landlords Association.
                      </p>
                    </div>

                    <div className={styles.vettingItem}>
                      <div className={styles.vettingItemTitle}>
                        <i className="fas fa-globe"></i> 6. Social & Business Footprint
                      </div>
                      <p className={styles.vettingItemDesc}>
                        Submit your registered CAC business certificate or active WhatsApp Business page with historic campus rental reviews.
                      </p>
                    </div>
                  </div>

                  <div className={styles.vettingContactCta}>
                    <span>Need help with non-ID verification?</span>
                    <a href="https://wa.me/2349161863877?text=Hello%20Campus%20Tent%20Support,%20I%20would%20like%20to%20verify%20my%20Agent%20account%20via%20alternative%20methods" target="_blank" rel="noopener noreferrer" className={styles.vettingContactLink}>
                      <i className="fab fa-whatsapp"></i> Chat with Support
                    </a>
                  </div>
                </div>
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
