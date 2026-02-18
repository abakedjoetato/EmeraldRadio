const { User, Station, LandingPage } = require('../models');

// ==================== USER MANAGEMENT ====================

// @desc    Create new user (admin or manager)
// @route   POST /api/admin/users
// @access  Admin only
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Only admin can create admin accounts
    if (role === 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create admin accounts'
      });
    }

    const user = await User.create({
      username,
      password,
      role: role || 'manager'
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user._id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin only
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Prevent managers from deleting admins
    if (user.role === 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin accounts'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Admin only
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent disabling yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot disable your own account'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'enabled' : 'disabled'} successfully`,
      data: { isActive: user.isActive }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ==================== STATION MANAGEMENT ====================

// @desc    Create new station
// @route   POST /api/admin/stations
// @access  Admin/Manager
exports.createStation = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      youtubePlaylistId,
      playlistDuration,
      headerImage,
      thumbnailImage,
      genre,
      themeSettings,
      schedule,
      isFeatured
    } = req.body;

    // Check if slug exists
    const existingStation = await Station.findOne({ slug });
    if (existingStation) {
      return res.status(400).json({
        success: false,
        message: 'Station slug already exists'
      });
    }

    const station = await Station.create({
      name,
      slug,
      description,
      youtubePlaylistId,
      playlistDuration: playlistDuration || 3600000,
      headerImage,
      thumbnailImage,
      genre,
      themeSettings,
      schedule,
      isFeatured,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Station created successfully',
      data: station
    });
  } catch (error) {
    console.error('Create station error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update station
// @route   PUT /api/admin/stations/:id
// @access  Admin/Manager
exports.updateStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    // Managers can only edit stations they created
    if (req.user.role === 'manager' &&
        station.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Can only edit stations you created'
      });
    }

    const updatedStation = await Station.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Station updated successfully',
      data: updatedStation
    });
  } catch (error) {
    console.error('Update station error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete station
// @route   DELETE /api/admin/stations/:id
// @access  Admin only
exports.deleteStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    await Station.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Station deleted successfully'
    });
  } catch (error) {
    console.error('Delete station error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all stations (including inactive) for admin
// @route   GET /api/admin/stations
// @access  Admin/Manager
exports.getAllStationsAdmin = async (req, res) => {
  try {
    const stations = await Station.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: stations.length,
      data: stations
    });
  } catch (error) {
    console.error('Get admin stations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Toggle station active status
// @route   PUT /api/admin/stations/:id/toggle
// @access  Admin/Manager
exports.toggleStationStatus = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    // Managers can only toggle stations they created
    if (req.user.role === 'manager' &&
        station.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Can only toggle stations you created'
      });
    }

    station.isActive = !station.isActive;
    await station.save();

    res.json({
      success: true,
      message: `Station ${station.isActive ? 'enabled' : 'disabled'} successfully`,
      data: { isActive: station.isActive }
    });
  } catch (error) {
    console.error('Toggle station status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ==================== DASHBOARD STATS ====================

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin/Manager
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStations = await Station.countDocuments();
    const activeStations = await Station.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();
    const totalManagers = await User.countDocuments({ role: 'manager' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalBasicUsers = await User.countDocuments({ role: 'user' });

    // Aggregate listener counts
    const listenerStats = await Station.aggregate([
      {
        $group: {
          _id: null,
          totalListeners: { $sum: '$listenerCount' },
          totalPlays: { $sum: '$totalPlays' }
        }
      }
    ]);

    const recentStations = await Station.find()
      .select('name slug listenerCount isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stations: {
          total: totalStations,
          active: activeStations
        },
        users: {
          total: totalUsers,
          managers: totalManagers,
          admins: totalAdmins,
          basicUsers: totalBasicUsers
        },
        listeners: listenerStats[0]?.totalListeners || 0,
        totalPlays: listenerStats[0]?.totalPlays || 0,
        recentStations
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ==================== LANDING PAGE MANAGEMENT ====================

// @desc    Get landing page settings
// @route   GET /api/admin/landing
// @access  Admin/Manager
exports.getLandingPage = async (req, res) => {
  try {
    const landing = await LandingPage.getLandingPage();

    res.json({
      success: true,
      data: landing
    });
  } catch (error) {
    console.error('Get landing page error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update landing page
// @route   PUT /api/admin/landing
// @access  Admin/Manager
exports.updateLandingPage = async (req, res) => {
  try {
    const landing = await LandingPage.getLandingPage();

    const updated = await LandingPage.findByIdAndUpdate(
      landing._id,
      {
        ...req.body,
        updatedBy: req.user.id,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Landing page updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update landing page error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
