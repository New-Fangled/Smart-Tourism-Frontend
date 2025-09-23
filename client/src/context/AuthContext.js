// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "../api/authapi";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user data from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Check if user is logged in (runs on page load/refresh)
  useEffect(() => {
    (async () => {
      try {
        const data = await getUser();
        setUser(data.currentUser);
      } catch (err) {
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local data
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
