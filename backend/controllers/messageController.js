// controllers/messageController.js
const Message = require('../models/Message');

// Fetch messages for a specific group
const fetchMessages = async (req, res) => {
    const { groupId } = req.params;
    const messages = await Message.find({ groupId }).sort({ timestamp: -1 }).limit(20);
    console.log(messages);
    res.json(messages.reverse());
};

module.exports = { fetchMessages };