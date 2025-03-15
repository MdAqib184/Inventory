import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Define the API URL
const API_URL = "https://inventory-eef5.onrender.com";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/status`);
        if (res.data.isAuthenticated) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        }
        setLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setError('Failed to verify authentication. Please try again.');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setError(null);
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.get(`${API_URL}/auth/logout`);
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh auth state
  const refreshAuth = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/auth/status`);
      if (res.data.isAuthenticated) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setError(null);
    } catch (error) {
      console.error('Failed to refresh authentication:', error);
      setError('Failed to refresh authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        loading, 
        error, 
        login, 
        logout, 
        refreshAuth 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};