// routes/questionRoutes.js
const express = require('express');
const { saveJob, getJobsByEmail, deleteJobPosting, updateJobStatus } = require('../controllers/jobController');
const router = express.Router();

// Route to save job posting details
router.post('/save-job', saveJob);

// Route to fetch job postings by email
router.post('/details-jobs', getJobsByEmail);

// Route to update the job status
router.patch('/update-status/:id', updateJobStatus);

// Route to delete a job posting
router.delete('/delete-job/:jobId', deleteJobPosting);

module.exports = router;

