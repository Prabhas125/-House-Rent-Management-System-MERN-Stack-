const { validationResult } = require("express-validator");
const Property = require("../models/Property");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Create a new property listing (defaults to "pending" status)
// @route   POST /api/properties
// @access  Private (logged-in users)
const createProperty = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const property = await Property.create({
    ...req.body,
    owner: req.user._id,
    status: "pending", // every new listing must be approved by admin first
  });

  res.status(201).json({
    success: true,
    message: "Property submitted for admin approval",
    property,
  });
});

// @desc    Get all APPROVED properties, with search/filter/pagination
// @route   GET /api/properties
// @access  Public
// Query params: city, minPrice, maxPrice, propertyType, page, limit
const getProperties = asyncHandler(async (req, res) => {
  const { city, minPrice, maxPrice, propertyType, page = 1, limit = 9 } = req.query;

  const filter = { status: "approved", isAvailable: true };

  if (city) {
    filter["location.city"] = { $regex: city, $options: "i" };
  }
  if (propertyType) {
    filter.propertyType = propertyType;
  }
  if (minPrice || maxPrice) {
    filter.rent = {};
    if (minPrice) filter.rent.$gte = Number(minPrice);
    if (maxPrice) filter.rent.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [properties, total] = await Promise.all([
    Property.find(filter)
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Property.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: properties.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    properties,
  });
});

// @desc    Get a single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate("owner", "name email phone");

  if (!property) {
    return res.status(404).json({ success: false, message: "Property not found" });
  }

  res.status(200).json({ success: true, property });
});

// @desc    Get properties owned by the logged-in user
// @route   GET /api/properties/mine/list
// @access  Private
const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: properties.length, properties });
});

// @desc    Update a property (only by its owner, and resets status to pending)
// @route   PUT /api/properties/:id
// @access  Private (owner only)
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({ success: false, message: "Property not found" });
  }

  if (property.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized to edit this property" });
  }

  const allowedFields = [
    "title",
    "description",
    "propertyType",
    "rent",
    "location",
    "bedrooms",
    "bathrooms",
    "areaSqft",
    "images",
    "isAvailable",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) property[field] = req.body[field];
  });

  // Any edit requires re-approval to keep listings accurate
  property.status = "pending";

  const updated = await property.save();

  res.status(200).json({
    success: true,
    message: "Property updated and sent for re-approval",
    property: updated,
  });
});

// @desc    Delete a property (owner only)
// @route   DELETE /api/properties/:id
// @access  Private (owner only)
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({ success: false, message: "Property not found" });
  }

  if (property.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Not authorized to delete this property" });
  }

  await property.deleteOne();

  res.status(200).json({ success: true, message: "Property deleted successfully" });
});

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
};
