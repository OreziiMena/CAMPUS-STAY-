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

import TwoFactorSettingsModal from "@/components/TwoFactorSettingsModal";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [show2FAModal, setShow2FAModal] = useState(false);
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
      setAdminEmail(user.email || "");
      setIs2FAEnabled(!!user.twoFactorEnabled);
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
            <button
              type="button"
              onClick={() => setShow2FAModal(true)}
              title="Two-Factor Security Configuration"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: is2FAEnabled ? "#ecfdf5" : "#fef2f2",
                color: is2FAEnabled ? "#065f46" : "#991b1b",
                border: `1px solid ${is2FAEnabled ? "#a7f3d0" : "#fecaca"}`,
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                marginRight: "12px",
              }}
            >
              <i className={`fas ${is2FAEnabled ? "fa-shield-alt" : "fa-exclamation-triangle"}`}></i>
              {is2FAEnabled ? "2FA Protected" : "2FA Required"}
            </button>
            <div className="admin-avatar">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span>{adminName}</span>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          {!is2FAEnabled ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#fef2f2", color: "#dc2626", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "28px", marginBottom: "16px" }}>
                <i className="fas fa-lock"></i>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
                Administrative 2FA Enrollment Required
              </h3>
              <p style={{ color: "#64748b", maxWidth: "460px", margin: "0 auto 20px auto", fontSize: "0.9rem", lineHeight: 1.6 }}>
                Access to the Campus Tent Admin Portal strictly requires an active Two-Factor Authentication (TOTP) setup. Please link your Authenticator app to continue.
              </p>
              <button
                type="button"
                onClick={() => setShow2FAModal(true)}
                style={{ background: "#02351c", color: "white", padding: "10px 22px", borderRadius: "8px", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}
              >
                <i className="fas fa-qrcode" style={{ marginRight: "8px" }}></i> Complete 2FA Setup
              </button>
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      {/* 2FA Modal (Mandatory when !is2FAEnabled) */}
      <TwoFactorSettingsModal
        isOpen={!is2FAEnabled || show2FAModal}
        onClose={() => setShow2FAModal(false)}
        onSuccess={() => {
          setIs2FAEnabled(true);
          setShow2FAModal(false);
        }}
        userEmail={adminEmail}
        userRole="ADMIN"
        mandatory={!is2FAEnabled}
      />
    </div>
  );
}
