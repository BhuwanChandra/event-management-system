const { dateToString } = require("../../helpers/date");
const Event = require("../../models/event");
const User = require("../../models/user");

const Dataloader = require('dataloader');

const eventLoader = new Dataloader((eventIds) => {
  return events(eventIds);
});

const userLoader = new Dataloader((userIds) => {
  return User.find({_id: { $in: userIds}});
})

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator)
  };
};


const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};


const events = async eventIds => {
  try {
    const res = await Event.find({ _id: { $in: eventIds } });
    res.sort((a, b) => {
      return eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString());
    })
    return res.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const res = await eventLoader.load(eventId.toString());
    return res;
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const res = await userLoader.load(userId.toString());
    return {
      ...res._doc,
      _id: res.id,
      createdEvents: () => eventLoader.loadMany(res._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;
