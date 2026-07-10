import React, { useState } from "react";

const propertyTypes = ["", "Apartment", "House", "Villa", "PG/Hostel", "Studio", "Commercial"];

const SearchFilter = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    city: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const cleared = { city: "", propertyType: "", minPrice: "", maxPrice: "" };
    setFilters(cleared);
    onSearch(cleared);
  };

  return (
    <form className="row g-2 bg-white p-3 rounded shadow-sm mb-4" onSubmit={handleSubmit}>
      <div className="col-md-3 col-6">
        <input
          type="text"
          className="form-control"
          name="city"
          placeholder="City"
          value={filters.city}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-3 col-6">
        <select
          className="form-select"
          name="propertyType"
          value={filters.propertyType}
          onChange={handleChange}
        >
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type || "All Types"}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-2 col-6">
        <input
          type="number"
          className="form-control"
          name="minPrice"
          placeholder="Min Rent"
          value={filters.minPrice}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-2 col-6">
        <input
          type="number"
          className="form-control"
          name="maxPrice"
          placeholder="Max Rent"
          value={filters.maxPrice}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-2 d-flex gap-2">
        <button type="submit" className="btn btn-primary flex-fill">
          Search
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default SearchFilter;
