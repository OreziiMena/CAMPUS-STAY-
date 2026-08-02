"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOTP, generateOTP } from "@/app/actions/otp";
import { verifyPasswordResetOTP } from "@/app/actions/auth";
import "../signup.css";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const purpose = (searchParams.get("purpose") as "EMAIL_VERIFICATION" | "PASSWORD_RESET") || "EMAIL_VERIFICATION";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isDebugMsg, setIsDebugMsg] = useState(false);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  // Countdown timer for Resend button
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Handle OTP digit changes
  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.replace(/[^0-9]/g, ""); // Keep only numbers
    if (!val) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1); // Only take last digit
    setOtp(newOtp);

    // Auto-focus next input box
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspaces for delete focus shifting
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index] === "") {
        // Shifting focus back if current is empty
        if (index > 0 && inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
          newOtp[index - 1] = "";
        }
      } else {
        newOtp[index] = "";
      }
      setOtp(newOtp);
    }
  };

  // Paste handler
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").replace(/[^0-9]/g, "").substring(0, 6);
    if (data.length === 6) {
      const pasteOtp = data.split("");
      setOtp(pasteOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const enteredCode = otp.join("");
    if (enteredCode.length < 6) {
      setError("Please enter the full 6-digit verification code.");
      return;
    }

    if (!email) {
      setError("Email address is missing.");
      return;
    }

    setIsLoading(true);

    try {
      if (purpose === "PASSWORD_RESET") {
        const res = await verifyPasswordResetOTP(email, enteredCode);
        setIsLoading(false);

        if (res.success && res.token) {
          setSuccess("Code verified! Redirecting to password reset page...");
          setTimeout(() => {
            router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&token=${res.token}`);
          }, 1500);
        } else {
          setError(res.error || "Failed to verify code.");
        }
      } else {
        const res = await verifyOTP(email, enteredCode, "EMAIL_VERIFICATION");
        setIsLoading(false);

        if (res.success) {
          setSuccess("Email verified successfully! Logging you in...");
          setTimeout(() => {
            if (res.role === "ADMIN") {
              router.push("/admin-dashboard");
            } else if (res.role === "AGENT") {
              router.push("/agent-dashboard");
            } else {
              router.push("/explore");
            }
          }, 1500);
        } else {
          setError(res.error || "Failed to verify verification code.");
        }
      }
    } catch {
      setIsLoading(false);
      setError("An unexpected error occurred.");
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await generateOTP(email, purpose);
      setIsLoading(false);

      if (res.success) {
        setSuccess("A new verification code has been sent to your email!");
        setResendCountdown(60);
        setOtp(new Array(6).fill(""));
        inputRefs.current[0]?.focus();
        if (res.debug) {
          setIsDebugMsg(true);
        }
      } else {
        setError(res.error || "Failed to resend verification code.");
      }
    } catch {
      setIsLoading(false);
      setError("Failed to resend verification code.");
    }
  };

  return (
    <div className="auth-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif" }}>
      <Link href="/auth/login" className="back-link">
        <i className="fas fa-arrow-left"></i> Back to Login
      </Link>

      <section className="auth-container" style={{ width: "100%", maxWidth: "450px" }}>
        <div className="auth-card" style={{ padding: "40px 30px", borderRadius: "20px", boxShadow: "0 10px 35px rgba(0,0,0,0.06)", border: "1px solid #eaeaea", background: "white" }}>
          <div className="auth-header" style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "rgb(2, 53, 28)", margin: "0 0 10px 0" }}>Verify Email</h2>
            <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>
              We sent a 6-digit OTP verification code to <br />
              <strong style={{ color: "#333" }}>{email || "your registered email"}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div style={{ backgroundColor: "#fde8e8", border: "1px solid #f8b4b4", color: "#9b1c1c", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            )}

            {success && (
              <div style={{ backgroundColor: "#e6f4ea", border: "1px solid #c4eed0", color: "#137333", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="fas fa-check-circle"></i> {success}
              </div>
            )}

            {isDebugMsg && (
              <div style={{ backgroundColor: "#e8f0fe", border: "1px solid #d2e3fc", color: "#1967d2", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.8rem" }}>
                <i className="fas fa-info-circle"></i> <strong>Developer Notice:</strong> Since no `RESEND_API_KEY` env variable is set, the code has been written to the server CLI console logs!
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", margin: "24px 0" }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  style={{
                    width: "48px",
                    height: "56px",
                    borderRadius: "10px",
                    border: "1.5px solid #ddd",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    backgroundColor: "#fafafa",
                    outline: "none",
                    transition: "all 0.2s",
                    color: "rgb(2, 53, 28)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgb(2, 53, 28)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(2, 53, 28, 0.1)";
                    e.target.style.backgroundColor = "white";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ddd";
                    e.target.style.boxShadow = "none";
                    e.target.style.backgroundColor = "#fafafa";
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "rgb(2, 53, 28)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isLoading ? (
                <><i className="fas fa-spinner fa-spin"></i> Verifying...</>
              ) : (
                "Verify Code"
              )}
            </button>

            <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.85rem", color: "#666" }}>
              Didn't receive the email?{" "}
              {resendCountdown > 0 ? (
                <span style={{ color: "#999" }}>Resend code in {resendCountdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgb(2, 53, 28)",
                    fontWeight: "700",
                    cursor: "pointer",
                    padding: 0,
                    textDecoration: "underline",
                    fontFamily: "inherit",
                  }}
                >
                  Resend Code
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="auth-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ color: "rgb(2, 53, 28)", fontSize: "1.2rem", fontWeight: "600" }}>
          <i className="fas fa-spinner fa-spin"></i> Loading...
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
