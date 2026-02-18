const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const stationRoutes = require('./stationRoutes');
const chatRoutes = require('./chatRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const landingRoutes = require('./landingRoutes');
const userRoutes = require('./userRoutes');

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/stations', stationRoutes);
router.use('/chat', chatRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/landing', landingRoutes);
router.use('/users', userRoutes);

module.exports = router;
