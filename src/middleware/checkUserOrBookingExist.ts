const User = require('../models/user');
const Booking = require('../models/booking');

// eslint-disable-next-line consistent-return
module.exports = async (req:any, res:any, next:any) => {
  const { userId, bookingId } = req.params;
  req.user = await User.findById(userId).exec();
  req.booking = await Booking.findById(bookingId).exec();
  if (!req.user || !req.booking) {
    return res.status(404).send('No such an user or booking id.');
  }
  next();
};
