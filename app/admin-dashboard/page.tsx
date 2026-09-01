"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  getAdminDashboardData, 
  toggleUserVerification, 
  togglePropertyVerification,
  deletePropertyByAdmin,
  deleteUserByAdmin,
  getAdminAnalyticsData,
  getAgentActivityLogs
} from "@/app/actions/admin";
import { getPendingReports, moderateReport } from "@/app/actions/reports";
import Chart from "chart.js/auto";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "verifications";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Verification queues (Unverified items only)
  const [students, setStudents] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  
  // Full Directories (All items, verified or not)
  const [users, setUsers] = useState<any[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [activityFilter, setActivityFilter] = useState<string>("ALL");
  
  // Tab control
  const [activeTab, setActiveTab] = useState("verifications");
  const [activeQueueTab, setActiveQueueTab] = useState("students");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const chartInstancesRef = useRef<Chart[]>([]);
  const [activePreviewDoc, setActivePreviewDoc] = useState<{ url: string; title: string } | null>(null);

  const fetchQueues = async () => {
    setLoading(true);
    setError("");
    const res = await getAdminDashboardData();
    if (res.success) {
      setStudents(res.students || []);
      setAgents(res.agents || []);
      setProperties(res.properties || []);
      setUsers(res.users || []);
      setAllProperties(res.allProperties || []);
    } else {
      setError(res.error || "Failed to fetch dashboard queues.");
    }

    const reportsRes = await getPendingReports();
    if (reportsRes.success) {
      setReports(reportsRes.reports || []);
    }

    const analyticsRes = await getAdminAnalyticsData();
    if (analyticsRes.success) {
      setAnalyticsData(analyticsRes);
    }

    const activityRes = await getAgentActivityLogs();
    if (activityRes.success) {
      setActivityLogs(activityRes.logs || []);
    }

    setLoading(false);
  };

  const handleModerateReport = async (reportId: string, action: "DISMISS" | "RESOLVE", deleteListing: boolean = false) => {
    setActionLoading(reportId);
    setError("");
    const res = await moderateReport(reportId, action, deleteListing);
    if (res.success) {
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      if (deleteListing) {
        fetchQueues();
      }
    } else {
      setError(res.error || "Failed to moderate report.");
    }
    setActionLoading(null);
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  useEffect(() => {
    setActiveTab(tabParam);
    setSearchQuery(""); // Clear search query when changing tabs
  }, [tabParam]);

  useEffect(() => {
    if (activeTab !== "analytics" || !analyticsData) return;

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
              data: [analyticsData.stats.totalStudents, analyticsData.stats.totalAgents],
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

    if (growthCtx && analyticsData.charts.labels.length > 0) {
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
  }, [activeTab, analyticsData]);

  const handleVerifyUser = async (profileId: string, role: "STUDENT" | "AGENT") => {
    setActionLoading(profileId);
    const res = await toggleUserVerification(profileId, role, true);
    if (res.success) {
      if (role === "STUDENT") {
        setStudents((prev) => prev.filter((s) => s.id !== profileId));
      } else {
        setAgents((prev) => prev.filter((a) => a.id !== profileId));
      }
      setUsers((prev) => prev.map((u) => {
        if (role === "STUDENT" && u.studentProfile?.id === profileId) {
          return { ...u, studentProfile: { ...u.studentProfile, isVerified: true } };
        }
        if (role === "AGENT" && u.agentProfile?.id === profileId) {
          return { ...u, agentProfile: { ...u.agentProfile, isVerified: true } };
        }
        return u;
      }));
    } else {
      alert(res.error || "Failed to verify profile.");
    }
    setActionLoading(null);
  };

  const handleRejectUser = async (profileId: string, role: "STUDENT" | "AGENT") => {
    if (!confirm("Are you sure you want to REJECT and DELETE this user registration? This action is permanent.")) {
      return;
    }
    setActionLoading(profileId);
    const res = await deleteUserByAdmin(profileId, role);
    if (res.success) {
      if (role === "STUDENT") {
        setStudents((prev) => prev.filter((s) => s.id !== profileId));
      } else {
        setAgents((prev) => prev.filter((a) => a.id !== profileId));
      }
      setUsers((prev) => prev.filter((u) => {
        const idToCompare = role === "STUDENT" ? u.studentProfile?.id : u.agentProfile?.id;
        return idToCompare !== profileId;
      }));
    } else {
      alert(res.error || "Failed to reject user.");
    }
    setActionLoading(null);
  };

  const handleVerifyProperty = async (propertyId: string) => {
    setActionLoading(propertyId);
    const res = await togglePropertyVerification(propertyId, true);
    if (res.success) {
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setAllProperties((prev) => prev.map((p) => {
        if (p.id === propertyId) {
          return { ...p, isVerified: true };
        }
        return p;
      }));
    } else {
      alert(res.error || "Failed to verify property.");
    }
    setActionLoading(null);
  };

  const handleRejectProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to REJECT and DELETE this property listing? This action is permanent.")) {
      return;
    }
    setActionLoading(propertyId);
    const res = await deletePropertyByAdmin(propertyId);
    if (res.success) {
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setAllProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } else {
      alert(res.error || "Failed to reject property.");
    }
    setActionLoading(null);
  };

  const handleToggleVerificationAllUsers = async (userId: string, role: "STUDENT" | "AGENT", currentStatus: boolean) => {
    const userObj = users.find((u) => u.id === userId);
    if (!userObj) return;
    const profileId = role === "STUDENT" ? userObj.studentProfile?.id : userObj.agentProfile?.id;
    if (!profileId) return;

    setActionLoading(userId);
    const res = await toggleUserVerification(profileId, role, !currentStatus);
    if (res.success) {
      setUsers((prev) => prev.map((u) => {
        if (u.id === userId) {
          if (role === "STUDENT") {
            return { ...u, studentProfile: { ...u.studentProfile, isVerified: !currentStatus } };
          } else {
            return { ...u, agentProfile: { ...u.agentProfile, isVerified: !currentStatus } };
          }
        }
        return u;
      }));
      
      if (!currentStatus) {
        if (role === "STUDENT") {
          setStudents((prev) => prev.filter((s) => s.id !== profileId));
        } else {
          setAgents((prev) => prev.filter((a) => a.id !== profileId));
        }
      } else {
        fetchQueues();
      }
    } else {
      alert(res.error || "Failed to toggle verification.");
    }
    setActionLoading(null);
  };

  const handleDeleteUserAllUsers = async (userId: string, role: "STUDENT" | "AGENT") => {
    const userObj = users.find((u) => u.id === userId);
    if (!userObj) return;
    const profileId = role === "STUDENT" ? userObj.studentProfile?.id : userObj.agentProfile?.id;
    if (!profileId) return;

    if (!confirm("Are you sure you want to permanently DELETE this user account? All their data will be lost.")) {
      return;
    }

    setActionLoading(userId);
    const res = await deleteUserByAdmin(profileId, role);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      if (role === "STUDENT") {
        setStudents((prev) => prev.filter((s) => s.id !== profileId));
      } else {
        setAgents((prev) => prev.filter((a) => a.id !== profileId));
      }
    } else {
      alert(res.error || "Failed to delete user account.");
    }
    setActionLoading(null);
  };

  const handleTogglePropertyVerificationAll = async (propertyId: string, currentStatus: boolean) => {
    setActionLoading(propertyId);
    const res = await togglePropertyVerification(propertyId, !currentStatus);
    if (res.success) {
      setAllProperties((prev) => prev.map((p) => {
        if (p.id === propertyId) {
          return { ...p, isVerified: !currentStatus };
        }
        return p;
      }));
      if (!currentStatus) {
        setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      } else {
        fetchQueues();
      }
    } else {
      alert(res.error || "Failed to update property status.");
    }
    setActionLoading(null);
  };

  const handleDeletePropertyAll = async (propertyId: string) => {
    if (!confirm("Are you sure you want to permanently DELETE this property listing? This action is permanent.")) {
      return;
    }
    setActionLoading(propertyId);
    const res = await deletePropertyByAdmin(propertyId);
    if (res.success) {
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setAllProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } else {
      alert(res.error || "Failed to delete property.");
    }
    setActionLoading(null);
  };

  // Filter users by role for separate lists
  const studentUsers = users.filter((u) => u.role === "STUDENT");
  const agentUsers = users.filter((u) => u.role === "AGENT");

  // Search filter logic
  const filteredStudents = studentUsers.filter((u) => {
    const name = u.studentProfile?.fullName?.toLowerCase() || "";
    const username = u.studentProfile?.username?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";
    const phone = u.phone?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return name.includes(query) || username.includes(query) || email.includes(query) || phone.includes(query);
  });

  const filteredAgents = agentUsers.filter((u) => {
    const name = u.agentProfile?.fullName?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";
    const phone = u.phone?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return name.includes(query) || email.includes(query) || phone.includes(query);
  });

  const filteredAllProperties = allProperties.filter((p) => {
    const title = p.title?.toLowerCase() || "";
    const location = p.location?.toLowerCase() || "";
    const university = p.university?.toLowerCase() || "";
    const agentName = p.agent?.fullName?.toLowerCase() || "";
    const studentName = p.student?.fullName?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return title.includes(query) || location.includes(query) || university.includes(query) || agentName.includes(query) || studentName.includes(query);
  });

  // Filter queues under verification tab too if query exists
  const filteredQueueStudents = students.filter((s) => {
    const name = s.fullName?.toLowerCase() || "";
    const username = s.username?.toLowerCase() || "";
    const university = s.university?.toLowerCase() || "";
    const email = s.user?.email?.toLowerCase() || "";
    const phone = s.user?.phone?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return name.includes(query) || username.includes(query) || university.includes(query) || email.includes(query) || phone.includes(query);
  });

  const filteredQueueAgents = agents.filter((a) => {
    const name = a.fullName?.toLowerCase() || "";
    const address = a.address?.toLowerCase() || "";
    const email = a.user?.email?.toLowerCase() || "";
    const phone = a.user?.phone?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return name.includes(query) || address.includes(query) || email.includes(query) || phone.includes(query);
  });

  const filteredQueueProperties = properties.filter((p) => {
    const title = p.title?.toLowerCase() || "";
    const location = p.location?.toLowerCase() || "";
    const university = p.university?.toLowerCase() || "";
    const agentName = p.agent?.fullName?.toLowerCase() || "";
    const studentName = p.student?.fullName?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return title.includes(query) || location.includes(query) || university.includes(query) || agentName.includes(query) || studentName.includes(query);
  });

  const filteredReports = reports.filter((r) => {
    const reporterEmail = r.reporter?.email?.toLowerCase() || "";
    const description = r.description?.toLowerCase() || "";
    const reason = r.reason?.toLowerCase() || "";
    const targetName = (r.property?.title || r.roommate?.fullName || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return reporterEmail.includes(query) || description.includes(query) || reason.includes(query) || targetName.includes(query);
  });

  const filteredActivityLogs = activityLogs.filter((log) => {
    if (activityFilter !== "ALL" && log.action !== activityFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const name = log.userName?.toLowerCase() || "";
    const email = log.userEmail?.toLowerCase() || "";
    const desc = log.description?.toLowerCase() || "";
    const title = log.propertyTitle?.toLowerCase() || "";
    const action = log.action?.toLowerCase() || "";
    return name.includes(query) || email.includes(query) || desc.includes(query) || title.includes(query) || action.includes(query);
  });

  return (
    <div>
      {error && (
        <div className="error-banner" style={{ background: "#fdf2f2", border: "1px solid #f8b4b4", color: "#9b1c1c", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {/* Dynamic Directory Search Bar */}
      <div style={{ marginBottom: "25px", display: "flex", gap: "10px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <i className="fas fa-search" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#888" }}></i>
          <input
            type="text"
            placeholder={
              activeTab === "students" 
                ? "Search students by name, username, email, or phone..." 
                : activeTab === "agents" 
                  ? "Search agents by name, email, or phone..." 
                  : activeTab === "properties" 
                    ? "Search properties by title, location, school, or owner..."
                    : activeTab === "activity-logs"
                      ? "Search activity logs by agent name, email, property title..."
                      : "Search verification queues..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 15px 12px 40px",
              borderRadius: "8px",
              border: "1px solid #eaeaea",
              fontSize: "14px",
              outline: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.01)"
            }}
          />
        </div>
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="reject-btn"
            style={{ borderRadius: "8px", display: "flex", alignItems: "center", gap: "5px" }}
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="no-data-text">
          <i className="fas fa-spinner fa-spin"></i> Loading pending requests...
        </div>
      ) : (
        <>
          {/* 1. VERIFICATIONS DASHBOARD TAB */}
          {activeTab === "verifications" && (
            <div>
              <div className="admin-tabs">
                <button 
                  className={`tab-btn ${activeQueueTab === "students" ? "active" : ""}`}
                  onClick={() => setActiveQueueTab("students")}
                >
                  Students Queue ({students.length})
                </button>
                <button 
                  className={`tab-btn ${activeQueueTab === "agents" ? "active" : ""}`}
                  onClick={() => setActiveQueueTab("agents")}
                >
                  Agents Queue ({agents.length})
                </button>
                <button 
                  className={`tab-btn ${activeQueueTab === "properties" ? "active" : ""}`}
                  onClick={() => setActiveQueueTab("properties")}
                >
                  Properties Queue ({properties.length})
                </button>
              </div>

              {activeQueueTab === "students" && (
                <div className="admin-card">
                  <h2><i className="fas fa-user-graduate"></i> Pending Student Verifications</h2>
                  {students.length === 0 ? (
                    <div className="no-data-text">No pending student verification requests.</div>
                  ) : filteredQueueStudents.length === 0 ? (
                    <div className="no-data-text">No matching student verification requests.</div>
                  ) : (
                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Full Name</th>
                            <th>Username</th>
                            <th>University</th>
                            <th>Contact Details</th>
                            <th>Verification Documents</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredQueueStudents.map((student) => (
                            <tr key={student.id}>
                              <td><strong>{student.fullName}</strong></td>
                              <td>@{student.username}</td>
                              <td>{student.university}</td>
                              <td>
                                <div>{student.user.email}</div>
                                <div style={{ color: "#666", fontSize: "12px" }}>{student.user.phone}</div>
                              </td>
                              <td>
                                  <div className="doc-links-cell">
                                    {!student.idCardDoc && !student.feesReceiptDoc && !student.portalScreenshotDoc && !student.jambLetterDoc && (
                                      <span style={{ color: "#888", fontSize: "13px" }}>No documents uploaded</span>
                                    )}
                                    {student.idCardDoc && (
                                      <button 
                                        onClick={() => setActivePreviewDoc({ url: student.idCardDoc, title: `${student.fullName}'s Student ID Card` })}
                                        className="doc-link"
                                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", padding: "4px 0", color: "#1c64f2", fontStyle: "normal", textAlign: "left", textDecoration: "underline" }}
                                      >
                                        <i className="fas fa-id-card"></i> Student ID Card
                                      </button>
                                    )}
                                    {student.feesReceiptDoc && (
                                      <button 
                                        onClick={() => setActivePreviewDoc({ url: student.feesReceiptDoc, title: `${student.fullName}'s School Fees Receipt` })}
                                        className="doc-link"
                                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", padding: "4px 0", color: "#1c64f2", fontStyle: "normal", textAlign: "left", textDecoration: "underline" }}
                                      >
                                        <i className="fas fa-receipt"></i> School Fees Receipt
                                      </button>
                                    )}
                                    {student.portalScreenshotDoc && (
                                      <button 
                                        onClick={() => setActivePreviewDoc({ url: student.portalScreenshotDoc, title: `${student.fullName}'s Portal Screenshot` })}
                                        className="doc-link"
                                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", padding: "4px 0", color: "#1c64f2", fontStyle: "normal", textAlign: "left", textDecoration: "underline" }}
                                      >
                                        <i className="fas fa-desktop"></i> Portal Screenshot
                                      </button>
                                    )}
                                    {student.jambLetterDoc && (
                                      <button 
                                        onClick={() => setActivePreviewDoc({ url: student.jambLetterDoc, title: `${student.fullName}'s JAMB Letter` })}
                                        className="doc-link"
                                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", padding: "4px 0", color: "#1c64f2", fontStyle: "normal", textAlign: "left", textDecoration: "underline" }}
                                      >
                                        <i className="fas fa-envelope-open-text"></i> JAMB Letter
                                      </button>
                                    )}
                                  </div>
                              </td>
                              <td>
                                <div className="admin-action-btns">
                                  <button 
                                    onClick={() => handleVerifyUser(student.id, "STUDENT")}
                                    disabled={actionLoading !== null}
                                    className="approve-btn"
                                  >
                                    {actionLoading === student.id ? "Approving..." : "Approve"}
                                  </button>
                                  <button 
                                    onClick={() => handleRejectUser(student.id, "STUDENT")}
                                    disabled={actionLoading !== null}
                                    className="reject-btn"
                                  >
                                    {actionLoading === student.id ? "Rejecting..." : "Reject"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeQueueTab === "agents" && (
                <div className="admin-card">
                  <h2><i className="fas fa-user-tie"></i> Pending Agent/Landlord Verifications</h2>
                  {agents.length === 0 ? (
                    <div className="no-data-text">No pending agent verification requests.</div>
                  ) : filteredQueueAgents.length === 0 ? (
                    <div className="no-data-text">No matching agent verification requests.</div>
                  ) : (
                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Full Name</th>
                            <th>Business Address</th>
                            <th>Contact Details</th>
                            <th>Verification Document</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredQueueAgents.map((agent) => (
                            <tr key={agent.id}>
                              <td><strong>{agent.fullName}</strong></td>
                              <td>{agent.address || "No office address provided"}</td>
                              <td>
                                <div>{agent.user.email}</div>
                                <div style={{ color: "#666", fontSize: "12px" }}>{agent.user.phone}</div>
                              </td>
                              <td>
                                {agent.ninDocument ? (
                                  <button 
                                    onClick={() => setActivePreviewDoc({ url: agent.ninDocument, title: `${agent.fullName}'s NIN / Govt ID Document` })}
                                    className="doc-link"
                                    style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", padding: "4px 0", color: "#1c64f2", fontStyle: "normal", textAlign: "left", textDecoration: "underline" }}
                                  >
                                    <i className="fas fa-file-alt"></i> NIN / Govt ID Document
                                  </button>
                                ) : (
                                  <span style={{ color: "#d32f2f", fontSize: "13px", fontWeight: "600" }}>No Document Uploaded</span>
                                )}
                              </td>
                              <td>
                                <div className="admin-action-btns">
                                  <button 
                                    onClick={() => handleVerifyUser(agent.id, "AGENT")}
                                    disabled={actionLoading !== null}
                                    className="approve-btn"
                                  >
                                    {actionLoading === agent.id ? "Approving..." : "Approve"}
                                  </button>
                                  <button 
                                    onClick={() => handleRejectUser(agent.id, "AGENT")}
                                    disabled={actionLoading !== null}
                                    className="reject-btn"
                                  >
                                    {actionLoading === agent.id ? "Rejecting..." : "Reject"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeQueueTab === "properties" && (
                <div className="admin-card">
                  <h2><i className="fas fa-building"></i> Pending Property Approvals</h2>
                  {properties.length === 0 ? (
                    <div className="no-data-text">No pending property approvals.</div>
                  ) : filteredQueueProperties.length === 0 ? (
                    <div className="no-data-text">No matching property approvals.</div>
                  ) : (
                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Property details</th>
                            <th>Type</th>
                            <th>Price & Fee Breakdown</th>
                            <th>Location & Distance</th>
                            <th>Listed By</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredQueueProperties.map((property) => (
                            <tr key={property.id}>
                              <td>
                                <div className="property-preview-cell">
                                  <img 
                                    src={property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3"} 
                                    alt={property.title} 
                                    className="property-preview-img"
                                  />
                                  <span className="property-preview-title">{property.title}</span>
                                </div>
                              </td>
                              <td>{property.hostelType}</td>
                              <td>
                                <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "140px" }}>
                                  <strong style={{ fontSize: "0.95rem", color: "rgb(2, 53, 28)" }}>
                                    ₦{property.price.toLocaleString()}
                                    <span style={{ fontSize: "0.75rem", color: "#666", fontWeight: "normal" }}> / yr</span>
                                  </strong>
                                  <div style={{ fontSize: "0.78rem", color: "#374151", lineHeight: "1.35", backgroundColor: "#f9fafb", padding: "4px 8px", borderRadius: "6px", border: "1px solid #e5e7eb", marginTop: "3px" }}>
                                    <div><span style={{ color: "#6b7280" }}>Rent:</span> ₦{(property.rentAmount ?? property.price).toLocaleString()}</div>
                                    <div>
                                      <span style={{ color: "#6b7280" }}>Agent Fee:</span> ₦{(property.agentFee ?? 0).toLocaleString()}{" "}
                                      {property.isNegotiable ? (
                                        <span style={{ color: "#047857", fontWeight: "700", fontSize: "0.7rem", backgroundColor: "rgba(16, 185, 129, 0.12)", padding: "1px 5px", borderRadius: "4px" }}>
                                          Negotiable
                                        </span>
                                      ) : (
                                        <span style={{ color: "#6b7280", fontSize: "0.7rem" }}>(Fixed)</span>
                                      )}
                                    </div>
                                    {property.cautionFee !== null && property.cautionFee !== undefined && property.cautionFee > 0 && (
                                      <div><span style={{ color: "#6b7280" }}>Caution Fee:</span> ₦{property.cautionFee.toLocaleString()}</div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>{property.location}</div>
                                <div style={{ color: "#666", fontSize: "12px" }}>{property.distance}</div>
                              </td>
                              <td>
                                {property.agent ? (
                                  <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                      <strong>{property.agent.username ? `@${property.agent.username}` : property.agent.fullName}</strong>
                                      {property.agent.isVerified && (
                                        <span style={{ color: "#2e7d32" }} title="Verified Owner">
                                          <i className="fas fa-check-circle"></i>
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#666" }}>Agent/Landlord</div>
                                  </div>
                                ) : property.student ? (
                                  <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                      <strong>{property.student.username ? `@${property.student.username}` : property.student.fullName}</strong>
                                      {property.student.isVerified && (
                                        <span style={{ color: "#2e7d32" }} title="Verified Owner">
                                          <i className="fas fa-check-circle"></i>
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#666" }}>Student (Roommate Space)</div>
                                  </div>
                                ) : (
                                  "CS Official"
                                )}
                              </td>
                              <td>
                                <div className="admin-action-btns">
                                  <button 
                                    onClick={() => handleVerifyProperty(property.id)}
                                    disabled={actionLoading !== null}
                                    className="approve-btn"
                                  >
                                    {actionLoading === property.id ? "Approving..." : "Approve"}
                                  </button>
                                  <button 
                                    onClick={() => handleRejectProperty(property.id)}
                                    disabled={actionLoading !== null}
                                    className="reject-btn"
                                  >
                                    {actionLoading === property.id ? "Rejecting..." : "Reject"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. STUDENT USERS TAB */}
          {activeTab === "students" && (
            <div className="admin-card">
              <h2><i className="fas fa-user-graduate"></i> Student Users Directory</h2>
              {studentUsers.length === 0 ? (
                <div className="no-data-text">No student accounts found.</div>
              ) : filteredStudents.length === 0 ? (
                <div className="no-data-text">No matching student accounts found.</div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Username</th>
                        <th>University</th>
                        <th>Email / Contact</th>
                        <th>Verification Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((u) => {
                        const isVerified = u.studentProfile?.isVerified || false;
                        return (
                          <tr key={u.id}>
                            <td style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <strong>{u.studentProfile?.fullName || "Student"}</strong>
                              {isVerified && (
                                <i className="fas fa-check-circle verified-icon" style={{ color: "#2e7d32", fontSize: "0.85rem" }}></i>
                              )}
                            </td>
                            <td>{u.studentProfile?.username ? `@${u.studentProfile.username}` : "N/A"}</td>
                            <td>{u.studentProfile?.university || "N/A"}</td>
                            <td>
                              <div>{u.email}</div>
                              <div style={{ color: "#666", fontSize: "12px" }}>{u.phone}</div>
                            </td>
                            <td>
                              {isVerified ? (
                                <span className="status-badge verified"><i className="fas fa-check-circle"></i> Verified</span>
                              ) : (
                                <span className="status-badge unverified"><i className="fas fa-hourglass-half"></i> Unverified</span>
                              )}
                            </td>
                            <td>
                              <div className="admin-action-btns">
                                <button 
                                  onClick={() => handleToggleVerificationAllUsers(u.id, "STUDENT", isVerified)}
                                  disabled={actionLoading !== null}
                                  className={isVerified ? "reject-btn" : "approve-btn"}
                                  style={{ minWidth: "120px" }}
                                >
                                  {actionLoading === u.id ? "Updating..." : (isVerified ? "Revoke Verify" : "Verify Account")}
                                </button>
                                <button 
                                  onClick={() => handleDeleteUserAllUsers(u.id, "STUDENT")}
                                  disabled={actionLoading !== null}
                                  className="reject-btn"
                                >
                                  {actionLoading === u.id ? "Deleting..." : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 3. AGENT USERS TAB */}
          {activeTab === "agents" && (
            <div className="admin-card">
              <h2><i className="fas fa-user-tie"></i> Agent / Landlord Directory</h2>
              {agentUsers.length === 0 ? (
                <div className="no-data-text">No agent accounts found.</div>
              ) : filteredAgents.length === 0 ? (
                <div className="no-data-text">No matching agent accounts found.</div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Agent Name</th>
                        <th>Office Address</th>
                        <th>Email / Contact</th>
                        <th>Verification Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAgents.map((u) => {
                        const isVerified = u.agentProfile?.isVerified || false;
                        return (
                          <tr key={u.id}>
                            <td style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <strong>{u.agentProfile?.fullName || "Agent"}</strong>
                              {isVerified && (
                                <i className="fas fa-check-circle verified-icon" style={{ color: "#2e7d32", fontSize: "0.85rem" }}></i>
                              )}
                            </td>
                            <td>{u.agentProfile?.address || "No office address"}</td>
                            <td>
                              <div>{u.email}</div>
                              <div style={{ color: "#666", fontSize: "12px" }}>{u.phone}</div>
                            </td>
                            <td>
                              {isVerified ? (
                                <span className="status-badge verified"><i className="fas fa-check-circle"></i> Verified</span>
                              ) : (
                                <span className="status-badge unverified"><i className="fas fa-hourglass-half"></i> Unverified</span>
                              )}
                            </td>
                            <td>
                              <div className="admin-action-btns">
                                <button 
                                  onClick={() => handleToggleVerificationAllUsers(u.id, "AGENT", isVerified)}
                                  disabled={actionLoading !== null}
                                  className={isVerified ? "reject-btn" : "approve-btn"}
                                  style={{ minWidth: "120px" }}
                                >
                                  {actionLoading === u.id ? "Updating..." : (isVerified ? "Revoke Verify" : "Verify Account")}
                                </button>
                                <button 
                                  onClick={() => handleDeleteUserAllUsers(u.id, "AGENT")}
                                  disabled={actionLoading !== null}
                                  className="reject-btn"
                                >
                                  {actionLoading === u.id ? "Deleting..." : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 4. PROPERTIES DIRECTORY TAB */}
          {activeTab === "properties" && (
            <div className="admin-card">
              <h2><i className="fas fa-building"></i> Properties Directory</h2>
              {allProperties.length === 0 ? (
                <div className="no-data-text">No listed properties found.</div>
              ) : filteredAllProperties.length === 0 ? (
                <div className="no-data-text">No matching properties found.</div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Property Details</th>
                        <th>Type</th>
                        <th>Price & Fee Breakdown</th>
                        <th>Location & School</th>
                        <th>Listed By</th>
                        <th>Verification Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAllProperties.map((p) => {
                        const isVerified = p.isVerified || false;
                        const isOwnerVerified = p.agent ? p.agent.isVerified : (p.student ? p.student.isVerified : false);
                        return (
                          <tr key={p.id}>
                            <td>
                              <div className="property-preview-cell">
                                <img 
                                  src={p.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3"} 
                                  alt={p.title} 
                                  className="property-preview-img"
                                />
                                <span className="property-preview-title">{p.title}</span>
                              </div>
                            </td>
                            <td>{p.hostelType}</td>
                            <td>
                              <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "140px" }}>
                                <strong style={{ fontSize: "0.95rem", color: "rgb(2, 53, 28)" }}>
                                  ₦{p.price.toLocaleString()}
                                  <span style={{ fontSize: "0.75rem", color: "#666", fontWeight: "normal" }}> / yr</span>
                                </strong>
                                <div style={{ fontSize: "0.78rem", color: "#374151", lineHeight: "1.35", backgroundColor: "#f9fafb", padding: "4px 8px", borderRadius: "6px", border: "1px solid #e5e7eb", marginTop: "3px" }}>
                                  <div><span style={{ color: "#6b7280" }}>Rent:</span> ₦{(p.rentAmount ?? p.price).toLocaleString()}</div>
                                  <div>
                                    <span style={{ color: "#6b7280" }}>Agent Fee:</span> ₦{(p.agentFee ?? 0).toLocaleString()}{" "}
                                    {p.isNegotiable ? (
                                      <span style={{ color: "#047857", fontWeight: "700", fontSize: "0.7rem", backgroundColor: "rgba(16, 185, 129, 0.12)", padding: "1px 5px", borderRadius: "4px" }}>
                                        Negotiable
                                      </span>
                                    ) : (
                                      <span style={{ color: "#6b7280", fontSize: "0.7rem" }}>(Fixed)</span>
                                    )}
                                  </div>
                                  {p.cautionFee !== null && p.cautionFee !== undefined && p.cautionFee > 0 && (
                                    <div><span style={{ color: "#6b7280" }}>Caution Fee:</span> ₦{p.cautionFee.toLocaleString()}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>{p.location}</div>
                              <div style={{ color: "#666", fontSize: "12px" }}>Near {p.university} ({p.distance})</div>
                            </td>
                            <td>
                              {p.agent ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <strong>{p.agent.fullName}</strong>
                                  {p.agent.isVerified && (
                                    <span style={{ color: "#2e7d32" }} title="Verified Owner">
                                      <i className="fas fa-check-circle"></i>
                                    </span>
                                  )}
                                </div>
                              ) : p.student ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <strong>{p.student.username ? `@${p.student.username}` : p.student.fullName}</strong>
                                  {p.student.isVerified && (
                                    <span style={{ color: "#2e7d32" }} title="Verified Owner">
                                      <i className="fas fa-check-circle"></i>
                                    </span>
                                  )}
                                </div>
                              ) : (
                                "CS Official"
                              )}
                            </td>
                            <td>
                              {isOwnerVerified ? (
                                <span className="status-badge verified"><i className="fas fa-check-circle"></i> Verified</span>
                              ) : (
                                <span className="status-badge unverified"><i className="fas fa-hourglass-half"></i> Unverified</span>
                              )}
                            </td>
                            <td>
                              <div className="admin-action-btns">
                                <button 
                                  onClick={() => handleTogglePropertyVerificationAll(p.id, isVerified)}
                                  disabled={actionLoading !== null}
                                  className={isVerified ? "reject-btn" : "approve-btn"}
                                  style={{ minWidth: "120px" }}
                                >
                                  {actionLoading === p.id ? "Updating..." : (isVerified ? "Revoke Approval" : "Approve Listing")}
                                </button>
                                <button 
                                  onClick={() => handleDeletePropertyAll(p.id)}
                                  disabled={actionLoading !== null}
                                  className="reject-btn"
                                >
                                  {actionLoading === p.id ? "Deleting..." : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="analytics-dashboard">
              {/* Stat Cards Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
                <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eaeaea", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{ background: "#e8fdf4", color: "#10b981", width: "50px", height: "50px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }} className="stat-icon">
                    <i className="fas fa-user-graduate"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "rgb(2, 53, 28)", fontSize: "1.6rem", fontWeight: "700" }}>
                      {analyticsData?.stats.totalStudents || 0}
                    </h3>
                    <p style={{ margin: 0, color: "#666", fontSize: "0.85rem" }}>Total Students</p>
                  </div>
                </div>

                <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eaeaea", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{ background: "#d1fae5", color: "#065f46", width: "50px", height: "50px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }} className="stat-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "rgb(2, 53, 28)", fontSize: "1.6rem", fontWeight: "700" }}>
                      {analyticsData?.stats.verifiedStudents || 0}
                    </h3>
                    <p style={{ margin: 0, color: "#666", fontSize: "0.85rem" }}>Verified Students</p>
                  </div>
                </div>

                <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eaeaea", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{ background: "#eef2ff", color: "#3b82f6", width: "50px", height: "50px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }} className="stat-icon">
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "rgb(2, 53, 28)", fontSize: "1.6rem", fontWeight: "700" }}>
                      {analyticsData?.stats.totalAgents || 0}
                    </h3>
                    <p style={{ margin: 0, color: "#666", fontSize: "0.85rem" }}>Total Agents</p>
                  </div>
                </div>

                <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eaeaea", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{ background: "#dbeafe", color: "#1e40af", width: "50px", height: "50px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }} className="stat-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "rgb(2, 53, 28)", fontSize: "1.6rem", fontWeight: "700" }}>
                      {analyticsData?.stats.verifiedAgents || 0}
                    </h3>
                    <p style={{ margin: 0, color: "#666", fontSize: "0.85rem" }}>Verified Agents</p>
                  </div>
                </div>

                <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eaeaea", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{ background: "#fef7e0", color: "#f39c12", width: "50px", height: "50px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }} className="stat-icon">
                    <i className="fas fa-building"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "rgb(2, 53, 28)", fontSize: "1.6rem", fontWeight: "700" }}>
                      {analyticsData?.stats.totalProperties || 0}
                    </h3>
                    <p style={{ margin: 0, color: "#666", fontSize: "0.85rem" }}>Hostel Listings</p>
                  </div>
                </div>

                <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eaeaea", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{ background: "#fdf2f2", color: "#e74c3c", width: "50px", height: "50px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }} className="stat-icon">
                    <i className="fas fa-user-friends"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "rgb(2, 53, 28)", fontSize: "1.6rem", fontWeight: "700" }}>
                      {analyticsData?.stats.totalRoommates || 0}
                    </h3>
                    <p style={{ margin: 0, color: "#666", fontSize: "0.85rem" }}>Roommate Listings</p>
                  </div>
                </div>
              </div>

              {/* Chart Canvases */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" }}>
                <div style={{ background: "white", padding: "25px", borderRadius: "12px", border: "1px solid #eaeaea", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                  <h4 style={{ margin: "0 0 20px 0", color: "rgb(2, 53, 28)", fontSize: "1.1rem", fontWeight: "700" }}>User Distribution</h4>
                  <div style={{ maxHeight: "300px", display: "flex", justifyContent: "center" }}>
                    <canvas id="userDistributionChart"></canvas>
                  </div>
                </div>

                <div style={{ background: "white", padding: "25px", borderRadius: "12px", border: "1px solid #eaeaea", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                  <h4 style={{ margin: "0 0 20px 0", color: "rgb(2, 53, 28)", fontSize: "1.1rem", fontWeight: "700" }}>Listing Growth Rate</h4>
                  <div style={{ maxHeight: "300px" }}>
                    <canvas id="growthChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="admin-card">
              <div className="card-header" style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700", color: "rgb(2, 53, 28)", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <i className="fas fa-flag" style={{ color: "#d9534f" }}></i> User Flagged Reports Queue
                </h4>
                <p style={{ color: "#666", fontSize: "0.85rem", margin: "5px 0 0 0" }}>Review and moderate reports submitted by students against properties or roommate profiles.</p>
              </div>

              {filteredReports.length === 0 ? (
                <div className="no-data-text">
                  <i className="fas fa-check-circle" style={{ color: "#2e7d32", fontSize: "1.5rem", marginRight: "8px" }}></i>
                  No pending flagged reports found matching your criteria.
                </div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date Reported</th>
                        <th>Reporter</th>
                        <th>Target Details</th>
                        <th>Reason for Report</th>
                        <th>Description Details</th>
                        <th>Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((r: any) => {
                        const targetType = r.propertyId ? "Property Listing" : "Roommate Profile";
                        const targetName = r.property ? r.property.title : (r.roommate ? r.roommate.fullName : "Unknown Target");
                        const targetId = r.propertyId || r.roommateId;
                        const targetLink = r.propertyId 
                          ? `/apartment-details?id=${r.propertyId}` 
                          : `/roommates`;

                        return (
                          <tr key={r.id}>
                            <td style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                              {new Date(r.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td>
                              <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>{r.reporter?.email}</div>
                              <span style={{ fontSize: "0.75rem", color: "#888" }}>ID: {r.reporter?.id.substring(0, 8)}</span>
                            </td>
                            <td>
                              <span style={{ fontSize: "0.75rem", padding: "3px 8px", borderRadius: "20px", fontWeight: "700", textTransform: "uppercase", backgroundColor: r.propertyId ? "#e8f0fe" : "#fef7e0", color: r.propertyId ? "#1a73e8" : "#b06000", display: "inline-block", marginBottom: "5px" }}>
                                {targetType}
                              </span>
                              <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                                <a href={targetLink} target="_blank" rel="noopener noreferrer" style={{ color: "rgb(2, 53, 28)", textDecoration: "underline" }}>
                                  {targetName}
                                </a>
                              </div>
                              <span style={{ fontSize: "0.75rem", color: "#888" }}>ID: {targetId?.substring(0, 8)}</span>
                            </td>
                            <td>
                              <span className="status-badge" style={{ backgroundColor: "#fce8e6", color: "#c5221f", border: "1px solid #fad2cf", display: "inline-flex", alignItems: "center", gap: "5px", textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "700", padding: "4px 8px", borderRadius: "4px" }}>
                                <i className="fas fa-exclamation-triangle"></i>
                                {r.reason === "OTHER" ? (r.customReason || "OTHER") : r.reason.replace("_", " ")}
                              </span>
                            </td>
                            <td style={{ maxWidth: "300px", fontSize: "0.85rem", color: "#444" }}>
                              <div style={{ maxHeight: "100px", overflowY: "auto", wordBreak: "break-word" }}>
                                {r.description}
                              </div>
                            </td>
                            <td>
                              <div className="admin-action-btns" style={{ flexDirection: "column", gap: "6px" }}>
                                <div style={{ display: "flex", gap: "6px", width: "100%" }}>
                                  <button
                                    onClick={() => handleModerateReport(r.id, "DISMISS")}
                                    disabled={actionLoading !== null}
                                    className="reject-btn"
                                    style={{ flex: 1, padding: "8px", fontSize: "0.85rem", whiteSpace: "nowrap" }}
                                  >
                                    Dismiss Report
                                  </button>
                                  <button
                                    onClick={() => handleModerateReport(r.id, "RESOLVE", false)}
                                    disabled={actionLoading !== null}
                                    className="approve-btn"
                                    style={{ flex: 1, padding: "8px", fontSize: "0.85rem", whiteSpace: "nowrap" }}
                                  >
                                    Resolve (Keep)
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleModerateReport(r.id, "RESOLVE", true)}
                                  disabled={actionLoading !== null}
                                  className="reject-btn"
                                  style={{ width: "100%", padding: "8px", fontSize: "0.85rem", backgroundColor: "#c5221f", color: "white", whiteSpace: "nowrap" }}
                                >
                                  Resolve & Delete Flagged Listing
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity-logs" && (
            <div className="admin-card">
              <div className="card-header" style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
                <div>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "700", color: "rgb(2, 53, 28)", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                    <i className="fas fa-history" style={{ color: "#d35400" }}></i> Agent Activity & Audit Logs
                  </h4>
                  <p style={{ color: "#666", fontSize: "0.85rem", margin: "5px 0 0 0" }}>
                    Real-time timeline and audit history of every action taken by agents (creating, updating, pricing edits, status changes, and deletions).
                  </p>
                </div>

                {/* Filter Pills */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    { id: "ALL", label: "All Activities" },
                    { id: "PROPERTY_CREATED", label: "Created" },
                    { id: "PROPERTY_UPDATED", label: "Updated" },
                    { id: "PROPERTY_AVAILABILITY_TOGGLED", label: "Status Toggled" },
                    { id: "PROPERTY_DELETED", label: "Deleted" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActivityFilter(filter.id)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        border: activityFilter === filter.id ? "1px solid rgb(2, 53, 28)" : "1px solid #d1d5db",
                        backgroundColor: activityFilter === filter.id ? "rgb(2, 53, 28)" : "#fff",
                        color: activityFilter === filter.id ? "#fff" : "#4b5563",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredActivityLogs.length === 0 ? (
                <div className="no-data-text">
                  <i className="fas fa-clipboard-list" style={{ color: "#6b7280", fontSize: "1.5rem", marginRight: "8px" }}></i>
                  No activity logs found matching your criteria.
                </div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>User / Agent</th>
                        <th>Action Type</th>
                        <th>Property Target</th>
                        <th>Activity Details & Changes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredActivityLogs.map((log: any) => {
                        let actionBadgeStyle = { background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" };
                        let actionIcon = "fas fa-info-circle";
                        let actionLabel = "Updated";

                        if (log.action === "PROPERTY_CREATED") {
                          actionBadgeStyle = { background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" };
                          actionIcon = "fas fa-plus-circle";
                          actionLabel = "Listing Created";
                        } else if (log.action === "PROPERTY_UPDATED") {
                          actionBadgeStyle = { background: "#e0e7ff", color: "#4338ca", border: "1px solid #c7d2fe" };
                          actionIcon = "fas fa-edit";
                          actionLabel = "Listing Edited";
                        } else if (log.action === "PROPERTY_AVAILABILITY_TOGGLED") {
                          actionBadgeStyle = { background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a" };
                          actionIcon = "fas fa-toggle-on";
                          actionLabel = "Status Changed";
                        } else if (log.action === "PROPERTY_DELETED") {
                          actionBadgeStyle = { background: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca" };
                          actionIcon = "fas fa-trash-alt";
                          actionLabel = "Listing Deleted";
                        }

                        return (
                          <tr key={log.id}>
                            <td style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                              <div style={{ fontWeight: "600" }}>
                                {new Date(log.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                                {new Date(log.createdAt).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "rgb(2, 53, 28)" }}>{log.userName}</div>
                              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{log.userEmail}</div>
                              <span style={{ fontSize: "0.7rem", backgroundColor: "#f3f4f6", padding: "2px 6px", borderRadius: "4px", color: "#374151", fontWeight: "600", marginTop: "3px", display: "inline-block" }}>
                                {log.userRole || "AGENT"}
                              </span>
                            </td>
                            <td>
                              <span style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontSize: "0.75rem",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                ...actionBadgeStyle
                              }}>
                                <i className={actionIcon}></i>
                                {actionLabel}
                              </span>
                            </td>
                            <td>
                              {log.propertyTitle ? (
                                <div>
                                  <strong style={{ fontSize: "0.88rem", color: "#111827", display: "block" }}>
                                    {log.propertyTitle}
                                  </strong>
                                  {log.propertyId && log.action !== "PROPERTY_DELETED" && (
                                    <a
                                      href={`/apartment-details?id=${log.propertyId}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ fontSize: "0.78rem", color: "#047857", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "3px" }}
                                    >
                                      View Details <i className="fas fa-external-link-alt" style={{ fontSize: "0.65rem" }}></i>
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>-</span>
                              )}
                            </td>
                            <td style={{ maxWidth: "340px", fontSize: "0.85rem", color: "#374151" }}>
                              <div style={{ lineHeight: "1.5" }}>
                                {log.description}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activePreviewDoc && (
        <div 
          onClick={() => setActivePreviewDoc(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "800px",
              height: "85vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
              overflow: "hidden"
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #eaeaea", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, color: "rgb(2, 53, 28)", fontSize: "1.15rem", fontWeight: "700", fontFamily: "'Poppins', sans-serif" }}>{activePreviewDoc.title}</h3>
              <button 
                onClick={() => setActivePreviewDoc(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#666" }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flexGrow: 1, backgroundColor: "#f9f9f9", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {activePreviewDoc.url.toLowerCase().endsWith(".pdf") ? (
                <iframe 
                  src={activePreviewDoc.url} 
                  style={{ width: "100%", height: "100%", border: "none", borderRadius: "8px" }}
                ></iframe>
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "auto" }}>
                  <img 
                    src={activePreviewDoc.url} 
                    alt={activePreviewDoc.title} 
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "8px" }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "12px 24px", borderTop: "1px solid #eaeaea", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <a 
                href={activePreviewDoc.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f1f3f4", color: "#333", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}
              >
                <i className="fas fa-external-link-alt"></i> Open In New Tab
              </a>
              <button 
                onClick={() => setActivePreviewDoc(null)}
                style={{ backgroundColor: "rgb(2, 53, 28)", color: "white", padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "0.9rem", fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="no-data-text"><i className="fas fa-spinner fa-spin"></i> Loading admin panel...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
