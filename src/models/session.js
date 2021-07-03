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
  },
  {
    timestamps: true,
  },
);

module.exports = model('Session', schema);
