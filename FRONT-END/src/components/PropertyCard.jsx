import React from "react";
import { Link } from "react-router-dom";

const statusClass = {
  pending: "status-badge-pending",
  approved: "status-badge-approved",
  rejected: "status-badge-rejected",
};

const PropertyCard = ({ property, showStatus = false }) => {
  const image =
    property.images && property.images.length > 0
      ? property.images[0]
      : "https://placehold.co/400x250?text=Property+Image";

  return (
    <div className="card property-card shadow-sm">
      <img src={image} className="card-img-top" alt={property.title} />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title">{property.title}</h5>
          {showStatus && (
            <span className={`badge ${statusClass[property.status] || "bg-secondary"}`}>
              {property.status}
            </span>
          )}
        </div>
        <p className="text-muted mb-1">
          {property.location?.address}, {property.location?.city}
        </p>
        <p className="mb-1">
          <strong>₹{property.rent}</strong> / month
        </p>
        <p className="text-muted small mb-2">
          Owner: {property.owner?.name || "N/A"}
        </p>
        <Link to={`/properties/${property._id}`} className="btn btn-primary mt-auto btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
