import React, { createContext, useContext, useState } from 'react';

// Create the context
const UserContext = createContext();

// Context provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ id: null, role: null }); // Global user state

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for accessing user data
export const useUser = () => useContext(UserContext);
