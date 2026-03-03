const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all users
router.get('/', userController.getAllUsers);

// Get single user
router.get('/:id', userController.getUserById);

// Create user (Super Admin and Admin only)
router.post('/', authorize('Super Admin', 'Admin'), userController.createUser);

// Update user (Super Admin and Admin only)
router.put('/:id', authorize('Super Admin', 'Admin'), userController.updateUser);

// Delete user (Super Admin only)
router.delete('/:id', authorize('Super Admin'), userController.deleteUser);

module.exports = router;
