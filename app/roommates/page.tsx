"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRoommateListings } from "@/app/actions/student";
import { getOrCreateRoommateChatRoom } from "@/app/actions/chat";
import { getCurrentUser } from "@/app/actions/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ToastProvider";
import { NIGERIAN_UNIVERSITIES } from "@/lib/universities";
import "./roommates.css";

// Modular Components
import HeroBanner from "./components/HeroBanner";
import SearchFilters from "./components/SearchFilters";
import IntentTabs, { RoommateIntentFilter } from "./components/IntentTabs";
import CompatBanner from "./components/CompatBanner";
import Grid from "./components/Grid";
import SafetyTip from "./components/SafetyTip";

// Modular Modals
import ListingModal from "./components/modals/ListingModal";
import DetailsModal from "./components/modals/DetailsModal";
import PairingModal from "./components/modals/PairingModal";
import CompatModal from "./components/modals/CompatModal";
import ReportModal from "./components/modals/ReportModal";

const GENDER_OPTIONS = [
  { code: "All", name: "All Genders" },
  { code: "Male", name: "Male" },
  { code: "Female", name: "Female" },
];

const LEVEL_OPTIONS = [
  { code: "100L", name: "100 Level (Freshman)" },
  { code: "200L", name: "200 Level" },
  { code: "300L", name: "300 Level" },
  { code: "400L", name: "400 Level" },
  { code: "500L", name: "500 Level (Finalist)" },
  { code: "Postgraduate", name: "Postgraduate" },
];

const CAMPUS_OPTIONS = [
  { code: "All", name: "All Universities" },
  ...NIGERIAN_UNIVERSITIES,
];

const SPACE_TYPES = [
  { code: "Bedsitter", name: "Bedsitter" },
  { code: "Self-Contain", name: "Self-Contain" },
  { code: "1-Bedroom Flat", name: "1-Bedroom Flat" },
  { code: "2-Bedroom Flat", name: "2-Bedroom Flat" },
];

const REPORT_REASONS = [
  { code: "FRAUD_SCAM", name: "Fraud or Scam Profile" },
  { code: "INACCURATE_DETAILS", name: "Inaccurate preferences/information" },
  { code: "INAPPROPRIATE_CONTENT", name: "Inappropriate content/abuse" },
  { code: "SPAM", name: "Spam or Duplicate Profile" },
  { code: "OTHER", name: "Other Reason" },
];

export default function RoommatesDirectory() {
  const { showToast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSafetyTip, setShowSafetyTip] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Filters State
  const [intentFilter, setIntentFilter] = useState<RoommateIntentFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [university, setUniversity] = useState("All");
  const [gender, setGender] = useState("All");
  const [maxBudget, setMaxBudget] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 9;

  // Modals State
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [selectedRoommateDetails, setSelectedRoommateDetails] = useState<any | null>(null);
  const [isPairModalOpen, setIsPairModalOpen] = useState(false);
  const [pairingListing, setPairingListing] = useState<any | null>(null);
  const [isCompatModalOpen, setIsCompatModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Safety tip auto-dismiss timer (15 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSafetyTip(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  // Reset pagination when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, university, gender, maxBudget, intentFilter]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const element = document.querySelector(".roommates-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 350, behavior: "smooth" });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const user = await getCurrentUser();
    setCurrentUser(user);

    const res = await getRoommateListings();
    if (res.success && res.listings) {
      setListings(res.listings);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenListingModal = async () => {
    const activeUser = await getCurrentUser();
    if (!activeUser) {
      showToast("Please log in to upload roommate listings.", "error");
      router.push("/auth/login");
      return;
    }
    setCurrentUser(activeUser);

    if (activeUser.role !== "STUDENT") {
      showToast("Only students can upload roommate requests.", "error");
    } else {
      setIsListingModalOpen(true);
    }
  };

  const handleMessageRoommate = async (roommateUserId: string) => {
    const activeUser = await getCurrentUser();
    if (!activeUser) {
      showToast("Please log in to contact potential roommates.", "error");
      router.push("/auth/login");
      return;
    }
    setCurrentUser(activeUser);

    if (activeUser.role !== "STUDENT") {
      showToast("Only students can message roommate partners.", "error");
      return;
    }

    const res = await getOrCreateRoommateChatRoom(roommateUserId);
    if (res.success && res.chatRoomId) {
      router.push(`/chat?roomId=${res.chatRoomId}`);
    } else {
      showToast(res.error || "Failed to initialize conversation.", "error");
    }
  };

  const handleOpenPairModal = async (listing: any) => {
    const activeUser = await getCurrentUser();
    if (!activeUser) {
      showToast("Please log in to send a roommate pairing proposal.", "error");
      router.push("/auth/login");
      return;
    }
    setCurrentUser(activeUser);

    if (activeUser.role !== "STUDENT") {
      showToast("Only students can pair up with potential roommates.", "error");
      return;
    }

    if (activeUser.id === listing.student?.userId) {
      showToast("You cannot send a pairing proposal to your own listing.", "error");
      return;
    }

    setPairingListing(listing);
    setIsPairModalOpen(true);
  };

  // Filter Logic
  const filteredListings = listings.filter((l) => {
    // 0. Intent Filter
    if (intentFilter === "LOOKING_TO_PAIR" && l.roommateIntent !== "LOOKING_TO_PAIR") return false;
    if (intentFilter === "HAVE_SPACE" && l.roommateIntent === "LOOKING_TO_PAIR") return false;

    // 1. Search Query (title / location / roommate username / department)
    const roommateUsername = l.student?.username || "";
    const roommateName = l.student?.fullName || "";
    const dept = l.department || "";
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roommateUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roommateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. University
    const matchesUni = university === "All" || l.university === university;

    // 3. Gender
    const roommateGender = l.student?.gender || "Any";
    const matchesGender =
      gender === "All" ||
      roommateGender.toLowerCase() === gender.toLowerCase();

    // 4. Budget
    const effectivePrice = l.roommateIntent === "LOOKING_TO_PAIR" ? (l.myBudget || l.price) : l.price;
    const matchesBudget =
      !maxBudget || effectivePrice <= parseFloat(maxBudget);

    return matchesSearch && matchesUni && matchesGender && matchesBudget;
  });

  const countAll = listings.length;
  const countPairing = listings.filter((l) => l.roommateIntent === "LOOKING_TO_PAIR").length;
  const countHaveSpace = listings.filter((l) => l.roommateIntent !== "LOOKING_TO_PAIR").length;

  const userPrefs = currentUser?.studentProfile?.preferences as any;
  const shouldShowCompatBanner =
    currentUser &&
    currentUser.role === "STUDENT" &&
    (!userPrefs?.department || !userPrefs?.level);

  return (
    <>
      <Navbar />

      <main className="roommates-layout">
        {/* Hero Banner */}
        <HeroBanner 
          onListRoommateClick={handleOpenListingModal}
          onEditCompatClick={() => setIsCompatModalOpen(true)}
          isStudent={Boolean(currentUser && currentUser.role === "STUDENT")}
        />

        {/* Search & Filters */}
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          university={university}
          onUniversityChange={setUniversity}
          campusOptions={CAMPUS_OPTIONS}
          gender={gender}
          onGenderChange={setGender}
          genderOptions={GENDER_OPTIONS}
          maxBudget={maxBudget}
          onMaxBudgetChange={setMaxBudget}
        />

        {/* Co-Renting & Space Intent Tabs */}
        <IntentTabs
          currentFilter={intentFilter}
          onFilterChange={setIntentFilter}
          countAll={countAll}
          countPairing={countPairing}
          countHaveSpace={countHaveSpace}
        />

        {/* Compatibility Match / Edit Banner */}
        {currentUser && currentUser.role === "STUDENT" && (
          <CompatBanner 
            preferences={userPrefs}
            onOpenCompatModal={() => setIsCompatModalOpen(true)} 
          />
        )}

        {/* Directory Grid & Pagination */}
        <Grid
          loading={loading}
          listings={filteredListings}
          currentUser={currentUser}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
          playingVideoId={playingVideoId}
          onPlayVideo={(id) => setPlayingVideoId(id)}
          onStopVideo={() => setPlayingVideoId(null)}
          onViewDetails={(listing) => setSelectedRoommateDetails(listing)}
          onPairUp={handleOpenPairModal}
          onMessage={handleMessageRoommate}
        />

        
      </main>

      {/* Upload Roommate Listing Modal */}
      <ListingModal
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
        currentUser={currentUser}
        onSuccess={fetchData}
        spaceTypes={SPACE_TYPES}
        levelOptions={LEVEL_OPTIONS}
      />

      {/* Roommate Details Modal */}
      <DetailsModal
        listing={selectedRoommateDetails}
        onClose={() => setSelectedRoommateDetails(null)}
        onReportClick={() => setIsReportModalOpen(true)}
        onPairUpClick={handleOpenPairModal}
        onMessageClick={handleMessageRoommate}
      />

      {/* Request to Pair Up Proposal Modal */}
      <PairingModal
        isOpen={isPairModalOpen}
        listing={pairingListing}
        currentUser={currentUser}
        onClose={() => {
          setIsPairModalOpen(false);
          setPairingListing(null);
        }}
        levelOptions={LEVEL_OPTIONS}
      />

      {/* Compatibility Profile Setup Modal */}
      <CompatModal
        isOpen={isCompatModalOpen}
        onClose={() => setIsCompatModalOpen(false)}
        onSuccess={fetchData}
        initialDept={(currentUser?.studentProfile?.preferences as any)?.department || ""}
        initialLevel={(currentUser?.studentProfile?.preferences as any)?.level || "100L"}
        initialGender={(currentUser?.studentProfile?.preferences as any)?.gender || "Male"}
        levelOptions={LEVEL_OPTIONS}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        roommateStudentId={selectedRoommateDetails?.student?.id}
        reportReasons={REPORT_REASONS}
      />

      <Footer />
    </>
  );
}
