"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/app/actions/auth";
import { getAgentDashboardData } from "@/app/actions/properties";
import { getAgentViewingsAndLeads } from "@/app/actions/inspection";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

// Child Components
import EarningsCard from "./components/EarningsCard";
import StatsGrid from "./components/StatsGrid";
import InquiryList from "./components/InquiryList";
import InspectionsLeadsList from "./components/InspectionsLeadsList";
import GuideModal from "./components/GuideModal";

export default function AgentDashboard() {
  const router = useRouter();
  const [agentName, setAgentName] = useState("Agent");
  const [stats, setStats] = useState({ totalProperties: 0, activeListings: 0, newInquiries: 0 });
  const [earnings, setEarnings] = useState<any>({
    disbursedEarnings: 0,
    pendingEscrow: 0,
    totalEarnings: 0,
    totalInspections: 0,
    disbursedCount: 0,
    pendingCount: 0,
    bankConfigured: false,
    bankInfo: { bankName: null, accountNumber: null, accountName: null },
  });
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [viewings, setViewings] = useState<any[]>([]);
  const [inspectionPayments, setInspectionPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    const user = await getCurrentUser();
    if (!user || user.role !== "AGENT") {
      router.push("/auth/login");
      return;
    }
    setAgentName(user.agentProfile?.fullName || user.name || "Agent");

    // Fetch dashboard database statistics & inquiries & earnings
    const dashData = await getAgentDashboardData();
    if (dashData.success) {
      if (dashData.stats) setStats(dashData.stats);
      if (dashData.earnings) setEarnings(dashData.earnings);
      setInquiries(dashData.recentInquiries || []);
    }

    // Fetch inspection viewings and leads
    const leadsData = await getAgentViewingsAndLeads();
    if (leadsData.success) {
      setViewings(leadsData.viewings || []);
      setInspectionPayments(leadsData.inspectionPayments || []);
    }

    setLoading(false);

    // Auto-open onboarding guide for first-time agents
    const onboardingDone = localStorage.getItem("cs_agent_onboarding_completed");
    if (!onboardingDone) {
      setIsGuideOpen(true);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [router]);

  return (
    <>
      <div className="welcome-banner">
        <div>
          <h1 id="welcome-text">
            Welcome back, <span id="welcome-name">{agentName}</span>!
          </h1>
          <p>Here is what's happening with your properties today.</p>
        </div>
        <Link href="/agent-dashboard/add-property" className={`add-properties-btn ${styles.addPropBtn}`}>
          <i className="fas fa-plus"></i> Add New Property
        </Link>
      </div>

      {loading ? (
        <div className={styles.loader}>
          <i className={`fas fa-spinner fa-spin ${styles.spinnerIcon}`}></i> Loading dashboard data...
        </div>
      ) : (
        <>
          {/* Inspection Earnings & Escrow Overview Card */}
          <EarningsCard earnings={earnings} />

          {/* Statistics Grid */}
          <StatsGrid
            totalProperties={stats.totalProperties}
            activeListings={stats.activeListings}
            newInquiries={stats.newInquiries}
          />

          {/* Physical Inspections & Paid Leads Management */}
          <InspectionsLeadsList
            viewings={viewings}
            inspectionPayments={inspectionPayments}
            onStatusUpdated={loadDashboard}
          />
        </>
      )}

      {/* Onboarding Interactive Guide Modal */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Floating Onboarding Help Button */}
      <button 
        className="floating-help-trigger" 
        onClick={() => setIsGuideOpen(true)}
        title="View Dashboard Guide"
      >
        <i className="fas fa-question-circle"></i>
      </button>
    </>
  );
}
