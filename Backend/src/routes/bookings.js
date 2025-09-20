const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  updateBookingStatus,
  cancelBooking,
  getBookingAnalytics,
  addBookingMessage
} = require('../controllers/bookings');

const { protect, protectAdmin, protectProvider } = require('../middleware/auth');
const { checkAdminPermission, checkBookingAccess } = require('../middleware/roleCheck');
const { bookingValidations, queryValidations } = require('../middleware/validation');

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

// Get all bookings (filtered by user role)
router.get('/', queryValidations.pagination, queryValidations.dateRange, getBookings);

// Create new booking (users only)
router.post('/', bookingValidations.create, createBooking);

// Analytics (admin/provider only)
router.get('/analytics', getBookingAnalytics);

// Single booking routes
router.get('/:id', checkBookingAccess, getBooking);
router.put('/:id', checkBookingAccess, bookingValidations.update, updateBooking);

// Status management (provider/admin only)
router.put('/:id/status', checkBookingAccess, bookingValidations.updateStatus, updateBookingStatus);

// Cancel booking (user/admin only)
router.put('/:id/cancel', checkBookingAccess, cancelBooking);

// Communication
router.post('/:id/messages', checkBookingAccess, addBookingMessage);

module.exports = router;