const express = require('express');

const userRouter = require('./routes/user');
const bookingRouter = require('./routes/booking');
const sessionRouter = require('./routes/session');
const authRoute = require('./routes/auth');
const paymentRouter = require('./routes/payment');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRouter);
router.use('/bookings', bookingRouter);
router.use('/sessions', sessionRouter);
router.use('/stripe/charge', paymentRouter);

module.exports = router;
