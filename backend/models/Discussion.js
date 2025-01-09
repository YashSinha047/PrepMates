// models/Discussion.js
const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    groupId: { type: String, required: true },
    message: { type: String, required: true },
    user: { type: String },  // Assuming user is stored as string, change if different
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Discussion', discussionSchema);
