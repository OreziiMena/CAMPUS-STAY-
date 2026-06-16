"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import { getAgentDashboardData } from "@/app/actions/properties";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import styles from "./layout.module.css";
import "./agent-dashboard.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [agentName, setAgentName] = useState("Agent");
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  useEffect(() => {
    setIsSidebarMobileOpen(false);
    const loadUser = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user || user.role !== "AGENT") {
        router.push("/auth/login");
        return;
      }
      setAgentName(user.agentProfile?.fullName || user.name || "Agent");

      // Fetch dynamic badge count
      const dashData = await getAgentDashboardData();
      if (dashData.success && dashData.stats) {
        setNewInquiriesCount(dashData.stats.newInquiries);
      }
      setLoading(false);
    };
    loadUser();
  }, [router, pathname]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/explore");
  };


  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <i className={`fas fa-spinner fa-spin ${styles.spinnerIcon}`}></i> Loading ...
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activePath={pathname}
        newInquiriesCount={newInquiriesCount}
        isMobileOpen={isSidebarMobileOpen}
        onClose={() => setIsSidebarMobileOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Panel */}
      <main className="dashboard-main">
        {/* Header Section */}
        <DashboardHeader
          agentName={agentName}
          onMenuToggle={() => setIsSidebarMobileOpen(true)}
          onLogout={handleLogout}
        />

        {/* Content Section */}
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}
