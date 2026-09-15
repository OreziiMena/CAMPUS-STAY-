"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/actions/auth";
import { verify2FALogin, send2FAEmailOTP } from "@/app/actions/two-factor";
import "../signup.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2FA State
  const [require2FA, setRequire2FA] = useState(false);
  const [twoFactorTempToken, setTwoFactorTempToken] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isBackupCodeMode, setIsBackupCodeMode] = useState(false);
  const [isEmailOtpMode, setIsEmailOtpMode] = useState(false);
  const [userRole, setUserRole] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUser({ email, password });
      setIsLoading(false);

      if (res.success) {
        if (res.role === "ADMIN") {
          router.push("/admin-dashboard");
        } else if (res.role === "AGENT") {
          router.push("/agent-dashboard");
        } else {
          router.push("/explore");
        }
      } else if (res.require2FA) {
        setRequire2FA(true);
        setTwoFactorTempToken(res.tempToken || "");
        setUserRole(res.role || "");
        setSuccessMsg("Please enter the 6-digit code from your authenticator app.");
      } else if (res.requireVerification) {
        router.push(`/auth/verify-email?email=${encodeURIComponent(res.email || email)}`);
      } else {
        setError(res.error || "Invalid email or password.");
      }
    } catch {
      setIsLoading(false);
      setError("An unexpected error occurred during login.");
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!twoFactorCode.trim()) {
      setError(isBackupCodeMode ? "Please enter your backup recovery code." : "Please enter the 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verify2FALogin({
        tempToken: twoFactorTempToken,
        code: twoFactorCode.trim(),
        isBackupCode: isBackupCodeMode,
        isEmailOtp: isEmailOtpMode,
      });
      setIsLoading(false);

      if (res.success) {
        const destRole = res.role || userRole;
        if (destRole === "ADMIN") {
          router.push("/admin-dashboard");
        } else if (destRole === "AGENT") {
          router.push("/agent-dashboard");
        } else {
          router.push("/explore");
        }
      } else {
        setError(res.error || "Invalid verification code.");
      }
    } catch {
      setIsLoading(false);
      setError("Failed to verify code. Please try again.");
    }
  };

  const handleSendEmailOTP = async () => {
    setError("");
    setSuccessMsg("");
    setIsLoading(true);
    try {
      const res = await send2FAEmailOTP(twoFactorTempToken);
      setIsLoading(false);
      if (res.success) {
        setIsEmailOtpMode(true);
        setIsBackupCodeMode(false);
        setSuccessMsg(res.message || "A 6-digit code has been sent to your email.");
      } else {
        setError(res.error || "Failed to send backup email code.");
      }
    } catch {
      setIsLoading(false);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="auth-page">
        <Link href="/" className="back-link">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>

        <section className="auth-container">
          <div className="auth-card auth-card-narrow">
            {!require2FA ? (
              <>
                <div className="auth-header">
                  <h2>Welcome Back</h2>
                  <p>Log in to your Campus Tent account.</p>
                </div>

                <form id="login-form" className="auth-form" onSubmit={handleSubmit}>
                  {error && (
                    <small className="error-text login-error-msg" id="login-error">
                      {error}
                    </small>
                  )}

                  <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <div className="password-label-row">
                      <label htmlFor="password">Password</label>
                    </div>
                    <div className="password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <span
                        className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>

                    <div className="rf-flex">
                      <div className="checkbox-group checkbox-group-no-margin">
                        <input type="checkbox" id="remember-me" disabled={isLoading} />
                        <label htmlFor="remember-me">Remember me</label>
                      </div>
                      <div className="forgot-password-container">
                        <Link href="/auth/forgot-password" className="forgot-password-link">
                          Forgot Password?
                        </Link>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn submit-btn-login-adjust" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log In"}
                  </button>

                  <p className="auth-footer-text">
                    Don't have an account? <Link href="/auth/rolepick">Sign up</Link>
                  </p>
                </form>
              </>
            ) : (
              /* Two-Factor Authentication Verification Step */
              <>
                <div className="auth-header">
                  <div className="two-factor-icon-badge">
                    <i className={isBackupCodeMode ? "fas fa-key" : isEmailOtpMode ? "fas fa-envelope-open-text" : "fas fa-shield-alt"}></i>
                  </div>
                  <h2>Two-Factor Security</h2>
                  <p className="two-factor-desc">
                    {isBackupCodeMode
                      ? "Enter one of your 8-character recovery backup codes."
                      : isEmailOtpMode
                      ? "Enter the 6-digit security code sent to your email."
                      : "Enter the 6-digit verification code from your Authenticator app."}
                  </p>
                </div>

                <form className="auth-form" onSubmit={handle2FASubmit}>
                  {error && (
                    <small className="error-text login-error-msg">
                      {error}
                    </small>
                  )}
                  {successMsg && (
                    <div className="verify-alert-success">
                      {successMsg}
                    </div>
                  )}

                  <div className="input-group">
                    <label htmlFor="2fa-code">
                      {isBackupCodeMode ? "Recovery Backup Code" : "6-Digit Security Code"}
                    </label>
                    <input
                      type="text"
                      id="2fa-code"
                      placeholder={isBackupCodeMode ? "XXXXXXXX" : "000000"}
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      disabled={isLoading}
                      autoFocus
                      maxLength={isBackupCodeMode ? 12 : 6}
                      className={`two-factor-code-input ${isBackupCodeMode ? "backup-mode" : ""}`}
                      required
                    />
                  </div>

                  <button type="submit" className="auth-submit-btn submit-btn-login-adjust" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </button>

                  {/* Fallback Options */}
                  <div className="two-factor-fallback-box">
                    {!isEmailOtpMode && (
                      <button
                        type="button"
                        onClick={handleSendEmailOTP}
                        disabled={isLoading}
                        className="two-factor-link-primary"
                      >
                        <i className="far fa-envelope"></i> Send code to my email instead
                      </button>
                    )}

                    {!isBackupCodeMode ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsBackupCodeMode(true);
                          setIsEmailOtpMode(false);
                          setTwoFactorCode("");
                          setError("");
                        }}
                        disabled={isLoading}
                        className="two-factor-link-secondary"
                      >
                        Use a recovery backup code
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsBackupCodeMode(false);
                          setIsEmailOtpMode(false);
                          setTwoFactorCode("");
                          setError("");
                        }}
                        disabled={isLoading}
                        className="two-factor-link-primary"
                      >
                        Use Authenticator App (TOTP)
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setRequire2FA(false);
                        setTwoFactorTempToken("");
                        setTwoFactorCode("");
                        setError("");
                        setSuccessMsg("");
                      }}
                      disabled={isLoading}
                      className="two-factor-link-back"
                    >
                      &larr; Back to login
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

