"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import { getAgentAnalyticsData, getAgentDashboardData } from "@/app/actions/properties";
import DashboardClientLogic from "../DashboardClientLogic";
import Chart from "chart.js/auto";
import "./styles.css";
import "../agent-dashboard.css";

export default function Analytics() {
  const router = useRouter();
  const [agentName, setAgentName] = useState("Agent");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);

  // Live analytics data states
  const [metrics, setMetrics] = useState({ totalViews: 0, clicks: 0, totalInquiries: 0, conversionRate: 0 });
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [inquiryCount, setInquiryCount] = useState(0);

  // Chart instances tracking for cleanup
  const [chartInstances, setChartInstances] = useState<Chart[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user || user.role !== "AGENT") {
        router.push("/auth/login");
        return;
      }
      setAgentName(user.name || "Agent");

      // Load Theme
      const savedTheme = localStorage.getItem("campus_stay_theme") || "light";
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }

      // Fetch dynamic analytics datasets
      const res = await getAgentAnalyticsData();
      if (res.success && res.metrics) {
        setMetrics(res.metrics);
        setAnalyticsData(res);
      }
      
      // Fetch sidebar dashboard inquiry count
      const dashData = await getAgentDashboardData();
      if (dashData.success && dashData.stats) {
        setInquiryCount(dashData.stats.newInquiries);
      }
      setLoading(false);
    };
    loadAnalytics();
  }, [router]);

  // Handle Chart.js drawing & updates
  useEffect(() => {
    if (!analyticsData) return;

    // Destroy existing charts to prevent canvas re-use conflicts
    chartInstances.forEach((c) => c.destroy());
    
    const isDark = theme === "dark";
    const textColor = isDark ? "#a0a0a0" : "#666";
    const gridColor = isDark ? "#333" : "#eaeaea";
    Chart.defaults.color = textColor;
    Chart.defaults.font.family = "'Open Sans', sans-serif";

    const ctx1 = document.getElementById("engagementChart") as HTMLCanvasElement;
    const ctx2 = document.getElementById("propertyViewsChart") as HTMLCanvasElement;
    const ctx3 = document.getElementById("demographicsChart") as HTMLCanvasElement;

    const newInstances: Chart[] = [];

    // 1. Engagement Overview Line Chart
    if (ctx1) {
      const labels = analyticsData.engagementTrend.map((t: any) => t.day);
      const viewsData = analyticsData.engagementTrend.map((t: any) => t.views);
      const inquiriesData = analyticsData.engagementTrend.map((t: any) => t.inquiries);

      newInstances.push(
        new Chart(ctx1.getContext("2d")!, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Profile Views",
                data: viewsData,
                borderColor: "#28a745",
                backgroundColor: "rgba(40, 167, 69, 0.1)",
                tension: 0.4,
                fill: true,
              },
              {
                label: "Inquiries",
                data: inquiriesData,
                borderColor: "#f39c12",
                backgroundColor: "transparent",
                tension: 0.4,
                borderDash: [5, 5],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: textColor }
              }
            },
            scales: {
              y: { grid: { color: gridColor }, ticks: { color: textColor } },
              x: { grid: { color: gridColor }, ticks: { color: textColor } },
            },
          },
        })
      );
    }

    // 2. Views per Property Bar Chart
    if (ctx2) {
      const labels = analyticsData.viewsPerProperty.map((p: any) => p.title);
      const viewsData = analyticsData.viewsPerProperty.map((p: any) => p.views);

      newInstances.push(
        new Chart(ctx2.getContext("2d")!, {
          type: "bar",
          data: {
            labels: labels.length > 0 ? labels : ["No Properties"],
            datasets: [
              {
                label: "Total Views",
                data: viewsData.length > 0 ? viewsData : [0],
                backgroundColor: "#02351c",
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: textColor }
              }
            },
            scales: {
              y: { grid: { color: gridColor }, ticks: { color: textColor } },
              x: { grid: { display: false }, ticks: { color: textColor } },
            },
          },
        })
      );
    }

    // 3. Demographics Doughnut Chart
    if (ctx3) {
      const labels = analyticsData.demographics.map((d: any) => d.university);
      const counts = analyticsData.demographics.map((d: any) => d.count);

      newInstances.push(
        new Chart(ctx3.getContext("2d")!, {
          type: "doughnut",
          data: {
            labels: labels.length > 0 ? labels : ["No Demographics Data"],
            datasets: [
              {
                data: counts.length > 0 ? counts : [1],
                backgroundColor: ["#02351c", "#d35400", "#28a745", "#f39c12", "#3b82f6"],
                borderWidth: isDark ? 2 : 0,
                borderColor: isDark ? "#1e1e1e" : "#fff",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "right",
                labels: { color: textColor }
              }
            },
            cutout: "70%",
          },
        })
      );
    }

    setChartInstances(newInstances);
  }, [theme, analyticsData]);

  // Clean up charts on unmount
  useEffect(() => {
    return () => {
      chartInstances.forEach((c) => c.destroy());
    };
  }, []);

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
      <DashboardClientLogic isAnalytics={false} />
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
            <li><a href="#"><i className="fas fa-envelope"></i> Inquiries <span className="badge" id="nav-inquiry-badge">{inquiryCount}</span></a></li>
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
            {/*  Analytics Header  */}
            <div className="welcome-banner">
              <div>
                <h1 style={{ fontFamily: "'Poppins'", margin: "0 0 5px 0", color: "#333" }}><i className="fas fa-chart-pie" style={{ color: "rgb(2, 53, 28)", marginRight: "10px" }}></i> Performance Insights</h1>
                <p style={{ margin: "0", color: "#666", fontFamily: "'Open Sans'" }}>Analyze student engagement and property performance over time.</p>
              </div>
              <button className="primary-btn" style={{ backgroundColor: "rgb(2, 53, 28)", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontFamily: "'Poppins'", fontWeight: "600" }}><i className="fas fa-download"></i> Export Report</button>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "100px 50px", fontFamily: "Poppins", color: "rgb(2, 53, 28)", fontSize: "18px" }}>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: "10px" }}></i> Loading analytics...
              </div>
            ) : (
              <>
                {/*  KPI Stats Grid  */}
                <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                  <div className="stat-card">
                    <div className="stat-icon views"><i className="fas fa-eye"></i></div>
                    <div className="stat-details">
                      <h3 id="metric-views">{metrics.totalViews}</h3>
                      <p>Profile Views</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon clicks"><i className="fas fa-mouse-pointer"></i></div>
                    <div className="stat-details">
                      <h3 id="metric-clicks">{metrics.clicks}</h3>
                      <p>Property Clicks</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon requests"><i className="fas fa-comment-dots"></i></div>
                    <div className="stat-details">
                      <h3 id="metric-inquiries">{metrics.totalInquiries}</h3>
                      <p>Inquiries</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon conversion"><i className="fas fa-bolt"></i></div>
                    <div className="stat-details">
                      <h3 id="metric-conversion">{metrics.conversionRate}%</h3>
                      <p>Conversion Rate</p>
                    </div>
                  </div>
                </div>

                {/*  Visual Analytics Charts  */}
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <h3><i className="fas fa-chart-area" style={{ color: "rgb(2, 53, 28)", marginRight: "8px" }}></i> Engagement Overview (7 Days)</h3>
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
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
