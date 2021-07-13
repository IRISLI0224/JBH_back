const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

async function loginUser(req, res) {
  const { firstName, phone, email } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(400).json('INVALID_EMAIL');
  }

  if (!(await existingUser.validatePassword(firstName, phone))) {
    return res.status(400).json('INVALID_PASSWORD');
  }

  const token = generateToken(existingUser._id, existingUser.userType);

  return res.json({ email, token });
}

module.exports = {
  loginUser,
};
