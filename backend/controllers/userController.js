const { User } = require('../models');

// @desc    Get user profile by username
// @route   GET /api/users/profile/:username
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('username displayName profileImage socialLinks role createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, profileImage, socialLinks } = req.body;

    // Check if displayName is unique (if it's being changed)
    if (displayName && displayName !== req.user.displayName) {
      const existingDisplayName = await User.findOne({ displayName });
      if (existingDisplayName) {
        return res.status(400).json({
          success: false,
          message: 'Display name is already taken'
        });
      }
    }

    const fieldsToUpdate = {};
    if (displayName) fieldsToUpdate.displayName = displayName;
    if (profileImage !== undefined) fieldsToUpdate.profileImage = profileImage;
    if (socialLinks) fieldsToUpdate.socialLinks = socialLinks;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
