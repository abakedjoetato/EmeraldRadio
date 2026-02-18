const { LandingPage, Station } = require('../models');

// @desc    Get landing page data
// @route   GET /api/landing
// @access  Public
exports.getLandingPage = async (req, res) => {
  try {
    const landing = await LandingPage.getLandingPage();

    // Get featured stations if featured section exists
    const featuredSection = landing.sections.find(s => s.type === 'featured');
    let featuredStations = [];

    if (featuredSection && featuredSection.isEnabled) {
      featuredStations = await Station.find({
        isActive: true,
        isFeatured: true
      })
        .select('name slug description headerImage thumbnailImage genre listenerCount')
        .limit(6);
    }

    res.json({
      success: true,
      data: {
        ...landing.toObject(),
        featuredStations
      }
    });
  } catch (error) {
    console.error('Get landing page error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get landing page sections only
// @route   GET /api/landing/sections
// @access  Public
exports.getSections = async (req, res) => {
  try {
    const landing = await LandingPage.getLandingPage();

    const enabledSections = landing.sections
      .filter(s => s.isEnabled)
      .sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: enabledSections
    });
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
