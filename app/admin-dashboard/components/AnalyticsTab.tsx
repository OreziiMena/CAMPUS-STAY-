import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface AnalyticsTabProps {
  analyticsData: any;
}

export default function AnalyticsTab({ analyticsData }: AnalyticsTabProps) {
  const chartInstancesRef = useRef<Chart[]>([]);

  useEffect(() => {
    if (!analyticsData) return;

    // Clean up any existing instances first
    chartInstancesRef.current.forEach((instance) => instance.destroy());
    chartInstancesRef.current = [];

    const userDistributionCtx = document.getElementById("userDistributionChart") as HTMLCanvasElement | null;
    const growthCtx = document.getElementById("growthChart") as HTMLCanvasElement | null;

    if (userDistributionCtx) {
      const userChart = new Chart(userDistributionCtx, {
        type: "doughnut",
        data: {
          labels: ["Students", "Agents"],
          datasets: [
            {
              data: [analyticsData.stats?.totalStudents || 0, analyticsData.stats?.totalAgents || 0],
              backgroundColor: ["#10b981", "#3b82f6"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });
      chartInstancesRef.current.push(userChart);
    }

    if (growthCtx && analyticsData.charts?.labels?.length > 0) {
      const growthChart = new Chart(growthCtx, {
        type: "line",
        data: {
          labels: analyticsData.charts.labels,
          datasets: [
            {
              label: "New Listings Over Time",
              data: analyticsData.charts.data,
              borderColor: "rgb(2, 53, 28)",
              backgroundColor: "rgba(2, 53, 28, 0.1)",
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
        },
      });
      chartInstancesRef.current.push(growthChart);
    }

    // Payment Status Distribution Doughnut Chart
    const paymentDistCtx = document.getElementById("paymentDistributionChart") as HTMLCanvasElement | null;
    if (paymentDistCtx && analyticsData.paymentCharts?.statusDistribution) {
      const dist = analyticsData.paymentCharts.statusDistribution;
      const paymentChart = new Chart(paymentDistCtx, {
        type: "doughnut",
        data: {
          labels: ["Confirmed Paid", "Disputed", "Refunded", "Pending Approval"],
          datasets: [
            {
              data: [dist.paid || 0, dist.disputed || 0, dist.refunded || 0, dist.pending || 0],
              backgroundColor: ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });
      chartInstancesRef.current.push(paymentChart);
    }

    // Monthly Gross Revenue Bar Chart
    const revenueCtx = document.getElementById("revenueGrowthChart") as HTMLCanvasElement | null;
    if (revenueCtx && analyticsData.paymentCharts?.labels?.length > 0) {
      const revenueChart = new Chart(revenueCtx, {
        type: "bar",
        data: {
          labels: analyticsData.paymentCharts.labels,
          datasets: [
            {
              label: "Gross Collected (₦)",
              data: analyticsData.paymentCharts.data,
              backgroundColor: "rgba(16, 185, 129, 0.8)",
              borderColor: "#059669",
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (val) {
                  return "₦" + Number(val).toLocaleString();
                },
              },
            },
          },
        },
      });
      chartInstancesRef.current.push(revenueChart);
    }

    return () => {
      chartInstancesRef.current.forEach((instance) => instance.destroy());
      chartInstancesRef.current = [];
    };
  }, [analyticsData]);

  return (
    <div className="analytics-dashboard">
      {/* Platform & User Growth Section */}
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "rgb(2, 53, 28)", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="fas fa-users-cog" style={{ color: "#059669" }}></i> Platform Directory & Community Overview
        </h3>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>
          Registered students, verified agents, hostel listings, and roommate inquiries.
        </p>
      </div>

      {/* Stat Cards Row */}
      <div className="analytics-stats-grid">
        <div className="analytics-metric-card">
          <div className="analytics-stat-icon total-users">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <h3 className="analytics-stat-number">
              {analyticsData?.stats?.totalUsers ?? (analyticsData?.stats?.totalStudents || 0)}
            </h3>
            <p className="analytics-stat-label">Total Users</p>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-stat-icon total-students">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div>
            <h3 className="analytics-stat-number">
              {analyticsData?.stats?.totalStudents || 0}
            </h3>
            <p className="analytics-stat-label">Total Students</p>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-stat-icon total-agents">
            <i className="fas fa-user-tie"></i>
          </div>
          <div>
            <h3 className="analytics-stat-number">
              {analyticsData?.stats?.totalAgents || 0}
            </h3>
            <p className="analytics-stat-label">Total Agents</p>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-stat-icon verified-agents">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div>
            <h3 className="analytics-stat-number">
              {analyticsData?.stats?.verifiedAgents || 0}
            </h3>
            <p className="analytics-stat-label">Verified Agents</p>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-stat-icon total-properties">
            <i className="fas fa-building"></i>
          </div>
          <div>
            <h3 className="analytics-stat-number">
              {analyticsData?.stats?.totalProperties || 0}
            </h3>
            <p className="analytics-stat-label">Hostel Listings</p>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-stat-icon total-roommates">
            <i className="fas fa-user-friends"></i>
          </div>
          <div>
            <h3 className="analytics-stat-number">
              {analyticsData?.stats?.totalRoommates || 0}
            </h3>
            <p className="analytics-stat-label">Roommate Listings</p>
          </div>
        </div>
      </div>

      {/* Directory Chart Canvases */}
      <div className="analytics-charts-grid">
        <div className="analytics-chart-container">
          <h4 className="analytics-chart-title">User Distribution</h4>
          <div className="analytics-chart-canvas-box">
            <canvas id="userDistributionChart"></canvas>
          </div>
        </div>

        <div className="analytics-chart-container">
          <h4 className="analytics-chart-title">Listing Growth Rate</h4>
          <div className="analytics-chart-canvas-box">
            <canvas id="growthChart"></canvas>
          </div>
        </div>
      </div>

      {/* 2. Financial & Payment Overview Section */}
      <div style={{ marginTop: "40px", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "rgb(2, 53, 28)", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "10px" }}>
          <i className="fas fa-credit-card" style={{ color: "#059669" }}></i> Payment & Revenue Analytics
        </h3>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>
          Audited gross volume, platform retention fees, agent disbursements, and settled refunds.
        </p>
      </div>

      <div className="analytics-stats-grid">
        <div className="analytics-metric-card">
          <div className="analytics-stat-icon" style={{ background: "#ecfdf5", color: "#047857" }}>
            <i className="fas fa-wallet"></i>
          </div>
          <div>
            <h3 className="analytics-stat-number" style={{ color: "#047857" }}>
              ₦{(analyticsData?.paymentStats?.totalGrossVolume || 0).toLocaleString()}
            </h3>
            <p className="analytics-stat-label">Total Gross Volume</p>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-stat-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <i className="fas fa-chart-line"></i>
          </div>
          <div>
            <h3 className="analytics-stat-number" style={{ color: "#1d4ed8" }}>
              ₦{(analyticsData?.paymentStats?.netPlatformRevenue || 0).toLocaleString()}
            </h3>
            <p className="analytics-stat-label">Platform Net Revenue</p>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-stat-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <div>
            <h3 className="analytics-stat-number" style={{ color: "#b45309" }}>
              ₦{(analyticsData?.paymentStats?.totalDisbursedToAgents || 0).toLocaleString()}
            </h3>
            <p className="analytics-stat-label">Agent Payouts ({analyticsData?.paymentStats?.disbursedPayoutsCount || 0})</p>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-stat-icon" style={{ background: "#fef2f2", color: "#dc2626" }}>
            <i className="fas fa-undo-alt"></i>
          </div>
          <div>
            <h3 className="analytics-stat-number" style={{ color: "#dc2626" }}>
              ₦{(analyticsData?.paymentStats?.totalRefundedToStudents || 0).toLocaleString()}
            </h3>
            <p className="analytics-stat-label">Student Refunds ({analyticsData?.paymentStats?.refundedCount || 0})</p>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-stat-icon" style={{ background: "#fffbeb", color: "#b45309" }}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div>
            <h3 className="analytics-stat-number" style={{ color: "#b45309" }}>
              {analyticsData?.paymentStats?.disputedCount || 0}
            </h3>
            <p className="analytics-stat-label">Disputed Tours</p>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-stat-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div>
            <h3 className="analytics-stat-number" style={{ color: "#16a34a" }}>
              {analyticsData?.paymentStats?.paidCount || 0}
            </h3>
            <p className="analytics-stat-label">Confirmed Paid Tours</p>
          </div>
        </div>
      </div>

      {/* Payment Charts */}
      <div className="analytics-charts-grid" style={{ marginTop: "24px" }}>
        <div className="analytics-chart-container">
          <h4 className="analytics-chart-title">Payment Status Distribution</h4>
          <div className="analytics-chart-canvas-box">
            <canvas id="paymentDistributionChart"></canvas>
          </div>
        </div>

        <div className="analytics-chart-container">
          <h4 className="analytics-chart-title">Monthly Revenue Collected</h4>
          <div className="analytics-chart-canvas-box">
            <canvas id="revenueGrowthChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
