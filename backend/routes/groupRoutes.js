const express = require('express');
const router = express.Router();
const { createGroup, joinGroup, myGroup, leaveGroup, shareQuestion, getSharedQuestions } = require('../controllers/groupController');

// Route to create a new group
router.post('/create', createGroup);

// Route to join a group
router.post('/join', joinGroup);

// Route to get all groups details
router.get('/my-groups', myGroup);

// Route to leave a group
router.post('/leave-group', leaveGroup);

// Route to share question
router.post('/share-question', shareQuestion);

//Route to fetch all shared questions
router.get('/:groupId/shared-questions', getSharedQuestions);

module.exports = router;
