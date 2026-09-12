import React from "react";

interface HeroGalleryProps {
  gallery: string[];
  propertyTitle: string;
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  onOpenLightbox: (index: number) => void;
  hasVideo: boolean;
  variant?: "all" | "bento" | "carousel";
}

export default function HeroGallery({
  gallery,
  propertyTitle,
  currentImageIndex,
  setCurrentImageIndex,
  onOpenLightbox,
  hasVideo,
  variant = "all",
}: HeroGalleryProps) {
  const showBento = variant === "all" || variant === "bento";
  const showCarousel = variant === "all" || variant === "carousel";

  return (
    <>
      {/* --- 1. HERO BENTO MEDIA GRID (Desktop/Tablet) --- */}
      {showBento && (
        <div className="bento-gallery-container">
          {/* Main Hero Slot (Left 60%) */}
          <div className="bento-main-slot" onClick={() => onOpenLightbox(0)}>
            {gallery[0]?.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i) ? (
              <video 
                src={gallery[0]} 
                muted
                playsInline
                autoPlay
                loop
              />
            ) : (
              <img src={gallery[0]} alt={propertyTitle} />
            )}

            {hasVideo && (
              <div className="bento-video-badge">
                <i className="fas fa-video"></i> Video Tour Included
              </div>
            )}
          </div>

          {/* Sub Grid Slots (Right 40%) */}
          <div className="bento-side-grid">
            {[1, 2, 3, 4].map((idx) => {
              const mediaUrl = gallery[idx] || gallery[0];
              const isVid = mediaUrl.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
              return (
                <div 
                  key={idx} 
                  className="bento-sub-slot" 
                  onClick={() => onOpenLightbox(idx < gallery.length ? idx : 0)}
                >
                  {isVid ? (
                    <video src={mediaUrl} muted playsInline />
                  ) : (
                    <img src={mediaUrl} alt={`${propertyTitle} - ${idx}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* View All Photos Button */}
          <button className="bento-view-all-btn" onClick={() => onOpenLightbox(0)}>
            <i className="fas fa-images"></i> View all {gallery.length} Photos & Media
          </button>
        </div>
      )}

      {/* --- 2. Mobile Swipeable Carousel (Phone View) --- */}
      {showCarousel && (
        <div className="mobile-carousel-container">
          {(() => {
            const activeMedia = gallery[currentImageIndex] || gallery[0];
            const isVid = activeMedia.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
            return isVid ? (
              <video src={activeMedia} controls playsInline className="mobile-carousel-media" />
            ) : (
              <img src={activeMedia} alt={propertyTitle} className="mobile-carousel-media" />
            );
          })()}
          <div className="mobile-carousel-counter">
            {currentImageIndex + 1} / {gallery.length}
          </div>
          {gallery.length > 1 && (
            <>
              <button 
                className="mobile-carousel-nav prev"
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length)}
                aria-label="Previous photo"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button 
                className="mobile-carousel-nav next"
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % gallery.length)}
                aria-label="Next photo"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
