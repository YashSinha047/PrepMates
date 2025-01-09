import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import io from "socket.io-client";
import { Container, ListGroup, Spinner, Dropdown, Button } from 'react-bootstrap';

const socket = io("http://localhost:4000");

const JobPostings = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const userEmail = localStorage.getItem("email");

  const fetchJobPostings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/jobs/details-jobs',
        { userEmail },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.jobs) {
        setJobPostings(response.data.jobs);
      } else {
        setJobPostings([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchJobPostings();

    // Listen for new job postings via socket.io
    socket.on(`newJob-${userEmail}`, (newJob) => {
      setJobPostings((prevJobs) => [newJob, ...prevJobs]);
    });

    // Cleanup socket connection on component unmount
    return () => {
      socket.off(`newJob-${userEmail}`);
    };
  }, [fetchJobPostings, userEmail]);

  // Function to delete a job posting
  const deleteJobPosting = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/delete-job/${jobId}`);
      
      // Filter out the deleted job from the job postings list
      setJobPostings((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job posting:', error);
    }
  };

  const updateStatus = async (jobId, newStatus) => {
    setUpdating(true);
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/jobs/update-status/${jobId}`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setJobPostings((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, status: newStatus } : job
          )
        );
      }
    } catch (error) {
      console.error('Error updating job status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const statusOptions = ['applied', 'not applied', 'interviewing', 'offered', 'rejected', 'not interested'];

  return (
    <Container className="mt-5">
      <h2>Job Postings</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <ListGroup>
          {jobPostings.length === 0 ? (
            <ListGroup.Item>No job postings available.</ListGroup.Item>
          ) : (
            jobPostings.map((job) => (
              <ListGroup.Item key={job._id}>
                <h5>Job URL:</h5>
                <a href={job.url} target="_blank" rel="noopener noreferrer">{job.url}</a>
                <p><strong>Note:</strong> {job.note || 'No notes available.'}</p>
                <p><strong>Status:</strong> {job.status}</p>

                <Dropdown>
                  <Dropdown.Toggle as={Button} disabled={updating}>
                    {updating ? "Updating..." : "Change Status"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {statusOptions.map((status) => (
                      <Dropdown.Item
                        key={status}
                        onClick={() => updateStatus(job._id, status)}
                      >
                        {status}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                {/* Delete Button */}
                <Button variant="danger" className="ml-3" onClick={() => deleteJobPosting(job._id)}>
                  Delete
                </Button>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      )}
    </Container>
  );
};

export default JobPostings;
