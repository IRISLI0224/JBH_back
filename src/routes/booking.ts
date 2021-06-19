export {};

const express = require('express');

const router = express.Router();

const {
  addBooking,
  getAllBookingsOrByProduct,
  getBookingByID,
  getBookingsByEnteringTime,
  getBookingsByStatusConfirm,
} = require('../controllers/booking');

router.post('', addBooking);
router.get('', getAllBookingsOrByProduct);
router.get('/:id', getBookingByID);
router.get('', getBookingsByEnteringTime);
router.get('', getBookingsByStatusConfirm);

module.exports = router;
