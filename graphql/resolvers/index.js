const authResolvers = require('./auth');
const eventsResolvers = require('./events');
const bookingResolvers = require('./booking');

const rootResolver = {
  ...authResolvers,
  ...eventsResolvers,
  ...bookingResolvers
}

module.exports = rootResolver;
