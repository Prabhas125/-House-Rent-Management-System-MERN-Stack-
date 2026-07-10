import React, { useEffect, useState } from "react";
import { propertyAPI } from "../services/api.js";
import PropertyCard from "../components/PropertyCard.jsx";
import SearchFilter from "../components/SearchFilter.jsx";
import AlertMessage from "../components/AlertMessage.jsx";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = async (params = {}, pageNum = 1) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await propertyAPI.getAll({ ...params, page: pageNum, limit: 9 });
      setProperties(data.properties);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(filters, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    fetchProperties(newFilters, 1);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Browse Rental Properties</h2>
      <SearchFilter onSearch={handleSearch} />
      <AlertMessage type="danger" message={error} onClose={() => setError("")} />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : properties.length === 0 ? (
        <p className="text-muted text-center py-5">No approved properties match your search.</p>
      ) : (
        <>
          <div className="row g-4">
            {properties.map((property) => (
              <div className="col-md-4 col-sm-6" key={property._id}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setPage(p)}>
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Properties;
