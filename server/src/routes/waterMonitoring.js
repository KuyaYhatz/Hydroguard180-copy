const express = require('express');
const router = express.Router();
const waterMonitoringController = require('../controllers/waterMonitoringController');
const { authenticate, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/latest', optionalAuth, waterMonitoringController.getLatestWaterMonitoring);
router.get('/stats', optionalAuth, waterMonitoringController.getWaterMonitoringStats);

// ESP32 Device endpoint (unauthenticated)
router.post('/device', waterMonitoringController.createFromDevice);

// Protected routes
router.get('/', authenticate, waterMonitoringController.getAllWaterMonitoring);
router.get('/:id', authenticate, waterMonitoringController.getWaterMonitoringById);
router.post('/', authenticate, waterMonitoringController.createWaterMonitoring);
router.put('/:id', authenticate, waterMonitoringController.updateWaterMonitoring);
router.delete('/:id', authenticate, waterMonitoringController.deleteWaterMonitoring);

module.exports = router;
