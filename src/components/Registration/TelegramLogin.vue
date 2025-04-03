<template>
  <div class="telegram-login-wrapper">
    <!-- Сообщение об ошибке -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    
    <!-- Кнопка начала регистрации -->
    <button v-if="!showRegistrationForm" @click="startRegistration" class="register-button">
      Начать регистрацию
    </button>
    
    <!-- Контейнер для виджета Telegram -->
    <div v-if="!showRegistrationForm" class="telegram-login-container">
      <div ref="telegramLogin"></div>
    </div>
    
    <!-- Форма завершения регистрации -->
    <div v-if="showRegistrationForm" class="registration-form-container">
      <h2>Регистрация</h2>
      <form @submit.prevent="completeRegistration">
        <div class="form-group">
          <label for="full-name">ФИО:</label>
          <input type="text" id="full-name" v-model="fullName" required>
        </div>
        <button type="submit" class="register-button">Зарегистрироваться</button>
      </form>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "TelegramLogin",
  data() {
    return {
      errorMessage: null,
      showRegistrationForm: false,
      fullName: '',
      telegramUserData: null
    }
  },
  created() {
    // Проверяем сессию при загрузке компонента
    this.checkSession();
  },
  methods: {
    // Проверка существующей сессии
    async checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          this.$router.push('/profile');
        }
      } catch (e) {
        // Если ошибка, просто продолжаем показ страницы регистрации
        console.log('Нет активной сессии:', e);
      }
    },
    
    // Отображение ошибкиd
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000); // Скрываем ошибку через 5 секунд
    },
    
    // Начало регистрации (загрузка скрипта Telegram)
    startRegistration() {
      this.loadTelegramScript();
    },
    
    // Загрузка скрипта для виджета Telegram Login
    loadTelegramScript() {
      if (window.Telegram && window.Telegram.Login) {
        this.initTelegramWidget();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;
      script.onload = this.initTelegramWidget;
      document.head.appendChild(script);
    },

    // Инициализация виджета Telegram Login
    initTelegramWidget() {
      if (!window.Telegram || !window.Telegram.Login) {
        this.showError("Ошибка загрузки Telegram Login Widget");
        return;
      }

      window.Telegram.Login.auth(
        {
          bot_id: "7190707372", // ID вашего бота
          request_access: "write",
          lang: this.$i18n?.locale || "ru",
          // Используем относительный URL для лучшей поддержки разных окружений
          return_to: window.location.origin + '/auth/telegram'
        },
        this.onTelegramAuth
      );
    },

    // Обработчик данных авторизации из Telegram
    async onTelegramAuth(user) {
      if (!user) {
        this.showError("Не удалось получить данные пользователя");
        return;
      }
      
      console.log(`Logged in as ${user.first_name} ${user.last_name} (ID: ${user.id})`);
      this.telegramUserData = user;
      
      // Сохраняем URL фотографии в localStorage
      if (user.photo_url) {
        localStorage.setItem('telegramPhotoUrl', user.photo_url);
      }
      
      try {
        const res = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        
        const data = await res.json();
        
        if (!res.ok || !data.ok) {
          throw new Error(data.message || 'Ошибка аутентификации');
        }
        
        if (data.user.is_active) {
          // Если пользователь уже активен, перенаправляем в профиль
          this.$router.push('/profile');
        } else {
          // Иначе показываем форму для завершения регистрации
          this.showRegistrationForm = true;
        }
      } catch (error) {
        this.showError(error.message || 'Ошибка при обработке данных');
      }
    },
    
    // Завершение регистрации после заполнения формы
    async completeRegistration() {
      try {
        const res = await fetch('/api/auth/complete-registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name: this.fullName })
        });
        
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Ошибка завершения регистрации');
        }
        
        // Перенаправляем в профиль после успешной регистрации
        this.$router.push('/profile');
      } catch (error) {
        this.showError(error.message || 'Не удалось завершить регистрацию');
      }
    }
  }
};
</script>
  
<style scoped>
.telegram-login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.telegram-login-container {
  margin: 20px 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.register-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #389ce9; /* Цвет Telegram */
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 25px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  max-width: 300px;
}

.register-button:hover {
  background-color: #2d8ad9;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  width: 100%;
  text-align: center;
}

.registration-form-container {
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: #389ce9;
}

h2 {
  color: #4369AC;
  margin-bottom: 20px;
  text-align: center;
}
</style>
