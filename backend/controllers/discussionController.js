// controllers/discussionController.js
const Discussion = require('../models/Discussion');

// Post a new discussion message
exports.postDiscussionMessage = async (req, res) => {
    const { groupId, questionId } = req.params;
    const { message, user } = req.body;
    const io = req.io;

    try {
        const newMessage = new Discussion({ groupId, questionId, message, user });
        const savedMessage = await newMessage.save();

        io.emit("message", savedMessage); // Emit to the specific room
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ error: 'Server error while posting message' });
    }
};

// Get all messages for a question
exports.getDiscussionMessages = async (req, res) => {
    const { groupId, questionId } = req.params;

    try {
        const messages = await Discussion.find({ groupId, questionId })
            .sort({ createdAt: 1 })
            .select('message user createdAt'); // Select fields to include in the response
        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching messages' });
    }
};
