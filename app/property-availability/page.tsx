"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { respondPropertyAvailability } from "@/app/actions/inspection";
import "./property-availability.css";

function PropertyAvailabilityContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const responseType = searchParams.get("response") as "available" | "unavailable" | null;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    status?: string;
    propertyTitle?: string;
    propertyId?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    async function processResponse() {
      if (!token || !responseType) {
        setResult({
          success: false,
          error: "Invalid confirmation parameters. Missing token or response type.",
        });
        setLoading(false);
        return;
      }

      const res = await respondPropertyAvailability(token, responseType);
      setResult(res);
      setLoading(false);
    }

    processResponse();
  }, [token, responseType]);

  return (
    <>
      <Navbar />
      <main className="prop-avail-main">
        <div className="prop-avail-card">
          {loading ? (
            <div>
              <i className="fas fa-spinner fa-spin prop-avail-spinner"></i>
              <h2 className="prop-avail-loading-title">Updating Availability Status...</h2>
              <p className="prop-avail-loading-text">Recording your response and notifying the student in real-time.</p>
            </div>
          ) : result?.success ? (
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
                    Thank you! We've notified the student that <strong>"{result.propertyTitle}"</strong> is available. They can now pay the ₦7,500 inspection fee and book an in-person tour.
                  </>
                ) : (
                  <>
                    We've notified the student that <strong>"{result.propertyTitle}"</strong> is currently unavailable or occupied so they can browse alternatives.
                  </>
                )}
              </p>

              <div className="prop-avail-actions">
                <Link
                  href="/agent-dashboard"
                  className="prop-avail-btn-primary"
                >
                  <i className="fas fa-th-large"></i> Go to Dashboard
                </Link>
                {result.propertyId && (
                  <Link
                    href={`/apartment-details?id=${result.propertyId}`}
                    className="prop-avail-btn-secondary"
                  >
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

              <h2 className="prop-avail-error-title">
                Unable to Update Status
              </h2>

              <p className="prop-avail-desc">
                {result?.error || "This link may have already been used or is invalid."}
              </p>

              <div className="prop-avail-actions">
                <Link
                  href="/agent-dashboard"
                  className="prop-avail-btn-primary"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PropertyAvailabilityPage() {
  return (
    <Suspense fallback={
      <div className="prop-avail-fallback">
        <p>Loading...</p>
      </div>
    }>
      <PropertyAvailabilityContent />
    </Suspense>
  );
}

