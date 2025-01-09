// routes/discussionRoutes.js
const express = require('express');
const router = express.Router();
const { postDiscussionMessage, getDiscussionMessages } = require('../controllers/discussionController');

// Route to get all discussion messages for a question
router.get('/:groupId/questions/:questionId', getDiscussionMessages);

// Route to post a new message in the discussion
router.post('/:groupId/questions/:questionId', postDiscussionMessage);

module.exports = router;
