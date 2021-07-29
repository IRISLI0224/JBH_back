const express = require('express');
const { AdminLogin } = require('../controllers/auth');
const { addAdmin } = require('../controllers/admin');

const router = express.Router();

router.post('/', addAdmin);
router.post('/login', AdminLogin);

module.exports = router;
