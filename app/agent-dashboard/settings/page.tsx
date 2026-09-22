"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, updateAgentPassword } from "@/app/actions/auth";
import { getAgentBankDetails, resolveBankAccount, saveAgentBankDetails } from "@/app/actions/agent";
import { requestAgentBankUpdateVerification } from "@/app/actions/two-factor";
import { NIGERIAN_BANKS } from "@/lib/banks";
import styles from "./settings.module.css";
import "./styles.css";
import SearchableSelect from "@/components/SearchableSelect";
import TwoFactorSettingsModal from "@/components/TwoFactorSettingsModal";

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

  // Bank & Payout states
  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [recipientCode, setRecipientCode] = useState<string | null>(null);
  const [isResolvingBank, setIsResolvingBank] = useState(false);
  const [bankStatusMsg, setBankStatusMsg] = useState("");
  const [bankSaveLoading, setBankSaveLoading] = useState(false);

  // Bank Verification states
  const [showBankVerifyModal, setShowBankVerifyModal] = useState(false);
  const [bankVerifyMethod, setBankVerifyMethod] = useState<"TOTP" | "EMAIL_OTP">("EMAIL_OTP");
  const [bankVerifyMaskedEmail, setBankVerifyMaskedEmail] = useState("");
  const [bankVerifyCode, setBankVerifyCode] = useState("");
  const [bankVerifyError, setBankVerifyError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // 2FA Modal state
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [agentEmail, setAgentEmail] = useState("");

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user || user.role !== "AGENT") {
        router.push("/auth/login");
        return;
      }
      setAgentEmail(user.email || "");

      // Load bank details
      const bankRes = await getAgentBankDetails();
      if (bankRes.success && bankRes.bankDetails) {
        setBankCode(bankRes.bankDetails.bankCode || "");
        setBankName(bankRes.bankDetails.bankName || "");
        setAccountNumber(bankRes.bankDetails.accountNumber || "");
        setAccountName(bankRes.bankDetails.accountName || "");
        setRecipientCode(bankRes.bankDetails.recipientCode || null);
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

  const handleBankChange = (code: string) => {
    setBankCode(code);
    const selectedBank = NIGERIAN_BANKS.find((b) => b.code === code);
    setBankName(selectedBank ? selectedBank.name : "");
    if (accountNumber.trim().length === 10 && code) {
      triggerResolveBank(accountNumber.trim(), code);
    }
  };

  const handleAccountNumChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(cleaned);
    if (cleaned.length === 10 && bankCode) {
      triggerResolveBank(cleaned, bankCode);
    } else {
      setAccountName("");
      setBankStatusMsg("");
    }
  };

  const triggerResolveBank = async (accNum: string, bCode: string) => {
    setIsResolvingBank(true);
    setBankStatusMsg("");
    const res = await resolveBankAccount(accNum, bCode);
    if (res.success && res.accountName) {
      setAccountName(res.accountName);
      setBankStatusMsg(`Account verified: ${res.accountName}`);
    } else {
      setAccountName("");
      setBankStatusMsg(`Error: ${res.error || "Account resolution failed"}`);
    }
    setIsResolvingBank(false);
  };

  const handleInitiateBankSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankCode || !accountNumber || !accountName) {
      alert("Please ensure your bank is selected and account number is verified.");
      return;
    }
    setBankSaveLoading(true);
    setBankStatusMsg("");
    setBankVerifyError("");
    setBankVerifyCode("");

    const verifyInit = await requestAgentBankUpdateVerification();
    setBankSaveLoading(false);

    if (!verifyInit.success) {
      setBankStatusMsg(`Error: ${verifyInit.error || "Failed to initialize verification"}`);
      return;
    }

    setBankVerifyMethod(verifyInit.method || "EMAIL_OTP");
    if (verifyInit.maskedEmail) {
      setBankVerifyMaskedEmail(verifyInit.maskedEmail);
    }
    setShowBankVerifyModal(true);
    if (verifyInit.method === "EMAIL_OTP") {
      setResendCooldown(60);
    }
  };

  const handleResendBankOTP = async () => {
    if (resendCooldown > 0) return;
    setBankVerifyError("");
    const verifyInit = await requestAgentBankUpdateVerification();
    if (verifyInit.success) {
      setResendCooldown(60);
    } else {
      setBankVerifyError(verifyInit.error || "Failed to resend code.");
    }
  };

  const handleConfirmBankUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankVerifyCode.trim() || bankVerifyCode.trim().length !== 6) {
      setBankVerifyError("Please enter the complete 6-digit security code.");
      return;
    }

    setBankSaveLoading(true);
    setBankVerifyError("");

    const res = await saveAgentBankDetails({
      bankCode,
      bankName,
      accountNumber,
      accountName,
      securityCode: bankVerifyCode.trim(),
    });

    setBankSaveLoading(false);

    if (res.success) {
      setRecipientCode(res.recipientCode || null);
      setShowBankVerifyModal(false);
      setBankVerifyCode("");
      setBankStatusMsg("Payout bank details successfully verified and saved!");
      setTimeout(() => setBankStatusMsg(""), 5000);
    } else {
      setBankVerifyError(res.error || "Invalid security code. Please try again.");
    }
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
              className={`tab-btn ${activeTab === "bank-section" ? "active" : ""}`} 
              onClick={() => setActiveTab("bank-section")}
            >
              Bank & Payouts
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
                  <div className="region-select-wrapper">
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

          {activeTab === "bank-section" && (
            <section id="bank-section" className="tab-content active">
              <h3 className="prefer">Bank & Payout Details</h3>
              <p className="payout-desc-text">
                Add your verified Nigerian bank account to receive your 50% agent split (₦5,000) from confirmed student inspection tours.
              </p>

              {recipientCode && (
                <div className="payout-configured-box">
                  <i className="fas fa-check-circle payout-configured-icon"></i>
                  <div>
                    <div className="payout-configured-title">Payout Account Configured</div>
                    <div className="payout-configured-sub">
                      Bank: {bankName} &bull; Account: {accountNumber} ({accountName})
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleInitiateBankSave}>
                <div className="input-group payout-form-group">
                  <label>Select Nigerian Bank</label>
                  <div className="payout-select-wrapper">
                    <SearchableSelect
                      options={NIGERIAN_BANKS}
                      value={bankCode}
                      onChange={handleBankChange}
                      placeholder="Select Nigerian Bank..."
                    />
                  </div>
                </div>

                <div className="input-group payout-form-group">
                  <label>Account Number (10 digits NUBAN)</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={accountNumber}
                    onChange={(e) => handleAccountNumChange(e.target.value)}
                    placeholder="10-digit NUBAN account number"
                    required
                    className="payout-input"
                  />
                </div>

                {isResolvingBank && (
                  <div className="payout-verifying-notice">
                    <i className="fas fa-spinner fa-spin"></i> Verifying account with Paystack...
                  </div>
                )}

                {accountName && (
                  <div className="input-group payout-form-group">
                    <label>Verified Account Name</label>
                    <input
                      type="text"
                      value={accountName}
                      readOnly
                      className="payout-input-verified"
                    />
                  </div>
                )}

                {bankStatusMsg && (
                  <p className={`status-message-text ${bankStatusMsg.startsWith("Error") ? "error" : "success"} payout-status-msg`}>
                    {bankStatusMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="primary-btn payout-save-btn"
                  disabled={bankSaveLoading || isResolvingBank || !accountName}
                >
                  {bankSaveLoading ? "Saving Details..." : "Save Bank & Payout Details"}
                </button>
              </form>
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
                    <p>Receive tips, feature updates, and Campus Tent news.</p>
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
              {/* Two-Factor Authentication Security Card */}
              <div className="security-2fa-card">
                <div className="security-2fa-left">
                  <div className="security-2fa-icon-box">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div>
                    <h4 className="security-2fa-title">
                      Two-Factor Authentication (2FA)
                    </h4>
                    <p className="security-2fa-sub">
                      Protect your agent account and payout bank details using Google Authenticator or SMS/Email OTP.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShow2FAModal(true)}
                  className="security-2fa-btn"
                >
                  <i className="fas fa-key"></i> Manage 2FA
                </button>
              </div>

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
                    ></i>
                  </div>
                </div>

                {passStatus && (
                  <p className={`status-message-text ${passStatus.startsWith("Error") ? "error" : "success"} pass-status-msg`}>
                    {passStatus}
                  </p>
                )}

                <button type="submit" className="primary-btn pass-submit-btn" disabled={passLoading}>
                  {passLoading ? "Updating..." : "Update Password"}
                </button>
              </form>

              {/* 2FA Settings Modal */}
              <TwoFactorSettingsModal
                isOpen={show2FAModal}
                onClose={() => setShow2FAModal(false)}
                userEmail={agentEmail}
                userRole="AGENT"
              />
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

      {/* Multi-Factor Verification Modal for Bank Account Update */}
      {showBankVerifyModal && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
            fontFamily: "'Poppins', system-ui, sans-serif",
          }} 
          onClick={() => !bankSaveLoading && setShowBankVerifyModal(false)}
        >
          <div 
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              maxWidth: "460px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              style={{
                backgroundColor: "#02351c",
                color: "#ffffff",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="fas fa-shield-alt" style={{ fontSize: "1.2rem", color: "#34d399" }}></i>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Security Verification</h3>
                  <span style={{ fontSize: "0.75rem", color: "#a7f3d0" }}>Authorize Payout Account Change</span>
                </div>
              </div>
              <button
                onClick={() => !bankSaveLoading && setShowBankVerifyModal(false)}
                style={{ background: "none", border: "none", color: "#e2e8f0", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: "20px" }}>
              <div 
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "4px" }}>
                  New Payout Target:
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>
                  {bankName} &bull; {accountNumber}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#059669", fontWeight: 600 }}>
                  {accountName}
                </div>
              </div>

              <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                {bankVerifyMethod === "TOTP" ? (
                  <>
                    Open your <strong>Authenticator App</strong> (e.g. Google Authenticator) and enter your active 6-digit code to authorize this change.
                  </>
                ) : (
                  <>
                    A 6-digit one-time security code was dispatched to <strong>{bankVerifyMaskedEmail}</strong>. Enter it below to confirm this change.
                  </>
                )}
              </p>

              {bankVerifyError && (
                <div 
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#991b1b",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    fontSize: "0.82rem",
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{bankVerifyError}</span>
                </div>
              )}

              <form onSubmit={handleConfirmBankUpdate}>
                <div style={{ marginBottom: "16px" }}>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={bankVerifyCode}
                    onChange={(e) => setBankVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      textAlign: "center",
                      letterSpacing: "8px",
                      fontFamily: "monospace",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      border: "2px solid #cbd5e1",
                      borderRadius: "8px",
                      outline: "none",
                      color: "#0f172a",
                      boxSizing: "border-box",
                    }}
                    autoFocus
                    required
                  />
                </div>

                {bankVerifyMethod === "EMAIL_OTP" && (
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <button
                      type="button"
                      onClick={handleResendBankOTP}
                      disabled={resendCooldown > 0 || bankSaveLoading}
                      style={{
                        background: "none",
                        border: "none",
                        color: resendCooldown > 0 ? "#94a3b8" : "#059669",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: resendCooldown > 0 ? "default" : "pointer",
                      }}
                    >
                      {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Security Code"}
                    </button>
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setShowBankVerifyModal(false)}
                    disabled={bankSaveLoading}
                    style={{
                      padding: "9px 16px",
                      border: "1px solid #cbd5e1",
                      background: "white",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      color: "#475569",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bankSaveLoading || bankVerifyCode.trim().length !== 6}
                    style={{
                      backgroundColor: "#02351c",
                      color: "white",
                      border: "none",
                      padding: "9px 20px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: bankSaveLoading || bankVerifyCode.trim().length !== 6 ? "not-allowed" : "pointer",
                      opacity: bankSaveLoading || bankVerifyCode.trim().length !== 6 ? 0.7 : 1,
                    }}
                  >
                    {bankSaveLoading ? "Verifying..." : "Verify & Save Details"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
