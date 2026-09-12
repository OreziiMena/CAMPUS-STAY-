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
      } else {
        setProperty(null);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  const handleScheduleViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingDate || !viewingTime || !property) {
      setSchedulingStatus("Error: Please select both a preferred inspection date and time.");
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

        {/* Share Toast Notification */}
        {showToast && (
          <div className="toast-notification">
            <i className="fas fa-check-circle" style={{ marginRight: "8px" }}></i> Listing link copied to clipboard!
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
