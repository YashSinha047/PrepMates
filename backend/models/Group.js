const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    unique: true,
  },
  groupId: {
    type: String,
    required: true,
    unique: true,
  },
  members: [
    {
      type: String,
      required: true,
    },
  ],
  sharedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // Reference to questions
});

module.exports = mongoose.model('Group', GroupSchema);
