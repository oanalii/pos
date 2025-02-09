import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:1337'
});

// Add a request interceptor to add the token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API; 