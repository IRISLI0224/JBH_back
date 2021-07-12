const express = require('express');

const {
  addSession,
  getSession,
  getSessionByMonth,
  updateSession,
  deleteSession,
} = require('../controllers/session');

const router = express.Router();

router.post('/', addSession);
router.get('/single/:date/:time', getSession);
router.get('/group/:year/:month', getSessionByMonth);
router.put('/:date/:time', updateSession);
router.delete('/:date/:time', deleteSession);

module.exports = router;
