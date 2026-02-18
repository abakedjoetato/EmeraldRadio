const mongoose = require('mongoose');

const scheduleItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  startTime: String, // HH:MM format
  duration: Number, // in minutes
  dayOfWeek: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }]
});

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Station name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  youtubePlaylistId: {
    type: String,
    required: [true, 'YouTube Playlist ID is required'],
    trim: true
  },
  playlistDuration: {
    type: Number,
    default: 3600000 // 1 hour in milliseconds (default)
  },
  playlistStartTime: {
    type: Date,
    default: () => new Date('2024-01-01T00:00:00Z') // Fixed start time for sync
  },
  headerImage: {
    type: String,
    default: ''
  },
  thumbnailImage: {
    type: String,
    default: ''
  },
  genre: [{
    type: String,
    trim: true
  }],
  themeSettings: {
    backgroundColor: {
      type: String,
      default: '#070B14'
    },
    textColor: {
      type: String,
      default: '#F2F5FA'
    },
    accentColor: {
      type: String,
      default: '#00D084'
    }
  },
  schedule: [scheduleItemSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  listenerCount: {
    type: Number,
    default: 0
  },
  totalPlays: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
stationSchema.index({ name: 'text', description: 'text', genre: 'text' });

// Update timestamp
stationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

stationSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Method to get current sync position
stationSchema.methods.getCurrentPosition = function() {
  const now = Date.now();
  const startTime = this.playlistStartTime.getTime();
  const elapsed = now - startTime;
  const position = elapsed % this.playlistDuration;
  return {
    position,
    elapsed,
    playlistDuration: this.playlistDuration,
    currentVideoIndex: 0 // Calculated based on video durations if available
  };
};

module.exports = mongoose.model('Station', stationSchema);
