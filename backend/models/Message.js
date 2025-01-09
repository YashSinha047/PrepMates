const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    groupId: {
        type: String, // Reference to the Group model
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    mediaUrls: {
        type: [String], // Array of URLs for multiple media files like images, PDFs, etc.
        default: [],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;

