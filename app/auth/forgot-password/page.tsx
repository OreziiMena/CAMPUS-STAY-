"use client";
import React, { useState } from "react";
import Link from "next/link";
import "../signup.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Simple simulation: always succeed unless email is empty or invalid
      if (!email.includes("@")) {
        setError("Please enter a valid email address.");
      } else {
        setSuccess(true);
      }
    }, 1200);
  };

  return (
    <>
      <div className="auth-page">
        <Link href="/auth/login" className="back-link">
          <i className="fas fa-arrow-left"></i> Go back
        </Link>

        <div className="auth-container">
          <div className="auth-card auth-card-narrow">
            <div className="auth-header">
              <h2>Reset Your Password</h2>
              <p>Enter your email address and we will send you a secure link to reset your password.</p>
            </div>

            <form id="forgot-password-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="reset-email">Email Address</label>
                <input
                  type="email"
                  id="reset-email"
                  placeholder="student@fupre.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || success}
                  required
                />
                
                {error && (
                  <small className="error-text reset-status-error" id="reset-error">
                    {error}
                  </small>
                )}
                {success && (
                  <small className="success-text reset-status-success" id="reset-success">
                    Reset link sent! Please check your inbox.
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="auth-submit-btn auth-submit-btn-full auth-submit-btn-signup"
                id="submit-btn"
                disabled={isLoading || success}
              >
                {isLoading ? "Sending..." : success ? "Link Sent" : "Send Reset Link"}
              </button>
            </form>

            <div className="auth-footer-text auth-footer-margin">
              <p>
                Remembered your password? <Link href="/auth/login" className="auth-link">Back to Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
