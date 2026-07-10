const User = require("../models/User");
const Property = require("../models/Property");
const Booking = require("../models/Booking");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get overall dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalProperties, pendingProperties, approvedProperties, totalBookings, confirmedBookings] =
    await Promise.all([
      User.countDocuments({ role: "user" }),
      Property.countDocuments(),
      Property.countDocuments({ status: "pending" }),
      Property.countDocuments({ status: "approved" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "confirmed" }),
    ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalProperties,
      pendingProperties,
      approvedProperties,
      totalBookings,
      confirmedBookings,
    },
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "user" }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users });
});

// @desc    Block or unblock a user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
    user,
  });
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  await user.deleteOne();
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

// @desc    Get all properties regardless of status
// @route   GET /api/admin/properties
// @access  Private/Admin
const getAllProperties = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const properties = await Property.find(filter)
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: properties.length, properties });
});

// @desc    Approve or reject a property listing
// @route   PUT /api/admin/properties/:id/status
// @access  Private/Admin
const updatePropertyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value" });
  }

  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: "Property not found" });
  }

  property.status = status;
  await property.save();

  res.status(200).json({
    success: true,
    message: `Property ${status} successfully`,
    property,
  });
});

// @desc    Get all bookings (admin oversight)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("property", "title rent location")
    .populate("user", "name email")
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

module.exports = {
  getStats,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getAllProperties,
  updatePropertyStatus,
  getAllBookings,
};
