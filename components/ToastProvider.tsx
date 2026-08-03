"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Overlay Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card ${toast.type}`}>
            <div className="toast-icon">
              {toast.type === "success" && <i className="fas fa-check-circle"></i>}
              {toast.type === "error" && <i className="fas fa-exclamation-circle"></i>}
              {toast.type === "info" && <i className="fas fa-info-circle"></i>}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button className="toast-close-btn" onClick={() => removeToast(toast.id)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          pointer-events: none;
        }

        .toast-card {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 320px;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          animation: toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: all 0.3s ease;
        }

        @keyframes toastSlideIn {
          from {
            transform: translateY(24px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .toast-icon {
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .toast-card.success {
          border-left: 4px solid #10b981;
        }
        .toast-card.success .toast-icon {
          color: #10b981;
        }

        .toast-card.error {
          border-left: 4px solid #ef4444;
        }
        .toast-card.error .toast-icon {
          color: #ef4444;
        }

        .toast-card.info {
          border-left: 4px solid #3b82f6;
        }
        .toast-card.info .toast-icon {
          color: #3b82f6;
        }

        .toast-message {
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          color: #333;
          font-weight: 500;
          line-height: 1.4;
          flex-grow: 1;
        }

        .toast-close-btn {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 0.95rem;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .toast-close-btn:hover {
          color: #333;
        }

        @media (max-width: 576px) {
          .toast-container {
            bottom: 16px;
            left: 16px;
            right: 16px;
          }
          .toast-card {
            min-width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
