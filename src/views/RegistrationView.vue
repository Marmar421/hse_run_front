<template>
  <div class="registration-container">
    <div class="registration-content">
      <!-- Логотип HSE Run -->
      <div class="logo">
        <img src="@/assets/images/hserun_logo.svg" alt="HSE Run Logo" class="hserun_logo">
      </div>
      
      <!-- Заголовок регистрации -->
      <h1 class="registration-title">Регистрация</h1>
      
      <!-- Адрес -->
      <p class="registration-address">HSE RUN 29</p>
      
      <!-- Кнопка для входа через Telegram -->
      <button class="telegram-button" @click="loginWithTelegram">
        <span class="telegram-icon">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M9.78,18.65L10.06,14.42L17.74,7.5C18.08,7.19 17.67,7.04 17.22,7.31L7.74,13.3L3.64,12C2.76,11.75 2.75,11.14 3.84,10.7L19.81,4.54C20.54,4.21 21.24,4.72 20.96,5.84L18.24,18.65C18.05,19.56 17.5,19.78 16.74,19.36L12.6,16.3L10.61,18.23C10.38,18.46 10.19,18.65 9.78,18.65Z"></path>
          </svg>
        </span>
        <span>Войти через Telegram</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegistrationView',
  methods: {
    loginWithTelegram() {
      // Здесь можно добавить логику для авторизации через Telegram
      console.log('Запрос на авторизацию через Telegram');
    }
  }
}
</script>

<style scoped>
.registration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #F3F3F3;
  padding: 20px;
}

.registration-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;
}

.logo {
  margin-bottom: 40px;
}

.registration-title {
  color: #4369AC;
  font-size: 48px;
  font-weight: 300;
  margin-bottom: 10px;
  text-align: center;
}

.registration-address {
  color: 4369AC;
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 40px;
  text-align: center;
}

.telegram-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #389ce9; /* Цвет Telegram */
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 25px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.telegram-button:hover {
  background-color: #2d8ad9;
}

.telegram-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 480px) {
  .registration-title {
    font-size: 36px;
  }
  
  .registration-address {
    font-size: 20px;
  }
  
  .telegram-button {
    font-size: 16px;
    padding: 10px 20px;
  }
}
</style>