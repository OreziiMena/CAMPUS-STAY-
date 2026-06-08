"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import styles from "./settings.module.css";
import "./styles.css";

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

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user || user.role !== "AGENT") {
        router.push("/auth/login");
        return;
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleSavePreferences = () => {
    setIsSaving(true);
    setSaveStatus("Saving...");
    setTimeout(() => {
      setSaveStatus("Saved!");
      setTimeout(() => {
        setSaveStatus("Save Preferences");
        setIsSaving(false);
      }, 2000);
    }, 1000);
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
                  <select 
                    className="settings-dropdown" 
                    id="region-select" 
                    value={region} 
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    <option value="ngn">Nigeria (NGN ₦)</option>
                    <option value="usd">International (USD $)</option>
                    <option value="gbp">United Kingdom (GBP £)</option>
                  </select>
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
