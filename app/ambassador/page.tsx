"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchableSelect from "@/components/SearchableSelect";
import { NIGERIAN_UNIVERSITIES } from "@/lib/universities";
import { submitAmbassadorApplication, getAmbassadorStatus } from "@/app/actions/ambassador";
import { getCurrentUser } from "@/app/actions/auth";
import styles from "./ambassador.module.css";

const ACADEMIC_LEVELS = [
  { code: "100L", name: "100 Level" },
  { code: "200L", name: "200 Level" },
  { code: "300L", name: "300 Level" },
  { code: "400L", name: "400 Level" },
  { code: "500L", name: "500 Level" },
  { code: "Postgraduate", name: "Postgraduate" },
];

export default function AmbassadorPage() {
  const [activeTab, setActiveTab] = useState<"apply" | "status">("apply");
  
  // Application Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    university: "FUPRE",
    department: "",
    level: "200L",
    socialHandle: "",
    pitch: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [existingApp, setExistingApp] = useState<any>(null);

  // Status Lookup State
  const [statusQuery, setStatusQuery] = useState("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<any>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    const initUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setFormData((prev) => ({
            ...prev,
            fullName: user.name || prev.fullName,
            email: user.email || prev.email,
            phone: user.phone || prev.phone,
            university: user.studentProfile?.university || prev.university,
          }));

          // Check if this student already has an active ambassador record
          if (user.email) {
            const statusCheck = await getAmbassadorStatus(user.email);
            if (statusCheck.success && statusCheck.application) {
              setExistingApp(statusCheck.application);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load user profile for ambassador prefill:", err);
      }
    };
    initUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSubmitError(null);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitResult(null);

    // Client-side validations
    if (!formData.fullName.trim()) {
      setSubmitError("Please provide your full name.");
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setSubmitError("Please provide a valid email address.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setSubmitError("Please provide a valid phone number (at least 10 digits).");
      return;
    }
    if (!formData.university) {
      setSubmitError("Please select your university / higher institution.");
      return;
    }
    if (!formData.department.trim()) {
      setSubmitError("Please provide your department / faculty.");
      return;
    }
    if (!formData.pitch.trim() || formData.pitch.trim().length < 20) {
      setSubmitError("Please provide at least 20 characters explaining why you would make an exceptional campus ambassador.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitAmbassadorApplication(formData);
      if (res.success) {
        setSubmitResult(res);
        if (res.referralCode) {
          setExistingApp({
            referralCode: res.referralCode,
            status: res.status || "PENDING",
            fullName: formData.fullName,
            university: formData.university,
          });
        }
      } else {
        setSubmitError(res.error || "Failed to submit application.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusCheck = async (e?: React.FormEvent, directCode?: string) => {
    if (e) e.preventDefault();
    const query = (directCode || statusQuery).trim();
    if (!query) return;

    setIsCheckingStatus(true);
    setStatusError(null);
    setStatusResult(null);

    try {
      const res = await getAmbassadorStatus(query);
      if (res.success) {
        setStatusResult(res.application);
      } else {
        setStatusError(res.error || "No ambassador found with this email or code.");
      }
    } catch (err: any) {
      setStatusError(err.message || "Could not check status.");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const copyReferralLink = (code: string) => {
    const link = `https://campustent.com/auth/student-signup?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const getWhatsAppShareUrl = (code: string) => {
    const text = `Hey! Check out Campus Tent to find verified hostels, book student accommodations, and connect with trusted roommates on campus. Use my referral link or code (${code}) when signing up:\nhttps://campustent.com/auth/student-signup?ref=${code}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className={styles.ambassadorPage}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <i className="fas fa-bullhorn"></i> Campus Tent Ambassador Program
          </div>
          <h1 className={styles.heroTitle}>
            Lead on Your Campus. <span>Earn Lucrative Rewards.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Help fellow students discover verified, secure off-campus accommodation and roommates while unlocking commissions, leadership certificates, and exclusive perks.
          </p>

          <div className={styles.heroStats}>
            <div className={styles.heroStatItem}>
              <div className={styles.heroStatValue}>₦1,000</div>
              <div className={styles.heroStatLabel}>Per Booking Referral</div>
            </div>
            <div className={styles.heroStatItem}>
              <div className={styles.heroStatValue}>100%</div>
              <div className={styles.heroStatLabel}>Flexible & Remote</div>
            </div>
            <div className={styles.heroStatItem}>
              <div className={styles.heroStatValue}>Official</div>
              <div className={styles.heroStatLabel}>Leadership Certificate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Section */}
      <main className={styles.mainContainer}>
        {/* Tab Switcher */}
        <div className={styles.tabSwitcher}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "apply" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("apply")}
          >
            <i className="fas fa-paper-plane"></i> Apply for Program
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "status" ? styles.tabBtnActive : ""}`}
            onClick={() => {
              setActiveTab("status");
              if (existingApp?.referralCode && !statusResult) {
                setStatusQuery(existingApp.referralCode);
                handleStatusCheck(undefined, existingApp.referralCode);
              }
            }}
          >
            <i className="fas fa-search"></i> Check My Referral Code
          </button>
        </div>

        {/* Perks Grid (Shown on Apply tab only so Status tab content is visible immediately without scrolling) */}
        {activeTab === "apply" && (
          <div className={styles.perksGrid}>
            <div className={styles.perkCard}>
              <div className={styles.perkIcon}>
                <i className="fas fa-wallet"></i>
              </div>
              <h4 className={styles.perkTitle}>Direct Cash Payouts</h4>
              <p className={styles.perkDesc}>
                Earn direct bank payouts for every student who books an inspection tour or reserves accommodation with your referral code.
              </p>
            </div>

            <div className={styles.perkCard}>
              <div className={styles.perkIcon}>
                <i className="fas fa-certificate"></i>
              </div>
              <h4 className={styles.perkTitle}>Executive Certificate</h4>
              <p className={styles.perkDesc}>
                Receive an official Certificate of Leadership & Community Management endorsed by Campus Tent to boost your CV and LinkedIn.
              </p>
            </div>

            <div className={styles.perkCard}>
              <div className={styles.perkIcon}>
                <i className="fas fa-gift"></i>
              </div>
              <h4 className={styles.perkTitle}>Merchandise & Swag</h4>
              <p className={styles.perkDesc}>
                Get branded Campus Tent merchandise and priority VIP access to university orientation campaigns.
              </p>
            </div>

            <div className={styles.perkCard}>
              <div className={styles.perkIcon}>
                <i className="fas fa-shield-alt"></i>
              </div>
              <h4 className={styles.perkTitle}>Safety & Advocacy</h4>
              <p className={styles.perkDesc}>
                Protect your peers from hostel scammers by guiding them to 100% verified, inspected student residences.
              </p>
            </div>
          </div>
        )}

        {/* TAB 1: APPLICATION FORM */}
        {activeTab === "apply" && (
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h3>Campus Ambassador Application</h3>
              <p>Fill out the application below. Approvals are typically processed within 48 hours.</p>
            </div>

            {/* Existing Application Banner for Logged-In User */}
            {existingApp && !submitResult && (
              <div className={styles.existingNoticeBanner}>
                <div className={styles.existingNoticeLeft}>
                  <i className="fas fa-info-circle"></i>
                  <div className={styles.existingNoticeText}>
                    You already have an ambassador record with code: <strong>{existingApp.referralCode}</strong> ({existingApp.status}).
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.existingNoticeBtn}
                  onClick={() => {
                    setActiveTab("status");
                    setStatusQuery(existingApp.referralCode);
                    handleStatusCheck(undefined, existingApp.referralCode);
                  }}
                >
                  View Referral Stats
                </button>
              </div>
            )}

            {submitError && (
              <div className={`${styles.alertBox} ${styles.alertError}`}>
                <i className="fas fa-exclamation-circle"></i>
                <span>{submitError}</span>
              </div>
            )}

            {submitResult ? (
              <div className={styles.successCard}>
                <i className={`fas fa-check-circle ${styles.successIcon}`}></i>
                <h3 className={styles.successTitle}>
                  Application Received!
                </h3>
                <p className={styles.successDesc}>
                  {submitResult.message}
                </p>

                {/* 24-48 Hour Review Notice Banner */}
                <div className={styles.noticeBanner}>
                  <i className={`fas fa-envelope-open-text ${styles.noticeIcon}`}></i>
                  <div>
                    <h5 className={styles.noticeTitle}>Check Your Email (24 - 48 Hours)</h5>
                    <p className={styles.noticeText}>
                      We have sent your confirmation details to <strong>{formData.email}</strong>. Our team is reviewing your profile and will send your official onboarding approval within <strong>24 to 48 hours</strong>.
                    </p>
                  </div>
                </div>

                {/* Referral Code Box */}
                <div className={styles.referralCodeBox}>
                  <div>
                    <div className={styles.codeLabel}>Your Unique Referral Code</div>
                    <div className={styles.referralCodeText}>{submitResult.referralCode}</div>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className={styles.actionsRow}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    onClick={() => copyReferralCode(submitResult.referralCode)}
                  >
                    <i className={copiedCode ? "fas fa-check" : "far fa-copy"}></i>
                    {copiedCode ? "Code Copied!" : "Copy Code"}
                  </button>

                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    onClick={() => copyReferralLink(submitResult.referralCode)}
                  >
                    <i className={copiedLink ? "fas fa-check" : "fas fa-link"}></i>
                    {copiedLink ? "Link Copied!" : "Copy Signup Link"}
                  </button>

                  <a
                    href={getWhatsAppShareUrl(submitResult.referralCode)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.actionBtn} ${styles.actionBtnWhatsapp}`}
                  >
                    <i className="fab fa-whatsapp"></i> Share on WhatsApp
                  </a>
                </div>

                {/* Instructions on How to Use Referral Code */}
                <div className={styles.instructionsBox}>
                  <h4 className={styles.instructionsTitle}>
                    <i className="fas fa-lightbulb"></i> How to Use Your Referral Code & Earn
                  </h4>
                  <ol className={styles.instructionsList}>
                    <li>
                      <strong>Share Your Code / Link:</strong> Send your referral link or code (<code>{submitResult.referralCode}</code>) to course mates, hostel groups, and newly admitted students.
                    </li>
                    <li>
                      <strong>Automatic Signup Linking:</strong> When students register on Campus Tent using your link or code, they are permanently assigned to your ambassador profile.
                    </li>
                    <li>
                      <strong>Earn ₦1,000 per Referral:</strong> Receive direct commission payouts when your referred students book property inspections or lease accommodations.
                    </li>
                    <li>
                      <strong>Track Live Earnings:</strong> Switch to the <em>"Check My Referral Code"</em> tab at any time to monitor your real-time signups and cash balance.
                    </li>
                  </ol>
                </div>

                <div className={styles.resetBtnWrapper}>
                  <button
                    type="button"
                    className={styles.resetBtn}
                    onClick={() => {
                      setSubmitResult(null);
                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        university: "FUPRE",
                        department: "",
                        level: "200L",
                        socialHandle: "",
                        pitch: "",
                      });
                    }}
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className={styles.formGrid}>
                <div>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className={styles.input}
                  />
                </div>

                <div>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    className={styles.input}
                  />
                </div>

                <div>
                  <label className={styles.label}>WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number e.g. 08012345678"
                    className={styles.input}
                  />
                </div>

                <div>
                  <label className={styles.label}>University / Higher Institution *</label>
                  <SearchableSelect
                    options={NIGERIAN_UNIVERSITIES}
                    value={formData.university}
                    onChange={(val) => setFormData({ ...formData, university: val })}
                    placeholder="Select your institution..."
                  />
                </div>

                <div>
                  <label className={styles.label}>Department / Faculty *</label>
                  <input
                    type="text"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Department / Faculty"
                    className={styles.input}
                  />
                </div>

                <div>
                  <label className={styles.label}>Academic Level *</label>
                  <SearchableSelect
                    options={ACADEMIC_LEVELS}
                    value={formData.level}
                    onChange={(val) => setFormData({ ...formData, level: val })}
                    placeholder="Select academic level..."
                    showSearch={false}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Social Media Handle (Instagram, Twitter or TikTok) - Optional</label>
                  <input
                    type="text"
                    name="socialHandle"
                    value={formData.socialHandle}
                    onChange={handleInputChange}
                    placeholder="e.g. @username"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>
                    Why would you make an exceptional Campus Ambassador? *
                  </label>
                  <textarea
                    rows={4}
                    name="pitch"
                    required
                    value={formData.pitch}
                    onChange={handleInputChange}
                    placeholder="Describe your campus involvement, leadership experience, or motivation (at least 20 characters)..."
                    className={styles.textarea}
                  />
                </div>

                <div className={`${styles.formGroupFull} ${styles.submitBtnWrapper}`}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitBtn}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Submitting Application...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i> Submit Ambassador Application
                      </>
                    )}
                  </button>
                  <p className={styles.reviewNote}>
                    <i className="fas fa-clock"></i> Note: Reviews & confirmation emails are dispatched within 24 to 48 hours.
                  </p>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: REFERRAL CODE & STATUS LOOKUP */}
        {activeTab === "status" && (
          <div className={styles.statusCheckCard}>
            <div className={styles.formHeader}>
              <h3>Check Ambassador Status & Code</h3>
              <p>Enter your registered email address or referral code to check your statistics and earnings.</p>
            </div>

            <form onSubmit={handleStatusCheck} className={styles.statusForm}>
              <input
                type="text"
                required
                value={statusQuery}
                onChange={(e) => {
                  setStatusQuery(e.target.value);
                  setStatusError(null);
                }}
                placeholder="Enter registered email or referral code (e.g. CT-EMEN-924)"
                className={`${styles.input} ${styles.statusInput}`}
              />
              <button
                type="submit"
                disabled={isCheckingStatus}
                className={`${styles.submitBtn} ${styles.statusBtn}`}
              >
                {isCheckingStatus ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Checking...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i> Check Status
                  </>
                )}
              </button>
            </form>

            {statusError && (
              <div className={`${styles.alertBox} ${styles.alertError} ${styles.statusAlert}`}>
                <i className="fas fa-exclamation-circle"></i>
                <span>{statusError}</span>
              </div>
            )}

            {statusResult && (
              <div className={styles.statusResultBox}>
                <div className={styles.statusCardHeader}>
                  <div>
                    <h4 className={styles.statusCardTitle}>
                      {statusResult.fullName}
                    </h4>
                    <p className={styles.statusCardSub}>
                      {statusResult.university} &bull; Applied on {new Date(statusResult.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {statusResult.status === "APPROVED" && (
                      <span className={styles.statusBadgeApproved}>
                        <i className={`fas fa-check-circle ${styles.statusBadgeIcon}`}></i> Active Ambassador
                      </span>
                    )}
                    {statusResult.status === "PENDING" && (
                      <span className={styles.statusBadgePending}>
                        <i className={`fas fa-clock ${styles.statusBadgeIcon}`}></i> Under Review (24 - 48h)
                      </span>
                    )}
                    {statusResult.status === "REJECTED" && (
                      <span className={styles.statusBadgeRejected}>
                        <i className={`fas fa-times-circle ${styles.statusBadgeIcon}`}></i> Application Declined
                      </span>
                    )}
                  </div>
                </div>

                {/* Stat details */}
                <div className={styles.statusGrid}>
                  <div className={styles.statusStatCard}>
                    <div className={styles.statusStatLabel}>Referral Code</div>
                    <div className={styles.statusStatValue}>
                      {statusResult.referralCode}
                    </div>
                  </div>

                  <div className={styles.statusStatCard}>
                    <div className={styles.statusStatLabel}>Referred Students</div>
                    <div className={styles.statusStatValue}>
                      {statusResult.referralCount}
                    </div>
                  </div>

                  <div className={styles.statusStatCard}>
                    <div className={styles.statusStatLabel}>Total Commissions</div>
                    <div className={styles.statusStatEarnings}>
                      ₦{statusResult.earnings.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Quick Share Section */}
                <div className={styles.statusShareSection}>
                  <p className={styles.statusShareText}>
                    <i className="fas fa-share-alt"></i> Share your referral link:
                  </p>
                  <div className={styles.actionsRow}>
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                      onClick={() => copyReferralLink(statusResult.referralCode)}
                    >
                      <i className={copiedLink ? "fas fa-check" : "fas fa-link"}></i>
                      {copiedLink ? "Link Copied!" : "Copy Signup Link"}
                    </button>
                    <a
                      href={getWhatsAppShareUrl(statusResult.referralCode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.actionBtn} ${styles.actionBtnWhatsapp}`}
                    >
                      <i className="fab fa-whatsapp"></i> Share on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

