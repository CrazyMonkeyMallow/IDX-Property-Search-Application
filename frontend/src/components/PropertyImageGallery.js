import { useEffect, useRef, useState } from "react";
import { parsePhotos } from "../utils/photos";

function PropertyImageGallery({ photos, alt }) {
  const photoUrls = parsePhotos(photos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const lightboxRef = useRef(null);

  useEffect(() => {
    if (isLightboxOpen) {
      lightboxRef.current?.focus();
    }
  }, [isLightboxOpen]);

  if (photoUrls.length === 0) {
    return <div className="property-gallery__placeholder">No photos available</div>;
  }

  function move(direction) {
    setCurrentIndex((index) =>
      (index + direction + photoUrls.length) % photoUrls.length
    );
  }

  function handleLightboxKeyDown(event) {
    if (event.key === "Escape") setIsLightboxOpen(false);
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  }

  return (
    <section className="property-gallery" aria-label="Property photos">
      <button
        type="button"
        className="property-gallery__main"
        onClick={() => setIsLightboxOpen(true)}
        aria-label="Open photo gallery"
      >
        <img src={photoUrls[currentIndex]} alt={alt} />
      </button>

      {photoUrls.length > 1 && (
        <div className="property-gallery__thumbnails">
          {photoUrls.map((photo, index) => (
            <button
              type="button"
              key={photo}
              className={index === currentIndex ? "is-active" : ""}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Show photo ${index + 1}`}
            >
              <img src={photo} alt="" />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Property photo lightbox"
          tabIndex={-1}
          ref={lightboxRef}
          onKeyDown={handleLightboxKeyDown}
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsLightboxOpen(false);
          }}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close gallery"
            onClick={() => setIsLightboxOpen(false)}
          >
            &times;
          </button>
          {photoUrls.length > 1 && (
            <button
              type="button"
              className="lightbox__arrow lightbox__arrow--previous"
              aria-label="Previous photo"
              onClick={() => move(-1)}
            >
              &#8249;
            </button>
          )}
          <img src={photoUrls[currentIndex]} alt={alt} />
          {photoUrls.length > 1 && (
            <button
              type="button"
              className="lightbox__arrow lightbox__arrow--next"
              aria-label="Next photo"
              onClick={() => move(1)}
            >
              &#8250;
            </button>
          )}
          <span className="lightbox__counter">
            {currentIndex + 1} / {photoUrls.length}
          </span>
        </div>
      )}
    </section>
  );
}

export default PropertyImageGallery;
