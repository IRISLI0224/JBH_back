/* eslint-disable no-underscore-dangle */
export {};

const bcrypt = require('bcrypt');

const User = require('../models/user');
const Booking = require('../models/booking');
const { generateToken } = require('../utils/jwt');

// 添加user
const addUser = async (req:any, res:any) => {
  // 添加的是admin user
  if (req.admin) {
    const { firstName, userType } = req.admin;
    const existingAdmin = await User.findOne({ firstName }).exec();
    if (existingAdmin) { return res.status(400).send('admin existing'); }
    const password = await bcrypt.hash('123456', 10);
    const user = new User({
      userType,
      firstName,
      password,
    });
    await user.save();
    const token = generateToken(user._id, userType);
    return res.status(201).json({ firstName, token });
  }
  // 添加的是client user
  const {
    firstName, lastName, gender, email, birthYear, phone, userType,
  } = req.validatedBody;
  const existingUser = await User.findOne({ phone }).exec();
  if (existingUser) { return res.status(400).send('client existing'); }
  const user = new User({
    firstName,
    lastName,
    gender,
    email,
    birthYear,
    phone,
    userType,
  });
  await user.hashPassword();
  await user.save();
  const token = generateToken(user._id, user.userType);
  return res.status(201).json({ email, token });
};

// 提供接口：从query中根据唯一电话号码查询client user，如果没有query，表示查询所有users
const getAllUsersOrByPhone = async (req:any, res:any) => {
  const { phone } = req.query;
  if (phone) {
    const user = await User.findOne({ phone }).exec();
    if (!user) {
      return res.status(404).send('No such a phone number.');
    }
    return res.json(user);
  }
  const users = await User.find().exec();
  return res.json(users);
};

// 根据id查询user
const getUserById = async (req:any, res:any) => {
  const { id } = req.params;
  const user = await User.findById(id).populate('bookings').exec();
  // _id位数固定，如果位数确定但数字不对是走下面错误返回，否则直接500
  if (!user) {
    return res.status(404).send('No such an id.');
  }
  return res.status(200).send(user);
};

// 更新client user（admin user无需更新）
const updateUserById = async (req:any, res:any) => {
  const { id } = req.params;
  const newUserInfo = req.validatedBody;
  await User.findOneAndUpdate(
    { _id: id },
    { ...newUserInfo },
    { useFindAndModify: false },
  ).exec();
  return res.send('update success');
};

// 删除user
const deleteUserById = async (req:any, res:any) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id).exec();
  if (!user) {
    return res.status(404).json('user not found in this id');
  }
  // 删除后更新booking表的user关联
  await Booking.updateMany(
    { users: user._id },
    { $pull: { users: user._id } },
  ).exec();
  return res.status(200).send('delete successful');
};

// 给user关联booking信息
const addBookingFromUser = async (req:any, res:any) => {
  const { user, booking } = req;
  user.bookings.addToSet(booking._id);
  booking.users.addToSet(user._id);
  await user.save();
  await booking.save();
  return res.json(user);
};

// 从user删除关联的booking信息
const removeBookingFromUser = async (req:any, res:any) => {
  const { user, booking } = req;
  user.bookings.pull(booking._id);
  booking.users.pull(user._id);
  await user.save();
  await booking.save();
  return res.json(user);
};

module.exports = {
  addUser,
  getAllUsersOrByPhone,
  getUserById,
  updateUserById,
  deleteUserById,
  addBookingFromUser,
  removeBookingFromUser,
};
