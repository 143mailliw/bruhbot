const config = require('./config.json');

// get the server invite from the config file
// and return it
exports.getInvite = function() {
  return config.invite;
}