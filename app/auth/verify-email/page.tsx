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
    <div className="auth-page">
      <Link href="/auth/login" className="back-link">
        <i className="fas fa-arrow-left"></i> Back to Login
      </Link>

      <section className="auth-container auth-container-narrow">
        <div className="auth-card auth-card-verify">
          <div className="auth-header">
            <h2>Verify Email</h2>
            <p>
              We sent a 6-digit OTP verification code to <br />
              <strong>{email || "your registered email"}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="verify-alert-error">
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            )}

            {success && (
              <div className="verify-alert-success">
                <i className="fas fa-check-circle"></i> {success}
              </div>
            )}

            {isDebugMsg && (
              <div className="verify-alert-debug">
                <i className="fas fa-info-circle"></i> <strong>Developer Notice:</strong> Since no `RESEND_API_KEY` env variable is set, the code has been written to the server CLI console logs!
              </div>
            )}

            <div className="otp-grid">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="otp-input"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="verify-btn"
            >
              {isLoading ? (
                <><i className="fas fa-spinner fa-spin"></i> Verifying...</>
              ) : (
                "Verify Code"
              )}
            </button>

            <div className="verify-footer">
              Didn't receive the email?{" "}
              {resendCountdown > 0 ? (
                <span className="countdown-text">Resend code in {resendCountdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="resend-btn"
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
      <div className="auth-page">
        <div className="loading-fallback-container">
          <i className="fas fa-spinner fa-spin"></i> Loading...
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
