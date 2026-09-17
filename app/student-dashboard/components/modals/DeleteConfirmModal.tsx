"use client";

import React from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  listingTitle: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  listingTitle,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="student-modal-overlay" onClick={onCancel}>
      <div 
        className="student-modal-container delete-confirm-modal-container" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="student-modal-header delete-confirm-header">
          <div>
            <h3 className="receipt-modal-title">
              <i className="fas fa-exclamation-triangle"></i> Delete Listing
            </h3>
            <span className="dispute-ref-subtitle">Permanent Action</span>
          </div>
          <button 
            type="button" 
            onClick={onCancel} 
            className="student-modal-close-btn"
            disabled={isDeleting}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="delete-confirm-body">
          <div className="delete-warning-icon-wrap">
            <i className="fas fa-trash-alt delete-warning-icon"></i>
          </div>
          <h4 className="delete-confirm-title">Are you sure?</h4>
          <p className="delete-confirm-text">
            You are about to delete <strong>&quot;{listingTitle}&quot;</strong>. This listing will be immediately removed and cannot be restored.
          </p>

          <div className="delete-actions-row">
            <button
              type="button"
              className="delete-cancel-btn"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="delete-proceed-btn"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Deleting...
                </>
              ) : (
                <>
                  <i className="fas fa-trash-alt"></i> Delete Listing
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
