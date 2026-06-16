"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, updateAgentPassword } from "@/app/actions/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";

export default function StudentSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("preferences-section");

  // App preferences simulator states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [marketingAlerts, setMarketingAlerts] = useState(true);
  const [saveStatus, setSaveStatus] = useState("Save Preferences");
  const [isSaving, setIsSaving] = useState(false);

  // Security password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passStatus, setPassStatus] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user || user.role !== "STUDENT") {
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
      <Navbar />

      <main className="student-settings-layout">
        {loading ? (
          <div className="student-settings-loader">
            <i className="fas fa-spinner fa-spin"></i> Loading settings...
          </div>
        ) : (
          <div className="profile-layout">
            {/* Header Card */}
            <div className="profile-header-card">
              <div className="profile-title">
                <h2><i className="fas fa-cog"></i> Account Settings</h2>
                <p>Manage your notification alerts and account credentials.</p>
              </div>
            </div>

            {/* Settings Tabs */}
            <div className="profile-tabs">
              <button 
                className={`tab-btn ${activeTab === "preferences-section" ? "active" : ""}`} 
                onClick={() => setActiveTab("preferences-section")}
              >
                App Preferences
              </button>
              <button 
                className={`tab-btn ${activeTab === "security-section" ? "active" : ""}`} 
                onClick={() => setActiveTab("security-section")}
              >
                Security & Password
              </button>
            </div>

            {/* App Preferences */}
            {activeTab === "preferences-section" && (
              <section id="preferences-section" className="tab-content active">
                <h3 className="prefer">Notification Settings</h3>

                <div className="settings-group">
                  <div className="settings-item">
                    <div className="settings-info">
                      <h4>Email Notifications</h4>
                      <p>Receive email alerts for direct messages, viewings confirmation, and listings activity.</p>
                    </div>
                    <label className="checkbox-toggle">
                      <input 
                        type="checkbox" 
                        checked={emailAlerts} 
                        onChange={(e) => setEmailAlerts(e.target.checked)} 
                      />
                      <span className="checkbox-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-item">
                    <div className="settings-info">
                      <h4>SMS Alerts</h4>
                      <p>Receive urgent updates via SMS for viewing appointment changes.</p>
                    </div>
                    <label className="checkbox-toggle">
                      <input 
                        type="checkbox" 
                        checked={smsAlerts} 
                        onChange={(e) => setSmsAlerts(e.target.checked)} 
                      />
                      <span className="checkbox-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-item">
                    <div className="settings-info">
                      <h4>Marketing & News</h4>
                      <p>Receive newsletter updates and housing guidelines from Campus Stay.</p>
                    </div>
                    <label className="checkbox-toggle">
                      <input 
                        type="checkbox" 
                        checked={marketingAlerts} 
                        onChange={(e) => setMarketingAlerts(e.target.checked)} 
                      />
                      <span className="checkbox-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <button 
                  className="primary-btn"
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                >
                  {saveStatus}
                </button>
              </section>
            )}

            {/* Security */}
            {activeTab === "security-section" && (
              <section id="security-section" className="tab-content active">
                <h3 className="h-header">Change Password</h3>
                <form onSubmit={handleUpdatePassword}>
                  <div className="input-group">
                    <label>Current Password</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label>New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  </div>

                  {passStatus && (
                    <p className={`status-message-text ${passStatus.startsWith("Error") ? "error" : "success"}`}>
                      {passStatus}
                    </p>
                  )}

                  <button type="submit" className="primary-btn" disabled={passLoading}>
                    {passLoading ? "Updating..." : "Update Password"}
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
