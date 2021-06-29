// @ts-ignore
const { Schema, model } = require("mongoose");
// @ts-ignore
const Joi = require('joi');
// @ts-ignore
const schema = new Schema(
  {
    date: {
      type: String,
      required: true,
      validate:{
        validator:(date:string)=>{
          return !Joi.date().iso().raw().validate(date).error;
        },
        msg:'Invalid date format'
      }
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
