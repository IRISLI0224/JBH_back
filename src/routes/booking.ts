// @ts-ignore
const express = require("express");

// @ts-ignore
const { addBooking, deleteBooking } = require("../controllers/booking");

// @ts-ignore
const router = express.Router();

router.post("/", addBooking);
router.delete('/:bookingDate/:bookingTime', deleteBooking);

module.exports = router;
