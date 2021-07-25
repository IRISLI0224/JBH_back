const express = require('express');
const { createPaymentContainer } = require('../controllers/payment');

const router = express.Router();

router.post('', createPaymentContainer);

module.exports = router;
