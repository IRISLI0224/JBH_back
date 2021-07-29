/* eslint-disable func-names */
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new Schema({
  email: { type: String },
  password: { type: String },
  userType: {
    type: String,
    default: 'admin',
},
  __v: { type: Number, select: true },
});

schema.methods.hashPassword = async function() {
  this.password = await bcrypt.hash(this.password, 10);
  console.log(this.password);
};

schema.methods.validatePassword = async function (password) {
  const validPassword = await bcrypt.compare(password, this.password);
  return validPassword;
};

module.exports = model('Admin', schema);
