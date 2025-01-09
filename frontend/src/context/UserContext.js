import React, { createContext, useState, useEffect } from 'react';

// Create a context for user authentication
export const UserContext = createContext();

// UserProvider component to wrap your app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On app load, check if user info exists in localStorage
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedGroupId = localStorage.getItem('groupId');
    const storedGroupName = localStorage.getItem('groupName');

    // If all values are available, set them as the initial user state
    if (storedToken && storedUsername && storedEmail) {
      setUser({
        token: storedToken,
        username: storedUsername,
        email: storedEmail,
        groupId: storedGroupId || null,   // Handle case where groupId might not exist
        groupName: storedGroupName || null, // Handle case where groupName might not exist
      });
    }
  }, []);

  // Update local storage whenever the user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('token', user.token);
      localStorage.setItem('username', user.username);
      localStorage.setItem('email', user.email);
      localStorage.setItem('groupId', user.groupId);   // Save groupId to local storage
      localStorage.setItem('groupName', user.groupName); // Save groupName to local storage
    } else {
      // Clear user data from local storage on logout or when user is null
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('groupId');   // Clear groupId from local storage
      localStorage.removeItem('groupName'); // Clear groupName from local storage
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


