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
      default: 0,
    },
    maxNumber: Number,
    // 需要存的不是booking数据的id，而是其中的参与人数
    bookings: [{ type: Number, ref: 'Booking' }],
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
    versionKey: false,
  },
);

schema.virtual('state').get(function getStateType() {
  const stateTypeTable = [
    { threshold: 100, type: 'fullyBooked' },
    { threshold: 80, type: 'limited' },
    { threshold: 0, type: 'available' },
  ];
  // 用关联bookings表中参与人数的总和来当分子，而不是bookings数组的个数
  const attendance = this.bookings.length !== 0
    ? this.bookings.reduce((pre, cur) => pre + cur)
    : 0;
  const percentage = (attendance / this.maxNumber) * 100;
  for (let i = 0; i < stateTypeTable.length; i += 1) {
    if (percentage >= stateTypeTable[i].threshold) {
      return stateTypeTable[i].type;
    }
  }
  return false;
});

module.exports = model('Session', schema);
