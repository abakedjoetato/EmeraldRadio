const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['hero', 'featured', 'about', 'news', 'charts', 'submissions', 'announcements', 'events', 'custom'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: String,
  content: String,
  imageUrl: String,
  buttonText: String,
  buttonLink: String,
  isEnabled: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: false });

const landingPageSchema = new mongoose.Schema({
  headerImage: {
    type: String,
    default: ''
  },
  headerTitle: {
    type: String,
    default: 'Emerald Radio'
  },
  headerSubtitle: {
    type: String,
    default: '24/7 Synchronized Radio Experience'
  },
  sections: [sectionSchema],
  metaTitle: {
    type: String,
    default: 'Emerald Radio - 24/7 Multi-Station Web Radio'
  },
  metaDescription: {
    type: String,
    default: 'Tune in to Emerald Radio - a multi-station platform where everyone hears the same moment, synchronized across all listeners.'
  },
  socialLinks: {
    twitter: String,
    facebook: String,
    instagram: String,
    discord: String,
    youtube: String
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure only one landing page document exists
landingPageSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    if (count > 0) {
      const existing = await this.constructor.findOne();
      existing.overwrite(this);
      await existing.save();
      return next(new Error('Landing page updated instead of created'));
    }
  }
  this.updatedAt = Date.now();
  next();
});

// Static method to get or create landing page
landingPageSchema.statics.getLandingPage = async function() {
  let landing = await this.findOne();
  if (!landing) {
    landing = await this.create({
      sections: [
        {
          id: 'hero',
          type: 'hero',
          title: 'Tune In. Stay Synced.',
          subtitle: 'Emerald is a multi-station platform where everyone hears the same moment—live.',
          isEnabled: true,
          order: 0
        },
        {
          id: 'featured',
          type: 'featured',
          title: 'Featured Stations',
          isEnabled: true,
          order: 1
        },
        {
          id: 'about',
          type: 'about',
          title: 'Why Synced Radio?',
          content: 'Experience music together. Our synchronized playback means every listener hears the same beat at the same moment.',
          isEnabled: true,
          order: 2
        }
      ]
    });
  }
  return landing;
};

module.exports = mongoose.model('LandingPage', landingPageSchema);
