const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// Get all users
router.get('/', auth, userController.getUsers);

// Toggle Block Status (Admin only)
router.patch('/:id/block', auth, authorize('Admin'), userController.toggleBlockStatus);

// Update Profile
router.put('/profile', auth, userController.updateProfile);

// Update Password
router.put('/password', auth, userController.updatePassword);

module.exports = router;
