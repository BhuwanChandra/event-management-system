const Booking = require("../../models/booking");
const { transformEvent, transformBooking } = require('./merge');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async args => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "5ec414c5a96ea38c1c8a75ab",
      event: fetchedEvent
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const canceledEvent = transformEvent(booking.event);

      await Booking.deleteOne({ _id: args.bookingId });
      return canceledEvent;
    } catch (err) {
      throw err;
    }
  }
};
