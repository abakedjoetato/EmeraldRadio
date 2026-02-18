const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', favoritesController.getFavorites);
router.post('/:stationId', favoritesController.addFavorite);
router.delete('/:stationId', favoritesController.removeFavorite);
router.get('/check/:stationId', favoritesController.checkFavorite);

module.exports = router;
