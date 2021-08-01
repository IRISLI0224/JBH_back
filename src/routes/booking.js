const express = require('express');

const bookingValidator = require('../middleware/bookingValidator');
const authGuard = require('../middleware/authGuard');
// const adminGuard = require('../middleware/adminGuard');

const router = express.Router();

const {
  addBooking,
  getAllBookings,
  getBookingsByMonth,
  getBookingsByPhone,
  getBookingsByEmail,
  getBookingByBookingNum,
  getBookingsByBookingDate,
  getBookingById,
  updateBookingByBookingNum,
  updateBookingById,
  deleteBookingById,
} = require('../controllers/booking');

router.post('', bookingValidator, addBooking);
router.get('/all', authGuard, getAllBookings);
router.get('/monthly/:year/:month', getBookingsByMonth);
router.get('/phone/:phone', authGuard, getBookingsByPhone);
router.get('/email/:email', authGuard, getBookingsByEmail);
router.get('/bookingnum/:bookingNum', authGuard, getBookingByBookingNum);
router.get('/bookingdate/:bookingDate', authGuard, getBookingsByBookingDate);
router.get('/id/:_id', authGuard, getBookingById);
router.put(
  '/bookingnum/:bookingNum',
  bookingValidator,
  authGuard,
  updateBookingByBookingNum,
);
router.put('/id/:_id', bookingValidator, authGuard, updateBookingById);
router.delete('/id/:_id', authGuard, deleteBookingById);

module.exports = router;
