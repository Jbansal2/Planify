const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

// Get Dashboard Stats
router.get('/stats', auth, dashboardController.getStats);

// Get Latest Notifications
router.get('/notifications', auth, dashboardController.getNotifications);

// Mark Notification as Read
router.patch('/notifications/:id/read', auth, dashboardController.markNotificationRead);

module.exports = router;
