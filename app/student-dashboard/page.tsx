"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { 
  getStudentDashboardData, 
  getStudentPaymentHistory, 
  getStudentMyRoommateListings, 
  toggleRoommateListingAvailability 
} from "@/app/actions/student";
import { deleteProperty } from "@/app/actions/properties";
import { getOrCreateChatRoom } from "@/app/actions/chat";
import { confirmStudentInspectionTour, reportInspectionIssue } from "@/app/actions/inspection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./student-dashboard.css";

// Modular Components
import StudentWelcomeBanner from "./components/StudentWelcomeBanner";
import StudentPaymentsCard from "./components/StudentPaymentsCard";
import StudentViewingsCard from "./components/StudentViewingsCard";
import StudentInquiriesCard from "./components/StudentInquiriesCard";
import StudentRoommatesCard from "./components/StudentRoommatesCard";

// Modals
import StudentReceiptModal from "./components/modals/StudentReceiptModal";
import StudentDisputeModal from "./components/modals/StudentDisputeModal";
import EditRoommateModal from "./components/modals/EditRoommateModal";

export default function StudentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("Student");
  const [profile, setProfile] = useState<any>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [viewings, setViewings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [roommateListings, setRoommateListings] = useState<any[]>([]);
  const [confirmingViewingId, setConfirmingViewingId] = useState<string | null>(null);

  // Modals
  const [receiptModalPayment, setReceiptModalPayment] = useState<any | null>(null);
  const [disputeModalPayment, setDisputeModalPayment] = useState<any | null>(null);
  const [editingRoommateListing, setEditingRoommateListing] = useState<any | null>(null);
  const [roommateActionLoadingId, setRoommateActionLoadingId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState("Agent did not show up for inspection");
  const [disputeDesc, setDisputeDesc] = useState("");
  const [disputeLoading, setDisputeLoading] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT") {
      router.push("/auth/login");
      return;
    }
    setStudentName(user.studentProfile?.fullName || user.name || "Student");

    const [res, paymentsRes, roommatesRes] = await Promise.all([
      getStudentDashboardData(),
      getStudentPaymentHistory(),
      getStudentMyRoommateListings(),
    ]);

    if (res.success) {
      setProfile(res.profile);
      setInquiries(res.inquiries || []);
      setViewings(res.viewings || []);
    }
    if (paymentsRes.success) {
      setPayments(paymentsRes.payments || []);
    }
    if (roommatesRes.success) {
      setRoommateListings(roommatesRes.listings || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, [router]);

  const handleSubmitDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeModalPayment) return;
    setDisputeLoading(true);
    try {
      const res = await reportInspectionIssue({
        paymentId: disputeModalPayment.id,
        reason: disputeReason,
        description: disputeDesc,
      });
      if (res.success) {
        alert("Dispute report submitted successfully. Our admin team has been alerted.");
        setPayments((prev) =>
          prev.map((p) =>
            p.id === disputeModalPayment.id
              ? { ...p, status: "DISPUTED", disputeReason: `${disputeReason}: ${disputeDesc}` }
              : p
          )
        );
        setDisputeModalPayment(null);
        setDisputeDesc("");
      } else {
        alert(res.error || "Failed to submit dispute.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setDisputeLoading(false);
    }
  };

  const handleConfirmTour = async (e: React.MouseEvent, viewingId: string) => {
    e.stopPropagation();
    setConfirmingViewingId(viewingId);
    try {
      const res = await confirmStudentInspectionTour(viewingId);
      if (res.success) {
        setViewings((prev) =>
          prev.map((v) =>
            v.id === viewingId
              ? { ...v, studentConfirmedTour: true, studentConfirmedAt: new Date().toISOString() }
              : v
          )
        );
      } else {
        alert(res.error || "Failed to confirm tour.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setConfirmingViewingId(null);
    }
  };

  const handleInquiryClick = async (propertyId: string) => {
    const res = await getOrCreateChatRoom(propertyId);
    if (res.success && res.chatRoomId) {
      router.push(`/chat?roomId=${res.chatRoomId}`);
    } else {
      alert(res.error || "Failed to open conversation.");
    }
  };

  const handleToggleRoommateStatus = async (listingId: string) => {
    setRoommateActionLoadingId(listingId);
    try {
      const res = await toggleRoommateListingAvailability(listingId);
      if (res.success) {
        setRoommateListings((prev) =>
          prev.map((item) =>
            item.id === listingId ? { ...item, isAvailable: res.isAvailable } : item
          )
        );
      } else {
        alert(res.error || "Failed to update listing status.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setRoommateActionLoadingId(null);
    }
  };

  const handleDeleteRoommateListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this roommate listing? This cannot be undone.")) {
      return;
    }
    setRoommateActionLoadingId(listingId);
    try {
      const res = await deleteProperty(listingId);
      if (res.success) {
        setRoommateListings((prev) => prev.filter((item) => item.id !== listingId));
      } else {
        alert(res.error || "Failed to delete listing.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setRoommateActionLoadingId(null);
    }
  };

  const handleSaveRoommateSuccess = async () => {
    const res = await getStudentMyRoommateListings();
    if (res.success) {
      setRoommateListings(res.listings || []);
    }
  };

  return (
    <>
      <Navbar />

      <main className="student-dashboard-layout">
        {loading ? (
          <div className="student-loader">
            <i className="fas fa-spinner fa-spin"></i> Loading dashboard...
          </div>
        ) : (
          <div className="student-dashboard-container">
            {/* Welcome Section */}
            <StudentWelcomeBanner studentName={studentName} />

            {/* Roommate & Co-Renting Listings Management Section */}
            <StudentRoommatesCard
              listings={roommateListings}
              onEdit={(listing) => setEditingRoommateListing(listing)}
              onToggleStatus={handleToggleRoommateStatus}
              onDelete={handleDeleteRoommateListing}
              actionLoadingId={roommateActionLoadingId}
            />

            {/* Inspection Payments & Receipts Section */}
            <StudentPaymentsCard
              payments={payments}
              onViewReceipt={(payment) => setReceiptModalPayment(payment)}
              onDispute={(payment) => setDisputeModalPayment(payment)}
            />

            {/* Dashboard Sections Grid: Scheduled Viewings & Sent Inquiries */}
            <div className="dashboard-sections-grid">
              <StudentViewingsCard
                viewings={viewings}
                confirmingViewingId={confirmingViewingId}
                onInquiryClick={handleInquiryClick}
                onConfirmTour={handleConfirmTour}
              />

              <StudentInquiriesCard
                inquiries={inquiries}
                onInquiryClick={handleInquiryClick}
              />
            </div>

            {/* Student Receipt Modal */}
            <StudentReceiptModal
              payment={receiptModalPayment}
              onClose={() => setReceiptModalPayment(null)}
            />

            {/* Student Dispute Modal */}
            <StudentDisputeModal
              payment={disputeModalPayment}
              disputeReason={disputeReason}
              setDisputeReason={setDisputeReason}
              disputeDesc={disputeDesc}
              setDisputeDesc={setDisputeDesc}
              disputeLoading={disputeLoading}
              onSubmit={handleSubmitDispute}
              onClose={() => setDisputeModalPayment(null)}
            />

            {/* Edit Roommate Modal */}
            <EditRoommateModal
              listing={editingRoommateListing}
              onClose={() => setEditingRoommateListing(null)}
              onSaveSuccess={handleSaveRoommateSuccess}
            />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
