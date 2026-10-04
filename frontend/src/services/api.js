import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

API.interceptors.request.use((config) => {
  const userToken = localStorage.getItem('vyntra_token');
  const adminToken = localStorage.getItem('vyntra_admin_token');

  if (config.url?.startsWith('/admin') || config.url?.startsWith('/analytics')) {
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

export default API;
