import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().clearAuth();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  getMe: () => api.get('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
  logout: () => api.post('/auth/logout')
};

// Stations API
export const stationsAPI = {
  getAll: () => api.get('/stations'),
  getFeatured: () => api.get('/stations/featured'),
  getBySlug: (slug: string) => api.get(`/stations/${slug}`),
  getSync: (slug: string) => api.get(`/stations/${slug}/sync`),
  search: (query: string) => api.get(`/stations/search?q=${query}`),
  updateListeners: (slug: string, action: 'join' | 'leave') =>
    api.post(`/stations/${slug}/listeners`, { action })
};

// User API
export const userAPI = {
  getProfile: (username: string) => api.get(`/users/profile/${username}`),
  updateProfile: (data: any) => api.put('/users/profile', data)
};

// Admin API
export const adminAPI = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),

  // Users
  getUsers: () => api.get('/admin/users'),
  createUser: (data: { username: string; password: string; role: string }) =>
    api.post('/admin/users', data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  toggleUser: (id: string) => api.put(`/admin/users/${id}/toggle`),

  // Stations
  getAllStations: () => api.get('/admin/stations'),
  createStation: (data: any) => api.post('/admin/stations', data),
  updateStation: (id: string, data: any) => api.put(`/admin/stations/${id}`, data),
  deleteStation: (id: string) => api.delete(`/admin/stations/${id}`),
  toggleStation: (id: string) => api.put(`/admin/stations/${id}/toggle`),

  // Landing Page
  getLandingPage: () => api.get('/admin/landing'),
  updateLandingPage: (data: any) => api.put('/admin/landing', data)
};

// Chat API
export const chatAPI = {
  getMessages: (stationSlug: string, limit = 50) =>
    api.get(`/chat/${stationSlug}?limit=${limit}`),
  sendMessage: (stationSlug: string, username: string, message: string) =>
    api.post(`/chat/${stationSlug}`, { username, message })
};

// Favorites API
export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (stationId: string) => api.post(`/favorites/${stationId}`),
  remove: (stationId: string) => api.delete(`/favorites/${stationId}`),
  check: (stationId: string) => api.get(`/favorites/check/${stationId}`)
};

// Landing API
export const landingAPI = {
  getLandingPage: () => api.get('/landing'),
  getSections: () => api.get('/landing/sections')
};
