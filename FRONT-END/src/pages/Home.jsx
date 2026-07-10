import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="bg-dark text-white text-center py-5">
        <div className="container">
          <h1 className="display-5 fw-bold">Find Your Perfect Rental Home</h1>
          <p className="lead">
            Browse verified rental listings, connect with owners, and manage bookings — all in
            one place.
          </p>
          <Link to="/properties" className="btn btn-primary btn-lg me-2">
            Browse Properties
          </Link>
          <Link to="/add-property" className="btn btn-outline-light btn-lg">
            Post a Property
          </Link>
        </div>
      </div>

      <div className="container py-5">
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm p-4">
              <h4>🔍 Search & Filter</h4>
              <p className="text-muted">
                Find properties by location, price range, and type in seconds.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm p-4">
              <h4>✅ Admin Verified</h4>
              <p className="text-muted">
                Every listing is reviewed by an admin before it goes public, so listings are
                genuine.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm p-4">
              <h4>📋 Easy Booking</h4>
              <p className="text-muted">
                Request a property directly and track your booking status from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
