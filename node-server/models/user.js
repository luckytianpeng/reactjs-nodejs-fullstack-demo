const config = require('config');
const mongoose = require('mongoose');

const uri = config.get('db.uri');
const connnection = mongoose.createConnection(uri);

const User = connnection.model('User', {
  uuid: String,
  email: String,
  password: String,
  fullName: String,
  locked: Boolean,
  confirmed: Boolean
});

module.exports = User;
