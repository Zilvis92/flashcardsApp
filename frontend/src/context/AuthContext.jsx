import React, { createContext, useState, useEffect } from 'react';
import api from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/users/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser({ token: res.data.token });
  };

 const register = async (username, email, password) => {
    try {
      const res = await api.post('/users/register', { username, email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      console.log('Response status:', res.status);
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};