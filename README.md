# 🏠 House Rent Management System

A full-stack **MERN** application for browsing rental properties, posting listings, and managing bookings — with admin moderation and role-based dashboards.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

**[Features](#-features)** • **[Tech Stack](#-tech-stack)** • **[Getting Started](#-getting-started)** • **[API Reference](#-api-reference)** • **[Project Structure](#-project-structure)**

---

## 📖 Overview

**House Rent Management System** is a submission-ready academic/portfolio project that simulates a real rental marketplace. Users can register, list properties for rent, search/filter approved listings, and request bookings. Admins moderate every listing before it goes public and oversee users and bookings platform-wide.

Built with a clean **MVC backend** (Express + MongoDB) and a **componentized React frontend**, using JWT authentication, bcrypt password hashing, and role-based route protection throughout.

---

## ✨ Features

- 🔐 **Secure Auth** — JWT-based login/register with bcrypt-hashed passwords
- 👥 **Role-Based Access** — separate `user` and `admin` permissions enforced on both frontend and backend
- 🏘️ **Property Listings** — full CRUD with image URLs, bedrooms/bathrooms/area, and structured location data
- 🔍 **Search & Filter** — by city, price range, and property type, with pagination
- ✅ **Admin Approval Workflow** — listings stay `pending` until an admin approves them; editing resets status for re-review
- 📋 **Booking System** — request, confirm, or cancel bookings with clear status tracking
- 📊 **Dashboards** — personal dashboard (profile, listings, bookings) and an admin dashboard (stats, user/property/booking management)
- 🛡️ **Validation & Error Handling** — `express-validator` on all inputs, centralized error middleware, consistent JSON responses
- 📱 **Responsive UI** — Bootstrap 5 layout that adapts across desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), React Router v6, Axios, Bootstrap 5 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **Validation** | express-validator |

---

## 📂 Project Structure

```
house-rent-management/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Business logic (auth, property, booking, admin)
│   ├── middleware/      # JWT auth, role checks, error handling
│   ├── models/          # Mongoose schemas: User, Property, Booking
│   ├── routes/          # Express route definitions
│   ├── utils/           # JWT helper, async wrapper, admin seed script
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/  # Navbar, PropertyCard, SearchFilter, ProtectedRoute, AlertMessage
        ├── context/      # AuthContext (global auth state)
        ├── pages/        # Home, Login, Register, Properties, PropertyDetails,
        │                 # AddProperty, UserDashboard, AdminDashboard
        ├── services/     # Axios instance + grouped API calls
        └── App.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/house-rent-management.git
cd house-rent-management
```

### 2. Set up the backend
```bash
cd backend
npm install
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, etc.
npm run seed:admin         # creates the default admin account
npm run dev                 # runs on http://localhost:5000
```

### 3. Set up the frontend
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev                 # runs on http://localhost:5173
```

### 4. Log in
- Register a new account to try the renter/lister flow.
- Use the seeded admin credentials (from `backend/.env`) to try the moderation flow:
  ```
  Email:    admin@houserent.com
  Password: Admin@12345
  ```

---

## 🔑 Environment Variables

**backend/.env**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/house_rent_db
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@houserent.com
ADMIN_PASSWORD=Admin@12345
```

**frontend/.env**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📡 API Reference

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Register a new user |
| `/api/auth/login` | POST | Public | Log in and receive a JWT |
| `/api/auth/profile` | GET/PUT | Private | View or update profile |
| `/api/properties` | GET | Public | Browse approved properties (search/filter/pagination) |
| `/api/properties/:id` | GET | Public | View a single property |
| `/api/properties` | POST | Private | Create a listing (pending approval) |
| `/api/properties/:id` | PUT/DELETE | Private (owner) | Update or delete own listing |
| `/api/bookings` | POST | Private | Request a booking |
| `/api/bookings/mine` / `/received` | GET | Private | View sent or received bookings |
| `/api/bookings/:id/status` | PUT | Private | Confirm or cancel a booking |
| `/api/admin/stats` | GET | Admin | Platform-wide statistics |
| `/api/admin/users` | GET | Admin | Manage users (block/delete) |
| `/api/admin/properties` | GET/PUT | Admin | Approve/reject listings |
| `/api/admin/bookings` | GET | Admin | View all bookings |

> Full endpoint documentation, request/response shapes, and a testing checklist are in the project's technical README.

---

## 🗺️ Roadmap

- [ ] Image upload via Cloudinary/S3 (currently accepts image URLs)
- [ ] Payment integration (Razorpay/Stripe)
- [ ] Favorites/wishlist
- [ ] Real-time chat between renters and owners (Socket.IO)
- [ ] Map-based property search
- [ ] Email notifications for bookings and approvals
- [ ] Reviews & ratings

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

Built as a full-stack MERN learning project — contributions and forks welcome.
