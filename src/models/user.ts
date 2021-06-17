// @ts-ignore
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// you can rewrite it
const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  DOB: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    default: 'client',
  },
  password: {
    type: String,
  },
});

schema.methods.hashPassword = async function () {
  const genPassword:any = this.firstName + this.lastName + this.DOB;
  this.password = await bcrypt.hash(genPassword, 10);
};

const model = mongoose.model('User', schema);

module.exports = model;
