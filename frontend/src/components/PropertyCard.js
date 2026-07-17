function getFirstPhotoUrl(photos) {
  if (!photos) {
    return null;
  }

  if (Array.isArray(photos)) {
    return typeof photos[0] === "string" && photos[0].trim() ? photos[0] : null;
  }

  if (typeof photos !== "string") {
    return null;
  }

  try {
    const parsedPhotos = JSON.parse(photos);

    if (!Array.isArray(parsedPhotos) || parsedPhotos.length === 0) {
      return null;
    }

    return typeof parsedPhotos[0] === "string" && parsedPhotos[0].trim()
      ? parsedPhotos[0]
      : null;
  } catch (error) {
    return null;
  }
}

function formatPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericPrice);
}

function formatFact(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
}

function PropertyCard({ property }) {
  const photoUrl = getFirstPhotoUrl(property.photos);

  return (
    <article className="property-card">
      <div className="property-card__media">
        {photoUrl ? (
          <img
            className="property-card__image"
            src={photoUrl}
            alt={property.address || "Property"}
          />
        ) : (
          <div className="property-card__placeholder">No photo</div>
        )}
      </div>

      <div className="property-card__content">
        <h2>{formatPrice(property.price)}</h2>
        <p className="property-card__address">{property.address || "Address unavailable"}</p>
        <p className="property-card__location">
          {property.city || "Unknown city"}, {property.state || "--"}
        </p>

        <dl className="property-card__facts">
          <div>
            <dt>Beds</dt>
            <dd>{formatFact(property.beds)}</dd>
          </div>
          <div>
            <dt>Baths</dt>
            <dd>{formatFact(property.baths)}</dd>
          </div>
          <div>
            <dt>Sqft</dt>
            <dd>{formatFact(property.sqft)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export default PropertyCard;
