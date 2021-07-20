const express = require('express');

const userRouter = require('./routes/user');
const bookingRouter = require('./routes/booking');
const sessionRouter = require('./routes/session');
const loginRoute = require('./routes/login');

const router = express.Router();

router.use('/login', loginRoute);
router.use('/users', userRouter);
router.use('/bookings', bookingRouter);
router.use('/sessions', sessionRouter);

module.exports = router;
