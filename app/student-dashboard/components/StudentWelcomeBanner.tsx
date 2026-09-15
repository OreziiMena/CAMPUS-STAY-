import React from "react";
import Link from "next/link";

interface StudentWelcomeBannerProps {
  studentName: string;
}

export default function StudentWelcomeBanner({ studentName }: StudentWelcomeBannerProps) {
  return (
    <div className="student-welcome-banner">
      <div>
        <h1>Welcome back, {studentName}!</h1>
        <p>Manage your hostel search, viewings, and verification status.</p>
      </div>
      <div className="student-actions-row">
        <Link href="/explore" className="student-explore-btn">
          <i className="fas fa-search"></i> Find Hostels
        </Link>
        <Link href="/roommates" className="student-explore-btn roommate-btn">
          <i className="fas fa-user-friends"></i> Find Roommates
        </Link>
      </div>
    </div>
  );
}
