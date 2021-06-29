const Booking = require("../models/booking");
// @ts-ignore
const Session = require("../models/session");

// @ts-ignore
async function addBooking(req: any, res: any) {
  const { bookingDate, bookingTime } = req.body;

  const booking = new Booking({ bookingDate, bookingTime });
  await booking.save();

  await Session.updateMany(
    {
      date: bookingDate,
      time: bookingTime,
    },
    {
      $addToSet: { bookings: booking.id },
    }
  );
  return res.status(201).json(booking);
}

// @ts-ignore
async function deleteBooking(req, res) {
  const { bookingDate, bookingTime } = req.params;
  const booking = await Booking.findOne({ bookingDate, bookingTime });
  if (!booking) {
    return res.status(404).send("booking is not found");
  }

  await Session.updateMany(
    {
      bookings: booking.id,
    },
    {
      $pull: {
        bookings: booking.id,
      },
    }
  );

  await Booking.findByIdAndDelete(booking.id).exec();
  return res.status(200).send("booking has been deleted");
}

module.exports = { addBooking, deleteBooking };
