import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user?.username) {
        config.headers['X-Username'] = user.username;
      }
      if (user?.role) {
        config.headers['X-Role'] = user.role;
      }
    } catch (e) {
      // ignore JSON parse error
    }
  }
  return config;
});

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
};

export const customerService = {
  getProfile: async (username) => {
    const res = await api.get('/customers/profile', {
      params: username ? { username } : {},
    });
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/customers/profile', data);
    return res.data;
  },
  submitRequest: async (formData) => {
    const res = await api.post('/requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  getMyRequests: async () => {
    const res = await api.get('/requests/my');
    return res.data;
  },
  getRequestById: async (id) => {
    const res = await api.get(`/requests/${id}`);
    return res.data;
  },
};

export const adminService = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },
  getRequests: async (status) => {
    const res = await api.get('/admin/requests', {
      params: status && status !== 'ALL' ? { status } : {},
    });
    return res.data;
  },
  getRequestById: async (id) => {
    const res = await api.get(`/admin/requests/${id}`);
    return res.data;
  },
  approveRequest: async (id, remarks) => {
    const res = await api.put(`/admin/requests/${id}/approve`, { remarks });
    return res.data;
  },
  rejectRequest: async (id, remarks) => {
    const res = await api.put(`/admin/requests/${id}/reject`, { remarks });
    return res.data;
  },
  getRequestHistory: async (id) => {
    const res = await api.get(`/admin/requests/${id}/history`);
    return res.data;
  },
};

export default api;
