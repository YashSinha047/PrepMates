import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  
  // If user is authenticated, allow access to the children component
  // If not, redirect to login
  return user || localStorage.getItem('token') ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;



