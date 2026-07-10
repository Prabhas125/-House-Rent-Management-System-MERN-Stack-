const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 2000,
    },
    propertyType: {
      type: String,
      required: true,
      enum: ["Apartment", "House", "Villa", "PG/Hostel", "Studio", "Commercial"],
    },
    rent: {
      type: Number,
      required: [true, "Rent amount is required"],
      min: [0, "Rent cannot be negative"],
    },
    location: {
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true, default: "" },
      address: { type: String, required: true, trim: true },
      pincode: { type: String, trim: true, default: "" },
    },
    bedrooms: { type: Number, default: 1, min: 0 },
    bathrooms: { type: Number, default: 1, min: 0 },
    areaSqft: { type: Number, default: 0, min: 0 },
    // Storing image URLs (external links or placeholder) — actual file upload
    // is listed as a future enhancement, see README.
    images: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index to speed up common search/filter queries
propertySchema.index({ "location.city": 1, rent: 1, propertyType: 1, status: 1 });

module.exports = mongoose.model("Property", propertySchema);
