const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous messages
  },
  senderDisplayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Display name too long']
  },
  senderUsername: {
    type: String,
    required: false,
    trim: true,
    maxlength: [30, 'Username too long']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [300, 'Message cannot exceed 300 characters']
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours
  }
});

// Index for recent messages query
chatMessageSchema.index({ station: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
