const { Schema, model } = require('mongoose');

const schema = new Schema({
  bookingDate: { type: Date, require: true },
  numOfGuests: { type: Number, require: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  emailAddress: { type: String, trim: true },
  phoneNumber: { type: String, trim: true },
  dateOfBirth: { type: Date, require: true },
  paymentAmount: { type: Number, require: true },
  id: { type: String, require: true },
});

module.exports = model('Booking', schema);
