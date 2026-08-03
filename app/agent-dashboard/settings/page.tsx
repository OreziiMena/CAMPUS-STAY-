"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, updateAgentPassword } from "@/app/actions/auth";
import styles from "./settings.module.css";
import "./styles.css";
import SearchableSelect from "@/components/SearchableSelect";

const REGION_OPTIONS = [
  { code: "ngn", name: "Nigeria (NGN ₦)" },
  { code: "usd", name: "International (USD $)" },
  { code: "gbp", name: "United Kingdom (GBP £)" }
];

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("preferences-section");

  // Save preference simulation states
  const [saveStatus, setSaveStatus] = useState("Save Preferences");
  const [isSaving, setIsSaving] = useState(false);

  // Toggle statuses
  const [offlineMode, setOfflineMode] = useState(false);
  const [region, setRegion] = useState("ngn");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [marketingAlerts, setMarketingAlerts] = useState(true);

  // Security password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passStatus, setPassStatus] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user || user.role !== "AGENT") {
        router.push("/auth/login");
        return;
      }

      // Load local storage preferences if any
      const offlinePref = localStorage.getItem("cs_agent_pref_offline");
      const regionPref = localStorage.getItem("cs_agent_pref_region");
      const emailPref = localStorage.getItem("cs_agent_pref_email");
      const smsPref = localStorage.getItem("cs_agent_pref_sms");
      const marketingPref = localStorage.getItem("cs_agent_pref_marketing");

      if (offlinePref !== null) setOfflineMode(offlinePref === "true");
      if (regionPref !== null) setRegion(regionPref);
      if (emailPref !== null) setEmailAlerts(emailPref === "true");
      if (smsPref !== null) setSmsAlerts(smsPref === "true");
      if (marketingPref !== null) setMarketingAlerts(marketingPref === "true");

      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleSavePreferences = () => {
    setIsSaving(true);
    setSaveStatus("Saving...");
    localStorage.setItem("cs_agent_pref_offline", offlineMode.toString());
    localStorage.setItem("cs_agent_pref_region", region);
    localStorage.setItem("cs_agent_pref_email", emailAlerts.toString());
    localStorage.setItem("cs_agent_pref_sms", smsAlerts.toString());
    localStorage.setItem("cs_agent_pref_marketing", marketingAlerts.toString());

    setTimeout(() => {
      setSaveStatus("Saved!");
      setTimeout(() => {
        setSaveStatus("Save Preferences");
        setIsSaving(false);
      }, 2000);
    }, 1000);
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
      setTimeout(() => setPassStatus(""), 3000);
    } else {
      setPassStatus(`Error: ${res.error}`);
    }
    setPassLoading(false);
  };

  return (
    <>
      {loading ? (
        <div className={styles.loader}>
          <i className={`fas fa-spinner fa-spin ${styles.spinnerIcon}`}></i> Loading settings...
        </div>
      ) : (
        <div className={`profile-layout ${styles.profileLayoutCustom}`}>
          <div className="profile-header-card">
            <div className="profile-title">
              <h2><i className="fas fa-cog"></i> Account Settings</h2>
              <p>Manage your app preferences, notifications, and account security.</p>
            </div>
          </div>

          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === "preferences-section" ? "active" : ""}`} 
              onClick={() => setActiveTab("preferences-section")}
            >
              App Preferences
            </button>
            <button 
              className={`tab-btn ${activeTab === "notifications-section" ? "active" : ""}`} 
              onClick={() => setActiveTab("notifications-section")}
            >
              Notifications
            </button>
            <button 
              className={`tab-btn ${activeTab === "security-section" ? "active" : ""}`} 
              onClick={() => setActiveTab("security-section")}
            >
              Security & Password
            </button>
            <button 
              className={`tab-btn ${activeTab === "danger-section" ? "active" : ""}`} 
              onClick={() => setActiveTab("danger-section")}
            >
              Danger Zone
            </button>
          </div>

          {activeTab === "preferences-section" && (
            <section id="preferences-section" className="tab-content active">
              <h3 className="prefer">App Preferences</h3>

              <div className="settings-group">
                <div className="settings-item">
                  <div className="settings-info">
                    <h4>Offline Mode</h4>
                    <p>Hide your active status. Students will see you as "Unavailable".</p>
                  </div>
                  <label className="custom-toggle">
                    <input 
                      type="checkbox" 
                      id="toggle-offline" 
                      checked={offlineMode} 
                      onChange={(e) => setOfflineMode(e.target.checked)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <hr className="settings-divider" />

                <div className="settings-item dropdown-item">
                  <div className="settings-info">
                    <h4>Default Region & Currency</h4>
                    <p>Set the default display for your property listings.</p>
                  </div>
                  <div style={{ width: "200px" }}>
                    <SearchableSelect
                      options={REGION_OPTIONS}
                      value={region}
                      onChange={(val) => setRegion(val)}
                    />
                  </div>
                </div>
              </div>

              <button 
                id="save-preferences-btn" 
                className={`primary-btn ${styles.savePreferencesBtn} ${saveStatus === "Saved!" ? styles.savedSuccess : ""}`}
                onClick={handleSavePreferences}
                disabled={isSaving}
              >
                {saveStatus}
              </button>
            </section>
          )}

          {activeTab === "notifications-section" && (
            <section id="notifications-section" className="tab-content active">
              <h3 className="prefer">Notification Settings</h3>

              <div className="settings-group">
                <div className="settings-item">
                  <div className="settings-info">
                    <h4>Email Alerts (New Bookings)</h4>
                    <p>Receive an email immediately when a student inquires or books.</p>
                  </div>
                  <label className="custom-toggle">
                    <input 
                      type="checkbox" 
                      id="toggle-email" 
                      checked={emailAlerts} 
                      onChange={(e) => setEmailAlerts(e.target.checked)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <hr className="settings-divider" />

                <div className="settings-item">
                  <div className="settings-info">
                    <h4>SMS Alerts</h4>
                    <p>Get text messages for urgent notifications and security alerts.</p>
                  </div>
                  <label className="custom-toggle">
                    <input 
                      type="checkbox" 
                      id="toggle-sms" 
                      checked={smsAlerts} 
                      onChange={(e) => setSmsAlerts(e.target.checked)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <hr className="settings-divider" />

                <div className="settings-item">
                  <div className="settings-info">
                    <h4>Marketing Updates</h4>
                    <p>Receive tips, feature updates, and Campus Stay news.</p>
                  </div>
                  <label className="custom-toggle">
                    <input 
                      type="checkbox" 
                      id="toggle-marketing" 
                      checked={marketingAlerts} 
                      onChange={(e) => setMarketingAlerts(e.target.checked)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </section>
          )}

          {activeTab === "security-section" && (
            <section id="security-section" className="tab-content active">
              <h3 className="prefer">Change Password</h3>
              <form onSubmit={handleUpdatePassword}>
                <div className="input-group">
                  <label>Current Password</label>
                  <div className="password-wrapper">
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)} 
                      required 
                    />
                    <i 
                      className={`fas ${showCurrentPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`} 
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>
                </div>
                <div className="input-group">
                  <label>New Password</label>
                  <div className="password-wrapper">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      required 
                    />
                    <i 
                      className={`fas ${showNewPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`} 
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>
                </div>

                {passStatus && (
                  <p className={`status-message-text ${passStatus.startsWith("Error") ? "error" : "success"}`} style={{ marginTop: "15px" }}>
                    {passStatus}
                  </p>
                )}

                <button type="submit" className="primary-btn" disabled={passLoading} style={{ marginTop: "20px" }}>
                  {passLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </section>
          )}

          {activeTab === "danger-section" && (
            <section id="danger-section" className="tab-content active">
              <h3 className="prefer">Danger Zone</h3>

              <div className="danger-zone-card">
                <div className="danger-info">
                  <h4>Deactivate Account</h4>
                  <p>Once you deactivate your account, all your active property listings will be hidden from the platform. This action is temporary, but you will need to contact support to reactivate.</p>
                </div>
                <button 
                  id="deactivate-account-btn" 
                  className="danger-outline-btn"
                  onClick={() => alert("Deactivation request submitted. Our support team will contact you.")}
                >
                  Deactivate Account
                </button>
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
