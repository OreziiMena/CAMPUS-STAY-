import React from "react";

interface DocViewerModalProps {
  activePreviewDoc: { url: string; title: string } | null;
  onClose: () => void;
}

export default function DocViewerModal({
  activePreviewDoc,
  onClose,
}: DocViewerModalProps) {
  if (!activePreviewDoc) return null;

  return (
    <div 
      onClick={onClose}
      className="admin-modal-overlay"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="admin-modal-container doc-viewer"
      >
        {/* Modal Header */}
        <div className="admin-modal-header">
          <h3 className="admin-modal-header-title">{activePreviewDoc.title}</h3>
          <button 
            onClick={onClose}
            className="admin-modal-close-btn"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="doc-viewer-body">
          {activePreviewDoc.url.toLowerCase().endsWith(".pdf") ? (
            <iframe 
              src={activePreviewDoc.url} 
              className="doc-viewer-iframe"
            ></iframe>
          ) : (
            <div className="doc-viewer-img-container">
              <img 
                src={activePreviewDoc.url} 
                alt={activePreviewDoc.title} 
                className="doc-viewer-img"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="admin-modal-footer">
          <a 
            href={activePreviewDoc.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="doc-open-link-btn"
          >
            <i className="fas fa-external-link-alt"></i> Open In New Tab
          </a>
          <button 
            onClick={onClose} 
            className="doc-close-btn"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
