const express = require('express');
const router = express.Router();
const alertLevelController = require('../controllers/alertLevelController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');

// Public route to get current alert level
router.get('/current', optionalAuth, alertLevelController.getCurrentAlertLevel);

// Public routes to get alert levels
router.get('/', alertLevelController.getAllAlertLevels);
router.get('/:level', alertLevelController.getAlertLevelByLevel);

// Protected routes (Admin only)
router.put('/:level', authenticate, authorize('Super Admin', 'Admin'), alertLevelController.updateAlertLevel);
router.post('/recalculate', authenticate, authorize('Super Admin', 'Admin'), alertLevelController.recalculateAlertLevels);

module.exports = router;
