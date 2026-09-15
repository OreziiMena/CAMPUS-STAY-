"use client";

import React, { useState, useEffect } from "react";
import { get2FAStatus, setup2FA, confirm2FA, disable2FA } from "@/app/actions/two-factor";
import styles from "./TwoFactorSettingsModal.module.css";

interface TwoFactorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userRole?: string;
}

export default function TwoFactorSettingsModal({
  isOpen,
  onClose,
  userEmail,
  userRole,
}: TwoFactorSettingsModalProps) {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);

  // Setup state
  const [step, setStep] = useState<"STATUS" | "SETUP_QR" | "BACKUP_CODES" | "DISABLE">("STATUS");
  const [secret, setSecret] = useState("");
  const [otpauthUri, setOtpauthUri] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchStatus = async () => {
    setLoading(true);
    setError("");
    const res = await get2FAStatus();
    if (res.success) {
      setIsEnabled(!!res.enabled);
      setConfirmedAt(res.confirmedAt ? new Date(res.confirmedAt).toLocaleDateString() : null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      setStep("STATUS");
      setError("");
      setSuccessMsg("");
      fetchStatus();
    }
  }, [isOpen]);

  const handleStartSetup = async () => {
    setActionLoading(true);
    setError("");
    try {
      const res = await setup2FA();
      if (res.success && res.secret) {
        setSecret(res.secret);
        setOtpauthUri(res.otpauthUri || "");
        setBackupCodes(res.backupCodes || []);
        setVerificationCode("");
        setStep("SETUP_QR");
      } else {
        setError(res.error || "Failed to start 2FA setup.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim() || verificationCode.trim().length !== 6) {
      setError("Please enter the 6-digit code from your authenticator app.");
      return;
    }

    setActionLoading(true);
    setError("");
    try {
      const res = await confirm2FA({
        secret,
        code: verificationCode.trim(),
        backupCodes,
      });

      if (res.success) {
        setIsEnabled(true);
        setStep("BACKUP_CODES");
      } else {
        setError(res.error || "Invalid verification code. Please check your authenticator clock.");
      }
    } catch {
      setError("Failed to verify 2FA code.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disableCode.trim()) {
      setError("Please enter your 6-digit code to confirm disabling 2FA.");
      return;
    }

    setActionLoading(true);
    setError("");
    try {
      const res = await disable2FA({ code: disableCode.trim() });
      if (res.success) {
        setIsEnabled(false);
        setStep("STATUS");
        setDisableCode("");
        setSuccessMsg("Two-Factor Authentication has been successfully disabled.");
      } else {
        setError(res.error || "Failed to disable 2FA. Code is invalid.");
      }
    } catch {
      setError("Failed to disable 2FA.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopiedBackupCodes(true);
    setTimeout(() => setCopiedBackupCodes(false), 2000);
  };

  if (!isOpen) return null;

  // Generate simple QR code URL using standard public QR API or fallback
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(otpauthUri)}`;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <i className={`fas fa-shield-alt ${styles.headerIcon}`}></i>
            <div>
              <h3 className={styles.headerTitle}>Two-Factor Security (2FA)</h3>
              <span className={styles.headerSub}>
                {userRole === "ADMIN" ? "Admin Access Protection" : "Agent Financial & Account Security"}
              </span>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            &times;
          </button>
        </div>

        {/* Content Body */}
        <div className={styles.body}>
          {error && (
            <div className={styles.alertError}>
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className={styles.alertSuccess}>
              <i className="fas fa-check-circle"></i>
              <span>{successMsg}</span>
            </div>
          )}

          {loading ? (
            <div className={styles.loaderWrap}>
              <i className={`fas fa-spinner fa-spin ${styles.loaderIcon}`}></i>
              <p className={styles.loaderText}>Checking 2FA security status...</p>
            </div>
          ) : step === "STATUS" ? (
            /* Current Status Overview */
            <div>
              <div className={`${styles.statusCard} ${isEnabled ? styles.statusCardActive : styles.statusCardInactive}`}>
                <i className={`${isEnabled ? `fas fa-shield-check ${styles.statusCardIconActive}` : `fas fa-shield-exclamation ${styles.statusCardIconInactive}`}`}></i>
                <div>
                  <div className={isEnabled ? styles.statusHeadingActive : styles.statusHeadingInactive}>
                    {isEnabled ? "2FA Protection Active" : "2FA Protection Disabled"}
                  </div>
                  <p className={isEnabled ? styles.statusDescActive : styles.statusDescInactive}>
                    {isEnabled
                      ? `Your account requires a 6-digit TOTP security code upon every login and payout/bank account change.${confirmedAt ? ` Enabled on ${confirmedAt}.` : ""}`
                      : "We strongly recommend enabling Two-Factor Authentication to protect your account against unauthorized access and credential leaks."}
                  </p>
                </div>
              </div>

              <div className={styles.appSupportBox}>
                <p className={styles.appSupportTitle}>
                  <strong>Supported Authenticator Apps:</strong>
                </p>
                <ul className={styles.appSupportList}>
                  <li>Google Authenticator (iOS & Android)</li>
                  <li>Microsoft Authenticator / Apple Passwords</li>
                  <li>Twilio Authy / 1Password / Bitwarden</li>
                </ul>
              </div>

              <div className={styles.actionRow}>
                {!isEnabled ? (
                  <button
                    type="button"
                    onClick={handleStartSetup}
                    disabled={actionLoading}
                    className={styles.btnPrimary}
                  >
                    {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-qrcode"></i>}
                    Enable 2FA Protection
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep("DISABLE")}
                    className={styles.btnDisable}
                  >
                    Disable 2FA
                  </button>
                )}
              </div>
            </div>
          ) : step === "SETUP_QR" ? (
            /* Setup Step 1: Scan QR Code */
            <div>
              <div className={styles.qrHeader}>
                <h4 className={styles.qrTitle}>Scan Authenticator QR Code</h4>
                <p className={styles.qrDesc}>
                  Open your Authenticator app, tap <strong>Add Account</strong> &rarr; <strong>Scan QR code</strong>.
                </p>
              </div>

              {/* QR Code container */}
              <div className={styles.qrImageWrap}>
                <div className={styles.qrBox}>
                  <img src={qrCodeUrl} alt="2FA QR Code" width={170} height={170} className={styles.qrImg} />
                </div>
              </div>

              {/* Manual Secret Key */}
              <div className={styles.secretBox}>
                <div className={styles.secretLabel}>
                  CAN'T SCAN? ENTER KEY MANUALLY:
                </div>
                <div className={styles.secretFlex}>
                  <code className={styles.secretCode}>
                    {secret}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className={styles.copySecretBtn}
                  >
                    {copiedSecret ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Confirmation Form */}
              <form onSubmit={handleConfirmSetup}>
                <div className={styles.inputGroup}>
                  <label htmlFor="modal-verify-code" className={styles.inputLabel}>
                    Enter 6-digit Code from Authenticator:
                  </label>
                  <input
                    type="text"
                    id="modal-verify-code"
                    maxLength={6}
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className={styles.codeInput}
                    autoFocus
                    required
                  />
                </div>

                <div className={styles.actionRow}>
                  <button
                    type="button"
                    onClick={() => setStep("STATUS")}
                    className={styles.btnCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className={styles.btnPrimary}
                  >
                    {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                    Verify & Activate
                  </button>
                </div>
              </form>
            </div>
          ) : step === "BACKUP_CODES" ? (
            /* Setup Step 2: Save Recovery Backup Codes */
            <div>
              <div className={styles.backupHeader}>
                <div className={styles.backupCheckCircle}>
                  <i className="fas fa-check"></i>
                </div>
                <h4 className={styles.backupTitle}>
                  2FA Activated! Save Backup Codes
                </h4>
                <p className={styles.backupDesc}>
                  If you lose access to your phone or authenticator app, these 8 single-use codes are the only way to recover access.
                </p>
              </div>

              {/* Codes Grid */}
              <div className={styles.backupCodesGrid}>
                {backupCodes.map((c, i) => (
                  <div key={i}>
                    <span className={styles.backupCodeIndex}>{i + 1}.</span>
                    {c}
                  </div>
                ))}
              </div>

              <div className={styles.actionRow}>
                <button
                  type="button"
                  onClick={handleCopyBackupCodes}
                  className={styles.copyAllBtn}
                >
                  <i className="far fa-copy"></i> {copiedBackupCodes ? "Copied All!" : "Copy All Codes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("STATUS");
                    setSuccessMsg("Two-Factor Authentication is now active!");
                  }}
                  className={styles.btnPrimary}
                >
                  I've Saved My Codes
                </button>
              </div>
            </div>
          ) : (
            /* Disable 2FA Prompt */
            <div>
              <h4 className={styles.disableTitle}>
                Confirm Disabling 2FA
              </h4>
              <p className={styles.disableDesc}>
                To disable Two-Factor Authentication, please enter the current 6-digit code from your authenticator app.
              </p>

              <form onSubmit={handleDisable2FA}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={disableCode}
                    onChange={(e) => setDisableCode(e.target.value)}
                    className={styles.codeInput}
                    autoFocus
                    required
                  />
                </div>

                <div className={styles.actionRow}>
                  <button
                    type="button"
                    onClick={() => setStep("STATUS")}
                    className={styles.btnCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className={styles.btnConfirmDisable}
                  >
                    {actionLoading ? "Disabling..." : "Confirm Disable"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
