const Admin = require('../models/admin');

const getAdminByEmail = async (req, res) => {
  const { email } = req.params;
  const admin = await Admin.findOne({ email }).exec();
  if (!admin) { return ('no such an admin email'); }
  return admin;
};

module.exports = { getAdminByEmail };
