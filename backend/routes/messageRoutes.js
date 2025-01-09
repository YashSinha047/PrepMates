// routes/messageRoutes.js
const express = require('express');
const { fetchMessages } = require('../controllers/messageController');
const router = express.Router();

// Fetch messages for a specific group
router.get('/:groupId', fetchMessages);

module.exports = router;