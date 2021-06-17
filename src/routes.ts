// @ts-ignore
const express = require('express');

const userRouter = require('./routes/user');

// @ts-ignore
const router = express.Router();

router.use('/users', userRouter);

module.exports = router;
