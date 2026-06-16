"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { getStudentDashboardData } from "@/app/actions/student";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./student-dashboard.css";

export default function StudentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("Student");
  const [profile, setProfile] = useState<any>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [viewings, setViewings] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user || user.role !== "STUDENT") {
        router.push("/auth/login");
        return;
      }
      setStudentName(user.studentProfile?.fullName || user.name || "Student");

      const res = await getStudentDashboardData();
      if (res.success) {
        setProfile(res.profile);
        setInquiries(res.inquiries || []);
        setViewings(res.viewings || []);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, [router]);

  return (
    <>
      <Navbar />

      <main className="student-dashboard-layout">
        {loading ? (
          <div className="student-loader">
            <i className="fas fa-spinner fa-spin"></i> Loading dashboard...
          </div>
        ) : (
          <div className="student-dashboard-container">
            {/* Welcome Section */}
            <div className="student-welcome-banner">
              <div>
                <h1>Welcome back, {studentName}! 👋</h1>
                <p>Manage your hostel search, viewings, and verification status.</p>
              </div>
              <div className="student-actions-row">
                <Link href="/explore" className="student-explore-btn">
                  <i className="fas fa-search"></i> Find Hostels
                </Link>
                <Link href="/student-dashboard/add-roommate-listing" className="student-explore-btn roommate-btn">
                  <i className="fas fa-plus-circle"></i> Upload Roommate Option
                </Link>
              </div>
            </div>

            {/* Verification Status Alert Banner */}
            {profile?.isVerified ? (
              <div className="verification-alert verified">
                <i className="fas fa-check-circle verified-icon"></i>
                <div className="alert-details">
                  <h4>Student Identity Verified</h4>
                  <p>All student features are unlocked! You can now contact agents directly and schedule physical viewings.</p>
                </div>
              </div>
            ) : (profile?.idCardDoc || profile?.feesReceiptDoc || profile?.portalScreenshotDoc) ? (
              <div className="verification-alert pending">
                <i className="fas fa-clock pending-icon"></i>
                <div className="alert-details">
                  <h4>Verification Review Pending</h4>
                  <p>We are reviewing your uploaded document(s). You will unlock full permissions once verified by our admin team.</p>
                </div>
                <Link href="/student-dashboard/profile" className="alert-action-btn">
                  Check Status
                </Link>
              </div>
            ) : (
              <div className="verification-alert unverified">
                <i className="fas fa-exclamation-triangle unverified-icon"></i>
                <div className="alert-details">
                  <h4>Verification Required</h4>
                  <p>Your profile is unverified. Please upload at least one document (Student ID, current fees receipt, or portal screenshot) to unlock agent contacts, direct messaging, and physical viewings.</p>
                </div>
                <Link href="/student-dashboard/profile" className="alert-action-btn verify">
                  Verify Now
                </Link>
              </div>
            )}

            {/* Dashboard Sections Grid */}
            <div className="dashboard-sections-grid">
              {/* Column 1: Scheduled Viewings */}
              <div className="dashboard-card-section">
                <div className="section-title-row">
                  <h3><i className="fas fa-calendar-alt"></i> Scheduled Viewings</h3>
                  <span className="badge-count">{viewings.length}</span>
                </div>
                
                {viewings.length === 0 ? (
                  <div className="empty-section-state">
                    <i className="far fa-calendar-times"></i>
                    <p>No physical viewings scheduled yet.</p>
                    <Link href="/explore" className="inline-link">Browse apartments &rarr;</Link>
                  </div>
                ) : (
                  <div className="viewings-list-wrapper">
                    <div className="dashboard-list">
                      {viewings.map((viewing) => (
                        <div key={viewing.id} className="dashboard-list-item">
                          <div className="item-main">
                            <h5>{viewing.propertyTitle}</h5>
                            <p className="item-meta">
                              <span><i className="fas fa-user-tie"></i> {viewing.agentName}</span>
                              <span><i className="far fa-clock"></i> {new Date(viewing.dateTime).toLocaleString()}</span>
                            </p>
                          </div>
                          <span className={`status-tag ${viewing.status.toLowerCase()}`}>
                            {viewing.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Column 2: Recent Inquiries */}
              <div className="dashboard-card-section">
                <div className="section-title-row">
                  <h3><i className="fas fa-comment-dots"></i> Sent Inquiries</h3>
                  <span className="badge-count">{inquiries.length}</span>
                </div>

                {inquiries.length === 0 ? (
                  <div className="empty-section-state">
                    <i className="far fa-comments"></i>
                    <p>You haven't sent any messages to agents yet.</p>
                  </div>
                ) : (
                  <div className="inquiries-list-wrapper">
                    <div className="dashboard-list">
                      {inquiries.map((inquiry) => (
                        <div key={inquiry.id} className="dashboard-list-item">
                          <div className="item-main">
                            <h5>{inquiry.propertyTitle}</h5>
                            <p className="inquiry-msg">"{inquiry.message}"</p>
                            <p className="item-meta">
                              <span><i className="fas fa-user-tie"></i> {inquiry.agentName}</span>
                              <span><i className="far fa-calendar-alt"></i> {new Date(inquiry.createdAt).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
