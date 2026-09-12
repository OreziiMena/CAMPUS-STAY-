import React from "react";

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  gallery: string[];
  propertyTitle: string;
  lightboxIndex: number;
  setLightboxIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function LightboxModal({
  isOpen,
  onClose,
  gallery,
  propertyTitle,
  lightboxIndex,
  setLightboxIndex,
}: LightboxModalProps) {
  if (!isOpen) return null;

  return (
    <div className="lightbox-modal-overlay">
      <div className="lightbox-header">
        <div className="lightbox-title">
          {propertyTitle}
        </div>
        <div className="lightbox-counter">
          {lightboxIndex + 1} / {gallery.length}
        </div>
        <button className="lightbox-close-btn" onClick={onClose} aria-label="Close lightbox">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="lightbox-main-view">
        {gallery.length > 1 && (
          <button 
            className="lightbox-nav-btn prev"
            onClick={() => setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length)}
            aria-label="Previous image"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        )}

        {gallery[lightboxIndex]?.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i) ? (
          <video src={gallery[lightboxIndex]} controls autoPlay className="lightbox-media" />
        ) : (
          <img src={gallery[lightboxIndex]} alt="Full view" className="lightbox-media" />
        )}

        {gallery.length > 1 && (
          <button 
            className="lightbox-nav-btn next"
            onClick={() => setLightboxIndex((prev) => (prev + 1) % gallery.length)}
            aria-label="Next image"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      <div className="lightbox-thumbnail-strip">
        {gallery.map((imgUrl: string, idx: number) => {
          const isVid = imgUrl.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
          return (
            <div 
              key={idx} 
              className={`lightbox-thumb ${lightboxIndex === idx ? "active" : ""}`}
              onClick={() => setLightboxIndex(idx)}
            >
              {isVid ? (
                <video src={imgUrl} muted />
              ) : (
                <img src={imgUrl} alt={`Thumb ${idx}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
