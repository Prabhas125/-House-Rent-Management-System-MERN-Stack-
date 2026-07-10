import axios from "axios";

// Centralized Axios instance. Base URL comes from Vite env variable.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "bypass-tunnel-reminder": "true",
  },
});

// Attach JWT token (stored after login) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response handler: auto-logout on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;

// ---- Grouped API helper functions (keeps components clean) ----

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

export const propertyAPI = {
  getAll: (params) => api.get("/properties", { params }),
  getById: (id) => api.get(`/properties/${id}`),
  getMine: () => api.get("/properties/mine/list"),
  create: (data) => api.post("/properties", data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  remove: (id) => api.delete(`/properties/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post("/bookings", data),
  getMine: () => api.get("/bookings/mine"),
  getReceived: () => api.get("/bookings/received"),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  remove: (id) => api.delete(`/bookings/${id}`),
};

export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getUsers: () => api.get("/admin/users"),
  toggleBlockUser: (id) => api.put(`/admin/users/${id}/block`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getProperties: (status) => api.get("/admin/properties", { params: { status } }),
  updatePropertyStatus: (id, status) => api.put(`/admin/properties/${id}/status`, { status }),
  getBookings: () => api.get("/admin/bookings"),
};
