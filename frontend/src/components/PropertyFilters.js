import { useState } from "react";

export const EMPTY_FILTERS = {
  city: "",
  zipcode: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
};

function PropertyFilters({ onSearch, onClear, disabled = false }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  function handleChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "")
    );

    onSearch(activeFilters);
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS);
    onClear();
  }

  return (
    <form className="property-filters" onSubmit={handleSubmit}>
      <div className="property-filters__fields">
        <label>
          City
          <input
            name="city"
            type="text"
            value={filters.city}
            onChange={handleChange}
          />
        </label>

        <label>
          ZIP code
          <input
            name="zipcode"
            type="text"
            inputMode="numeric"
            value={filters.zipcode}
            onChange={handleChange}
          />
        </label>

        <label>
          Min price
          <input
            name="minPrice"
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={handleChange}
          />
        </label>

        <label>
          Max price
          <input
            name="maxPrice"
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </label>

        <label>
          Beds
          <select name="beds" value={filters.beds} onChange={handleChange}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </label>

        <label>
          Baths
          <select name="baths" value={filters.baths} onChange={handleChange}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </label>
      </div>

      <div className="property-filters__actions">
        <button type="submit" disabled={disabled}>Search</button>
        <button type="button" className="button-secondary" onClick={handleClear}>
          Clear Filters
        </button>
      </div>
    </form>
  );
}

export default PropertyFilters;
