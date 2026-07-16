"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  getAdminDashboardData, 
  toggleUserVerification, 
  togglePropertyVerification,
  deletePropertyByAdmin,
  deleteUserByAdmin
} from "@/app/actions/admin";

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
  
  // Tab control
  const [activeTab, setActiveTab] = useState("verifications");
  const [activeQueueTab, setActiveQueueTab] = useState("students");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    setLoading(false);
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  useEffect(() => {
    setActiveTab(tabParam);
    setSearchQuery(""); // Clear search query when changing tabs
  }, [tabParam]);

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
                                  {!student.idCardDoc && !student.feesReceiptDoc && !student.portalScreenshotDoc && (
                                    <span style={{ color: "#888", fontSize: "13px" }}>No documents uploaded</span>
                                  )}
                                  {student.idCardDoc && (
                                    <a href={student.idCardDoc} target="_blank" rel="noopener noreferrer" className="doc-link">
                                      <i className="fas fa-id-card"></i> Student ID Card
                                    </a>
                                  )}
                                  {student.feesReceiptDoc && (
                                    <a href={student.feesReceiptDoc} target="_blank" rel="noopener noreferrer" className="doc-link">
                                      <i className="fas fa-receipt"></i> School Fees Receipt
                                    </a>
                                  )}
                                  {student.portalScreenshotDoc && (
                                    <a href={student.portalScreenshotDoc} target="_blank" rel="noopener noreferrer" className="doc-link">
                                      <i className="fas fa-desktop"></i> Portal Screenshot
                                    </a>
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
                                  <a href={agent.ninDocument} target="_blank" rel="noopener noreferrer" className="doc-link">
                                    <i className="fas fa-file-alt"></i> NIN / Govt ID Document
                                  </a>
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
                            <th>Yearly Cost</th>
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
                              <td>₦{property.price.toLocaleString()}</td>
                              <td>
                                <div>{property.location}</div>
                                <div style={{ color: "#666", fontSize: "12px" }}>{property.distance}</div>
                              </td>
                              <td>
                                {property.agent ? (
                                  <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                      <strong>{property.agent.fullName}</strong>
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
                                      <strong>{property.student.fullName}</strong>
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
                            <td><strong>{u.studentProfile?.fullName || "Student"}</strong></td>
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
                            <td><strong>{u.agentProfile?.fullName || "Agent"}</strong></td>
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
                        <th>Yearly Cost</th>
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
                            <td>₦{p.price.toLocaleString()}</td>
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
                                  <strong>{p.student.fullName}</strong>
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
        </>
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
