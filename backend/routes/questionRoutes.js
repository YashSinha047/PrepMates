// routes/questionRoutes.js
const express = require('express');
const { saveQuestion, getQuestionsByEmail, toggleQuestionStatus, deleteQuestion } = require('../controllers/questionController');
const router = express.Router();

// Route to save question details
router.post('/save-question', saveQuestion);

// Route to fetch questions by email
router.post('/details-questions', getQuestionsByEmail);

// Route to toggle the solved status of a question
router.patch('/status/:questionId', toggleQuestionStatus);

// Route to delete a question
router.delete('/:id', deleteQuestion);

module.exports = router;

