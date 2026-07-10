const express = require("express");
const { body } = require("express-validator");
const {
  createBooking,
  getMyBookings,
  getReceivedBookings,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const bookingValidation = [
  body("propertyId").notEmpty().withMessage("propertyId is required"),
  body("moveInDate").notEmpty().withMessage("moveInDate is required"),
];

router.post("/", protect, bookingValidation, createBooking);
router.get("/mine", protect, getMyBookings);
router.get("/received", protect, getReceivedBookings);
router.put("/:id/status", protect, updateBookingStatus);
router.delete("/:id", protect, deleteBooking);

module.exports = router;
