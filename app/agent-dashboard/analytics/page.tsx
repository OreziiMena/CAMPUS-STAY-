"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { getAgentAnalyticsData } from "@/app/actions/properties";
import Chart from "chart.js/auto";
import styles from "./analytics.module.css";
import "./styles.css";

export default function Analytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  // Live analytics data states
  const [metrics, setMetrics] = useState({ totalViews: 0, clicks: 0, totalInquiries: 0, conversionRate: 0 });
  const [analyticsData, setAnalyticsData] = useState<any>(null);

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

      // Fetch dynamic analytics datasets
      const res = await getAgentAnalyticsData();
      if (res.success && res.metrics) {
        setMetrics(res.metrics);
        setAnalyticsData(res);
      }
      setLoading(false);
    };
    loadAnalytics();
  }, [router]);

  // Monitor body class mutations to update theme dynamically for Chart.js
  useEffect(() => {
    const syncTheme = () => {
      const isDark = document.body.classList.contains("dark-mode");
      setTheme(isDark ? "dark" : "light");
    };
    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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
  }, [chartInstances]);

  return (
    <>
      {/*  Analytics Header  */}
      <div className="welcome-banner">
        <div>
          <h1 className={styles.h1Title}>
            <i className={`fas fa-chart-pie ${styles.pieIcon}`}></i> Performance Insights
          </h1>
          <p className={styles.pSub}>Analyze student engagement and property performance over time.</p>
        </div>
        <button className={`primary-btn ${styles.exportBtn}`}>
          <i className="fas fa-download"></i> Export Report
        </button>
      </div>

      {loading ? (
        <div className={styles.loader}>
          <i className={`fas fa-spinner fa-spin ${styles.spinnerIcon}`}></i> Loading analytics...
        </div>
      ) : (
        <>
          {/*  KPI Stats Grid  */}
          <div className={`stats-grid ${styles.statsGridCustom}`}>
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
              <h3><i className={`fas fa-chart-area ${styles.chartIcon}`}></i> Engagement Overview (7 Days)</h3>
              <div className={`chart-placeholder ${styles.chartWrapper300}`}>
                <canvas id="engagementChart"></canvas>
              </div>
            </div>

            <div className="analytics-card">
              <h3><i className={`fas fa-chart-bar ${styles.chartIcon}`}></i> Views per Property</h3>
              <div className={`chart-placeholder ${styles.chartWrapper300}`}>
                <canvas id="propertyViewsChart"></canvas>
              </div>
            </div>

            <div className={`analytics-card ${styles.fullWidthCard}`}>
              <h3><i className={`fas fa-map-marked-alt ${styles.chartIcon}`}></i> Student Demographics & Location</h3>
              <div className={`chart-placeholder ${styles.chartWrapper350}`}>
                <canvas id="demographicsChart"></canvas>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
