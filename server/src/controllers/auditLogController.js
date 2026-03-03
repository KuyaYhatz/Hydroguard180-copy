const prisma = require('../db');

// Get all audit logs
exports.getAllAuditLogs = async (req, res) => {
  try {
    const { limit = 100, offset = 0, userId, action, startDate, endDate } = req.query;

    const where = {};
    
    // Filter by userId if provided
    if (userId) where.userId = userId;
    
    // Filter by action if provided
    if (action) where.action = { contains: action };
    
    // Filter by date range if provided
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true
          }
        }
      }
    });

    const total = await prisma.auditLog.count({ where });

    res.json({
      data: logs,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get all audit logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single audit log
exports.getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!log) {
      return res.status(404).json({ error: 'Audit log not found' });
    }

    res.json(log);
  } catch (error) {
    console.error('Get audit log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create audit log (typically used internally, but exposed for manual logging)
exports.createAuditLog = async (req, res) => {
  try {
    const { action, target, details } = req.body;

    const log = await prisma.auditLog.create({
      data: {
        userId: req.userId,
        userName: req.user.fullName,
        action,
        target,
        details
      }
    });

    res.status(201).json(log);
  } catch (error) {
    console.error('Create audit log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
