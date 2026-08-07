function PropertyMap({ latitude, longitude }) {
  if (latitude === null || latitude === undefined || latitude === "" ||
      longitude === null || longitude === undefined || longitude === "") {
    return null;
  }

  const location = `${latitude},${longitude}`;
  const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(location)}&zoom=15`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;

  return (
    <section className="property-map">
      <h2>Location</h2>
      <iframe
        title="Property location"
        src={embedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a href={directionsUrl} target="_blank" rel="noreferrer">
        Get Directions
      </a>
    </section>
  );
}

export default PropertyMap;
