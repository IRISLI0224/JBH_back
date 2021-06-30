const { Schema, model } = require('mongoose');

const schema = new Schema({
  statusConfirm: { type: Boolean, require: true },
  enteringTime: { type: Date, require: true },
  numOfParticipants: { type: Number, require: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = model('Booking', schema);
