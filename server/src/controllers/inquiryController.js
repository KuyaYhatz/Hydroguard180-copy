const prisma = require('../db');

// Get all inquiries with optional filters
exports.getAllInquiries = async (req, res) => {
  try {
    const { status, limit = 100, offset = 0 } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    res.json(inquiries);
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get inquiry by ID
exports.getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json(inquiry);
  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new inquiry (public endpoint)
exports.createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required' });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: 'unread',
      },
    });

    res.status(201).json(inquiry);
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update inquiry (mark read, add reply)
exports.updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reply } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (reply !== undefined) {
      updateData.reply = reply;
      if (reply && status === 'replied') {
        updateData.repliedAt = new Date();
      }
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: updateData,
    });

    // Log the action
    if (req.userId) {
      await prisma.auditLog.create({
        data: {
          userId: req.userId,
          userName: req.user.fullName,
          action: 'Inquiry Updated',
          target: 'Inquiries',
          details: `Updated inquiry from ${inquiry.name} - Status: ${status || 'unchanged'}`,
        },
      });
    }

    res.json(inquiry);
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.inquiry.delete({
      where: { id },
    });

    // Log the action
    if (req.userId) {
      await prisma.auditLog.create({
        data: {
          userId: req.userId,
          userName: req.user.fullName,
          action: 'Inquiry Deleted',
          target: 'Inquiries',
          details: `Deleted inquiry from ${inquiry.name}: ${inquiry.subject}`,
        },
      });
    }

    res.json({ message: 'Inquiry deleted successfully', inquiry });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.inquiry.count({
      where: { status: 'unread' },
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
