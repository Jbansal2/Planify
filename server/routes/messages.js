const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

// Get chat history with a specific user
router.get('/:userId', auth, messageController.getChatHistory);

// Send a new message
router.post('/', auth, messageController.sendMessage);

module.exports = router;
