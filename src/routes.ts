export {};

const express = require('express');

const userRouter = require('./routes/user');
const bookingRouter = require('./routes/booking');

const router = express.Router();

router.use('/user', userRouter);
router.use('/booking', bookingRouter);

module.exports = router;
