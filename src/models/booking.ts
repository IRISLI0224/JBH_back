// @ts-ignore
const { Schema, model } = require("mongoose");

// you can rewrite it
// @ts-ignore
const schema = new Schema({
  bookingDate: {
    type: String,
    required: true,
  },
  bookingTime: {
    type: Number,
    required: true,
  },
});

// @ts-ignore
const model = model("Booking", schema);

module.exports = model;
