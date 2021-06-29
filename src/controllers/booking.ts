export {};

const Booking = require('../models/booking');

const addBooking = async (req:any, res:any) => {
  const { statusConfirm, enteringTime, numOfParticipants } = req.body;
  const booking = new Booking({
    statusConfirm,
    enteringTime,
    numOfParticipants,
  });
  await booking.save();
  return res.status(201).json(booking);
};

const getAllBookingsOrByProduct = async (req:any, res:any) => {
  const bookings = await Booking.find().exec();
  return res.json(bookings);
};

const getBookingByID = (req:any, res:any) => {
  res.send('This is getBookingByID Api.');
};

const getBookingsByEnteringTime = (req:any, res:any) => {
  res.send('This is getBookingsByEnteringTime Api.');
};

const getBookingsByStatusConfirm = (req:any, res:any) => {
  res.send('This is getBookingsByStatusConfirm Api.');
};

module.exports = {
  addBooking,
  getAllBookingsOrByProduct,
  getBookingByID,
  getBookingsByEnteringTime,
  getBookingsByStatusConfirm,
};
