const { Favorite, Station } = require('../models');

// @desc    Get user's favorite stations
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: 'station',
        select: 'name slug description headerImage thumbnailImage genre listenerCount isActive',
        match: { isActive: true }
      })
      .sort({ createdAt: -1 });

    // Filter out favorites where station is null (inactive or deleted)
    const validFavorites = favorites.filter(fav => fav.station !== null);

    res.json({
      success: true,
      count: validFavorites.length,
      data: validFavorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add station to favorites
// @route   POST /api/favorites/:stationId
// @access  Private
exports.addFavorite = async (req, res) => {
  try {
    const { stationId } = req.params;

    // Check if station exists and is active
    const station = await Station.findOne({ _id: stationId, isActive: true });
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found or inactive'
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      station: stationId
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Station already in favorites'
      });
    }

    // Create favorite
    const favorite = await Favorite.create({
      user: req.user.id,
      station: stationId
    });

    // Update station favorite count
    station.favoriteCount += 1;
    await station.save();

    await favorite.populate({
      path: 'station',
      select: 'name slug description headerImage thumbnailImage genre listenerCount'
    });

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove station from favorites
// @route   DELETE /api/favorites/:stationId
// @access  Private
exports.removeFavorite = async (req, res) => {
  try {
    const { stationId } = req.params;

    const favorite = await Favorite.findOne({
      user: req.user.id,
      station: stationId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    await Favorite.findByIdAndDelete(favorite._id);

    // Update station favorite count
    const station = await Station.findById(stationId);
    if (station) {
      station.favoriteCount = Math.max(0, station.favoriteCount - 1);
      await station.save();
    }

    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Check if station is favorited
// @route   GET /api/favorites/check/:stationId
// @access  Private
exports.checkFavorite = async (req, res) => {
  try {
    const { stationId } = req.params;

    const favorite = await Favorite.findOne({
      user: req.user.id,
      station: stationId
    });

    res.json({
      success: true,
      data: {
        isFavorited: !!favorite
      }
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
