const User = require('../models/user');
const Booking = require('../models/booking');

module.exports = async (req, res, next) => {
  const { userId, bookingId } = req.params;
  req.user = await User.findById(userId).exec();
  req.booking = await Booking.findById(bookingId).exec();
  if (!req.user || !req.booking) {
    return res.status(404).send('No such an user or booking id.');
  }
  return next();
};
