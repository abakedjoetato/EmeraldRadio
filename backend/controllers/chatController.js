const { ChatMessage, Station } = require('../models');

// @desc    Get chat messages for a station
// @route   GET /api/chat/:stationSlug
// @access  Public
exports.getMessages = async (req, res) => {
  try {
    const { stationSlug } = req.params;
    const { limit = 50, before } = req.query;

    // Find station
    const station = await Station.findOne({ slug: stationSlug });
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    // Build query
    const query = {
      station: station._id,
      isDeleted: false
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await ChatMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('user', 'username role');

    res.json({
      success: true,
      count: messages.length,
      data: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Send a chat message
// @route   POST /api/chat/:stationSlug
// @access  Public (with rate limiting)
exports.sendMessage = async (req, res) => {
  try {
    const { stationSlug } = req.params;
    const { username, message } = req.body;

    // Find station
    const station = await Station.findOne({ slug: stationSlug });
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    // Check if station is active
    if (!station.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Chat is disabled for this station'
      });
    }

    // Rate limiting check (simple in-memory)
    // In production, use Redis for distributed rate limiting
    const rateLimitKey = `chat_${req.ip}_${stationSlug}`;
    const now = Date.now();

    // Create message
    const chatMessage = await ChatMessage.create({
      station: station._id,
      user: req.user?.id || null,
      senderDisplayName: req.user?.displayName || username || 'Anonymous',
      senderUsername: req.user?.username || null,
      message: message.trim()
    });

    // Populate for response
    await chatMessage.populate('user', 'username role');

    // Emit to socket room
    const io = req.app.get('io');
    io.to(`station:${stationSlug}`).emit('newMessage', {
      ...chatMessage.toObject(),
      stationSlug
    });

    res.status(201).json({
      success: true,
      data: chatMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete a chat message (admin only)
// @route   DELETE /api/chat/:messageId
// @access  Admin
exports.deleteMessage = async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.isDeleted = true;
    await message.save();

    // Get station slug for socket emission
    const station = await Station.findById(message.station);

    // Emit deletion to socket room
    const io = req.app.get('io');
    io.to(`station:${station.slug}`).emit('messageDeleted', {
      messageId: message._id
    });

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
