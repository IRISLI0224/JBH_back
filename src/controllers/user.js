const bcrypt = require('bcrypt');

const User = require('../models/user');
const Booking = require('../models/booking');

// 添加user
const addUser = async (req, res) => {
  // 添加的是admin user
  if (req.validatedAdmin) {
    const { firstName, email, userType } = req.validatedAdmin;
    const existingAdmin = await User.findOne({ firstName }).exec();
    if (existingAdmin) {
      return res.status(400).send('admin existing');
    }
    const password = await bcrypt.hash('123456', 10);
    const user = new User({
      userType,
      firstName,
      email,
      password,
    });
    await user.save();
    // 这里不需要生成和返回token，只需要返回登录名+密码告知前端即可(并且不需要返回这个hash后的password，只需要告知密码是123456)
    return res.status(201).send(`请记住您的登录名是${email}，登录密码是123456`);
  }
  // 添加的是client user
  const {
    firstName, lastName, gender, email, birthYear, phone,
  } = req.validatedClient;
  const existingUser = await User.findOne({ phone }).exec();
  if (existingUser) {
    return res.status(400).send('client existing');
  }
  const user = new User({
    firstName,
    lastName,
    gender,
    email,
    birthYear,
    phone,
  });
  await user.hashPassword();
  await user.save();
  // 这里不需要生成和返回token，只需要返回登录名+密码告知前端即可(并且不需要返回这个hash后的password，只需要告知密码是名字+电话)
  // const token = generateToken(user._id, user.userType);
  return res
    .status(201)
    .send('您可通过email登录查看和修改订单，登录密码是firstName+phone');
};

// 查询全部users（仅admin登录后有权限）
const getAllUsers = async (req, res) => {
  const users = await User.find().exec();
  return res.json(users);
};

// 根据唯一电话号码查询client user（client和admin登录后均有权限）
const getUserByPhone = async (req, res) => {
  const { phone } = req.params;
  // 查到用户后把关联的booking数组展开
  const user = await User.findOne({ phone }).populate('bookings').exec();
  if (!user) {
    return res.status(404).send('No such a phone number.');
  }
  return res.json(user);
};

// 根据id查询user（client和admin登录后均有权限）
const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate('bookings').exec();
  // _id位数固定，如果位数确定但数字不对是走下面错误返回，否则直接500
  if (!user) {
    return res.status(404).send('No such an id.');
  }
  return res.status(200).send(user);
};

// 根据id更新client user（client和admin登录后均有权限）
const updateUserById = async (req, res) => {
  const { id } = req.params;
  const newUserInfo = req.validatedClient;
  const newUser = await User.findOneAndUpdate(
    { _id: id },
    { ...newUserInfo },
    { new: true },
  );
  await newUser.hashPassword();
  await newUser.save();
  return res.send('update success，仍然通过email和firstName+phone密码登录查看');
};

// 根据phone更新client user（client和admin登录后均有权限）
const updateUserByPhone = async (req, res) => {
  const { phone } = req.params;
  const newUserInfo = req.validatedClient;
  const newUser = await User.findOneAndUpdate(
    { phone },
    { ...newUserInfo },
    { new: true },
  );
  await newUser.hashPassword();
  await newUser.save();
  return res.send('update success，仍然通过email和firstName+phone密码登录查看');
};

// 根据id删除user（仅admin登录后有权限）
const deleteUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id).exec();
  if (!user) {
    return res.status(404).json('user not found in this id');
  }
  // 删除user后更新booking表的user关联
  await Booking.updateMany(
    { users: user._id },
    { $pull: { users: user._id } },
  ).exec();
  return res.status(200).send('delete successful');
};

// 给user关联booking信息（无需登录，前端booking后或editBooking后关联）
const addBookingFromUser = async (req, res) => {
  // req上有user和booking值是通过中间件加的
  const { user, booking } = req;
  user.bookings.addToSet(booking._id);
  booking.users.addToSet(user._id);
  await user.save();
  await booking.save();
  return res.json(user);
};

// 从user删除关联的booking信息（无需登录，前端booking或editBooking时可调用）
const removeBookingFromUser = async (req, res) => {
  const { user, booking } = req;
  user.bookings.pull(booking._id);
  booking.users.pull(user._id);
  await user.save();
  await booking.save();
  return res.json(user);
};

module.exports = {
  addUser,
  getAllUsers,
  getUserByPhone,
  getUserById,
  updateUserById,
  updateUserByPhone,
  deleteUserById,
  addBookingFromUser,
  removeBookingFromUser,
};
