const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  source: {
    type: String,
    required: true,
    enum: ['Website', 'Social Media', 'Referral', 'Email Campaign', 'Cold Call', 'Other']
  },
  status: {
    type: String,
    required: true,
    enum: ['New', 'Contacted', 'Converted'],
    default: 'New'
  },
  notes: {
    type: String,
    default: ''
  },
  followUpDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
