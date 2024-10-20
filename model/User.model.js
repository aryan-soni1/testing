const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
      type: Boolean,
      default: false
  },
  phoneNumber: {
    type: String
  },
  address: {
    type: String
  },
  role: {
    type: String,
    enum: ['Student', 'Instructor', 'Admin'],
    default: 'Student'
  }
},{timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;