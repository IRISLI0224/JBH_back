const Admin = require('../models/admin');
const { generateToken } = require('../utils/jwt');

const getAdminByEmail = async (req, res) => {
  const { email } = req.params;
  const admin = await Admin.findOne({ email }).exec();
  if (!admin) { return ('no such an admin email'); }
  return admin;
};

// 添加admin
const addAdmin = async (req, res) => {
  const {
    email,
    userType,
    password,
} = req.body;

const existingAdmin = await Admin.findOne({ email });
if (existingAdmin) {
    return res.status(400).json('Admin already exist');
}

const admin = new Admin({
  email,
  userType,
  password,
});
await admin.hashPassword();
await admin.save();
const token = generateToken(admin._id, admin.userType);
return res.json({ email, token });
};

module.exports = { getAdminByEmail,addAdmin };
