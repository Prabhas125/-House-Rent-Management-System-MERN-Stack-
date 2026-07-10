const express = require("express");
const {
  getStats,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getAllProperties,
  updatePropertyStatus,
  getAllBookings,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// All admin routes require a valid token AND the "admin" role
router.use(protect, authorize("admin"));

router.get("/stats", getStats);

router.get("/users", getAllUsers);
router.put("/users/:id/block", toggleBlockUser);
router.delete("/users/:id", deleteUser);

router.get("/properties", getAllProperties);
router.put("/properties/:id/status", updatePropertyStatus);

router.get("/bookings", getAllBookings);

module.exports = router;
