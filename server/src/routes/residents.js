const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all residents
router.get('/', residentController.getAllResidents);

// Get single resident
router.get('/:id', residentController.getResidentById);

// Create resident
router.post('/', residentController.createResident);

// Update resident
router.put('/:id', residentController.updateResident);

// Delete resident
router.delete('/:id', residentController.deleteResident);

module.exports = router;
