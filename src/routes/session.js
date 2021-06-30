const express = require('express');

const {
  addSession,
  getSession,
  updateSession,
  deleteSession,
} = require('../controllers/session');

const router = express.Router();

router.post('/', addSession);
router.get('/:date/:time', getSession);
router.put('/:date/:time', updateSession);
router.delete('/:date/:time', deleteSession);

module.exports = router;
