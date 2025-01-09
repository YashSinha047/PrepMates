import React, { useState, useContext } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const JoinGroup = () => {
  const { setUser } = useContext(UserContext);
  const [groupName, setGroupName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    setError('');
  
    // Retrieve username from localStorage or context
    const username = localStorage.getItem('username'); // or use context
  
    try {
      // Send the username along with group name and ID
      const response = await axios.post('http://localhost:5000/api/groups/join', {
        username, // include the username
        groupName,
        groupId,
      });
  
      // Handle successful response
      console.log('Joined Group Successfully:', response.data);
  
      // Update local storage with group name and group ID
      localStorage.setItem('groupName', response.data.groupName);
      localStorage.setItem('groupId', response.data.groupId);

      setUser((prevUser) => ({ 
        ...prevUser, 
        groupId,
        groupName // Add groupName to the user context
      }));
  
      // Redirect to the group dashboard
      navigate('/group-dashboard');
  
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Error joining group');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Join a New Group</h2>
      {error && <p className="text-danger">{error}</p>}
      <Form onSubmit={handleJoinGroup}>
        <Form.Group controlId="formGroupName">
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formGroupId">
          <Form.Label>Group ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Group ID"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Join Group
        </Button>
      </Form>
    </Container>
  );
};

export default JoinGroup;
