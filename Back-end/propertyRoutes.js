const express = require("express");
const { body } = require("express-validator");
const {
  createProperty,
  getProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const propertyValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("propertyType")
    .isIn(["Apartment", "House", "Villa", "PG/Hostel", "Studio", "Commercial"])
    .withMessage("Invalid property type"),
  body("rent").isFloat({ min: 0 }).withMessage("Rent must be a positive number"),
  body("location.city").trim().notEmpty().withMessage("City is required"),
  body("location.address").trim().notEmpty().withMessage("Address is required"),
];

// Public routes
router.get("/", getProperties);
router.get("/:id", getPropertyById);

// Private routes (must come before "/:id" collisions are avoided via distinct paths)
router.get("/mine/list", protect, getMyProperties);
router.post("/", protect, propertyValidation, createProperty);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);

module.exports = router;
