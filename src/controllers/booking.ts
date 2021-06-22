const Booking = require("../models/booking");

// @ts-ignore
async function addBooking(req: any, res: any) {
  const { bookingDate, bookingTime } = req.body;

  const booking = new Booking({ bookingDate, bookingTime });
  await booking.save();
  return res.status(201).json(booking);
}

module.exports = { addBooking };
