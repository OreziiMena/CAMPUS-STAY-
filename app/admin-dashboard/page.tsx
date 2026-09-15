"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  getAdminDashboardData, 
  toggleUserVerification, 
  togglePropertyVerification,
  deletePropertyByAdmin,
  deleteUserByAdmin,
  getAdminAnalyticsData,
  getAgentActivityLogs,
  getAdminAuditLogs,
  getBroadcastAudienceStats,
  sendBroadcastEmailAction,
  getAdminPaymentsData
} from "@/app/actions/admin";
import { getPendingReports, moderateReport } from "@/app/actions/reports";
import { adminGetAmbassadors } from "@/app/actions/ambassador";
import "./admin-dashboard.css";

// Modular Components
import AdminStatCards from "./components/AdminStatCards";
import AdminSearchBar from "./components/AdminSearchBar";
import VerificationsTab from "./components/VerificationsTab";
import DirectoriesTab from "./components/DirectoriesTab";
import AnalyticsTab from "./components/AnalyticsTab";
import ReportsTab from "./components/ReportsTab";
import ActivityLogsTab from "./components/ActivityLogsTab";
import BroadcastTab, { BROADCAST_TEMPLATES } from "./components/BroadcastTab";
import PaymentsTab, { PaymentRecord, PaymentMetrics } from "./components/PaymentsTab";
import AmbassadorsTab from "./components/AmbassadorsTab";

// Modals
import DocViewerModal from "./components/modals/DocViewerModal";
import EmailPreviewModal from "./components/modals/EmailPreviewModal";
import BroadcastConfirmModal from "./components/modals/BroadcastConfirmModal";
import TwoFactorSettingsModal from "@/components/TwoFactorSettingsModal";

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
  const [adminAuditLogs, setAdminAuditLogs] = useState<any[]>([]);
  const [show2FAModal, setShow2FAModal] = useState(false);
  
  // Tab control
  const [activeTab, setActiveTab] = useState("verifications");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [activePreviewDoc, setActivePreviewDoc] = useState<{ url: string; title: string } | null>(null);

  // Broadcast Email States
  const [broadcastAudience, setBroadcastAudience] = useState<"ALL" | "STUDENTS" | "AGENTS" | "VERIFIED_STUDENTS" | "VERIFIED_AGENTS">("ALL");
  const [broadcastSenderOption, setBroadcastSenderOption] = useState<"support" | "noreply">("support");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastHeadline, setBroadcastHeadline] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastCtaText, setBroadcastCtaText] = useState("");
  const [broadcastCtaUrl, setBroadcastCtaUrl] = useState("");
  const [broadcastTemplate, setBroadcastTemplate] = useState("custom");
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastTestSending, setBroadcastTestSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<{
    success: boolean;
    isTest?: boolean;
    testRecipient?: string;
    totalTargeted?: number;
    sentCount?: number;
    failedCount?: number;
    message?: string;
    errors?: string[];
  } | null>(null);
  const [broadcastStats, setBroadcastStats] = useState<{
    all: number;
    students: number;
    agents: number;
    verifiedStudents: number;
    verifiedAgents: number;
  }>({ all: 0, students: 0, agents: 0, verifiedStudents: 0, verifiedAgents: 0 });
  const [adminEmail, setAdminEmail] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Payments & Financial Monitoring States
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [paymentsMetrics, setPaymentsMetrics] = useState<PaymentMetrics>({
    totalGross: 0,
    platformShare: 0,
    agentEscrowLiability: 0,
    totalTransactions: 0,
    paidCount: 0,
  });
  const [ambassadors, setAmbassadors] = useState<any[]>([]);

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

    const auditRes = await getAdminAuditLogs();
    if (auditRes.success) {
      setAdminAuditLogs(auditRes.logs || []);
    }

    const broadcastStatsRes = await getBroadcastAudienceStats();
    if (broadcastStatsRes.success && broadcastStatsRes.stats) {
      setBroadcastStats(broadcastStatsRes.stats);
      if (broadcastStatsRes.adminEmail) {
        setAdminEmail(broadcastStatsRes.adminEmail);
      }
    }

    const paymentsRes = await getAdminPaymentsData();
    if (paymentsRes.success) {
      setPayments(paymentsRes.payments || []);
      if (paymentsRes.metrics) {
        setPaymentsMetrics(paymentsRes.metrics);
      }
    }

    const ambassadorsRes = await adminGetAmbassadors();
    if (ambassadorsRes.success) {
      setAmbassadors(ambassadorsRes.ambassadors || []);
    }

    setLoading(false);
  };

  const handleSelectTemplate = (templateId: string) => {
    setBroadcastTemplate(templateId);
    const tmpl = BROADCAST_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      if (tmpl.id !== "custom") {
        setBroadcastAudience(tmpl.audience);
        setBroadcastSubject(tmpl.subject);
        setBroadcastHeadline(tmpl.headline);
        setBroadcastMessage(tmpl.message);
        setBroadcastCtaText(tmpl.ctaText);
        setBroadcastCtaUrl(tmpl.ctaUrl);
      }
    }
  };

  const handleSendTestEmail = async () => {
    if (!broadcastSubject.trim()) {
      alert("Please enter an email subject before sending a test.");
      return;
    }
    if (!broadcastMessage.trim()) {
      alert("Please enter email message content before sending a test.");
      return;
    }

    setBroadcastTestSending(true);
    setBroadcastResult(null);
    const res = await sendBroadcastEmailAction({
      audience: broadcastAudience,
      subject: broadcastSubject,
      headline: broadcastHeadline,
      message: broadcastMessage,
      ctaText: broadcastCtaText,
      ctaUrl: broadcastCtaUrl,
      senderOption: broadcastSenderOption,
      sendTestOnly: true,
      testEmail: adminEmail,
    });

    setBroadcastTestSending(false);
    if (res.success) {
      setBroadcastResult(res);
    } else {
      alert(res.error || "Failed to send test email.");
    }
  };

  const handleSendBroadcast = async () => {
    setShowConfirmModal(false);
    setBroadcastSending(true);
    setBroadcastResult(null);

    const res = await sendBroadcastEmailAction({
      audience: broadcastAudience,
      subject: broadcastSubject,
      headline: broadcastHeadline,
      message: broadcastMessage,
      ctaText: broadcastCtaText,
      ctaUrl: broadcastCtaUrl,
      senderOption: broadcastSenderOption,
      sendTestOnly: false,
    });

    setBroadcastSending(false);
    if (res.success) {
      setBroadcastResult(res);
    } else {
      alert(res.error || "Failed to send broadcast email.");
    }
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
    setSearchQuery("");
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
      alert(res.error || "Failed to toggle property verification.");
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

  const verifiedStudentsCount = studentUsers.filter((u) => u.studentProfile?.isVerified).length;
  const unverifiedStudentsCount = studentUsers.filter((u) => !u.studentProfile?.isVerified).length;

  const verifiedAgentsCount = agentUsers.filter((u) => u.agentProfile?.isVerified).length;
  const unverifiedAgentsCount = agentUsers.filter((u) => !u.agentProfile?.isVerified).length;

  const allHostelProperties = allProperties.filter((p) => !p.isRoommateOption);
  const allRoommateListings = allProperties.filter((p) => p.isRoommateOption);

  const verifiedPropertiesCount = allHostelProperties.filter((p) => p.isVerified).length;
  const unverifiedPropertiesCount = allHostelProperties.filter((p) => !p.isVerified).length;

  const verifiedRoommatesCount = allRoommateListings.filter((p) => p.isVerified).length;
  const unverifiedRoommatesCount = allRoommateListings.filter((p) => !p.isVerified).length;

  const propertiesQueue = properties.filter((p) => !p.isRoommateOption);
  const roommatesQueue = properties.filter((p) => p.isRoommateOption);

  // Search filter logic
  const query = searchQuery.toLowerCase();

  const filteredStudents = studentUsers.filter((u) => {
    const name = u.studentProfile?.fullName?.toLowerCase() || "";
    const username = u.studentProfile?.username?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";
    const phone = u.phone?.toLowerCase() || "";
    return name.includes(query) || username.includes(query) || email.includes(query) || phone.includes(query);
  });

  const filteredAgents = agentUsers.filter((u) => {
    const name = u.agentProfile?.fullName?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";
    const phone = u.phone?.toLowerCase() || "";
    return name.includes(query) || email.includes(query) || phone.includes(query);
  });

  const filteredAllProperties = allHostelProperties.filter((p) => {
    const title = p.title?.toLowerCase() || "";
    const location = p.location?.toLowerCase() || "";
    const university = p.university?.toLowerCase() || "";
    const agentName = p.agent?.fullName?.toLowerCase() || "";
    return title.includes(query) || location.includes(query) || university.includes(query) || agentName.includes(query);
  });

  const filteredAllRoommates = allRoommateListings.filter((p) => {
    const title = p.title?.toLowerCase() || "";
    const location = p.location?.toLowerCase() || "";
    const university = p.university?.toLowerCase() || "";
    const studentName = (p.student?.fullName || p.student?.username || "").toLowerCase();
    return title.includes(query) || location.includes(query) || university.includes(query) || studentName.includes(query);
  });

  const filteredQueueStudents = students.filter((s) => {
    const name = s.fullName?.toLowerCase() || "";
    const username = s.username?.toLowerCase() || "";
    const university = s.university?.toLowerCase() || "";
    const email = s.user?.email?.toLowerCase() || "";
    const phone = s.user?.phone?.toLowerCase() || "";
    return name.includes(query) || username.includes(query) || university.includes(query) || email.includes(query) || phone.includes(query);
  });

  const filteredQueueAgents = agents.filter((a) => {
    const name = a.fullName?.toLowerCase() || "";
    const address = a.address?.toLowerCase() || "";
    const email = a.user?.email?.toLowerCase() || "";
    const phone = a.user?.phone?.toLowerCase() || "";
    return name.includes(query) || address.includes(query) || email.includes(query) || phone.includes(query);
  });

  const filteredQueueProperties = propertiesQueue.filter((p) => {
    const title = p.title?.toLowerCase() || "";
    const location = p.location?.toLowerCase() || "";
    const university = p.university?.toLowerCase() || "";
    const agentName = p.agent?.fullName?.toLowerCase() || "";
    return title.includes(query) || location.includes(query) || university.includes(query) || agentName.includes(query);
  });

  const filteredQueueRoommates = roommatesQueue.filter((p) => {
    const title = p.title?.toLowerCase() || "";
    const location = p.location?.toLowerCase() || "";
    const university = p.university?.toLowerCase() || "";
    const studentName = (p.student?.fullName || p.student?.username || "").toLowerCase();
    return title.includes(query) || location.includes(query) || university.includes(query) || studentName.includes(query);
  });

  const filteredReports = reports.filter((r) => {
    const reporterEmail = r.reporter?.email?.toLowerCase() || "";
    const description = r.description?.toLowerCase() || "";
    const reason = r.reason?.toLowerCase() || "";
    const targetName = (r.property?.title || r.roommate?.fullName || "").toLowerCase();
    return reporterEmail.includes(query) || description.includes(query) || reason.includes(query) || targetName.includes(query);
  });

  const filteredActivityLogs = activityLogs.filter((log) => {
    if (activityFilter !== "ALL" && log.action !== activityFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const name = log.userName?.toLowerCase() || "";
    const email = log.userEmail?.toLowerCase() || "";
    const desc = log.description?.toLowerCase() || "";
    const title = log.propertyTitle?.toLowerCase() || "";
    const action = log.action?.toLowerCase() || "";
    return name.includes(query) || email.includes(query) || desc.includes(query) || title.includes(query) || action.includes(query);
  });

  const filteredPayments = payments.filter((p) => {
    if (!searchQuery.trim()) return true;
    const ref = p.reference?.toLowerCase() || "";
    const studentName = p.student?.name?.toLowerCase() || "";
    const studentEmail = p.student?.email?.toLowerCase() || "";
    const studentPhone = p.student?.phone?.toLowerCase() || "";
    const agentName = p.agent?.name?.toLowerCase() || "";
    const agentEmail = p.agent?.email?.toLowerCase() || "";
    const propertyTitle = p.property?.title?.toLowerCase() || "";
    const propertyLocation = p.property?.location?.toLowerCase() || "";
    const status = p.status?.toLowerCase() || "";
    return (
      ref.includes(query) ||
      studentName.includes(query) ||
      studentEmail.includes(query) ||
      studentPhone.includes(query) ||
      agentName.includes(query) ||
      agentEmail.includes(query) ||
      propertyTitle.includes(query) ||
      propertyLocation.includes(query) ||
      status.includes(query)
    );
  });

  return (
    <div>
      {error && (
        <div className="error-banner">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {/* Global Admin Metrics Overview */}
      <AdminStatCards
        verifiedStudentsCount={verifiedStudentsCount}
        totalStudentsCount={studentUsers.length}
        unverifiedStudentsCount={unverifiedStudentsCount}
        verifiedAgentsCount={verifiedAgentsCount}
        totalAgentsCount={agentUsers.length}
        unverifiedAgentsCount={unverifiedAgentsCount}
        verifiedPropertiesCount={verifiedPropertiesCount}
        totalPropertiesCount={allProperties.length}
        unverifiedPropertiesCount={unverifiedPropertiesCount}
        pendingQueueCount={students.length + agents.length + properties.length}
        pendingStudentsQueueCount={students.length}
        pendingAgentsQueueCount={agents.length}
      />

      {/* Dynamic Directory Search Bar & Security CTA */}
      <div className="admin-search-security-row">
        <div className="admin-search-wrapper">
          <AdminSearchBar
            activeTab={activeTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <button
          type="button"
          onClick={() => setShow2FAModal(true)}
          className="admin-2fa-security-btn"
        >
          <i className="fas fa-shield-alt admin-2fa-shield-icon"></i>
          Admin 2FA Security
        </button>
      </div>

      {loading ? (
        <div className="no-data-text">
          <i className="fas fa-spinner fa-spin"></i> Loading pending requests...
        </div>
      ) : (
        <>
          {/* 1. VERIFICATIONS DASHBOARD TAB */}
          {activeTab === "verifications" && (
            <VerificationsTab
              students={students}
              agents={agents}
              propertiesQueue={propertiesQueue}
              roommatesQueue={roommatesQueue}
              filteredQueueStudents={filteredQueueStudents}
              filteredQueueAgents={filteredQueueAgents}
              filteredQueueProperties={filteredQueueProperties}
              filteredQueueRoommates={filteredQueueRoommates}
              actionLoading={actionLoading}
              onVerifyUser={handleVerifyUser}
              onRejectUser={handleRejectUser}
              onVerifyProperty={handleVerifyProperty}
              onRejectProperty={handleRejectProperty}
              onPreviewDoc={setActivePreviewDoc}
            />
          )}

          {/* 2-5. DIRECTORIES (Students, Agents, Properties, Roommates) */}
          {(activeTab === "students" || activeTab === "agents" || activeTab === "properties" || activeTab === "roommates") && (
            <DirectoriesTab
              activeTab={activeTab as "students" | "agents" | "properties" | "roommates"}
              studentUsers={studentUsers}
              agentUsers={agentUsers}
              allHostelProperties={allHostelProperties}
              allRoommateListings={allRoommateListings}
              filteredStudents={filteredStudents}
              filteredAgents={filteredAgents}
              filteredAllProperties={filteredAllProperties}
              filteredAllRoommates={filteredAllRoommates}
              verifiedStudentsCount={verifiedStudentsCount}
              verifiedAgentsCount={verifiedAgentsCount}
              verifiedPropertiesCount={verifiedPropertiesCount}
              verifiedRoommatesCount={verifiedRoommatesCount}
              actionLoading={actionLoading}
              onToggleVerificationUser={handleToggleVerificationAllUsers}
              onDeleteUser={handleDeleteUserAllUsers}
              onTogglePropertyVerification={handleTogglePropertyVerificationAll}
              onDeleteProperty={handleDeletePropertyAll}
            />
          )}

          {/* 6. ANALYTICS OVERVIEW TAB */}
          {activeTab === "analytics" && (
            <AnalyticsTab analyticsData={analyticsData} />
          )}

          {/* 7. FLAGGED REPORTS QUEUE TAB */}
          {activeTab === "reports" && (
            <ReportsTab
              filteredReports={filteredReports}
              actionLoading={actionLoading}
              onModerateReport={handleModerateReport}
            />
          )}

          {/* 8. AGENT ACTIVITY AUDIT LOGS TAB */}
          {activeTab === "activity-logs" && (
            <ActivityLogsTab
              filteredActivityLogs={filteredActivityLogs}
              activityFilter={activityFilter}
              setActivityFilter={setActivityFilter}
              adminAuditLogs={adminAuditLogs}
            />
          )}

          {/* 9. SEND BROADCAST ANNOUNCEMENTS TAB */}
          {activeTab === "broadcast" && (
            <BroadcastTab
              broadcastAudience={broadcastAudience}
              setBroadcastAudience={setBroadcastAudience}
              broadcastSenderOption={broadcastSenderOption}
              setBroadcastSenderOption={setBroadcastSenderOption}
              broadcastSubject={broadcastSubject}
              setBroadcastSubject={setBroadcastSubject}
              broadcastHeadline={broadcastHeadline}
              setBroadcastHeadline={setBroadcastHeadline}
              broadcastMessage={broadcastMessage}
              setBroadcastMessage={setBroadcastMessage}
              broadcastCtaText={broadcastCtaText}
              setBroadcastCtaText={setBroadcastCtaText}
              broadcastCtaUrl={broadcastCtaUrl}
              setBroadcastCtaUrl={setBroadcastCtaUrl}
              broadcastTemplate={broadcastTemplate}
              onSelectTemplate={handleSelectTemplate}
              broadcastSending={broadcastSending}
              broadcastTestSending={broadcastTestSending}
              broadcastResult={broadcastResult}
              setBroadcastResult={setBroadcastResult}
              broadcastStats={broadcastStats}
              adminEmail={adminEmail}
              onSendTestEmail={handleSendTestEmail}
              onOpenPreviewModal={() => setShowPreviewModal(true)}
              onOpenConfirmModal={() => {
                if (!broadcastSubject.trim()) {
                  alert("Please enter an email subject.");
                  return;
                }
                if (!broadcastMessage.trim()) {
                  alert("Please enter message content.");
                  return;
                }
                setShowConfirmModal(true);
              }}
            />
          )}

          {/* 10. INSPECTION PAYMENTS & ESCROW REVENUE MONITORING TAB */}
          {activeTab === "payments" && (
            <PaymentsTab
              payments={payments}
              filteredPayments={filteredPayments}
              metrics={paymentsMetrics}
              onRefresh={fetchQueues}
            />
          )}

          {/* 11. CAMPUS AMBASSADORS TAB */}
          {activeTab === "ambassadors" && (
            <AmbassadorsTab
              ambassadors={ambassadors}
              onRefresh={fetchQueues}
            />
          )}
        </>
      )}

      {/* Broadcast Live Visual Preview Modal */}
      <EmailPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        senderOption={broadcastSenderOption}
        subject={broadcastSubject}
        headline={broadcastHeadline}
        message={broadcastMessage}
        ctaText={broadcastCtaText}
        ctaUrl={broadcastCtaUrl}
      />

      {/* Broadcast Send Confirmation Modal */}
      <BroadcastConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSendBroadcast}
        audience={broadcastAudience}
        stats={broadcastStats}
        subject={broadcastSubject}
        senderOption={broadcastSenderOption}
      />

      {/* Document & ID Lightbox Preview Modal */}
      <DocViewerModal
        activePreviewDoc={activePreviewDoc}
        onClose={() => setActivePreviewDoc(null)}
      />

      {/* Admin 2FA Settings Modal */}
      <TwoFactorSettingsModal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        userEmail={adminEmail || "support@campustent.com"}
        userRole="ADMIN"
      />
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
