const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  pdfSent: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  unsubscribeToken: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscriber', subscriberSchema);