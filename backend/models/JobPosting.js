// models/JobPosting.js

const mongoose = require('mongoose');

// Define the Job Posting schema
const jobPostingSchema = new mongoose.Schema({
    userEmail: {
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
        type: String,
        enum: ['applied', 'not applied', 'interviewing', 'offered', 'rejected', 'not interested'],
        default: 'applied',
    },
    
},{ timestamps: true });

// Create the Job Posting model
const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

module.exports = JobPosting;
