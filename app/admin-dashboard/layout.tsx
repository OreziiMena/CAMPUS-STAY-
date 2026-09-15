"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import "./admin-dashboard.css";

function AdminSidebarWrapper({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  handleLogout 
}: { 
  isSidebarOpen: boolean; 
  setIsSidebarOpen: (b: boolean) => void; 
  handleLogout: () => void; 
}) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "verifications";

  return (
    <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <h2>CS Admin</h2>
        <button className="admin-close-sidebar" onClick={() => setIsSidebarOpen(false)}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="sidebar-menu">
        <ul>
          <li>
            <Link 
              href="/admin-dashboard?tab=analytics" 
              className={activeTab === "analytics" ? "active" : ""}
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-chart-line"></i> Analytics Overview
            </Link>
          </li>
          <li>
            <Link 
              href="/admin-dashboard" 
              className={activeTab === "verifications" ? "active" : ""}
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-user-check"></i> Verifications
            </Link>
          </li>
          <li>
            <Link 
              href="/admin-dashboard?tab=students" 
              className={activeTab === "students" ? "active" : ""}
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-user-graduate"></i> Student Users
            </Link>
          </li>
          <li>
            <Link 
              href="/admin-dashboard?tab=agents" 
              className={activeTab === "agents" ? "active" : ""}
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-user-tie"></i> Agent Users
            </Link>
          </li>
          <li>
            <Link 
              href="/admin-dashboard?tab=properties" 
              className={activeTab === "properties" ? "active" : ""}
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-building"></i> Hostels & Properties
            </Link>
          </li>
          <li>
            <Link 
              href="/admin-dashboard?tab=roommates" 
              className={activeTab === "roommates" ? "active" : ""}
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-user-friends"></i> Roommate Listings
            </Link>
          </li>
          <li>
            <Link 
              href="/admin-dashboard?tab=reports" 
              className={activeTab === "reports" ? "active" : ""}
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-flag"></i> Reports Moderation
            </Link>
          </li>
          <li>
            <Link 
              href="/admin-dashboard?tab=payments" 
              className={activeTab === "payments" ? "active" : ""}
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-credit-card"></i> Inspection Payments
            </Link>
          </li>
          <li>
            <Link 
              href="/admin-dashboard?tab=broadcast" 
              className={activeTab === "broadcast" ? "active" : ""}
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-paper-plane"></i> Broadcast Emails
            </Link>
          </li>
          <li>
            <Link 
              href="/admin-dashboard?tab=ambassadors" 
              className={activeTab === "ambassadors" ? "active" : ""}
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-bullhorn"></i> Campus Ambassadors
            </Link>
          </li>
          <li>
            <Link 
              href="/admin-dashboard?tab=activity-logs" 
              className={activeTab === "activity-logs" ? "active" : ""}
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-history"></i> Agent Activity Logs
            </Link>
          </li>
          <li className="sidebar-nav-divider">
            <Link href="/" onClick={() => setIsSidebarOpen(false)}>
              <i className="fas fa-globe"></i> View Explore Site
            </Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="admin-logout-btn">
          <i className="fas fa-sign-out-alt"></i> Log Out
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user || user.role !== "ADMIN") {
        router.push("/auth/login");
        return;
      }
      setAdminName(user.name || "Admin");
      setLoading(false);
      setIsSidebarOpen(false);
    };
    checkAdmin();
  }, [router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="admin-loading-container">
        <i className="fas fa-spinner fa-spin spinner-icon"></i> Checking Admin Access...
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar wrapped in Suspense */}
      <Suspense fallback={<aside className="admin-sidebar" />}>
        <AdminSidebarWrapper 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          handleLogout={handleLogout}
        />
      </Suspense>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button className="admin-menu-toggle" onClick={() => setIsSidebarOpen(true)}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="header-title">
              <h3>Campus Tent Admin Portal</h3>
            </div>
          </div>
          <div className="admin-profile-info">
            <div className="admin-avatar">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span>{adminName}</span>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
