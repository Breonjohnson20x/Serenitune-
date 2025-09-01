import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('serenitune_token'));

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('serenitune_token');
      const storedUser = localStorage.getItem('serenitune_user');

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid
          const response = await authAPI.verifyToken(storedToken);
          if (response.data.valid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('serenitune_token');
            localStorage.removeItem('serenitune_user');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('serenitune_token');
          localStorage.removeItem('serenitune_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user: userData, token: userToken } = response.data;

      setUser(userData);
      setToken(userToken);
      localStorage.setItem('serenitune_token', userToken);
      localStorage.setItem('serenitune_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user: newUser, token: userToken } = response.data;

      setUser(newUser);
      setToken(userToken);
      localStorage.setItem('serenitune_token', userToken);
      localStorage.setItem('serenitune_user', JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('serenitune_token');
    localStorage.removeItem('serenitune_user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('serenitune_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

