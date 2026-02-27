import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData)
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  approveUser: (userId) => api.put(`/users/${userId}/approve`)
};

// Activities API
export const activitiesAPI = {
  getActivities: (params) => api.get('/activities', { params }),
  getActivity: (id) => api.get(`/activities/${id}`),
  createActivity: (data) => api.post('/activities', data),
  updateActivity: (id, data) => api.put(`/activities/${id}`, data),
  deleteActivity: (id) => api.delete(`/activities/${id}`),
  getTeachersByField: (field) => api.get(`/activities/teachers/${field}`)
};

// Achievements API
export const achievementsAPI = {
  getAchievements: (params) => api.get('/achievements', { params }),
  createAchievement: (data) => api.post('/achievements', data),
  updateAchievementStatus: (id, data) => api.put(`/achievements/${id}/status`, data),
  getAchievementStats: () => api.get('/achievements/stats')
};

// Teachers API
export const teachersAPI = {
  getTeachers: () => api.get('/teachers'),
  createTeacher: (data) => api.post('/teachers', data),
  updateTeacher: (id, data) => api.put(`/teachers/${id}`, data)
};

// Reports API
export const reportsAPI = {
  getDashboardData: () => api.get('/reports/dashboard')
};

export default api;