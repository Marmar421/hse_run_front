<template>
  <div class="registration-container">
    <div class="registration-content">
      <!-- Логотип HSE Run -->
      <div class="logo">
        <img src="@/assets/images/hserun_logo.svg" alt="HSE Run Logo" class="hserun_logo">
      </div>
      
      <h1 class="registration-title">{{ $t('registration.title') }}</h1>
      
      <p class="registration-address">{{ $t('registration.address') }}</p>
      
      <TelegramLogin @auth="handleAuth" botName="test_burlak1n_bot"/>

    </div>
  </div>
</template>

<script>
import TelegramLogin from "@/components/Registration/TelegramLogin.vue";

export default {
  name: "RegistrationView",
  components: {
    TelegramLogin,
  },
  methods: {
    handleAuth(user) {
      console.log('Authenticated user:', user);
      // Обработка данных пользователя
    },
  }
};
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
  color: #4369AC;
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 40px;
  text-align: center;
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