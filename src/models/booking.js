/* eslint-disable func-names */
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  gender: { type: Boolean },
  email: { type: String },
  phone: { type: String },
  password: { type: String },
  bookingDate: { type: Date },
  numOfGuests: { type: Number },
  dateOfBirth: { type: Date },
  paidAmount: { type: Number },
  bookingNum: { type: String },
  __v: { type: Number, select: false },
  sessions: [{ type: Date, ref: 'Session' }],
});

schema.methods.hashPassword = async function () {
  const genPassword = this.firstName + this.phone;
  this.password = await bcrypt.hash(genPassword, 10);
};

schema.methods.validatePassword = async function (password) {
  const validPassword = await bcrypt.compare(password, this.password);
  return validPassword;
};

module.exports = model('Booking', schema);
