import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error);
    console.error('API Error Response:', error.response);
    
    // Don't redirect on login page 401 errors
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle subscription errors
    if (error.response?.status === 403 && error.response?.data?.subscriptionExpired) {
      const toast = (await import('react-hot-toast')).default;
      toast.error(error.response.data.message || 'Active subscription required to access this feature.');
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const menuAPI = {
  getMenu: () => api.get('/menu'),
  createCategory: (data) => api.post('/menu/categories', data),
  updateCategory: (id, data) => api.put(`/menu/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/menu/categories/${id}`),
  createMenuItem: (data) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.post('/menu/items', data, config);
  },
  updateMenuItem: (id, data) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.put(`/menu/items/${id}`, data, config);
  },
  deleteMenuItem: (id) => api.delete(`/menu/items/${id}`),
};

export const publicAPI = {
  getPublicMenu: (slug) => api.get(`/public/menu/${slug}`),
};

export const subscriptionAPI = {
  getSubscription: () => api.get('/subscription'),
  getPlans: () => api.get('/subscription/plans'),
  createOrder: (data) => api.post('/subscription/create-order', data),
  verifyPayment: (data) => api.post('/subscription/verify-payment', data),
  createSubscription: (data) => api.post('/subscription', data),
  getAllSubscriptions: () => api.get('/subscription/all'),
};

export const adminAPI = {
  getSubscriptionPlans: () => api.get('/admin/subscription-plans'),
  updateSubscriptionPlan: (id, data) => api.put(`/admin/subscription-plans/${id}`, data),
};

export default api;