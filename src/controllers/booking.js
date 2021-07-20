const Booking = require('../models/booking');
const { createPayment } = require('./payment');

const addBooking = async (req, res) => {
  const {
    bookingDate,
    numOfGuests,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    dateOfBirth,
    paidAmount,
  } = req.body;
  // validation and put in to booking
  const booking = new Booking({
    bookingDate,
    numOfGuests,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    dateOfBirth,
    paidAmount,
  });
  // save to DB 并将返回值存储，如果 MongoDB 不返回ID等信息则需要从DB取ID, bookingDate, numOfGuests, firstName, lastName
  const savedRecord = await booking.save();
  // 提取出 savedRecord中 ID, bookingDate, numOfGuests, firstName, lastName 然后返回. TBA
  return res.status(201).json(savedRecord);
};

const checkBooking = async (req, res) => {
  const {
    bookingDate,
    numOfGuests,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    dateOfBirth,
    paidAmount,
  } = req.body;
  // validation and put in to booking
  const checking = new Booking({
    bookingDate,
    numOfGuests,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    dateOfBirth,
    paidAmount,
  });

  // check bookingDate, return invalid if before the current time
  const todayDate = new Date().toISOString().slice(0, 10);
  if (todayDate > bookingDate) {
    return res.status(406).json('Booking date have to at least from tomorrow');
  }
  // check date of birth
  // if ((parseInt(todayDate) - parseInt(dateOfBirth)) < 18) {
  //   return res.status(406).json('You need to be over 18 years');
  // }
  // if ((parseInt(todayDate) - parseInt(dateOfBirth)) > 100) {
  //   return res.status(406).json('Please contact us through email');
  // }
  // check email address, return invalid email if failed， TBA
  // const emailValidator = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))
  // @((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // if (!emailValidator.test(emailAddress)) {
  //   return res.status(406).json('Email address invalid');
  // }
  // check phone number, return invalid phone number if failed， TBA
  const phoneValidator = /^0[0-8]\d{8}$/g;
  if (!phoneValidator.test(phoneNumber)) {
    return res.status(406).json('Phone number invalid');
  }

  return res.status(201).json(checking);
};

const getAllBookingsOrByProduct = async (req, res) => {
  const bookings = await Booking.find().exec();
  return res.json(bookings);
};

const getBookingsByEnteringTime = (req, res) => {
  res.send('This is getBookingsByEnteringTime Api.');
};

const getBookingsByStatusConfirm = (req, res) => {
  res.send('This is getBookingsByStatusConfirm Api.');
};

module.exports = {
  addBooking,
  checkBooking,
  getAllBookingsOrByProduct,
  getBookingsByEnteringTime,
  getBookingsByStatusConfirm,
};
