/* eslint-disable func-names */
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new Schema({
  email: { type: String },
  password: { type: String },
  __v: { type: Number, select: false },
});

schema.methods.hashPassword = async function () {
  this.password = await bcrypt.hash('aaaaaa', 10);
};

schema.methods.validatePassword = async function (password) {
  const validPassword = await bcrypt.compare(password, this.password);
  return validPassword;
};

module.exports = model('Admin', schema);
