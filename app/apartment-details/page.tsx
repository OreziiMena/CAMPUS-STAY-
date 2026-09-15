"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPropertyDetails } from "@/app/actions/properties";
import { getCurrentUser } from "@/app/actions/auth";
import { scheduleViewing } from "@/app/actions/student";
import { submitReport } from "@/app/actions/reports";
import {
  getInspectionStatus,
  queryPropertyAvailability,
  processInspectionPayment,
  initializePaystackInspection,
  submitBankTransferInspectionPayment,
} from "@/app/actions/inspection";
import { pusherClient } from "@/lib/pusher-client";
import "./styles.css";

// Modular Components
import Loader from "./components/Loader";
import HeroGallery from "./components/HeroGallery";
import QuickNav from "./components/QuickNav";
import OverviewSection from "./components/OverviewSection";
import RentSplitter from "./components/RentSplitter";
import AmenitiesSection from "./components/AmenitiesSection";
import CommuteSection from "./components/CommuteSection";
import SchedulerSection from "./components/SchedulerSection";
import Sidebar from "./components/Sidebar";

// Modals
import LightboxModal from "./components/modals/LightboxModal";
import ReportModal from "./components/modals/ReportModal";

interface Property {
  id: string;
  title: string;
  price: string;
  rawPriceNum?: number;
  rentAmount?: number;
  agentFee?: number;
  cautionFee?: number;
  isNegotiable?: boolean;
  location: string;
  distance: string;
  description: string;
  amenities: string[];
  images: string[];
  views?: number;
  hostelType?: string;
  isRoommateOption?: boolean;
  roommateGenderPreference?: string;
  agent: {
    name: string;
    role: string;
    phone: string;
    isVerified?: boolean;
  };
}

function ApartmentDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Lightbox Modal States
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Splitter Calculator State
  const [occupantsCount, setOccupantsCount] = useState<number>(1);

  // Active Navigation Anchor
  const [activeNavSection, setActiveNavSection] = useState("overview");

  // Student verification and scheduling states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [viewingDate, setViewingDate] = useState("");
  const [viewingTime, setViewingTime] = useState("");
  const [viewingNote, setViewingNote] = useState("");
  const [schedulingStatus, setSchedulingStatus] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Listing link copied to clipboard!");

  // Inspection Fee & Availability States
  const [inspectionStatus, setInspectionStatus] = useState<{
    isPaid: boolean;
    availabilityStatus: string;
    isOwner: boolean;
  }>({
    isPaid: false,
    availabilityStatus: "NONE",
    isOwner: false,
  });
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isPayingInspection, setIsPayingInspection] = useState(false);

  // Dual Payment Modal States (Direct Bank Transfer First, Paystack Second)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"bank_transfer" | "paystack">("bank_transfer");
  const [bankSenderName, setBankSenderName] = useState("");
  const [bankSenderBank, setBankSenderBank] = useState("");
  const [bankTransferRef, setBankTransferRef] = useState("");
  const [isSubmittingBankTransfer, setIsSubmittingBankTransfer] = useState(false);
  const [copiedAccountNum, setCopiedAccountNum] = useState(false);

  // Listing Report States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<any>("FRAUD_SCAM");
  const [reportCustomReason, setReportCustomReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState("");
  const [reportError, setReportError] = useState("");

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportError("");
    setReportSuccess("");

    if (!currentUser) {
      alert("Please log in to submit a report.");
      router.push("/auth/login");
      return;
    }

    if (!reportDescription || reportDescription.trim().length < 10) {
      setReportError("Please provide a detailed description (minimum 10 characters).");
      return;
    }

    setIsSubmittingReport(true);

    try {
      const res = await submitReport({
        propertyId: property?.id || id || "",
        reason: reportReason,
        customReason: reportReason === "OTHER" ? reportCustomReason : undefined,
        description: reportDescription,
      });

      setIsSubmittingReport(false);

      if (res.success) {
        setReportSuccess("Listing reported successfully. Thank you for keeping Campus Tent safe!");
        setTimeout(() => {
          setIsReportModalOpen(false);
          setReportReason("FRAUD_SCAM");
          setReportCustomReason("");
          setReportDescription("");
          setReportSuccess("");
        }, 2000);
      } else {
        setReportError(res.error || "Failed to submit report.");
      }
    } catch (err: any) {
      setIsSubmittingReport(false);
      setReportError(err.message || "An unexpected error occurred.");
    }
  };

  const handleShare = async () => {
    if (!property) return;
    const shareUrl = window.location.href;
    const shareData = {
      title: property.title,
      text: `Check out this listing on Campus Tent: ${property.title}`,
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Web Share API error:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setToastMessage("Listing link copied to clipboard!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);

      const user = await getCurrentUser();
      setCurrentUser(user);

      if (!id) {
        setProperty(null);
        setLoading(false);
        return;
      }

      const res = await getPropertyDetails(id);
      if (res.success && res.property) {
        const prop = res.property;
        const rawRent = prop.rentAmount !== null && prop.rentAmount !== undefined ? prop.rentAmount : prop.price;
        const rawAgentFee = prop.agentFee !== null && prop.agentFee !== undefined ? prop.agentFee : 0;
        const rawCautionFee = prop.cautionFee !== null && prop.cautionFee !== undefined ? prop.cautionFee : 0;
        const rawTotal = prop.price || (rawRent + rawAgentFee + rawCautionFee);

        setProperty({
          id: prop.id,
          title: prop.title,
          price: `₦${rawTotal.toLocaleString()}`,
          rawPriceNum: rawTotal,
          rentAmount: rawRent,
          agentFee: rawAgentFee,
          cautionFee: rawCautionFee,
          isNegotiable: Boolean(prop.isNegotiable),
          location: prop.location,
          distance: prop.distance,
          description: prop.description,
          amenities: prop.amenities || [],
          images: prop.images || [],
          views: prop.views || 0,
          hostelType: prop.hostelType || "Self-Contain",
          isRoommateOption: prop.isRoommateOption,
          roommateGenderPreference: prop.roommateGenderPreference,
          agent: {
            name: prop.agent ? prop.agent.fullName : (prop.student ? `@${prop.student.username}` : "Campus Tent Official"),
            role: prop.agent ? (prop.agent.isVerified ? "Verified Agent" : "Agent/Landlord") : (prop.student ? (prop.student.isVerified ? "Verified Student Roommate" : "Student Roommate") : "Campus Tent Partner"),
            phone: prop.agent ? (prop.agent.user?.phone || "+2349161863877") : (prop.student?.user?.phone || "+2349161863877"),
            isVerified: prop.agent ? prop.agent.isVerified : (prop.student ? prop.student.isVerified : true),
          }
        });

        // Check inspection and availability status
        const inspRes = await getInspectionStatus(prop.id);
        if (inspRes.success) {
          setInspectionStatus({
            isPaid: Boolean(inspRes.isPaid),
            availabilityStatus: inspRes.availabilityStatus || "NONE",
            isOwner: Boolean(inspRes.isOwner),
          });
        }
      } else {
        setProperty(null);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  // Real-time listener for agent 1-click availability updates via Pusher
  useEffect(() => {
    if (!id || !pusherClient) return;

    const channelName = `property-${id}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind("availability-status", (data: any) => {
      if (data && data.status) {
        setInspectionStatus((prev) => ({
          ...prev,
          availabilityStatus: data.status,
        }));
        setToastMessage(
          data.status === "AVAILABLE"
            ? "Agent confirmed: Property is available! Inspection payment unlocked."
            : "Agent updated status: Property is currently occupied/unavailable."
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(channelName);
    };
  }, [id]);

  const handleCheckAvailability = async () => {
    if (!property) return;
    if (!currentUser) {
      router.push(`/auth/login?redirect=/apartment-details?id=${property.id}`);
      return;
    }
    if (currentUser.role === "AGENT") {
      alert("Agents cannot check availability or book viewings. Please use a student account.");
      return;
    }
    setIsCheckingAvailability(true);
    try {
      const res = await queryPropertyAvailability(property.id);
      if (res.success) {
        setInspectionStatus((prev) => ({
          ...prev,
          availabilityStatus: res.status || "PENDING",
        }));
        setToastMessage(
          res.status === "AVAILABLE"
            ? "Property is available! Proceed to pay the inspection fee."
            : "Availability check sent to agent. Awaiting 1-click confirmation."
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      } else {
        alert(res.error || "Failed to check availability.");
      }
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const loadPaystackScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).PaystackPop) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayInspectionFee = () => {
    if (!property) return;
    if (!currentUser) {
      router.push(`/auth/login?redirect=/apartment-details?id=${property.id}`);
      return;
    }

    if (currentUser.role === "AGENT") {
      alert("Agents cannot pay inspection fees or book viewings. Please use a student account.");
      return;
    }

    setBankSenderName(currentUser.studentProfile?.fullName || currentUser.name || "");
    setIsPaymentModalOpen(true);
  };

  const handleLaunchPaystack = async () => {
    if (!property || !currentUser) return;
    setIsPayingInspection(true);

    const studentEmail = currentUser.email || "student@campustent.com";
    const studentName = currentUser.studentProfile?.fullName || currentUser.name || "Student";
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_6d1d6b2a82607cfb39ffeb9be11ae5e6913f7720";

    const onPaymentSuccess = async (reference: string) => {
      setIsPayingInspection(true);
      try {
        const res = await processInspectionPayment(property.id, reference);
        if (res.success) {
          setInspectionStatus((prev) => ({
            ...prev,
            isPaid: true,
          }));
          setIsPaymentModalOpen(false);
          setToastMessage("Inspection fee of ₦7,500 paid! Direct chat & appointment booking unlocked.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
        } else {
          alert(res.error || "Failed to confirm payment on server.");
        }
      } catch (err: any) {
        alert(err.message || "Error finalizing inspection fee.");
      } finally {
        setIsPayingInspection(false);
      }
    };

    try {
      // Pre-initialize on server to ensure reference is registered with Paystack
      const initRes = await initializePaystackInspection(property.id);
      const txRef = initRes?.reference || `INSP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const isScriptLoaded = await loadPaystackScript();

      if (isScriptLoaded && typeof window !== "undefined" && (window as any).PaystackPop) {
        const PaystackPop = (window as any).PaystackPop;

        if (typeof PaystackPop.setup === "function") {
          // Standard v1 Inline Popup
          const handler = PaystackPop.setup({
            key: paystackKey,
            email: studentEmail,
            amount: 7500 * 100, // ₦7,500 in kobo
            currency: "NGN",
            ref: txRef,
            metadata: {
              propertyId: property.id,
              propertyTitle: property.title,
              studentName: studentName,
              custom_fields: [
                {
                  display_name: "Property",
                  variable_name: "property_title",
                  value: property.title,
                },
                {
                  display_name: "Inspection Coverage",
                  variable_name: "inspection_coverage",
                  value: "₦7,500 Physical Tour & Alternative Options",
                },
              ],
            },
            callback: function (response: any) {
              const ref = response?.reference || txRef;
              onPaymentSuccess(ref);
            },
            onClose: function () {
              setIsPayingInspection(false);
            },
          });

          handler.openIframe();
        } else if (typeof PaystackPop === "function") {
          // v2 Transaction Popup
          const paystack = new PaystackPop();
          paystack.newTransaction({
            key: paystackKey,
            email: studentEmail,
            amount: 7500 * 100,
            currency: "NGN",
            reference: txRef,
            onSuccess: function (transaction: any) {
              const ref = transaction?.reference || txRef;
              onPaymentSuccess(ref);
            },
            onCancel: function () {
              setIsPayingInspection(false);
            },
          });
        }
      } else {
        // Direct server fallback for local testing
        await onPaymentSuccess(txRef);
      }
    } catch (err: any) {
      console.error("Paystack popup error:", err);
      alert(err.message || "Payment process error.");
      setIsPayingInspection(false);
    }
  };

  const handleConfirmBankTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !currentUser) return;
    if (!bankSenderName.trim() || !bankSenderBank.trim()) {
      alert("Please enter both the sender's full name and the bank name used for transfer.");
      return;
    }

    setIsSubmittingBankTransfer(true);
    try {
      const res = await submitBankTransferInspectionPayment({
        propertyId: property.id,
        senderName: bankSenderName.trim(),
        bankName: bankSenderBank.trim(),
        reference: bankTransferRef.trim() || undefined,
      });

      if (res.success) {
        setInspectionStatus((prev) => ({
          ...prev,
          isPaid: true,
        }));
        setIsPaymentModalOpen(false);
        setToastMessage("₦7,500 Bank Transfer confirmed! Direct chat & appointment booking unlocked.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      } else {
        alert(res.error || "Failed to confirm bank transfer payment.");
      }
    } catch (err: any) {
      alert(err.message || "Error finalizing bank transfer.");
    } finally {
      setIsSubmittingBankTransfer(false);
    }
  };

  const handleScheduleViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingDate || !viewingTime || !property) {
      setSchedulingStatus("Error: Please select both a preferred inspection date and time.");
      return;
    }
    if (currentUser?.role === "AGENT") {
      setSchedulingStatus("Error: Agents cannot book inspections. Please use a student account.");
      return;
    }
    setIsScheduling(true);
    setSchedulingStatus("");
    
    const combinedDateTime = `${viewingDate}T${viewingTime}`;
    const res = await scheduleViewing({
      propertyId: property.id,
      dateTime: combinedDateTime,
      note: viewingNote.trim() || undefined,
    });
    
    if (res.success) {
      setSchedulingStatus("Viewing requested successfully! The agent has been notified via email & in-app chat.");
      setViewingDate("");
      setViewingTime("");
      setViewingNote("");
      setTimeout(() => setSchedulingStatus(""), 6000);
    } else {
      setSchedulingStatus(`Error: ${res.error}`);
    }
    setIsScheduling(false);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveNavSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <main className="details-not-found-screen">
          <div className="details-not-found-card">
            <div className="details-not-found-icon">
              <i className="fas fa-home"></i>
            </div>
            <h2 className="details-not-found-title">Hostel Listing Not Found</h2>
            <p className="details-not-found-desc">
              The accommodation listing you are searching for might have been occupied, removed by the host, or does not exist.
            </p>
            <div className="details-not-found-actions">
              <Link href="/explore" className="not-found-btn primary">
                <i className="fas fa-search"></i> Explore All Hostels
              </Link>
              <Link href="/roommates" className="not-found-btn secondary">
                <i className="fas fa-users"></i> Find Roommates
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const gallery = property.images && property.images.length > 0 ? property.images : [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ];

  const hasVideo = gallery.some((url: string) => url.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i));

  // Splitter Calculations
  const rawTotal = property.rawPriceNum || property.rentAmount || 0;
  const rawRent = property.rentAmount || rawTotal;
  const rawAgentFee = property.agentFee || 0;

  const rentPerPerson = Math.round(rawRent / occupantsCount);
  const agentFeePerPerson = Math.round(rawAgentFee / occupantsCount);
  const totalPerPerson = Math.round(rawTotal / occupantsCount);

  return (
    <>
      <Navbar />

      <main className="details-page-wrapper">
        {/* 1. Desktop Bento Gallery (Hidden on Mobile) */}
        <HeroGallery
          gallery={gallery}
          propertyTitle={property.title}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          onOpenLightbox={openLightbox}
          hasVideo={hasVideo}
          variant="bento"
        />

        {/* 2. Sticky Quick Navigation Bar */}
        <QuickNav
          activeNavSection={activeNavSection}
          onScrollToSection={scrollToSection}
        />

        {/* 3. Two-Column Main Layout */}
        <div className="details-grid-container">
          {/* Main Left Column */}
          <div className="details-main-column">
            {/* Overview Section (Badges, Title, Location, and About this accommodation) */}
            <OverviewSection property={property} />

            {/* Mobile Hero Media Carousel (Hidden on Desktop, Displayed right after About on Mobile) */}
            <HeroGallery
              gallery={gallery}
              propertyTitle={property.title}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              onOpenLightbox={openLightbox}
              hasVideo={hasVideo}
              variant="carousel"
            />

            {/* Key Features & Amenities */}
            <AmenitiesSection amenities={property.amenities} />

            {/* In-Person Inspection Scheduler */}
            <SchedulerSection
              propertyId={property.id}
              currentUser={currentUser}
              isUnlocked={
                property.isRoommateOption ||
                inspectionStatus.isOwner ||
                currentUser?.role === "ADMIN" ||
                inspectionStatus.isPaid
              }
              onUnlockClick={() => scrollToSection("pricing-card")}
              viewingDate={viewingDate}
              setViewingDate={setViewingDate}
              viewingTime={viewingTime}
              setViewingTime={setViewingTime}
              viewingNote={viewingNote}
              setViewingNote={setViewingNote}
              schedulingStatus={schedulingStatus}
              isScheduling={isScheduling}
              onScheduleViewing={handleScheduleViewing}
            />
            
            {/* Roommate Rent Splitter Calculator (Last Item on Page) */}
            <RentSplitter
              occupantsCount={occupantsCount}
              setOccupantsCount={setOccupantsCount}
              rentPerPerson={rentPerPerson}
              agentFeePerPerson={agentFeePerPerson}
              totalPerPerson={totalPerPerson}
            />
          </div>

          {/* Sticky Right Floating Sidebar (On Mobile: Positioned cleanly after the Image & About) */}
          <Sidebar
            property={property}
            currentUser={currentUser}
            rawTotal={rawTotal}
            inspectionStatus={inspectionStatus}
            isCheckingAvailability={isCheckingAvailability}
            isPayingInspection={isPayingInspection}
            onCheckAvailability={handleCheckAvailability}
            onPayInspectionFee={handlePayInspectionFee}
            onScrollToScheduler={() => scrollToSection("scheduler")}
            onShare={handleShare}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        </div>

        {/* Fullscreen Lightbox Gallery Modal */}
        <LightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          gallery={gallery}
          propertyTitle={property.title}
          lightboxIndex={lightboxIndex}
          setLightboxIndex={setLightboxIndex}
        />

        {/* Report Listing Modal */}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportReason={reportReason}
          setReportReason={setReportReason}
          reportCustomReason={reportCustomReason}
          setReportCustomReason={setReportCustomReason}
          reportDescription={reportDescription}
          setReportDescription={setReportDescription}
          isSubmittingReport={isSubmittingReport}
          reportSuccess={reportSuccess}
          reportError={reportError}
          onReportSubmit={handleReportSubmit}
        />

        {/* Dual Payment Options Modal */}
        {isPaymentModalOpen && (
          <div className="payment-modal-overlay" onClick={() => !isPayingInspection && !isSubmittingBankTransfer && setIsPaymentModalOpen(false)}>
            <div className="payment-modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="payment-modal-header">
                <div className="payment-modal-header-top">
                  <div>
                    <h3 className="payment-modal-title">
                      <i className="fas fa-shield-alt"></i> Complete Inspection Payment
                    </h3>
                    <span className="payment-modal-amount-tag">Total Amount: ₦7,500</span>
                  </div>
                  <button
                    type="button"
                    className="payment-modal-close-icon"
                    onClick={() => setIsPaymentModalOpen(false)}
                    disabled={isPayingInspection || isSubmittingBankTransfer}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <div className="payment-modal-body">
                {/* Tab selector (Direct Bank Transfer First, Paystack Second) */}
                <div className="payment-method-selector-tabs">
                  <button
                    type="button"
                    className={`payment-method-selector-tab ${selectedPaymentMethod === "bank_transfer" ? "active" : ""}`}
                    onClick={() => setSelectedPaymentMethod("bank_transfer")}
                  >
                    <i className="fas fa-university"></i> Direct Bank Transfer
                  </button>
                  <button
                    type="button"
                    className={`payment-method-selector-tab ${selectedPaymentMethod === "paystack" ? "active" : ""}`}
                    onClick={() => setSelectedPaymentMethod("paystack")}
                  >
                    <i className="fas fa-credit-card"></i> Online Paystack
                  </button>
                </div>

                {selectedPaymentMethod === "bank_transfer" ? (
                  <form onSubmit={handleConfirmBankTransfer} className="bank-transfer-form">
                    <div className="bank-transfer-instructions">
                      <div className="bank-transfer-instructions-title">
                        <i className="fas fa-info-circle"></i> Campus Tent Official Bank Account
                      </div>
                      <div className="bank-account-details-list">
                        <div className="bank-account-item">
                          <span className="bank-account-label">Bank:</span>
                          <span className="bank-account-val">OPay</span>
                        </div>
                        <div className="bank-account-item">
                          <span className="bank-account-label">Account Number:</span>
                          <span className="bank-account-val">
                            610 554 8915
                            <button
                              type="button"
                              className="bank-copy-btn"
                              onClick={() => {
                                navigator.clipboard.writeText("6105548915");
                                setCopiedAccountNum(true);
                                setTimeout(() => setCopiedAccountNum(false), 2000);
                              }}
                              title="Copy account number"
                            >
                              <i className={copiedAccountNum ? "fas fa-check text-green" : "fas fa-copy"}></i>
                              {copiedAccountNum ? "Copied" : "Copy"}
                            </button>
                          </span>
                        </div>
                        <div className="bank-account-item">
                          <span className="bank-account-label">Account Name:</span>
                          <span className="bank-account-val">OREZIME DESTINY ABED</span>
                        </div>
                        <div className="bank-account-item">
                          <span className="bank-account-label">Amount:</span>
                          <span className="bank-account-val">₦7,500</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="filter-label">Sender Full Name *</label>
                      <input
                        type="text"
                        className="bank-input-field"
                        placeholder="e.g. John Doe (name on your bank account)"
                        value={bankSenderName}
                        onChange={(e) => setBankSenderName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="filter-label">Your Bank Name *</label>
                      <input
                        type="text"
                        className="bank-input-field"
                        placeholder="e.g. GTBank, Kuda, OPay, Zenith, Palmpay, Access"
                        value={bankSenderBank}
                        onChange={(e) => setBankSenderBank(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="filter-label">Session ID / Transaction Reference (Optional)</label>
                      <input
                        type="text"
                        className="bank-input-field"
                        placeholder="e.g. 100004294829..."
                        value={bankTransferRef}
                        onChange={(e) => setBankTransferRef(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="bank-confirm-submit-btn"
                      disabled={isSubmittingBankTransfer}
                    >
                      {isSubmittingBankTransfer ? (
                        <><i className="fas fa-spinner fa-spin"></i> Confirming Transfer...</>
                      ) : (
                        <><i className="fas fa-check-circle"></i> I Have Paid ₦7,500 &bull; Unlock Tour</>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="paystack-option-container">
                    <p className="paystack-option-info">
                      Pay securely online via Debit Cards (Mastercard, Visa, Verve), USSD, Apple Pay, or Internet Banking.
                    </p>
                    <div className="paystack-channels-badge">
                      <span className="paystack-channel-pill"><i className="fas fa-credit-card"></i> ATM Cards</span>
                      <span className="paystack-channel-pill"><i className="fas fa-mobile-alt"></i> USSD</span>
                      <span className="paystack-channel-pill"><i className="fas fa-building"></i> Bank Transfer</span>
                    </div>
                    <button
                      type="button"
                      className="paystack-launch-btn"
                      onClick={handleLaunchPaystack}
                      disabled={isPayingInspection}
                    >
                      {isPayingInspection ? (
                        <><i className="fas fa-spinner fa-spin"></i> Initializing Paystack...</>
                      ) : (
                        <><i className="fas fa-lock"></i> Proceed to Paystack (₦7,500)</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="toast-notification">
            <i className="fas fa-check-circle"></i> {toastMessage}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default function ApartmentDetailsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ApartmentDetailsContent />
    </Suspense>
  );
}
