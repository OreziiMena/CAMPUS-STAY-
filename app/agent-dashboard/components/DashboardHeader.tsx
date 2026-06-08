"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./DashboardHeader.module.css";

interface DashboardHeaderProps {
  agentName: string;
  onMenuToggle: () => void;
  onLogout: () => void;
}

export default function DashboardHeader({
  agentName,
  onMenuToggle,
  onLogout,
}: DashboardHeaderProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <header className="dashboard-header">
      <button className="menu-toggle-btn" id="menu-toggle" onClick={onMenuToggle}>
        <i className="fas fa-bars"></i>
      </button>

      <div className="header-right">
        <button className="notification-btn" id="notification-btn">
          <i className="fas fa-bell"></i>
        </button>
        <div
          ref={dropdownRef}
          className="profile-dropdown"
          onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        >
          <div className="profile-info">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                agentName
              )}&background=d35400&color=fff`}
              alt="Profile"
              className="profile-pic"
            />
            <span className="profile-name">{agentName}</span>
            <i className={`fas fa-chevron-down ${styles.chevronIcon}`}></i>
          </div>

          <div
            className={`dropdown-menu ${isProfileDropdownOpen ? "active" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Link href="/agent-dashboard/profile">
              <i className="fas fa-user"></i> My Profile
            </Link>
            <Link href="/agent-dashboard/settings">
              <i className="fas fa-cog"></i> Settings
            </Link>
            <div className="dropdown-divider"></div>
            <button
              onClick={onLogout}
              className={`explore-dropdown-item logout-link ${styles.logoutBtn}`}
            >
              <i className="fas fa-sign-out-alt"></i> Log Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
