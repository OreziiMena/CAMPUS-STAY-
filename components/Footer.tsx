"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/app/actions/auth";
import styles from "./Footer.module.css";

export default function Footer() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    checkUser();
  }, []);

  return (
    <footer className="main-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Image 
            src="/Assets/CAMPUS STAY LOGO.png" 
            alt="logo" 
            width={150} 
            height={50} 
            className={`footer-logo ${styles.logoImg}`}
          />
          <p className="brand-tagline">Connecting Students with <br />Trusted Off-Campus Housing.</p>
        </div>

        <div className="footer-links">
          <h4>PLATFORM</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/explore">Explore Properties</Link></li>
            <li>
              <Link href={user ? (user.role === "AGENT" ? "/agent-dashboard" : "/explore") : "/auth/rolepick"}>
                Find a Roommate
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>RESOURCES</h4>
          <ul>
            <li><Link href="/support">Help Center / Support</Link></li>
            <li><Link href="/tenant-guide">Tenant Guide</Link></li>
            <li><Link href="/landlord-hub">Landlord Hub</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>CONNECT</h4>
          <ul>
            <li><a href="mailto:support@campusstay.com"><i className="fa-solid fa-envelope"></i> support@campusstay.com</a></li>
            <li>
              <a href="https://wa.me/2349161863877?text=Hi%20Campus%20Stay%20Support,%20I%20need%20help" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-whatsapp"></i> Chat with Us
              </a>
            </li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 Campus Stay. All rights reserved.</p>
      </div>
    </footer>
  );
}
