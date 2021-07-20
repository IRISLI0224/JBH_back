const User = require('../models/user');
const { generateToken } = require('../utils/jwt');
const { INVALID_USER, INVALID_PASSWORD } = require('../constants/errorMessage');

const login = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email }).exec();
  if (!existingUser) {
    return res.status(400).send(INVALID_USER);
  }

  if (!(await existingUser.validatePassword(password.toString()))) {
    return res.status(400).send(INVALID_PASSWORD);
  }

  const token = generateToken(existingUser._id, existingUser.userType);
  return res.json({ token });
};

module.exports = { login };
