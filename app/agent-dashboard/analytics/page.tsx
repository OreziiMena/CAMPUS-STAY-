"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import DashboardClientLogic from "../DashboardClientLogic";
import "./styles.css";
import "../agent-dashboard.css";

export default function Analytics() {
  const router = useRouter();
  const [agentName, setAgentName] = useState("Agent");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const checkUser = async () => {
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
    };
    checkUser();
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
      <DashboardClientLogic isAnalytics={true} />
      <div className="dashboard-layout">
        {/*  Sidebar  */}
        <aside className="sidebar" id="sidebar">
          <div className="sidebar-header">
            <h2 className="logo-text">Campus Stay</h2>
            <button className="close-sidebar-btn" id="close-sidebar"><i className="fas fa-times"></i></button>
          </div>
          <ul className="sidebar-nav">
            <li><Link href="/agent-dashboard"><i className="fas fa-th-large"></i> Dashboard</Link></li>
            <li><a href="#"><i className="fas fa-building"></i> My Properties</a></li>
            <li><a href="#"><i className="fas fa-envelope"></i> Inquiries <span className="badge" id="nav-inquiry-badge">0</span></a></li>
            <li><Link href="/agent-dashboard/analytics" className="active"><i className="fas fa-chart-line"></i> Analytics</Link></li>
            <li><Link href="/agent-dashboard/settings"><i className="fas fa-cog"></i> Settings</Link></li>
          </ul>

          <div className="sidebar-footer">
            <button id="logout-btn" className="logout-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Log Out</button>
          </div>
        </aside>

        {/*  Main Content  */}
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
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(agentName)}&background=d35400&color=fff`} alt="Profile" className="profile-pic" />
                  <span className="profile-name">{agentName}</span>
                  <i className="fas fa-chevron-down" style={{ fontSize: "11px", color: "var(--text-main)", marginLeft: "2px" }}></i>
                </div>

                <div className={`dropdown-menu ${isProfileDropdownOpen ? "active" : ""}`} onClick={(e) => e.stopPropagation()}>
                  <a href="/"><i className="fas fa-user"></i> My Profile</a>
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
            {/*  Analytics Header  */}
            <div className="welcome-banner">
              <div>
                <h1 style={{ fontFamily: "'Poppins'", margin: "0 0 5px 0", color: "#333" }}><i className="fas fa-chart-pie" style={{ color: "rgb(2, 53, 28)", marginRight: "10px" }}></i> Performance Insights</h1>
                <p style={{ margin: "0", color: "#666", fontFamily: "'Open Sans'" }}>Analyze student engagement and property performance over time.</p>
              </div>
              <button className="primary-btn" style={{ backgroundColor: "rgb(2, 53, 28)", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontFamily: "'Poppins'", fontWeight: "600" }}><i className="fas fa-download"></i> Export Report</button>
            </div>

            {/*  KPI Stats Grid  */}
            <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              <div className="stat-card">
                <div className="stat-icon views"><i className="fas fa-eye"></i></div>
                <div className="stat-details">
                  <h3 id="metric-views">--</h3>
                  <p>Profile Views</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon clicks"><i className="fas fa-mouse-pointer"></i></div>
                <div className="stat-details">
                  <h3 id="metric-clicks">--</h3>
                  <p>Property Clicks</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon requests"><i className="fas fa-comment-dots"></i></div>
                <div className="stat-details">
                  <h3 id="metric-inquiries">--</h3>
                  <p>Inquiries</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon conversion"><i className="fas fa-bolt"></i></div>
                <div className="stat-details">
                  <h3 id="metric-conversion">--</h3>
                  <p>Conversion Rate</p>
                </div>
              </div>
            </div>

            {/*  Visual Analytics Charts  */}
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3><i className="fas fa-chart-area" style={{ color: "rgb(2, 53, 28)", marginRight: "8px" }}></i> Engagement Overview (30 Days)</h3>
                <div className="chart-placeholder" style={{ padding: "10px", backgroundColor: "transparent", border: "none", height: "300px" }}>
                  <canvas id="engagementChart"></canvas>
                </div>
              </div>

              <div className="analytics-card">
                <h3><i className="fas fa-chart-bar" style={{ color: "rgb(2, 53, 28)", marginRight: "8px" }}></i> Views per Property</h3>
                <div className="chart-placeholder" style={{ padding: "10px", backgroundColor: "transparent", border: "none", height: "300px" }}>
                  <canvas id="propertyViewsChart"></canvas>
                </div>
              </div>

              <div className="analytics-card" style={{ gridColumn: "1 / -1" }}>
                <h3><i className="fas fa-map-marked-alt" style={{ color: "rgb(2, 53, 28)", marginRight: "8px" }}></i> Student Demographics & Location</h3>
                <div className="chart-placeholder" style={{ padding: "10px", backgroundColor: "transparent", border: "none", height: "350px" }}>
                  <canvas id="demographicsChart"></canvas>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
