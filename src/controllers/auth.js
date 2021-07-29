const Admin = require('../models/admin');
const { generateToken } = require('../utils/jwt');
const { INVALID_EMAIL, INVALID_PASSWORD } = require('../constants/errorMessage');

const AdminLogin = async (req, res) => {
  const { email, password } = req.body;

  const existingAdmin = await Admin.findOne({ email }).exec();
  if (!existingAdmin) {
    return res.status(400).send(INVALID_EMAIL);
  }

  if (!(await existingAdmin.validatePassword(password.toString()))) {
    return res.status(400).send(INVALID_PASSWORD);
  }

  const token = generateToken(existingAdmin._id, existingAdmin.email);
  return res.json({ email, token });
};

module.exports = { AdminLogin };
