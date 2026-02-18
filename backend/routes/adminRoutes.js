const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin, requireManager } = require('../middleware/auth');

// Apply authentication to all admin routes
router.use(authenticate);

// User Management (Admin only)
router.post('/users', requireAdmin, adminController.createUser);
router.get('/users', requireAdmin, adminController.getAllUsers);
router.delete('/users/:id', requireAdmin, adminController.deleteUser);
router.put('/users/:id/toggle', requireAdmin, adminController.toggleUserStatus);

// Station Management (Admin/Manager)
router.post('/stations', requireManager, adminController.createStation);
router.put('/stations/:id', requireManager, adminController.updateStation);
router.delete('/stations/:id', requireAdmin, adminController.deleteStation);
router.get('/stations', requireManager, adminController.getAllStationsAdmin);
router.put('/stations/:id/toggle', requireManager, adminController.toggleStationStatus);

// Dashboard Stats (Admin/Manager)
router.get('/stats', requireManager, adminController.getDashboardStats);

// Landing Page Management (Admin/Manager)
router.get('/landing', requireManager, adminController.getLandingPage);
router.put('/landing', requireManager, adminController.updateLandingPage);

module.exports = router;
