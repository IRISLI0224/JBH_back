// @ts-ignore
const express = require("express");

// @ts-ignore
const { addBooking } = require("../controllers/booking");

// @ts-ignore
const router = express.Router();

router.post("/", addBooking);

module.exports = router;
