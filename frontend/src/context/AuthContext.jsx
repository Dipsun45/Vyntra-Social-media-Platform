import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const userToken = localStorage.getItem('vyntra_token');
      const adminToken = localStorage.getItem('vyntra_admin_token');

      if (userToken) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          // Clear stale/expired token quietly
          localStorage.removeItem('vyntra_token');
          setUser(null);
        }
      }

      if (adminToken) {
        try {
          const savedAdmin = JSON.parse(localStorage.getItem('vyntra_admin_data') || 'null');
          if (savedAdmin) setAdmin(savedAdmin);
        } catch (err) {
          localStorage.removeItem('vyntra_admin_token');
          localStorage.removeItem('vyntra_admin_data');
        }
      }

      setLoading(false);
    };

    fetchMe();
  }, []);

  const loginUser = async (login, password) => {
    const res = await API.post('/auth/login', { login, password });
    const data = res.data;
    localStorage.setItem('vyntra_token', data.token);
    setUser(data);
    return data;
  };

  const registerUser = async (formData) => {
    const res = await API.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const data = res.data;
    localStorage.setItem('vyntra_token', data.token);
    setUser(data);
    return data;
  };

  const logoutUser = () => {
    localStorage.removeItem('vyntra_token');
    setUser(null);
  };

  const loginAdmin = async (email, password) => {
    const res = await API.post('/admin/login', { email, password });
    const data = res.data;
    localStorage.setItem('vyntra_admin_token', data.token);
    localStorage.setItem('vyntra_admin_data', JSON.stringify(data));
    setAdmin(data);
    return data;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('vyntra_admin_token');
    localStorage.removeItem('vyntra_admin_data');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        admin,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
