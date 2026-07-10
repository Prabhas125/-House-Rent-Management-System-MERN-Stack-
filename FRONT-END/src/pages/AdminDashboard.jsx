import React, { useEffect, useState } from "react";
import { adminAPI } from "../services/api.js";
import AlertMessage from "../components/AlertMessage.jsx";

const statusBadge = {
  pending: "bg-warning",
  approved: "bg-success",
  rejected: "bg-danger",
  confirmed: "bg-success",
  cancelled: "bg-secondary",
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [propertyFilter, setPropertyFilter] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTab = async (tab, filter = propertyFilter) => {
    setLoading(true);
    setError("");
    try {
      if (tab === "stats") {
        const { data } = await adminAPI.getStats();
        setStats(data.stats);
      } else if (tab === "users") {
        const { data } = await adminAPI.getUsers();
        setUsers(data.users);
      } else if (tab === "properties") {
        const { data } = await adminAPI.getProperties(filter || undefined);
        setProperties(data.properties);
      } else if (tab === "bookings") {
        const { data } = await adminAPI.getBookings();
        setBookings(data.bookings);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTab(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handlePropertyStatus = async (id, status) => {
    try {
      await adminAPI.updatePropertyStatus(id, status);
      setSuccess(`Property ${status}`);
      loadTab("properties");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update property");
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      await adminAPI.toggleBlockUser(id);
      loadTab("users");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 dashboard-sidebar p-3">
          <h6 className="text-white mb-3">Admin Panel</h6>
          <ul className="nav flex-column">
            {["stats", "users", "properties", "bookings"].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link btn btn-link text-start text-capitalize ${
                    activeTab === tab ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
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
              {activeTab === "stats" && stats && (
                <div className="row g-3">
                  {[
                    ["Total Users", stats.totalUsers],
                    ["Total Properties", stats.totalProperties],
                    ["Pending Approvals", stats.pendingProperties],
                    ["Approved Properties", stats.approvedProperties],
                    ["Total Bookings", stats.totalBookings],
                    ["Confirmed Bookings", stats.confirmedBookings],
                  ].map(([label, value]) => (
                    <div className="col-md-4" key={label}>
                      <div className="card shadow-sm p-3 text-center">
                        <h2 className="mb-0">{value}</h2>
                        <p className="text-muted mb-0">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "users" && (
                <div>
                  <h4 className="mb-3">Manage Users</h4>
                  <div className="table-responsive">
                    <table className="table table-hover bg-white">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.phone || "-"}</td>
                            <td>
                              <span className={`badge ${u.isBlocked ? "bg-danger" : "bg-success"}`}>
                                {u.isBlocked ? "Blocked" : "Active"}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-warning me-2"
                                onClick={() => handleToggleBlock(u._id)}
                              >
                                {u.isBlocked ? "Unblock" : "Block"}
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteUser(u._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "properties" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Manage Properties</h4>
                    <select
                      className="form-select w-auto"
                      value={propertyFilter}
                      onChange={(e) => {
                        setPropertyFilter(e.target.value);
                        loadTab("properties", e.target.value);
                      }}
                    >
                      <option value="">All</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover bg-white">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Owner</th>
                          <th>City</th>
                          <th>Rent</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.map((p) => (
                          <tr key={p._id}>
                            <td>{p.title}</td>
                            <td>{p.owner?.name}</td>
                            <td>{p.location?.city}</td>
                            <td>₹{p.rent}</td>
                            <td>
                              <span className={`badge ${statusBadge[p.status]}`}>{p.status}</span>
                            </td>
                            <td>
                              {p.status !== "approved" && (
                                <button
                                  className="btn btn-sm btn-outline-success me-2"
                                  onClick={() => handlePropertyStatus(p._id, "approved")}
                                >
                                  Approve
                                </button>
                              )}
                              {p.status !== "rejected" && (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handlePropertyStatus(p._id, "rejected")}
                                >
                                  Reject
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "bookings" && (
                <div>
                  <h4 className="mb-3">All Bookings</h4>
                  <div className="table-responsive">
                    <table className="table table-hover bg-white">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Requested By</th>
                          <th>Owner</th>
                          <th>Move-in</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b._id}>
                            <td>{b.property?.title}</td>
                            <td>{b.user?.name}</td>
                            <td>{b.owner?.name}</td>
                            <td>{new Date(b.moveInDate).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge ${statusBadge[b.status]}`}>{b.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
