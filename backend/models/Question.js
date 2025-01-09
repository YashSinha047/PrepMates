// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  questionName: {
    type: String,
    default: "",
  },
  platform: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  status: {
    type: Boolean,
    default: false, // false = Unsolved, true = Solved
  },
  
},{ timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
