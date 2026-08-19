"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import { getUnreadMessagesCount } from "@/app/actions/chat";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    checkUser();
  }, [pathname]);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    const fetchUnread = async () => {
      const res = await getUnreadMessagesCount();
      if (res.success && typeof res.count === "number") {
        setUnreadCount(res.count);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, [user, pathname]);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".explore-profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.push("/");
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/" ? "active" : "";
    }
    return pathname.startsWith(path) ? "active" : "";
  };

  return (
    <nav className="sticky-top">
      <div className="brand">
        <Link href="/" className={styles.brandLink}>
          <Image 
            src="/Assets/CAMPUS STAY LOGO.png" 
            alt="logo" 
            width={50} 
            height={50} 
            unoptimized
            className={`logo ${styles.logoImg}`}
          />
          <h2 className={`logo-text ${styles.logoH2}`}>Campus Unit</h2>
        </Link>
      </div>
      
      <div className={`navlinks ${isMobileMenuOpen ? "active" : ""}`}>
        <ul>
          <li><Link className={isActive("/landing")} href="/landing">Home</Link></li>
          <li><Link className={isActive("/about")} href="/about">About</Link></li>
          <li><Link className={isActive("/")} href="/">Find Apartment</Link></li>
          <li><Link className={isActive("/roommates")} href="/roommates">Find Roommate</Link></li>
          <li><Link className={isActive("/support")} href="/support">Support</Link></li>
        </ul>
        <div className={styles.userDropdownWrapper}>
          {user ? (
            <div 
              className={`explore-profile-dropdown ${styles.profileDropdownTrigger}`} 
              onClick={(e) => {
                setIsProfileDropdownOpen(!isProfileDropdownOpen);
                e.stopPropagation();
              }}
            >
              <div className="explore-profile-info" style={{ position: "relative" }}>
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "Student")}&background=02351c&color=fff`} 
                  alt="Profile" 
                  className="explore-profile-pic" 
                />
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: "-2px", left: "26px", width: "10px", height: "10px", backgroundColor: "#d32f2f", borderRadius: "50%", border: "2px solid white" }}></span>
                )}
                <span className={`explore-profile-name ${styles.profileName}`} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  {user.name ? user.name.split(" ")[0] : "Student"}
                  {((user.role === "STUDENT" && user.studentProfile?.isVerified) || 
                    (user.role === "AGENT" && user.agentProfile?.isVerified) || 
                    (user.role === "ADMIN")) && (
                    <i className="fas fa-check-circle verified-icon" style={{ color: "#2e7d32", fontSize: "0.8rem" }} title="Verified User"></i>
                  )}
                </span>
                <i className={`fas fa-chevron-down ${styles.chevronIcon}`}></i>
              </div>

              <div className={`explore-dropdown-menu ${isProfileDropdownOpen ? "active" : ""}`} onClick={(e) => e.stopPropagation()}>
                <Link href={user.role === "AGENT" ? "/agent-dashboard/profile" : (user.role === "ADMIN" ? "/admin-dashboard" : "/student-dashboard/profile")} className="explore-dropdown-item">
                  <i className={`fas fa-user ${styles.icon16}`}></i> PROFILE
                </Link>
                 <Link href="/chat" className="explore-dropdown-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <i className={`fas fa-comments ${styles.icon16}`}></i> INBOX CHAT
                  </span>
                  {unreadCount > 0 && (
                    <span style={{ backgroundColor: "#d32f2f", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "10px", fontWeight: "bold" }}>
                      {unreadCount}
                    </span>
                  )}
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin-dashboard" className="explore-dropdown-item">
                    <i className={`fas fa-th-large ${styles.icon16}`}></i> ADMIN PORTAL
                  </Link>
                )}
                {user.role === "AGENT" && (
                  <Link href="/agent-dashboard" className="explore-dropdown-item">
                    <i className={`fas fa-th-large ${styles.icon16}`}></i> DASHBOARD
                  </Link>
                )}
                {user.role === "STUDENT" && (
                  <Link href="/student-dashboard" className="explore-dropdown-item">
                    <i className={`fas fa-th-large ${styles.icon16}`}></i> DASHBOARD
                  </Link>
                )}
                <Link href={user.role === "AGENT" ? "/agent-dashboard/settings" : "/student-dashboard/settings"} className="explore-dropdown-item">
                  <i className={`fas fa-cog ${styles.icon16}`}></i> SETTINGS
                </Link>
                <div className="explore-dropdown-divider"></div>
                <button 
                  onClick={handleLogout} 
                  className={`explore-dropdown-item logout-link ${styles.logoutBtn}`}
                >
                  <i className={`fas fa-sign-out-alt ${styles.icon16}`}></i> LOG OUT
                </button>
              </div>
            </div>
          ) : (
            <div className={`nav-auth-group ${styles.authGroup}`}>
              <Link href="/auth/rolepick" className={`start-btn nav-btn ${styles.authBtnLink}`}>Sign up</Link>
              <Link href="/auth/login" className={`start-btn nav-btn ${styles.authBtnLink}`}>Log in</Link>
            </div>
          )}
        </div>
      </div>
      
      <button className="mobilebtn" onClick={toggleMobileMenu}>
        <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>
    </nav>
  );
}
