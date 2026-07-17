import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProperties() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await fetchProperties({ limit: 20, offset: 0 });

        setProperties(data.results || []);
        setTotal(data.total || 0);
        setLimit(data.limit || 20);
      } catch (error) {
        setErrorMessage(error.message || "Unable to load properties");
      } finally {
        setIsLoading(false);
      }
    }

    loadProperties();
  }, []);

  const visibleCount = Math.min(limit, properties.length);

  return (
    <main className="listings-page">
      {!isLoading && !errorMessage && (
        <p className="property-count">
          Showing {visibleCount} of {total} properties
        </p>
      )}

      {isLoading && <div className="status-panel">Loading properties...</div>}

      {!isLoading && errorMessage && (
        <div className="status-panel status-panel--error">{errorMessage}</div>
      )}

      {!isLoading && !errorMessage && (
        <section className="property-grid" aria-label="Property results">
          {properties.map((property) => (
            <PropertyCard key={property.listingId} property={property} />
          ))}
        </section>
      )}
    </main>
  );
}

export default ListingsPage;
