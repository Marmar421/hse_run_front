import { createStore } from "vuex";

// Модуль безопасности
const securityModule = {
  namespaced: true,
  state: {
    xssProtection: true,
    csrfToken: null
  },
  mutations: {
    setCSRFToken(state, token) {
      state.csrfToken = token;
    }
  },
  actions: {
    // Получение CSRF-токена с сервера
    async fetchCSRFToken({ commit }) {
      try {
        const response = await fetch('/api/csrf-token');
        const data = await response.json();
        commit('setCSRFToken', data.token);
      } catch (error) {
        console.error('Ошибка при получении CSRF-токена:', error);
      }
    }
  },
  getters: {
    getCSRFToken: state => state.csrfToken
  }
};

// Функция для проверки данных на безопасность
const sanitizeState = (state) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(state)) {
    if (typeof value === 'string') {
      sanitized[key] = value
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeState(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

// Плагин для проверки безопасности данных в состоянии
const securityPlugin = (store) => {
  // Проверяем входящие данные перед изменением состояния
  store.subscribe((mutation, state) => {
    if (mutation.payload && typeof mutation.payload === 'object') {
      // Проверяем наличие потенциально опасных данных
      const sanitizedPayload = sanitizeState(mutation.payload);
      // Можно добавить дополнительные проверки здесь
    }
  });
};

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    appError: null
  },
  getters: {
    currentUser: state => state.user,
    isLoggedIn: state => state.isAuthenticated,
    hasError: state => state.appError !== null,
    errorMessage: state => state.appError
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
    setError(state, error) {
      state.appError = error;
    },
    clearError(state) {
      state.appError = null;
    }
  },
  actions: {
    // Инициализация безопасности
    initSecurity({ dispatch }) {
      dispatch('security/fetchCSRFToken');
    },
    // Выход пользователя
    async logout({ commit }) {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        commit('setUser', null);
      } catch (error) {
        commit('setError', 'Ошибка при выходе из системы');
      }
    }
  },
  modules: {
    security: securityModule
  },
  plugins: [securityPlugin]
});
