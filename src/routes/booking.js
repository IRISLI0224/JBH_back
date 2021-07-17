const express = require('express');

const router = express.Router();

const {
  addBooking,
  checkBooking,
  getAllBookingsOrByProduct,
  getBookingsByEnteringTime,
  getBookingsByStatusConfirm,
} = require('../controllers/booking');

router.post('/', addBooking);
router.post('/check',checkBooking);
router.get('', getAllBookingsOrByProduct);
router.get('', getBookingsByEnteringTime);
router.get('', getBookingsByStatusConfirm);

module.exports = router;