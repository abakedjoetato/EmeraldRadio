const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.get('/profile/:username', userController.getUserProfile);
router.put('/profile', authenticate, userController.updateProfile);

module.exports = router;
