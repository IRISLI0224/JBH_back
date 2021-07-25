const express = require('express');

const bookingRouter = require('./routes/booking');
const sessionRouter = require('./routes/session');
const loginRoute = require('./routes/login');

const router = express.Router();

router.use('/login', loginRoute);
router.use('/bookings', bookingRouter);
router.use('/sessions', sessionRouter);

module.exports = router;
