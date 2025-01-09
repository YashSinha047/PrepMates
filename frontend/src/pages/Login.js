import React, { useState, useContext } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setError('Invalid email format');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      // Save the token or any relevant data (if needed)
      // Assuming res.data contains both token and username
      const { token, username, email } = res.data;

      // Save token and username in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);  // Store username
      localStorage.setItem('email', email);

      // In your handleSubmit function after successful login
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({ email: formData.email }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message to extension:", chrome.runtime.lastError);
          } else {
            console.log("Email sent to extension:", response);
          }
        });
      }

      // Set user in context
      setUser({ token, username, email });

      console.log(res.data); // Handle successful login
      setError('');
      navigate('/primary-dashboard'); 
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            name="email"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            name="password"
            onChange={handleChange}
          />
        </Form.Group>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;

