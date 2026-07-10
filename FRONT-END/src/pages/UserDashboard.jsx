import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authAPI, propertyAPI, bookingAPI } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import AlertMessage from "../components/AlertMessage.jsx";

const statusBadge = {
  pending: "bg-warning",
  approved: "bg-success",
  rejected: "bg-danger",
  confirmed: "bg-success",
  cancelled: "bg-secondary",
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "", phone: "", password: "" });
  const [myProperties, setMyProperties] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [profileRes, propsRes, bookingsRes] = await Promise.all([
        authAPI.getProfile(),
        propertyAPI.getMine(),
        bookingAPI.getMine(),
      ]);
      setProfile({ name: profileRes.data.user.name, phone: profileRes.data.user.phone || "", password: "" });
      setMyProperties(propsRes.data.properties);
      setMyBookings(bookingsRes.data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const payload = { name: profile.name, phone: profile.phone };
      if (profile.password) payload.password = profile.password;
      await authAPI.updateProfile(payload);
      setSuccess("Profile updated successfully");
      setProfile({ ...profile, password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Delete this property listing?")) return;
    try {
      await propertyAPI.remove(id);
      setMyProperties(myProperties.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete property");
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await bookingAPI.updateStatus(id, "cancelled");
      setMyBookings(myBookings.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 dashboard-sidebar p-3">
          <h6 className="text-white mb-3">My Dashboard</h6>
          <ul className="nav flex-column">
            {["profile", "listings", "bookings"].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link btn btn-link text-start ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "profile" && "My Profile"}
                  {tab === "listings" && "My Listings"}
                  {tab === "bookings" && "My Bookings"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-10 p-4">
          <AlertMessage type="danger" message={error} onClose={() => setError("")} />
          <AlertMessage type="success" message={success} onClose={() => setSuccess("")} />

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : (
            <>
              {activeTab === "profile" && (
                <div className="card p-4 shadow-sm" style={{ maxWidth: 500 }}>
                  <h4>My Profile</h4>
                  <p className="text-muted">Email: {user.email} (cannot be changed)</p>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">New Password (leave blank to keep current)</label>
                      <input
                        type="password"
                        className="form-control"
                        value={profile.password}
                        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                        minLength={6}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "listings" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>My Listings</h4>
                    <Link to="/add-property" className="btn btn-primary btn-sm">
                      + Post New Property
                    </Link>
                  </div>
                  {myProperties.length === 0 ? (
                    <p className="text-muted">You haven't posted any properties yet.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover bg-white">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>City</th>
                            <th>Rent</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myProperties.map((p) => (
                            <tr key={p._id}>
                              <td>{p.title}</td>
                              <td>{p.location?.city}</td>
                              <td>₹{p.rent}</td>
                              <td>
                                <span className={`badge ${statusBadge[p.status]}`}>{p.status}</span>
                              </td>
                              <td>
                                <Link to={`/properties/${p._id}`} className="btn btn-sm btn-outline-primary me-2">
                                  View
                                </Link>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteProperty(p._id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "bookings" && (
                <div>
                  <h4 className="mb-3">My Bookings</h4>
                  {myBookings.length === 0 ? (
                    <p className="text-muted">You haven't requested any bookings yet.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover bg-white">
                        <thead>
                          <tr>
                            <th>Property</th>
                            <th>Move-in Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myBookings.map((b) => (
                            <tr key={b._id}>
                              <td>{b.property?.title || "Property removed"}</td>
                              <td>{new Date(b.moveInDate).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge ${statusBadge[b.status]}`}>{b.status}</span>
                              </td>
                              <td>
                                {b.status === "pending" && (
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleCancelBooking(b._id)}
                                  >
                                    Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
