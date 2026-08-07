import { useState } from "react";
import { parsePhotos } from "../utils/photos";

function PropertyImageCarousel({ photos, alt }) {
  const photoUrls = parsePhotos(photos);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (photoUrls.length === 0) {
    return <div className="property-card__placeholder">No photo</div>;
  }

  function changePhoto(event, direction) {
    event.preventDefault();
    event.stopPropagation();
    setCurrentIndex((index) =>
      (index + direction + photoUrls.length) % photoUrls.length
    );
  }

  return (
    <div className="property-carousel">
      <img className="property-card__image" src={photoUrls[currentIndex]} alt={alt} />

      {photoUrls.length > 1 && (
        <>
          <button
            type="button"
            className="property-carousel__arrow property-carousel__arrow--previous"
            aria-label="Previous photo"
            onClick={(event) => changePhoto(event, -1)}
          >
            &#8249;
          </button>
          <button
            type="button"
            className="property-carousel__arrow property-carousel__arrow--next"
            aria-label="Next photo"
            onClick={(event) => changePhoto(event, 1)}
          >
            &#8250;
          </button>
          <span className="property-carousel__counter">
            {currentIndex + 1} / {photoUrls.length}
          </span>
        </>
      )}
    </div>
  );
}

export default PropertyImageCarousel;
