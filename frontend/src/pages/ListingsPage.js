import { useCallback, useEffect, useRef, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const requestId = useRef(0);

  const loadProperties = useCallback(async (filters = {}) => {
    const currentRequestId = ++requestId.current;

    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await fetchProperties({ ...filters, limit: 20, offset: 0 });

      if (currentRequestId === requestId.current) {
        setProperties(data.results || []);
        setTotal(data.total || 0);
        setLimit(data.limit || 20);
      }
    } catch (error) {
      if (currentRequestId === requestId.current) {
        setErrorMessage(error.message || "Unable to load properties");
        setProperties([]);
        setTotal(0);
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const visibleCount = Math.min(limit, properties.length);

  return (
    <main className="listings-page">
      <h1>Property Search</h1>
      <PropertyFilters
        onSearch={loadProperties}
        onClear={() => loadProperties()}
      />

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
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.listingId} property={property} />
            ))
          ) : (
            <p className="empty-state">
              No properties found. Try changing or clearing your filters.
            </p>
          )}
        </section>
      )}
    </main>
  );
}

export default ListingsPage;
