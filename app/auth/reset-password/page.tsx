"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../signup.css";

export default function ResetPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    }, 1500);
  };

  return (
    <>
      <div className="auth-page">
        <Link href="/auth/rolepick" className="back-link">
          <i className="fas fa-arrow-left"></i> Go back
        </Link>

        <div className="auth-container">
          <div className="auth-card" style={{ maxWidth: "450px", margin: "0 auto" }}>
            <div className="auth-header">
              <h2>Set New Password</h2>
              <p>Your new password must be different from previous used passwords.</p>
            </div>

            {success ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <i className="fas fa-check-circle" style={{ fontSize: "60px", color: "#28a745", marginBottom: "20px" }}></i>
                <h3 style={{ fontFamily: "Poppins", marginBottom: "10px" }}>Password Updated!</h3>
                <p style={{ color: "#666" }}>Redirecting you to login...</p>
              </div>
            ) : (
              <form id="new-password-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="new-password">New Password</label>
                  <div className="password-wrapper" style={{ position: "relative" }}>
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
                      style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#666" }}
                    ></i>
                  </div>
                  <small className="helper-text" id="password-reqs" style={{ fontSize: "12px", color: "#666", marginTop: "5px", display: "block" }}>
                    Must be at least 8 characters.
                  </small>
                </div>

                <div className="input-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="password-wrapper" style={{ position: "relative" }}>
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
                      style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#666" }}
                    ></i>
                  </div>
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <small className="error-text" id="match-error" style={{ display: "block", color: "#dc3545", marginTop: "5px" }}>
                      Passwords do not match.
                    </small>
                  )}
                </div>

                {error && (
                  <small className="error-text" style={{ display: "block", color: "#dc3545", marginTop: "15px", fontWeight: "600" }}>
                    {error}
                  </small>
                )}

                <button
                  type="submit"
                  className="auth-submit-btn"
                  id="submit-btn"
                  disabled={isLoading}
                  style={{ width: "100%", marginTop: "20px" }}
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
