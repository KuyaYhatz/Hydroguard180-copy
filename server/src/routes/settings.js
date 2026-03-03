const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');

// Public route to get settings
router.get('/', optionalAuth, settingsController.getSettings);

// Protected route to update settings (Admin only)
router.put('/', authenticate, authorize('Super Admin', 'Admin'), settingsController.updateSettings);

module.exports = router;
