const { Station } = require('../models');

// @desc    Get all active stations
// @route   GET /api/stations
// @access  Public
exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.find({ isActive: true })
      .select('-schedule')
      .populate('createdBy', 'username')
      .sort({ isFeatured: -1, createdAt: -1 });

    res.json({
      success: true,
      count: stations.length,
      data: stations
    });
  } catch (error) {
    console.error('Get stations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get featured stations
// @route   GET /api/stations/featured
// @access  Public
exports.getFeaturedStations = async (req, res) => {
  try {
    const stations = await Station.find({ isActive: true, isFeatured: true })
      .select('-schedule')
      .populate('createdBy', 'username')
      .limit(6);

    res.json({
      success: true,
      count: stations.length,
      data: stations
    });
  } catch (error) {
    console.error('Get featured stations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single station by slug
// @route   GET /api/stations/:slug
// @access  Public
exports.getStation = async (req, res) => {
  try {
    const station = await Station.findOne({
      slug: req.params.slug,
      isActive: true
    }).populate('createdBy', 'username');

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    // Get sync position
    const syncData = station.getCurrentPosition();

    res.json({
      success: true,
      data: {
        ...station.toObject(),
        sync: syncData
      }
    });
  } catch (error) {
    console.error('Get station error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get station sync data (for live playback)
// @route   GET /api/stations/:slug/sync
// @access  Public
exports.getStationSync = async (req, res) => {
  try {
    const station = await Station.findOne({
      slug: req.params.slug,
      isActive: true
    });

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    const syncData = station.getCurrentPosition();

    res.json({
      success: true,
      data: {
        playlistId: station.youtubePlaylistId,
        ...syncData,
        serverTime: Date.now()
      }
    });
  } catch (error) {
    console.error('Get sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Search stations
// @route   GET /api/stations/search?q=query
// @access  Public
exports.searchStations = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const stations = await Station.find({
      $text: { $search: q },
      isActive: true
    }).select('-schedule').limit(10);

    res.json({
      success: true,
      count: stations.length,
      data: stations
    });
  } catch (error) {
    console.error('Search stations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update listener count
// @route   POST /api/stations/:slug/listeners
// @access  Public
exports.updateListeners = async (req, res) => {
  try {
    const { action } = req.body; // 'join' or 'leave'

    const station = await Station.findOne({
      slug: req.params.slug,
      isActive: true
    });

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    if (action === 'join') {
      station.listenerCount = Math.max(0, station.listenerCount + 1);
      station.totalPlays += 1;
    } else if (action === 'leave') {
      station.listenerCount = Math.max(0, station.listenerCount - 1);
    }

    await station.save();

    // Emit update via socket.io
    const io = req.app.get('io');
    io.to(`station:${station.slug}`).emit('listenerUpdate', {
      count: station.listenerCount
    });

    res.json({
      success: true,
      data: {
        listenerCount: station.listenerCount
      }
    });
  } catch (error) {
    console.error('Update listeners error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
