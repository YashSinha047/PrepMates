import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Dropdown, DropdownButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const PrimaryDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  // Retrieve username from context or localStorage
  const username = user?.username || localStorage.getItem('username');

  // State to hold groups data and loading state
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Logout function
  const handleLogout = () => {
    // Remove token and username from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // Clear the user state in the context
    setUser(null);
    
    // Redirect to landing page
    navigate('/');
  };

  // Fetch groups when "My Groups" button is clicked
  const handleMyGroupsClick = async () => {
    try {
      setLoadingGroups(true);
      // Retrieve username from the context or local storage
      const username = user?.username || localStorage.getItem('username');
      
      // Make the API call with the username as a query parameter
      const response = await axios.get(`http://localhost:5000/api/groups/my-groups?username=${username}`);
      
      setGroups(response.data);
      setShowDropdown(true);
      setLoadingGroups(false);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setLoadingGroups(false);
    }
  };

  // Handle selection of a group from the dropdown
  const handleGroupSelect = (group) => {

    // Destructure groupId and groupName from the selected group
    const { groupId, groupName } = group;

    // Store the selected group's name and ID in local storage
    localStorage.setItem('groupName', group.groupName);
    localStorage.setItem('groupId', group.groupId);

    setUser((prevUser) => ({ 
        ...prevUser, 
        groupId,
        groupName // Add groupName to the user context
      }));
      
    // Redirect to group dashboard
    navigate('/group-dashboard');
  };

  return (
    <Container fluid className="p-3">
      {/* Navbar for Welcome message and Logout */}
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>
          <h3>Welcome, {username}!</h3> {/* Display username */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Main content */}
      <Row className="mt-5">
        <Col xs={12} className="text-center">
          <h4>What would you like to do?</h4>
        </Col>
      </Row>

      {/* Buttons for different actions */}
      <Row className="mt-4 justify-content-center">
        <Col xs={12} md={6} className="d-flex justify-content-around">
          <Button variant="primary" size="lg" className="mx-2" onClick={() => navigate('/join-group')}>
            Join a New Group
          </Button>
          <Button variant="secondary" size="lg" className="mx-2" onClick={() => navigate('/create-group')}>
            Create a New Group
          </Button>
        </Col>
      </Row>

      <Row className="mt-4 justify-content-center">
        <Col xs={12} md={6} className="d-flex justify-content-around">
          {/* My Groups Button with Dropdown */}
        <DropdownButton
            id="dropdown-basic-button"
            title={loadingGroups ? 'Loading...' : 'My Groups'}
            onClick={handleMyGroupsClick}
            show={showDropdown} // Controls the dropdown visibility
            onToggle={() => setShowDropdown(!showDropdown)} // Toggle visibility
            variant="info"
            size="lg"
            className="mx-2"
            >
            {groups.length === 0 ? (
                <Dropdown.Item disabled>No Groups</Dropdown.Item>
            ) : (
                groups.map((group) => (
                <Dropdown.Item key={group.groupId} onClick={() => handleGroupSelect(group)}>
                    {group.groupName}
                </Dropdown.Item>
                ))
            )}
        </DropdownButton>

          {/* My Questions Button */}
          <Button variant="warning" size="lg" className="mx-2" onClick={() => navigate('/my-questions')}>
            My Questions
          </Button>

          <Button variant="success" size="lg" className="mx-2" onClick={() => navigate('/job-postings')}>
            Job Postings
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PrimaryDashboard;


