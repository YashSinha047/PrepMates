const JobPosting = require('../models/JobPosting');
const User = require('../models/User');

// Controller function to save job posting
const saveJob = async (req, res) => {
    console.log("save job posting request received");
    try {
        const { userEmail, url, note } = req.body;
        const io = req.io; // Access the `io` instance from the request

        if (!userEmail || !url) {
            return res.status(400).json({ message: "User email and URL are required." });
        }

        // Check if the user exists in the User model
        const userExists = await User.findOne({ email: userEmail });
        if (!userExists) {
            return res.status(404).json({ message: "No account found for this email. Would you like to create one?" });
        }

        // Save the question if the user exists
        const newJob = new JobPosting({
            userEmail,
            url,
            note,
        });

        await newJob.save();

        // Emit a WebSocket event to notify that a question has been saved
        io.emit(`newJob-${userEmail}`, newJob);

        return res.status(201).json({ message: "Job posting saved successfully!" });
    } catch (error) {
        console.error("Error saving job posting:", error);
        return res.status(500).json({ message: "An error occurred while saving the job posting." });
    }
};


// Fetch questions by user email
const getJobsByEmail = async (req, res) => {
    console.log('fetch request received', req.body);
    const { userEmail } = req.body;
  
    try {
      const jobs = await JobPosting.find({ userEmail }).sort({ createdAt: -1 });
  
      if (jobs.length === 0) {
        return res.status(404).json({ message: 'You have no questions saved.' });
      }
  
      return res.status(200).json({ jobs });
    } catch (error) {
      console.error('Error fetching job postings:', error);
      return res.status(500).json({ message: 'An error occurred while fetching job postings.' });
    }
};


// Update job status
const updateJobStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const updatedJob = await JobPosting.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!updatedJob) {
        return res.status(404).json({ message: 'Job posting not found.' });
      }
  
      return res.status(200).json({ message: 'Job status updated successfully.', job: updatedJob });
    } catch (error) {
      console.error('Error updating job status:', error);
      return res.status(500).json({ message: 'An error occurred while updating job status.' });
    }
  };


// Delete a job posting by ID
const deleteJobPosting = async (req, res) => {
    const { jobId } = req.params;
  
    try {
      const job = await JobPosting.findByIdAndDelete(jobId);
  
      if (!job) {
        return res.status(404).json({ message: 'Job posting not found.' });
      }
  
      return res.status(200).json({ message: 'Job posting deleted successfully.' });
    } catch (error) {
      console.error('Error deleting job posting:', error);
      return res.status(500).json({ message: 'An error occurred while deleting the job posting.' });
    }
  };

module.exports = { saveJob, getJobsByEmail, updateJobStatus, deleteJobPosting };
