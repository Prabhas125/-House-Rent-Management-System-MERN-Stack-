const { validationResult } = require("express-validator");
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Create a booking request for a property
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { propertyId, moveInDate, message } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) {
    return res.status(404).json({ success: false, message: "Property not found" });
  }

  if (property.status !== "approved") {
    return res.status(400).json({ success: false, message: "Cannot book a property that is not approved" });
  }

  if (property.owner.toString() === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: "You cannot book your own property" });
  }

  const booking = await Booking.create({
    property: property._id,
    user: req.user._id,
    owner: property.owner,
    moveInDate,
    message,
    status: "pending",
  });

  res.status(201).json({ success: true, message: "Booking request submitted", booking });
});

// @desc    Get bookings made by the logged-in user
// @route   GET /api/bookings/mine
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("property", "title rent location images")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

// @desc    Get bookings received on properties owned by the logged-in user
// @route   GET /api/bookings/received
// @access  Private
const getReceivedBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ owner: req.user._id })
    .populate("property", "title rent location")
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

// @desc    Update booking status (confirm/cancel) — only property owner or admin
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value" });
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  const isOwner = booking.owner.toString() === req.user._id.toString();
  const isBookingUser = booking.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  // Property owner/admin can confirm or cancel; the requesting user can only cancel
  if (status === "cancelled" && !(isOwner || isBookingUser || isAdmin)) {
    return res.status(403).json({ success: false, message: "Not authorized to cancel this booking" });
  }
  if (status === "confirmed" && !(isOwner || isAdmin)) {
    return res.status(403).json({ success: false, message: "Only the property owner can confirm a booking" });
  }

  booking.status = status;
  await booking.save();

  res.status(200).json({ success: true, message: `Booking marked as ${status}`, booking });
});

// @desc    Cancel/delete a booking (booking owner only)
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Not authorized to delete this booking" });
  }

  await booking.deleteOne();
  res.status(200).json({ success: true, message: "Booking deleted successfully" });
});

module.exports = {
  createBooking,
  getMyBookings,
  getReceivedBookings,
  updateBookingStatus,
  deleteBooking,
};
