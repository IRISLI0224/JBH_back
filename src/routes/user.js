const express = require('express');

const userValidator = require('../middleware/userValidator');
const authGuard = require('../middleware/authGuard');
const adminGuard = require('../middleware/adminGuard');
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

router.post('', userValidator, addUser);
router.get('', authGuard, adminGuard, getAllUsersOrByPhone);
router.get('/:id', authGuard, adminGuard, getUserById);
router.put('/:id', userValidator, updateUserById);
router.delete('/:id', authGuard, adminGuard, deleteUserById);
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
