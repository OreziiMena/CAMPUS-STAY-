"use client";
import React from "react";
import Link from "next/link";

interface SidebarProps {
  activePath: string;
  newInquiriesCount: number;
  isMobileOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  activePath,
  newInquiriesCount,
  isMobileOpen,
  onClose,
  onLogout,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${isMobileOpen ? "active" : ""}`} id="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">Campus Stay</h2>
        <button className="close-sidebar-btn" id="close-sidebar" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <ul className="sidebar-nav">
        <li>
          <Link href="/agent-dashboard" className={activePath === "/agent-dashboard" ? "active" : ""}>
            <i className="fas fa-th-large"></i> Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/agent-dashboard/add-property"
            className={activePath === "/agent-dashboard/add-property" ? "active" : ""}
          >
            <i className="fas fa-building"></i> My Properties
          </Link>
        </li>
        <li>
          <Link href="/agent-dashboard#inquiries-section">
            <i className="fas fa-envelope"></i> Inquiries{" "}
            <span className="badge" id="nav-inquiry-badge">
              {newInquiriesCount}
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/agent-dashboard/analytics"
            className={activePath === "/agent-dashboard/analytics" ? "active" : ""}
          >
            <i className="fas fa-chart-line"></i> Analytics
          </Link>
        </li>
        <li>
          <Link
            href="/agent-dashboard/settings"
            className={activePath === "/agent-dashboard/settings" ? "active" : ""}
          >
            <i className="fas fa-cog"></i> Settings
          </Link>
        </li>
      </ul>

      <div className="sidebar-footer">
        <button id="logout-btn" className="logout-btn" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i> Log Out
        </button>
      </div>
    </aside>
  );
}
