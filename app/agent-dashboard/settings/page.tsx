"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import DashboardClientLogic from "../DashboardClientLogic";
import "./styles.css";
import "../agent-dashboard.css";

export default function Settings() {
  const router = useRouter();
  const [agentName, setAgentName] = useState("Agent");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user || user.role !== "AGENT") {
        router.push("/auth/login");
        return;
      }
      setAgentName(user.name || "Agent");

      const savedTheme = localStorage.getItem("campus_stay_theme") || "light";
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    document.body.classList.remove("dark-mode");
    router.push("/");
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("campus_stay_theme", nextTheme);
    if (nextTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  return (
    <>
      <DashboardClientLogic isSettings={true} />
      <div className="dashboard-layout">
        <aside className="sidebar" id="sidebar">
          <div className="sidebar-header">
            <h2 className="logo-text">Campus Stay</h2>
            <button className="close-sidebar-btn" id="close-sidebar"><i className="fas fa-times"></i></button>
          </div>
          <ul className="sidebar-nav">
            <li><Link href="/agent-dashboard"><i className="fas fa-th-large"></i> Dashboard</Link></li>
            <li><a href="#"><i className="fas fa-building"></i> My Properties</a></li>
            <li><a href="#"><i className="fas fa-envelope"></i> Inquiries <span className="badge" id="nav-inquiry-badge">0</span></a></li>
            <li><Link href="/agent-dashboard/analytics"><i className="fas fa-chart-line"></i> Analytics</Link></li>
            <li><Link href="/agent-dashboard/settings" className="active"><i className="fas fa-cog"></i> Settings</Link></li>
          </ul>

          <div className="sidebar-footer">
            <button id="logout-btn" className="logout-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Log Out</button>
          </div>
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-header">
            <button className="menu-toggle-btn" id="menu-toggle"><i className="fas fa-bars"></i></button>

            <div className="header-right">
              <button className="notification-btn" id="notification-btn"><i className="fas fa-bell"></i></button>
              <button className="notification-btn" onClick={handleThemeToggle}>
                <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`} style={theme === "dark" ? { color: "#f1c40f" } : undefined}></i>
              </button>
              <div 
                className="profile-dropdown" 
                onClick={(e) => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  e.stopPropagation();
                }}
              >
                <div className="profile-info">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(agentName)}&background=d35400&color=fff`} alt="Profile" className="profile-pic" />
                  <span className="profile-name">{agentName}</span>
                  <i className="fas fa-chevron-down" style={{ fontSize: "11px", color: "var(--text-main)", marginLeft: "2px" }}></i>
                </div>

                <div className={`dropdown-menu ${isProfileDropdownOpen ? "active" : ""}`} onClick={(e) => e.stopPropagation()}>
                  <Link href="/agent-dashboard/profile"><i className="fas fa-user"></i> My Profile</Link>
                  <Link href="/agent-dashboard/settings"><i className="fas fa-cog"></i> Settings</Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="logout-link" style={{ background: "none", border: "none", padding: "12px 20px", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "Poppins", fontSize: "13px", display: "flex", gap: "10px", alignItems: "center" }}>
                    <i className="fas fa-sign-out-alt"></i> Log Out
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="dashboard-content">
            <div className="profile-layout">
              <div className="profile-header-card">
                <div className="profile-title">
                  <h2><i className="fas fa-cog"></i> Account Settings</h2>
                  <p>Manage your app preferences, notifications, and account security.</p>
                </div>
              </div>

              <div className="profile-tabs">
                <button className="tab-btn active" data-target="preferences-section">App Preferences</button>
                <button className="tab-btn" data-target="notifications-section">Notifications</button>
                <button className="tab-btn" data-target="danger-section">Danger Zone</button>
              </div>

              <section id="preferences-section" className="tab-content active">
                <h3 className="prefer">App Preferences</h3>

                <div className="settings-group">
                  <div className="settings-item">
                    <div className="settings-info">
                      <h4>Offline Mode</h4>
                      <p>Hide your active status. Students will see you as "Unavailable".</p>
                    </div>
                    <label className="custom-toggle">
                      <input type="checkbox" id="toggle-offline" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <hr className="settings-divider" />

                  <div className="settings-item dropdown-item">
                    <div className="settings-info">
                      <h4>Default Region & Currency</h4>
                      <p>Set the default display for your property listings.</p>
                    </div>
                    <select className="settings-dropdown" id="region-select">
                      <option value="ngn">Nigeria (NGN ₦)</option>
                      <option value="usd">International (USD $)</option>
                      <option value="gbp">United Kingdom (GBP £)</option>
                    </select>
                  </div>
                </div>

                <button id="save-preferences-btn" className="primary-btn" style={{ marginTop: "15px" }}>Save Preferences</button>
              </section>

              <section id="notifications-section" className="tab-content" style={{ display: "none" }}>
                <h3 className="prefer">Notification Settings</h3>

                <div className="settings-group">
                  <div className="settings-item">
                    <div className="settings-info">
                      <h4>Email Alerts (New Bookings)</h4>
                      <p>Receive an email immediately when a student inquires or books.</p>
                    </div>
                    <label className="custom-toggle">
                      <input type="checkbox" id="toggle-email" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <hr className="settings-divider" />

                  <div className="settings-item">
                    <div className="settings-info">
                      <h4>SMS Alerts</h4>
                      <p>Get text messages for urgent notifications and security alerts.</p>
                    </div>
                    <label className="custom-toggle">
                      <input type="checkbox" id="toggle-sms" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <hr className="settings-divider" />

                  <div className="settings-item">
                    <div className="settings-info">
                      <h4>Marketing Updates</h4>
                      <p>Receive tips, feature updates, and Campus Stay news.</p>
                    </div>
                    <label className="custom-toggle">
                      <input type="checkbox" id="toggle-marketing" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </section>

              <section id="danger-section" className="tab-content" style={{ display: "none" }}>
                <h3 className="prefer">Danger Zone</h3>

                <div className="danger-zone-card">
                  <div className="danger-info">
                    <h4>Deactivate Account</h4>
                    <p>Once you deactivate your account, all your active property listings will be hidden from the platform. This action is temporary, but you will need to contact support to reactivate.</p>
                  </div>
                  <button id="deactivate-account-btn" className="danger-outline-btn">Deactivate Account</button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
