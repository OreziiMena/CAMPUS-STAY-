"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordWithToken } from "@/app/actions/auth";
import "../signup.css";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!email || !token) {
      setError("Invalid reset request. Please request a new link.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await resetPasswordWithToken(email, token, newPassword);
      setIsLoading(false);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(res.error || "Failed to update password.");
      }
    } catch {
      setIsLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="auth-page">
        <Link href="/auth/login" className="back-link">
          <i className="fas fa-arrow-left"></i> Back to Login
        </Link>

        <div className="auth-container">
          <div className="auth-card auth-card-narrow">
            <div className="auth-header">
               <h2>Set New Password</h2>
               <p>Your new password must be different from previous used passwords.</p>
            </div>

            {success ? (
              <div className="auth-success-container">
                <i className="fas fa-check-circle auth-success-icon"></i>
                <h3 className="auth-success-title">Password Updated!</h3>
                <p className="auth-success-text">Redirecting you to login...</p>
              </div>
            ) : (
              <form id="new-password-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="new-password">New Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <i 
                      className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`} 
                      id="toggle-password-icon" 
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                  <small className="helper-text password-reqs-style" id="password-reqs">
                    Must be at least 8 characters.
                  </small>
                </div>

                <div className="input-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <i 
                      className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`} 
                      id="toggle-confirm-password-icon" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    ></i>
                  </div>
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <small className="error-text validation-error" id="match-error">
                      Passwords do not match.
                    </small>
                  )}
                </div>

                {error && (
                  <small className="error-text terms-error-msg">
                    {error}
                  </small>
                )}

                <button
                  type="submit"
                  className="auth-submit-btn auth-submit-btn-full auth-submit-btn-signup"
                  id="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card auth-card-narrow" style={{ textAlign: "center", padding: "40px" }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "rgb(2, 53, 28)" }}></i>
            <p style={{ marginTop: "15px" }}>Loading password reset...</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
