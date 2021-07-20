const { Schema, model } = require('mongoose');

const schema = new Schema({
  bookingDate: { type: Date, require: true },
  numOfGuests: { type: Number, require: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  emailAddress: { type: String, trim: true },
  phoneNumber: { type: String, trim: true },
  dateOfBirth: { type: Date, require: true },
  paidAmount: { type: Number, require: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = model('Booking', schema);
