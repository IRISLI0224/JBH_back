const express = require('express');

const router = express.Router();

const {
  addBooking,
  checkBooking,
  editBooking,
  getBookingsByEnteringTime,
  getBookingsByStatusConfirm,
} = require('../controllers/booking');

router.post('/', addBooking);
router.get('/check', checkBooking);
router.put('/:id', editBooking);
router.get('', getBookingsByEnteringTime);
router.get('', getBookingsByStatusConfirm);

module.exports = router;
