import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axiosConfig';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('/api/auth/me')
      .then((res) => {
        if (res.data.logged_in) {
          setUser({
            id:   res.data.user.id,
            name: res.data.user.name,
            type: res.data.user.type,
          });
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
