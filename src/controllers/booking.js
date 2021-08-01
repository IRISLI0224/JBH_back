const Booking = require('../models/booking');
const Session = require('../models/session');
const { genBookingNum } = require('../utils/gen');

// 添加booking并生成用户密码
const addBooking = async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    email,
    phone,
    bookingDate,
    numOfGuests,
    dateOfBirth,
    paidAmount,
  } = req.validatedBooking;
  const bookingNum = genBookingNum();
  const booking = new Booking({
    firstName,
    lastName,
    gender,
    email,
    phone,
    bookingDate,
    numOfGuests,
    dateOfBirth,
    paidAmount,
    bookingNum,
  });
  await booking.hashPassword();
  const session = await Session.findOne({ date: bookingDate }).exec();
  if (session) {
    booking.sessions.addToSet(session.date);
    session.bookings.addToSet(booking.numOfGuests);
    await session.save();
  }
  await booking.save();
  return res.status(201).json(booking);
};

// 查询全部bookings（仅admin登录后有权限）
const getAllBookings = async (req, res) => {
  const bookings = await Booking.find().exec();
  return res.json(bookings);
};

const getBookingsByMonth = async (req, res) => {
  const { year, month } = req.params;
  const reg = new RegExp(`^${year}-${month}`);
  const requestingSessions = await Session.find({
    date: { $regex: reg },
  }).exec();

  const daysInMonth = new Date(year, month, 0).getDate();
  const bookingsExistenceArr = [];
  for (let i = 0; i < daysInMonth; i += 1) {
    bookingsExistenceArr.push(false);
    for (let j = 0; j < requestingSessions.length; j += 1) {
      const requestingDay = parseInt(
        requestingSessions[j].date.split('-')[2],
        10,
      );
      if (requestingDay === i + 1 && requestingSessions[j].bookings.length > 0) {
        bookingsExistenceArr[i] = true;
        break;
      }
    }
  }
  return res.json({ date: `${year}-${month}`, bookingsExistenceArr });
};

// 根据phone、email、bookingNum、bookingDate、_id查询bookings数组，
// 电话、邮箱、bookingDate查询的数组可多个元素值（client和admin登录后均有权限）
const getBookingsByArgs = (args) => async (req, res) => {
  const bookings = await Booking.find({ [args]: req.params[args] }).exec();
  if (bookings.length === 0) {
    return res.status(404).send(`No such a ${args}.`);
  }
  return res.json(bookings);
};
const getBookingsByPhone = getBookingsByArgs('phone');
const getBookingsByEmail = getBookingsByArgs('email');
const getBookingByBookingNum = getBookingsByArgs('bookingNum');
const getBookingsByBookingDate = getBookingsByArgs('bookingDate');
const getBookingById = getBookingsByArgs('_id');

// 根据bookingNum或者_id更新booking（client和admin登录后均有权限）
// 改参加人数后session人数变动的逻辑还没写
const updateBookingByArgs = (args) => async (req, res) => {
  const newBookingInfo = req.validatedBooking;
  const newBooking = await Booking.findOneAndUpdate(
    { [args]: req.params[args] },
    { ...newBookingInfo },
    { new: true },
  ).exec();
  if (!newBooking) return res.send(`找不到这个${args}的booking信息`);
  await newBooking.hashPassword();
  await newBooking.save();
  return res.status(201).json(newBooking);
};
const updateBookingByBookingNum = updateBookingByArgs('bookingNum');
const updateBookingById = updateBookingByArgs('_id');

// 根据_id删除booking（仅admin登录后有权限）
const deleteBookingById = async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params._id).exec();
  if (!booking) {
    return res.status(404).json('booking not found in this id');
  }
  // 删除booking时删除关联到session的booking人数
  const date = booking.bookingDate.toISOString().split('T')[0];
  const session = await Session.findOne({ date }).exec();
  session.bookings.pull(booking.numOfGuests);
  await session.save();

  return res.status(200).send('delete successful');
};

module.exports = {
  addBooking,
  getAllBookings,
  getBookingsByMonth,
  getBookingsByPhone,
  getBookingsByEmail,
  getBookingByBookingNum,
  getBookingsByBookingDate,
  getBookingById,
  updateBookingByBookingNum,
  updateBookingById,
  deleteBookingById,
};
