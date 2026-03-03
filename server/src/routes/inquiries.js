const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');

// Public route to create inquiry (contact form)
router.post('/', inquiryController.createInquiry);

// Protected routes
router.get('/', authenticate, inquiryController.getAllInquiries);
router.get('/unread-count', authenticate, inquiryController.getUnreadCount);
router.get('/:id', authenticate, inquiryController.getInquiryById);
router.put('/:id', authenticate, authorize('Super Admin', 'Admin', 'Staff'), inquiryController.updateInquiry);
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), inquiryController.deleteInquiry);

module.exports = router;
