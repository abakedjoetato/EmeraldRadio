const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');

router.get('/', stationController.getAllStations);
router.get('/featured', stationController.getFeaturedStations);
router.get('/search', stationController.searchStations);
router.get('/:slug', stationController.getStation);
router.get('/:slug/sync', stationController.getStationSync);
router.post('/:slug/listeners', stationController.updateListeners);

module.exports = router;
