// @ts-ignore
const { Schema, model } = require("mongoose");

// @ts-ignore
const schema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: Number,
      required: true,
      default: 0,
    },
    maxNumber: Number,
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  },
  {
    timestamps: true,
  }
);
// @ts-ignore
const model = model("Session", schema);

module.exports = model;
