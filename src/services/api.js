import axios from 'axios';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (userData) => axios.post(`${VITE_AUTH_BASE_URL}/signup`, userData, { withCredentials: true }),
  login: (credentials) => axios.post(`${VITE_AUTH_BASE_URL}/login`, credentials, { withCredentials: true }),
  logout: () => axios.post(`${VITE_AUTH_BASE_URL}/logout`, {}, { withCredentials: true }),
  getCurrentUser: () => axios.get(`${VITE_API_BASE_URL}/auth/me`, { withCredentials: true }), // ✅ ADD THIS
  getOAuthUrl: () => `${VITE_BASE_URL}/oauth2/authorization/google`,
  deleteAccount: () => axios.delete(`${VITE_API_BASE_URL}/auth/account`, { withCredentials: true }),
};

// Quantity APIs
export const quantityAPI = {
  compare: (data) => api.post('/quantities/compare', data),
  convert: (data) => api.post('/quantities/convert', data),
  add: (data) => api.post('/quantities/add', data),
  subtract: (data) => api.post('/quantities/subtract', data),
  multiply: (data) => api.post('/quantities/multiply', data),
  divide: (data) => api.post('/quantities/divide', data),
  getUnits: () => api.get('/quantities/units'),
};

export const historyAPI = {
  getAll: (limit = 50) => api.get(`/history?limit=${limit}`),
  getByOperation: (operation) => api.get(`/history/operation/${operation}`),
  getByType: (type) => api.get(`/history/type/${type}`),
  getErrors: () => api.get('/history/errors'),
  getCount: (operation) => api.get(`/history/count/${operation}`),
  clearHistory: () => api.delete('/history'),
};

export default api;