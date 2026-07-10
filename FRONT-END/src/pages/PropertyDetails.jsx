import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { propertyAPI, bookingAPI } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import AlertMessage from "../components/AlertMessage.jsx";

const PropertyDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [booking, setBooking] = useState({ moveInDate: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await propertyAPI.getById(id);
        setProperty(data.property);
      } catch (err) {
        setError(err.response?.data?.message || "Property not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleBookingChange = (e) => setBooking({ ...booking, [e.target.name]: e.target.value });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await bookingAPI.create({ propertyId: id, ...booking });
      setSuccess("Booking request submitted successfully! Check your dashboard for status.");
      setBooking({ moveInDate: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="container py-5">
        <AlertMessage type="danger" message={error} />
      </div>
    );
  }

  const isOwner = user && property.owner?._id === user._id;
  const image =
    property.images && property.images.length > 0
      ? property.images[0]
      : "https://placehold.co/800x400?text=Property+Image";

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-7">
          <img src={image} alt={property.title} className="img-fluid rounded shadow-sm mb-3" />
          <h2>{property.title}</h2>
          <p className="text-muted">
            {property.location?.address}, {property.location?.city}, {property.location?.state}
          </p>
          <h4 className="text-primary">₹{property.rent} / month</h4>
          <div className="d-flex gap-4 my-3">
            <span>🛏️ {property.bedrooms} Beds</span>
            <span>🛁 {property.bathrooms} Baths</span>
            <span>📐 {property.areaSqft} sqft</span>
            <span>🏷️ {property.propertyType}</span>
          </div>
          <p>{property.description}</p>
          <p className="text-muted small">
            Listed by: {property.owner?.name} ({property.owner?.email})
          </p>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">Request to Book</h5>
            <AlertMessage type="danger" message={error} onClose={() => setError("")} />
            <AlertMessage type="success" message={success} onClose={() => setSuccess("")} />

            {isOwner ? (
              <p className="text-muted">You own this listing.</p>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div className="mb-3">
                  <label className="form-label">Preferred Move-in Date</label>
                  <input
                    type="date"
                    name="moveInDate"
                    className="form-control"
                    value={booking.moveInDate}
                    onChange={handleBookingChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message to Owner (optional)</label>
                  <textarea
                    name="message"
                    className="form-control"
                    rows="3"
                    value={booking.message}
                    onChange={handleBookingChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                  {submitting ? "Submitting..." : "Request Booking"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
