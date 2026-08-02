"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "@/app/actions/auth";
import "../signup.css";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await requestPasswordReset(email);
      setIsLoading(false);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}&purpose=PASSWORD_RESET`);
        }, 1500);
      } else {
        setError(res.error || "Failed to process request.");
      }
    } catch {
      setIsLoading(false);
      setError("An unexpected error occurred.");
    }
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
              <p>Enter your email address and we will send you an OTP to reset your password.</p>
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
