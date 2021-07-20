const express = require('express');

const userValidator = require('../middleware/userValidator');
const authGuard = require('../middleware/authGuard');
const adminGuard = require('../middleware/adminGuard');
const checkUserOrBookingExist = require('../middleware/checkUserOrBookingExist');

const router = express.Router();

const {
  addUser,
  getAllUsers,
  getUserByPhone,
  getUserById,
  updateUserById,
  updateUserByPhone,
  deleteUserById,
  addBookingFromUser,
  removeBookingFromUser,
} = require('../controllers/user');

router.post('', userValidator, addUser);
// 查询全部users用/all路径，跟普通查询区分开；下面/id路径是为了跟使用phone查询区分开
router.get('/all', authGuard, adminGuard, getAllUsers);
router.get('/:phone', authGuard, getUserByPhone);
router.get('/id/:id', authGuard, getUserById);
router.put('/id/:id', userValidator, authGuard, updateUserById);
router.put('/:phone', userValidator, authGuard, updateUserByPhone);
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
