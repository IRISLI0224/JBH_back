// @ts-ignore
const express = require('express');

// @ts-ignore
const { addUser } = require('../controllers/user');

// @ts-ignore
const router = express.Router();

router.post('/', addUser);

module.exports = router;
