const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { optionalAuth, authenticate, requireManager } = require('../middleware/auth');

router.get('/:stationSlug', chatController.getMessages);
router.post('/:stationSlug', optionalAuth, chatController.sendMessage);
router.delete('/:messageId', authenticate, requireManager, chatController.deleteMessage);

module.exports = router;
