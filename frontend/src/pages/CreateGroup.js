// CreateGroup.js
import React, { useState, useContext } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateGroup = () => {
  const { user, setUser } = useContext(UserContext);
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/groups/create', {
        groupName,
        userName: user.username,
      });

      const { groupId } = response.data;

      // Update user context to include groupId and groupName
    setUser((prevUser) => ({ 
        ...prevUser, 
        groupId,
        groupName // Add groupName to the user context
      }));

      // Redirect or show success message
      console.log('Group Created Successfully');  // replace with the next page if needed
      navigate('/group-dashboard');
    } catch (err) {
        setError(err.response?.data?.msg || err.message || 'Error creating group');
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center">Create Your Group</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formGroupName" className="mt-4">
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter unique group name"
            value={groupName}
            onChange={handleGroupNameChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formUserName" className="mt-3">
          <Form.Label>Your Name</Form.Label>
          <Form.Control
            type="text"
            value={user?.username || ''}
            readOnly
            disabled
          />
        </Form.Group>

        <Form.Group controlId="formUserEmail" className="mt-3">
          <Form.Label>Your Email</Form.Label>
          <Form.Control
            type="email"
            value={user?.email || ''}
            readOnly
            disabled
          />
        </Form.Group>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Button variant="primary" type="submit" className="mt-4">
          Create Group
        </Button>
      </Form>
    </Container>
  );
};

export default CreateGroup;
