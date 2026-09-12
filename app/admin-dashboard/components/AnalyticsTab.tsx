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

    return () => {
      chartInstancesRef.current.forEach((instance) => instance.destroy());
      chartInstancesRef.current = [];
    };
  }, [analyticsData]);

  return (
    <div className="analytics-dashboard">
      {/* Stat Cards Row */}
      <div className="analytics-stats-grid">
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
          <div className="analytics-stat-icon verified-students">
            <i className="fas fa-user-shield"></i>
          </div>
          <div>
            <h3 className="analytics-stat-number">
              {analyticsData?.stats?.verifiedStudents || 0}
            </h3>
            <p className="analytics-stat-label">Verified Students</p>
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

      {/* Chart Canvases */}
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
    </div>
  );
}
