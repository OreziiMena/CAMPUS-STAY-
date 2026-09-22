"use client";

import React, { useState } from "react";
import styles from "./partner.module.css";

interface PartnerInteractiveProps {
  agencyName: string;
  slug: string;
  whatsappLink: string;
}

export default function PartnerInteractive({
  agencyName,
  slug,
  whatsappLink,
}: PartnerInteractiveProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : `https://campustent.com/partner/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${agencyName} — CampusTent Trusted Agency`,
          text: `Check out verified student accommodation and hostels from ${agencyName} on CampusTent!`,
          url: url,
        });
        return;
      } catch {
        // Fallback to clipboard if share cancelled
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className={styles.heroActions}>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.actionBtnWhatsApp}
      >
        <i className="fab fa-whatsapp"></i> Chat on WhatsApp
      </a>

      <button
        type="button"
        onClick={handleShare}
        className={styles.actionBtnShare}
      >
        <i className={copied ? "fas fa-check" : "fas fa-share-alt"}></i>
        {copied ? "Link Copied!" : "Share Agency Hub"}
      </button>
    </div>
  );
}
