const Event = require("../../models/event");
const { transformEvent} = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5ec414c5a96ea38c1c8a75ab"
    });
    let createdEvent = {};
    try {
      const res = await event.save();
      createdEvent = transformEvent(res);

      const creator = await User.findByIdAndUpdate("5ec414c5a96ea38c1c8a75ab");

      if (!creator) {
        throw new Error("No User Exists!");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      throw err;
    }
  }
};

