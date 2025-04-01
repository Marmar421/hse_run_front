import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:80/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // для работы с куками
});

// Добавим перехватчики для обработки ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Неавторизован - редирект на страницу логина
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.post('/auth/update_profile', data),
};

export const teamAPI = {
  create: (data) => api.post('/auth/command/create', data),
  leave: () => api.post('/auth/command/leave'),
  delete: () => api.post('/auth/command/delete'),
  removeUser: (userId) => api.post('/auth/command/remove_user', { user_id: userId }),
};

export default api; 