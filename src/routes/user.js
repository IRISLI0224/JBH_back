const express = require('express');

const validator = require('../middleware/validator');
const checkUserOrBookingExist = require('../middleware/checkUserOrBookingExist');

const router = express.Router();

const {
  addUser,
  getAllUsersOrByPhone,
  getUserById,
  updateUserById,
  deleteUserById,
  addBookingFromUser,
  removeBookingFromUser,
} = require('../controllers/user');

router.post('', validator, addUser);
router.get('', getAllUsersOrByPhone);
router.get('/:id', getUserById);
router.put('/:id', validator, updateUserById);
router.delete('/:id', deleteUserById);
router.post(
  '/:userId/bookings/:bookingId',
  checkUserOrBookingExist,
  addBookingFromUser,
);
router.delete(
  '/:userId/bookings/:bookingId',
  checkUserOrBookingExist,
  removeBookingFromUser,
);

module.exports = router;
