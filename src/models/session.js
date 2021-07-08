const { Schema, model } = require('mongoose');
const Joi = require('joi');

const schema = new Schema(
  {
    date: {
      type: String,
      required: true,
      validate: {
        validator: (date) => !Joi.date().iso().raw().validate(date).error,
        msg: 'Invalid date format',
      },
    },
    time: {
      type: Number,
      required: true,
      default: 0,
    },
    maxNumber: Number,
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    id: false,
  },
);

schema.virtual('state').get(function getStateType() {
  const stateTypeTable = [
    { threshold: 100, type: 'fullyBooked' },
    { threshold: 80, type: 'limited' },
    { threshold: 0, type: 'available' },
  ];
  const percentage = (this.bookings.length / this.maxNumber) * 100;
  for (let i = 0; i < stateTypeTable.length; i += 1) {
    if (percentage >= stateTypeTable[i].threshold) {
      return stateTypeTable[i].type;
    }
  }
  return false;
});

module.exports = model('Session', schema);
