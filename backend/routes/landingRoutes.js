const express = require('express');
const router = express.Router();
const landingController = require('../controllers/landingController');

router.get('/', landingController.getLandingPage);
router.get('/sections', landingController.getSections);

module.exports = router;
