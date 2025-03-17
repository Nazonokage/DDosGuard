import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axiosConfig';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/auth/check-session');
        if (response.data.logged_in) {
          setUser({
            id: response.data.user.id,
            name: response.data.user.name,
            type: response.data.user.type,
          });
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    };
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth }; // Export useAuth