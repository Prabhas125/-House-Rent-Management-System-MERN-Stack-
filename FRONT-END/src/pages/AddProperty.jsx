import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { propertyAPI } from "../services/api.js";
import AlertMessage from "../components/AlertMessage.jsx";

const propertyTypes = ["Apartment", "House", "Villa", "PG/Hostel", "Studio", "Commercial"];

const initialState = {
  title: "",
  description: "",
  propertyType: "Apartment",
  rent: "",
  bedrooms: 1,
  bathrooms: 1,
  areaSqft: "",
  images: "", // comma-separated URLs, converted to array on submit
  location: { city: "", state: "", address: "", pincode: "" },
};

const AddProperty = () => {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["city", "state", "address", "pincode"].includes(name)) {
      setFormData({ ...formData, location: { ...formData.location, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const payload = {
        ...formData,
        rent: Number(formData.rent),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        areaSqft: Number(formData.areaSqft) || 0,
        images: formData.images
          ? formData.images.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await propertyAPI.create(payload);
      setSuccess("Property submitted successfully! It will be visible after admin approval.");
      setFormData(initialState);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setError(
        apiErrors ? apiErrors.map((e) => e.msg).join(", ") : err.response?.data?.message || "Failed to submit property"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <h3 className="mb-4">Post a New Property</h3>
      <AlertMessage type="danger" message={error} onClose={() => setError("")} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess("")} />

      <form onSubmit={handleSubmit} className="card shadow-sm p-4">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Property Type</label>
            <select
              name="propertyType"
              className="form-select"
              value={formData.propertyType}
              onChange={handleChange}
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Monthly Rent (₹)</label>
            <input
              type="number"
              name="rent"
              className="form-control"
              value={formData.rent}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              className="form-control"
              value={formData.bedrooms}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              className="form-control"
              value={formData.bathrooms}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Area (sqft)</label>
            <input
              type="number"
              name="areaSqft"
              className="form-control"
              value={formData.areaSqft}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <hr />
        <h6>Location</h6>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              className="form-control"
              value={formData.location.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">State</label>
            <input
              type="text"
              name="state"
              className="form-control"
              value={formData.location.state}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={formData.location.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Pincode</label>
            <input
              type="text"
              name="pincode"
              className="form-control"
              value={formData.location.pincode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Image URLs (comma-separated, optional)</label>
          <input
            type="text"
            name="images"
            className="form-control"
            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            value={formData.images}
            onChange={handleChange}
          />
          <small className="text-muted">
            File upload is a planned future enhancement — for now, paste image links.
          </small>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Submitting..." : "Submit for Approval"}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
