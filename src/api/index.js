import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
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
      // Проверяем, не находимся ли мы на странице QR-верификации
      if (!window.location.pathname.includes('/qr/verify')) {
        // Только в этом случае делаем редирект на регистрацию
        window.location.href = '/registration';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/registration', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.post('/auth/update_profile', data),
};

export const teamAPI = {
  create: (data) => api.post('/auth/command/create', data),
  leave: () => api.post('/auth/command/leave'),
  delete: () => api.post('/auth/command/delete'),
  removeUser: (userId) => api.post('/auth/command/remove_user', { user_id: userId }),
  join: (token) => api.post('/auth/command/join', { token }),
};

// Добавляем методы для работы с QR
export const qrAPI = {
  verify: (token) => api.post('/auth/qr/verify', { token }),
  generate: () => api.get('/auth/qr/generate'),
};

export default api; 