import { useCallback, useEffect, useRef, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import Pagination from "../components/Pagination";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [activeFilters, setActiveFilters] = useState({});

  
  const [sortBy, setSortBy] = useState("L_SystemPrice");


  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const requestId = useRef(0);

  const loadProperties = useCallback(async (filters, page) => {
    const currentRequestId = ++requestId.current;

    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await fetchProperties({
        ...filters,
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
        sortBy,
        sortOrder,
      });

      if (currentRequestId === requestId.current) {
        setProperties(data.results || []);
        setTotal(data.total || 0);
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
  }, [itemsPerPage, sortBy, sortOrder]);

  useEffect(() => {
    loadProperties(activeFilters, currentPage);
  }, [activeFilters, currentPage, loadProperties]);

  function handleSearch(filters) {
    setActiveFilters(filters);
    setCurrentPage(1);
    setSortBy("L_SystemPrice");
    setSortOrder("asc");
  }

  function handleClear() {
    setActiveFilters({});
    setCurrentPage(1);
    setSortBy("L_SystemPrice");
    setSortOrder("asc");
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  const totalPages = Math.ceil(total / itemsPerPage);
  const firstVisible = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const lastVisible = Math.min(currentPage * itemsPerPage, total);

  return (
    <main className="listings-page">
      <h1>Property Search</h1>
      <PropertyFilters
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <div className="property-sorting" aria-label="Property sorting">
        <label>
          Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="L_SystemPrice">Price</option>
            <option value="ListingContractDate">Date listed</option>
            <option value="LM_Int2_3">Square footage</option>
            <option value="L_Keyword2">Beds</option>
          </select>
        </label>
        <label>
          Order
          <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
            <option value="asc">Low to high</option>
            <option value="desc">High to low</option>
          </select>
        </label>
      </div>

      {!isLoading && !errorMessage && (
        <p className="property-count">
          Showing {firstVisible}-{lastVisible} of {total} properties
        </p>
      )}

      {isLoading && <div className="status-panel">Loading properties...</div>}

      {!isLoading && errorMessage && (
        <div className="status-panel status-panel--error">{errorMessage}</div>
      )}

      {!isLoading && !errorMessage && (
        <>
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}

export default ListingsPage;
