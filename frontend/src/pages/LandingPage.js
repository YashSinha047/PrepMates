import React from 'react';
import { Container, Button, Navbar } from 'react-bootstrap';

const LandingPage = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">My Application</Navbar.Brand>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="text-center mt-5">
        <h1>Welcome to My Application</h1>
        <p className="lead">
          A brief description of the application. Explain features, benefits, and purpose here.
        </p>

        {/* Buttons */}
        <Button href="/register" variant="outline-primary" size="lg" className="m-3">
          Register
        </Button>
        <Button href="/login" variant="outline-primary" size="lg" className="m-3">
          Login
        </Button>
      </Container>
    </>
  );
};

export default LandingPage;
