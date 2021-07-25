const Booking = require('../models/booking');
const { generateToken } = require('../utils/jwt');
const { INVALID_EMAIL, INVALID_PASSWORD } = require('../constants/errorMessage');

const login = async (req, res) => {
  const { email, password } = req.body;

  const existingBooking = await Booking.findOne({ email }).exec();
  if (!existingBooking) {
    return res.status(400).send(INVALID_EMAIL);
  }

  if (!(await existingBooking.validatePassword(password.toString()))) {
    return res.status(400).send(INVALID_PASSWORD);
  }

  const token = generateToken(existingBooking._id, existingBooking.bookingNum);
  return res.json({ token });
};

module.exports = { login };
