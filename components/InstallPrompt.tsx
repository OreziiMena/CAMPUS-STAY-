"use client";
import React, { useState, useEffect } from "react";

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | null>(null);

  useEffect(() => {
    // 1. Check if already running in standalone mode (installed)
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // 2. Check if dismissed recently
    const isDismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (isDismissed === "true") return;

    // 3. Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    // Only show on mobile viewports
    if (isIos) {
      setPlatform("ios");
      setShowPrompt(true);
    } else if (isAndroid) {
      setPlatform("android");
      setShowPrompt(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("pwa-prompt-dismissed", "true");
    setShowPrompt(false);
  };

  if (!showPrompt || !platform) return null;

  return (
    <div className="pwa-prompt-banner">
      <div className="pwa-prompt-content">
        <div className="pwa-prompt-icon">
          <img src="/icon.png" alt="Campus Stay Logo" />
        </div>
        <div className="pwa-prompt-text">
          <h4>Install Campus Stay</h4>
          {platform === "ios" ? (
            <p>
              Tap the share icon <i className="fa-solid fa-arrow-up-from-bracket" style={{ color: "#d35400" }}></i> and select <strong>"Add to Home Screen"</strong> for a native app experience.
            </p>
          ) : (
            <p>
              Tap the Chrome menu <i className="fas fa-ellipsis-v" style={{ color: "#d35400" }}></i> and select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
            </p>
          )}
        </div>
        <button className="pwa-prompt-close" onClick={handleDismiss} aria-label="Close prompt">
          &times;
        </button>
      </div>

      <style jsx>{`
        .pwa-prompt-banner {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 420px;
          background: white;
          border: 1px solid #eaeaea;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          border-radius: 16px;
          padding: 14px;
          z-index: 9999;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          font-family: 'Poppins', sans-serif;
        }

        @keyframes slideUp {
          from {
            transform: translate(-50%, 100px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        .pwa-prompt-content {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .pwa-prompt-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .pwa-prompt-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pwa-prompt-text {
          flex-grow: 1;
          padding-right: 20px;
        }

        .pwa-prompt-text h4 {
          margin: 0 0 3px 0;
          font-size: 0.9rem;
          color: rgb(2, 53, 28);
          font-weight: 700;
        }

        .pwa-prompt-text p {
          margin: 0;
          font-size: 0.75rem;
          color: #555;
          line-height: 1.4;
        }

        .pwa-prompt-close {
          position: absolute;
          top: -4px;
          right: -4px;
          background: none;
          border: none;
          font-size: 1.3rem;
          color: #aaa;
          cursor: pointer;
          transition: color 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .pwa-prompt-close:hover {
          color: #333;
        }
      `}</style>
    </div>
  );
}
