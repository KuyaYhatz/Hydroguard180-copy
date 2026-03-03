const prisma = require('../db');

// Get all FAQs
exports.getAllFaqs = async (req, res) => {
  try {
    const { published } = req.query;
    
    const where = {};
    if (published !== undefined) {
      where.isPublished = published === 'true';
    }

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(faqs);
  } catch (error) {
    console.error('Get all FAQs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single FAQ
exports.getFaqById = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await prisma.fAQ.findUnique({
      where: { id }
    });

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json(faq);
  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create FAQ
exports.createFaq = async (req, res) => {
  try {
    const { category, question, answer, isPublished, order } = req.body;

    const faq = await prisma.fAQ.create({
      data: {
        category,
        question,
        answer,
        isPublished: isPublished !== undefined ? isPublished : false,
        order: order || 0
      }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        userName: req.user.fullName,
        action: 'FAQ Created',
        target: question,
        details: `Created FAQ in category: ${category}`
      }
    });

    res.status(201).json(faq);
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update FAQ
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, question, answer, isPublished, order } = req.body;

    const existingFaq = await prisma.fAQ.findUnique({
      where: { id }
    });

    if (!existingFaq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        ...(category !== undefined && { category }),
        ...(question !== undefined && { question }),
        ...(answer !== undefined && { answer }),
        ...(isPublished !== undefined && { isPublished }),
        ...(order !== undefined && { order })
      }
    });

    // Log the action
    const action = isPublished !== undefined && existingFaq.isPublished !== isPublished
      ? (isPublished ? 'FAQ Published' : 'FAQ Unpublished')
      : 'FAQ Updated';

    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        userName: req.user.fullName,
        action,
        target: faq.question,
        details: `Updated FAQ in category: ${faq.category}`
      }
    });

    res.json(faq);
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await prisma.fAQ.findUnique({
      where: { id }
    });

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    await prisma.fAQ.delete({
      where: { id }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        userName: req.user.fullName,
        action: 'FAQ Deleted',
        target: faq.question,
        details: `Deleted FAQ from category: ${faq.category}`
      }
    });

    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Toggle publish status
exports.togglePublish = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await prisma.fAQ.findUnique({
      where: { id }
    });

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    const updatedFaq = await prisma.fAQ.update({
      where: { id },
      data: {
        isPublished: !faq.isPublished
      }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        userName: req.user.fullName,
        action: updatedFaq.isPublished ? 'FAQ Published' : 'FAQ Unpublished',
        target: updatedFaq.question,
        details: `Changed FAQ status in category: ${updatedFaq.category}`
      }
    });

    res.json(updatedFaq);
  } catch (error) {
    console.error('Toggle publish error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
