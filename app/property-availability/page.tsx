"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  respondPropertyAvailability,
  getAvailabilityQueryInfo,
  resendAvailabilityEmail,
} from "@/app/actions/inspection";
import "./property-availability.css";

interface QueryInfo {
  id: string;
  status: string;
  respondedAt: string | null;
  isExpired: boolean;
  propertyTitle: string;
  propertyId: string;
  propertyLocation?: string;
  propertyPrice?: number;
  studentName: string;
  studentEmail?: string;
  agentName?: string;
}

function PropertyAvailabilityContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const responseType = searchParams.get("response") as "available" | "unavailable" | null;

  const [loading, setLoading] = useState(true);
  const [queryInfo, setQueryInfo] = useState<QueryInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const [result, setResult] = useState<{
    success: boolean;
    status?: string;
    propertyTitle?: string;
    propertyId?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    async function init() {
      if (!token) {
        setResult({
          success: false,
          error: "Missing confirmation token. Please open the exact link provided in your email.",
        });
        setLoading(false);
        return;
      }

      // If responseType is present in the URL, automatically submit it (one-click from email)
      if (responseType) {
        const res = await respondPropertyAvailability(token, responseType);
        setResult(res);
        setLoading(false);
        return;
      }

      // If no responseType in the URL (e.g. user pasted database token or opened link):
      // Fetch details so user can click to confirm or resend
      const infoRes = await getAvailabilityQueryInfo(token);
      if (!infoRes.success || !infoRes.query) {
        setResult({
          success: false,
          error: infoRes.error || "Invalid or expired confirmation link.",
        });
      } else {
        setQueryInfo(infoRes.query as QueryInfo);
      }
      setLoading(false);
    }

    init();
  }, [token, responseType]);

  const handleManualResponse = async (choice: "available" | "unavailable") => {
    if (!token) return;
    setSubmitting(true);
    const res = await respondPropertyAvailability(token, choice);
    setResult(res);
    setSubmitting(false);
  };

  const handleResendEmail = async () => {
    if (!token) return;
    setResending(true);
    setResendStatus(null);
    const res = await resendAvailabilityEmail(token);
    if (res.success) {
      setResendStatus({ success: true, message: res.message || "Notification email sent successfully!" });
    } else {
      setResendStatus({ success: false, message: res.error || "Failed to resend email." });
    }
    setResending(false);
  };

  return (
    <>
      <Navbar />
      <main className="prop-avail-main">
        <div className="prop-avail-card">
          {loading || submitting ? (
            <div>
              <i className="fas fa-spinner fa-spin prop-avail-spinner"></i>
              <h2 className="prop-avail-loading-title">
                {submitting ? "Submitting Response..." : "Checking Availability Status..."}
              </h2>
              <p className="prop-avail-loading-text">
                Recording response and notifying student in real-time.
              </p>
            </div>
          ) : result ? (
            result.success ? (
              <div>
                <div className={`prop-avail-icon-badge ${result.status === "AVAILABLE" ? "available" : "unavailable"}`}>
                  <i className={result.status === "AVAILABLE" ? "fas fa-check-circle" : "fas fa-times-circle"}></i>
                </div>

                <h2 className="prop-avail-title">
                  {result.status === "AVAILABLE" ? "Property Marked as Available!" : "Property Marked as Unavailable"}
                </h2>

                <p className="prop-avail-desc">
                  {result.status === "AVAILABLE" ? (
                    <>
                      Thank you! We've dispatched an email notification to the student confirming that <strong>"{result.propertyTitle}"</strong> is available. They can now pay the ₦7,500 inspection fee and book a physical tour.
                    </>
                  ) : (
                    <>
                      We've notified the student that <strong>"{result.propertyTitle}"</strong> is currently unavailable or occupied so they can browse alternatives.
                    </>
                  )}
                </p>

                <div className="prop-avail-actions">
                  <Link href="/agent-dashboard" className="prop-avail-btn-primary">
                    <i className="fas fa-th-large"></i> Go to Dashboard
                  </Link>
                  {result.propertyId && (
                    <Link href={`/apartment-details?id=${result.propertyId}`} className="prop-avail-btn-secondary">
                      View Listing
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="prop-avail-icon-badge error">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>

                <h2 className="prop-avail-error-title">Unable to Process</h2>

                <p className="prop-avail-desc">
                  {result.error || "This link may have already been used or is invalid."}
                </p>

                <div className="prop-avail-actions">
                  <Link href="/agent-dashboard" className="prop-avail-btn-primary">
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            )
          ) : queryInfo ? (
            <div>
              {queryInfo.status !== "PENDING" ? (
                <div>
                  <div className={`prop-avail-icon-badge ${queryInfo.status === "AVAILABLE" ? "available" : "unavailable"}`}>
                    <i className={queryInfo.status === "AVAILABLE" ? "fas fa-check-circle" : "fas fa-info-circle"}></i>
                  </div>

                  <h2 className="prop-avail-title">
                    Already Marked as {queryInfo.status === "AVAILABLE" ? "Available" : "Unavailable"}
                  </h2>

                  <p className="prop-avail-desc">
                    This request for <strong>"{queryInfo.propertyTitle}"</strong> was previously recorded
                    {queryInfo.respondedAt ? ` on ${new Date(queryInfo.respondedAt).toLocaleString()}` : ""}.
                  </p>

                  <div className="prop-avail-info-box">
                    <div className="prop-avail-info-row">
                      <span className="prop-avail-label">Student:</span>
                      <span className="prop-avail-value">{queryInfo.studentName} ({queryInfo.studentEmail})</span>
                    </div>
                    <div className="prop-avail-info-row">
                      <span className="prop-avail-label">Current Status:</span>
                      <span className={`prop-avail-status-pill ${queryInfo.status.toLowerCase()}`}>
                        {queryInfo.status}
                      </span>
                    </div>
                  </div>

                  {resendStatus && (
                    <div className={`prop-avail-resend-feedback ${resendStatus.success ? "success" : "error"}`}>
                      {resendStatus.message}
                    </div>
                  )}

                  <div className="prop-avail-actions">
                    <button
                      type="button"
                      onClick={handleResendEmail}
                      disabled={resending}
                      className="prop-avail-btn-primary"
                    >
                      {resending ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Sending Email...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-envelope"></i> Resend Email to Student
                        </>
                      )}
                    </button>
                    <Link href={`/apartment-details?id=${queryInfo.propertyId}`} className="prop-avail-btn-secondary">
                      View Property
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="prop-avail-icon-badge pending">
                    <i className="fas fa-home"></i>
                  </div>

                  <h2 className="prop-avail-title">Confirm Property Availability</h2>

                  <p className="prop-avail-desc">
                    A student is waiting to book an inspection tour for:
                  </p>

                  <div className="prop-avail-info-box">
                    <h3 className="prop-avail-property-name">{queryInfo.propertyTitle}</h3>
                    {queryInfo.propertyLocation && (
                      <p className="prop-avail-meta">
                        <i className="fas fa-map-marker-alt"></i> {queryInfo.propertyLocation}
                      </p>
                    )}
                    <div className="prop-avail-info-row">
                      <span className="prop-avail-label">Student:</span>
                      <span className="prop-avail-value">{queryInfo.studentName}</span>
                    </div>
                  </div>

                  <p className="prop-avail-prompt">
                    Is this accommodation currently vacant and ready for inspection?
                  </p>

                  <div className="prop-avail-decision-actions">
                    <button
                      type="button"
                      onClick={() => handleManualResponse("available")}
                      className="prop-avail-btn-success"
                    >
                      <i className="fas fa-check"></i> Yes, It's Available
                    </button>
                    <button
                      type="button"
                      onClick={() => handleManualResponse("unavailable")}
                      className="prop-avail-btn-danger"
                    >
                      <i className="fas fa-times"></i> No, Unavailable / Occupied
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PropertyAvailabilityPage() {
  return (
    <Suspense
      fallback={
        <div className="prop-avail-fallback">
          <p>Loading...</p>
        </div>
      }
    >
      <PropertyAvailabilityContent />
    </Suspense>
  );
}

