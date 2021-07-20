/* eslint-disable func-names */
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  gender: {
    type: Boolean,
  },
  email: {
    type: String,
  },
  birthYear: {
    type: Number,
  },
  phone: {
    type: String,
  },
  userType: {
    type: Number,
    default: 2,
  },
  password: {
    type: String,
  },
  __v: {
    type: Number,
    select: false,
  },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
});

schema.methods.hashPassword = async function () {
  // 自动生成密码只给client user用，admin user使用123456
  const genPassword = this.firstName + this.phone;
  this.password = await bcrypt.hash(genPassword, 10);
};

schema.methods.validatePassword = async function (password) {
  // 如果admin使用默认密码123456，解密时加toString()
  const validPassword = await bcrypt.compare(password, this.password);
  return validPassword;
};

module.exports = model('User', schema);
