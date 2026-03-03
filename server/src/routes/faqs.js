const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { authenticate } = require('../middleware/auth');

// Public routes (no authentication required for reading published FAQs)
router.get('/public', async (req, res) => {
  try {
    const faqs = await require('../db').fAQ.findMany({
      where: { isPublished: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// All other routes require authentication
router.use(authenticate);

// Get all FAQs (with optional published filter)
router.get('/', faqController.getAllFaqs);

// Get single FAQ
router.get('/:id', faqController.getFaqById);

// Create FAQ
router.post('/', faqController.createFaq);

// Update FAQ
router.put('/:id', faqController.updateFaq);

// Toggle publish status
router.patch('/:id/toggle-publish', faqController.togglePublish);

// Delete FAQ
router.delete('/:id', faqController.deleteFaq);

module.exports = router;
