"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import DashboardClientLogic from "./DashboardClientLogic";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import { getAgentDashboardData } from "@/app/actions/properties";
import { useRouter } from "next/navigation";
import "./agent-dashboard.css";

export default function AgentDashboard() {
  const router = useRouter();
  const [agentName, setAgentName] = useState("Agent");
  const [stats, setStats] = useState({ totalProperties: 0, activeListings: 0, newInquiries: 0 });
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user || user.role !== "AGENT") {
        router.push("/auth/login");
        return;
      }
      setAgentName(user.name || "Agent");

      const savedTheme = localStorage.getItem("campus_stay_theme") || "light";
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }

      const dashData = await getAgentDashboardData();
      if (dashData.success && dashData.stats) {
        setStats(dashData.stats);
        setInquiries(dashData.recentInquiries || []);
      }
      setLoading(false);
    };
    loadDashboard();
  }, [router]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    document.body.classList.remove("dark-mode");
    router.push("/");
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("campus_stay_theme", nextTheme);
    if (nextTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  return (
    <>
      <DashboardClientLogic />
      <div className="dashboard-layout">
        <aside className="sidebar" id="sidebar">
            <div className="sidebar-header">
                <h2 className="logo-text">Campus Stay</h2>
                <button className="close-sidebar-btn" id="close-sidebar"><i className="fas fa-times"></i></button>
            </div>
            <ul className="sidebar-nav">
                <li><Link href="/agent-dashboard" className="active"><i className="fas fa-th-large"></i> Dashboard</Link></li>
                <li><a href="#"><i className="fas fa-building"></i> My Properties</a></li>
                <li><a href="#"><i className="fas fa-envelope"></i> Inquiries <span className="badge" id="nav-inquiry-badge">{stats.newInquiries}</span></a></li>
                <li><Link href="/agent-dashboard/analytics"><i className="fas fa-chart-line"></i> Analytics</Link></li>
                <li><Link href="/agent-dashboard/settings"><i className="fas fa-cog"></i> Settings</Link></li>
            </ul>

            <div className="sidebar-footer">
                <button id="logout-btn" className="logout-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Log Out</button>
            </div>
        </aside>

        <main className="dashboard-main">
            <header className="dashboard-header">
                <button className="menu-toggle-btn" id="menu-toggle"><i className="fas fa-bars"></i></button>

                <div className="header-right">
                    <button className="notification-btn" id="notification-btn"><i className="fas fa-bell"></i></button>
                    <button className="notification-btn" onClick={handleThemeToggle}>
                        <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`} style={theme === "dark" ? { color: "#f1c40f" } : undefined}></i>
                    </button>
                    <div 
                      className="profile-dropdown" 
                      onClick={(e) => {
                        setIsProfileDropdownOpen(!isProfileDropdownOpen);
                        e.stopPropagation();
                      }}
                    >
                        <div className="profile-info">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(agentName)}&background=d35400&color=fff`} alt="Profile"
                                className="profile-pic" />
                            <span className="profile-name">{agentName}</span>
                            <i className="fas fa-chevron-down" style={{ fontSize: "11px", color: "var(--text-main)", marginLeft: "2px" }}></i>
                        </div>

                        <div className={`dropdown-menu ${isProfileDropdownOpen ? "active" : ""}`} onClick={(e) => e.stopPropagation()}>
                            <Link href="/agent-dashboard/profile"><i className="fas fa-user"></i> My Profile</Link>
                            <Link href="/agent-dashboard/settings"><i className="fas fa-cog"></i> Settings</Link>
                            <div className="dropdown-divider"></div>
                            <button onClick={handleLogout} className="logout-link" style={{ background: "none", border: "none", padding: "12px 20px", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "Poppins", fontSize: "13px", display: "flex", gap: "10px", alignItems: "center" }}>
                                <i className="fas fa-sign-out-alt"></i> Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="welcome-banner">
                    <div>
                        <h1 id="welcome-text">Welcome back, <span id="welcome-name">{agentName}</span>! 👋</h1>
                        <p>Here is what's happening with your properties today.</p>
                    </div>
                    <Link href="/agent-dashboard/add-property" className="add-properties-btn" style={{ textDecoration: "none" }}>
                        <i className="fas fa-plus"></i> Add New Property
                    </Link>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "50px", fontFamily: "Poppins", color: "rgb(2, 53, 28)", fontSize: "18px" }}>
                       <i className="fas fa-spinner fa-spin" style={{ marginRight: "10px" }}></i> Loading dashboard data...
                    </div>
                ) : (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon"><i className="fas fa-home"></i></div>
                                <div className="stat-details">
                                    <h3 id="stat-total-properties">{stats.totalProperties}</h3>
                                    <p>Total Properties</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
                                <div className="stat-details">
                                    <h3 id="stat-active-listings">{stats.activeListings}</h3>
                                    <p>Active Listings</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon"><i className="fas fa-comments"></i></div>
                                <div className="stat-details">
                                    <h3 id="stat-new-inquiries">{stats.newInquiries}</h3>
                                    <p>Total Inquiries</p>
                                </div>
                            </div>
                        </div>

                        <div className="recent-section">
                            <div className="section-header">
                                <h2>Recent Student Inquiries</h2>
                                <a href="#">View All</a>
                            </div>

                            <div className="inquiry-list" id="inquiries-container">
                                {inquiries.length === 0 ? (
                                    <p style={{ color: "#888", fontFamily: "'Open Sans', sans-serif", fontSize: "14px" }}>
                                        No recent inquiries.
                                    </p>
                                ) : (
                                    inquiries.map((inq) => (
                                        <div key={inq.id} className="inquiry-item">
                                            <div className="inquiry-info">
                                                <h4>{inq.studentName} <strong>({inq.propertyName})</strong></h4>
                                                <p style={{ margin: "5px 0 10px 0", color: "#333", fontSize: "15px" }}>"{inq.message}"</p>
                                                <small style={{ color: "#666" }}>
                                                    <i className="fas fa-phone"></i> {inq.phone} | <i className="fas fa-envelope"></i> {inq.email}
                                                </small>
                                            </div>
                                            <div className="inquiry-time">
                                                {new Date(inq.createdAt).toLocaleDateString()}
                                            </div>
                                            <a 
                                                href={`https://wa.me/${inq.phone.replace(/[^0-9+]/g, "")}?text=Hi%20${encodeURIComponent(inq.studentName)},%20I%20am%20replying%20to%20your%20inquiry%20about%20"${encodeURIComponent(inq.propertyName)}"%20on%20Campus%20Stay.`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="reply-btn"
                                                style={{ textDecoration: "none" }}
                                            >
                                                Reply on WhatsApp
                                            </a>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
      </div>
    </>
  );
}
