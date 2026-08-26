import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import PropertyImageCarousel from "./PropertyImageCarousel";

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
  return (
    <article className="property-card">
      <Link
        className="property-card__link"
        to={`/property/${encodeURIComponent(property.listingId)}`}
        aria-label={`View ${property.address || "property"}`}
      />
      <div className="property-card__media">
        <PropertyImageCarousel
          photos={property.photos}
          alt={property.address || "Property"}
        />
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

PropertyCard.propTypes = {
  property: PropTypes.shape({
    listingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    beds: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    baths: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sqft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    photos: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  }).isRequired,
};

export default PropertyCard;
