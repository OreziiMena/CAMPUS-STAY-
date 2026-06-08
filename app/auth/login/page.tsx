"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/actions/auth";
import "../signup.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUser({ email, password });
      setIsLoading(false);

      if (res.success) {
        if (res.role === "AGENT" || res.role === "ADMIN") {
          router.push("/agent-dashboard");
        } else {
          router.push("/explore");
        }
      } else {
        setError(res.error || "Invalid email or password.");
      }
    } catch {
      setIsLoading(false);
      setError("An unexpected error occurred during login.");
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
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Log in to your Campus Stay account.</p>
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
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
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
          </div>
        </section>
      </div>
    </>
  );
}
