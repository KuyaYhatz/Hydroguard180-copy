const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all audit logs
router.get('/', auditLogController.getAllAuditLogs);

// Get single audit log
router.get('/:id', auditLogController.getAuditLogById);

// Create audit log manually (for custom logging)
router.post('/', auditLogController.createAuditLog);

module.exports = router;
