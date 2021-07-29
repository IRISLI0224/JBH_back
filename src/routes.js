const express = require('express');

const bookingRouter = require('./routes/booking');
const sessionRouter = require('./routes/session');
const loginRoute = require('./routes/login');
const paymentRouter = require('./routes/payment');
const adminRouter = require('./routes/admin');

const router = express.Router();

router.use('/login', loginRoute);
router.use('/bookings', bookingRouter);
router.use('/sessions', sessionRouter);
router.use('/payment', paymentRouter);
router.use('/admin', adminRouter);

module.exports = router;
