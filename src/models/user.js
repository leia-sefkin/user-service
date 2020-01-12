const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { 
    type: Number,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  zip_code: {
    type: Number,
    required: true
  },
  email_address: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;