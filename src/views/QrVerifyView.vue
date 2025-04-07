<template>
  <div class="qr-page">
    <LogoComponent />
    
    <div class="container">
      <StatusDisplay :status-text="statusText" :status-color="statusColor" />
      
      <div v-if="qrData" class="result-container">
        <!-- Информация о пользователе (для организаторов) -->
        <UserInfo v-if="isOrganizer" :user="qrData.user" />
        
        <!-- Информация о команде (для организаторов) -->
        <CommandInfo v-if="isOrganizer" :command="qrData.command" />
        
        <!-- Для организаторов и инсайдеров -->
        <ParticipantList 
          v-if="isOrganizer || isInsider" 
          :participants="qrData.command.participants" 
        />
        
        <!-- Кнопки действий для организаторов и инсайдеров -->
        <ActionButtons 
          v-if="isOrganizer || isInsider" 
          :is-organizer="isOrganizer" 
          :command-name="qrData.command.name" 
          @change-points="changePoints"
          @mark-attendance="markAttendance"
        />
      </div>
      
      <!-- Сообщение для гостя -->
      <GuestMessage 
        v-if="guestMessage" 
        :message="guestMessage" 
      />
      
      <!-- Подтверждение присоединения -->
      <JoinConfirmation 
        v-if="showJoinBox" 
        :command-name="qrData.command_name" 
        :captain-name="qrData.captain_name"
        :is-joining="isJoining"
        @join="joinTeam"
        @cancel="cancelJoin"
      />
      
      <!-- Сообщение об ошибке -->
      <ErrorMessage 
        v-if="errorMessage" 
        :message="errorMessage"
      />
    </div>
  </div>
</template>

<script>
import { qrAPI, teamAPI } from '@/api';
import UserInfo from '@/components/QrVerify/UserInfo.vue';
import CommandInfo from '@/components/QrVerify/CommandInfo.vue';
import ParticipantList from '@/components/QrVerify/ParticipantList.vue';
import ActionButtons from '@/components/QrVerify/ActionButtons.vue';
import JoinConfirmation from '@/components/QrVerify/JoinConfirmation.vue';
import ErrorMessage from '@/components/QrVerify/ErrorMessage.vue';
import GuestMessage from '@/components/QrVerify/GuestMessage.vue';
import StatusDisplay from '@/components/QrVerify/StatusDisplay.vue';
import LogoComponent from '@/components/UI/LogoComponent.vue';

export default {
  name: 'QrVerifyView',
  components: {
    UserInfo,
    CommandInfo,
    ParticipantList,
    ActionButtons,
    JoinConfirmation,
    ErrorMessage,
    GuestMessage,
    StatusDisplay,
    LogoComponent
  },
  data() {
    return {
      token: null,
      qrData: null,
      statusText: 'Проверка токена...',
      statusColor: '#fff3cd', // Желтый фон
      errorMessage: null,
      guestMessage: null,
      showJoinBox: false,
      isJoining: false,
      redirectTimeout: null,
      redirectCounter: 5,
      redirectInterval: null
    }
  },
  computed: {
    isOrganizer() {
      return this.qrData && this.qrData.scanner_role === 'organizer';
    },
    isInsider() {
      return this.qrData && this.qrData.scanner_role === 'insider';
    }
  },
  created() {
    // Получаем токен из URL
    this.token = this.$route.query.token;
    if (!this.token) {
      this.statusText = 'Ошибка: Токен отсутствует';
      this.statusColor = '#f8d7da'; // Красный фон
      this.errorMessage = 'Токен не был найден в URL. Пожалуйста, убедитесь, что вы используете правильную ссылку или QR-код.';
    } else {
      this.verifyToken();
    }
  },
  beforeDestroy() {
    // Очищаем все таймеры при уничтожении компонента
    this.clearRedirectTimers();
  },
  methods: {
    // Очистка таймеров перенаправления
    clearRedirectTimers() {
      if (this.redirectTimeout) {
        clearTimeout(this.redirectTimeout);
        this.redirectTimeout = null;
      }
      
      if (this.redirectInterval) {
        clearInterval(this.redirectInterval);
        this.redirectInterval = null;
      }
    },
    
    async verifyToken() {
      if (!this.token) return;
      
      try {
        // Показываем состояние загрузки
        this.statusText = 'Проверка токена...';
        this.statusColor = '#fff3cd'; // Желтый фон
        this.errorMessage = null;
        this.guestMessage = null;
        this.showJoinBox = false;

        // Используем qrAPI для проверки токена
        const response = await qrAPI.verify(this.token);
        
        // В случае успешной верификации
        if (response.data.ok) {
          this.handleSuccessfulVerification(response.data);
        } else {
          // В случае ошибки от сервера
          this.handleServerErrorMessage(response.data);
        }
      } catch (error) {
        console.error('Произошла ошибка при выполнении запроса:', error);
        
        // Настраиваем отображение ошибки
        this.statusText = 'Ошибка';
        this.statusColor = '#f8d7da'; // Красный фон
        
        // Получаем данные ответа, если они есть
        const responseData = error.response?.data;
        
        // Если ошибка 403 - требуется авторизация
        if (error.response?.status === 403) {
          this.handleAuthRequired();
          return;
        }
        
        // Если ошибка 401 - недействительный QR-код
        if (error.response?.status === 401) {
          this.statusText = 'Ошибка QR-кода';
          this.errorMessage = responseData?.detail || 
            'Срок действия ссылки истек или QR-код недействителен. Пожалуйста, получите новую ссылку в профиле.';
          return;
        }
        
        // Если это 500 ошибка - серверная ошибка
        if (error.response?.status === 500) {
          this.errorMessage = 'Произошла ошибка на сервере. Пожалуйста, обратитесь к организаторам.';
          return;
        }
        
        // Для других ошибок
        this.errorMessage = 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.';
      }
    },
    
    handleSuccessfulVerification(result) {
      this.statusText = 'Успешно';
      this.statusColor = '#d4edda'; // Зеленый фон
      
      // Сохраняем результат
      this.qrData = result;
      
      // Определяем, какое отображение показать
      this.determineUserView();
    },
    
    handleServerError(response) {
      this.statusText = 'Ошибка';
      this.statusColor = '#f8d7da'; // Красный фон
      
      this.errorMessage = 'Произошла ошибка на сервере. Пожалуйста, обратитесь к организаторам.';
    },
    
    async handleExpiredToken(response) {
      this.statusText = 'Ошибка';
      this.statusColor = '#f8d7da'; // Красный фон
      
      const result = response.data;
      this.errorMessage = result?.detail || 'Срок действия QR-кода или ссылки истек. Пожалуйста, получите новую ссылку в профиле.';
      
      const isQrExpiredError = 
        this.errorMessage.includes('QR') || 
        this.errorMessage.includes('qr') || 
        this.errorMessage.includes('истек') ||
        this.errorMessage.includes('Недействительный') ||
        this.errorMessage.includes('недействительный') ||
        this.errorMessage.includes('Недействительная');
        
      if (!isQrExpiredError) {
        this.checkForAuthErrors(result?.detail, response.status);
      }
    },
    
    handleUnauthorizedError(response = null) {
      this.statusText = 'Ошибка';
      this.statusColor = '#f8d7da'; // Красный фон
      
      let countdown = 5;
      this.errorMessage = `Для продолжения необходимо авторизоваться. Перенаправление через ${countdown}`;
      
      const countdownInterval = setInterval(() => {
        countdown--;
        this.errorMessage = `Для продолжения необходимо авторизоваться. Перенаправление через ${countdown}...`;
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
      
      const currentUrl = window.location.href;
      
      setTimeout(() => {
        this.$router.push(`/registration?redirect_url=${encodeURIComponent(currentUrl)}`);
      }, 5000);
    },
    
    handleAuthRequired() {
      this.statusText = 'Ошибка';
      this.statusColor = '#f8d7da'; // Красный фон
      
      let countdown = 5;
      this.errorMessage = `Для проверки QR-кода необходимо авторизоваться. Перенаправление через ${countdown} секунд...`;
      
      const countdownInterval = setInterval(() => {
        countdown--;
        this.errorMessage = `Для проверки QR-кода необходимо авторизоваться. Перенаправление через ${countdown}...`;
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
      
      const currentUrl = window.location.href;
      
      setTimeout(() => {
        this.$router.push(`/registration?redirect_url=${encodeURIComponent(currentUrl)}`);
      }, 5000);
    },
    
    checkForAuthErrors(errorMessage, statusCode) {
      // Если ошибка не связана с QR-кодом, а просто с авторизацией
      if (statusCode === 401 && 
          errorMessage && 
          !(
            errorMessage.includes('QR') || 
            errorMessage.includes('qr') || 
            errorMessage.includes('истек') || 
            errorMessage.includes('Недействительный') || 
            errorMessage.includes('недействительный') ||
            errorMessage.includes('Недействительная')
          ) && 
          (
            errorMessage.includes('Unauthorized') || 
            errorMessage.includes('unauthorized') || 
            errorMessage.includes('авторизац') ||
            errorMessage.includes('Необходима авторизация') ||
            errorMessage.includes('login') ||
            errorMessage.includes('войти')
          )
      ) {
        this.handleUnauthorizedError();
      }
    },
    
    handleServerErrorMessage(result) {
      this.statusText = result.message || 'Ошибка верификации';
      this.statusColor = '#f8d7da'; // Красный фон
      
      // Если сообщение о том, что пользователь уже в команде
      if (result.message && result.message.includes('уже состоите в')) {
        this.guestMessage = result.message;
      } else {
        // Для других ошибок показываем общий формат ошибки
        this.errorMessage = result.message || 'Неизвестная ошибка при проверке QR-кода';
      }
    },
    
    determineUserView() {
      if (!this.qrData) {
        this.guestMessage = 'Нет данных для отображения';
        return;
      }
      
      if (this.qrData.join_reason) {
        switch(this.qrData.join_reason) {
          case 'already_in_team':
            this.guestMessage = "Вы уже состоите в команде и не можете присоединиться к другой";
            break;
          case 'not_captain':
            this.guestMessage = "Только QR-код капитана команды позволяет присоединиться";
            break;
          case 'team_full':
            this.guestMessage = "В команде уже максимальное количество участников (6/6)";
            break;
          default:
            this.guestMessage = `Невозможно присоединиться к команде. Причина: ${this.qrData.join_reason}`;
        }
        return;
      }
      
      if (this.qrData.can_join) {
        this.showJoinBox = true;
        return;
      }
      
      if (this.qrData.message === "Вы успешно добавлены в команду") {
        this.guestMessage = this.qrData.message;
        return;
      }
      
      if (this.qrData.message) {
        this.guestMessage = this.qrData.message;
      } else {
        this.guestMessage = 'Нет данных для отображения';
      }
    },
    
    async joinTeam() {
      // Блокируем кнопки во время запроса
      this.isJoining = true;
      
      // Показываем индикатор загрузки
      this.statusText = 'Обработка...';
      
      try {
        // Используем fetch вместо API клиента
        const response = await fetch('/api/auth/command/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: this.token }),
          credentials: 'include' // для работы с куками
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Парсим JSON ответ
        const result = await response.json();
        
        if (result.ok) {
          // В случае успешного присоединения
          this.statusText = 'Успешно';
          this.statusColor = '#d4edda'; // Зеленый фон
          this.redirectCounter = 5;
          this.guestMessage = `Вы успешно присоединились к команде! Перенаправление в профиль через ${this.redirectCounter} секунд...`;
          this.showJoinBox = false;
          
          // Запускаем интервал для обновления счетчика
          this.redirectInterval = setInterval(() => {
            this.redirectCounter--;
            this.guestMessage = `Вы успешно присоединились к команде! Перенаправление в профиль через ${this.redirectCounter} секунд...`;
            
            if (this.redirectCounter <= 0) {
              clearInterval(this.redirectInterval);
            }
          }, 1000);
          
          // Запускаем таймер для перенаправления
          this.redirectTimeout = setTimeout(() => {
            this.$router.push('/profile');
          }, 5000);
        } else {
          // В случае ошибки
          this.statusText = 'Ошибка';
          this.statusColor = '#f8d7da'; // Красный фон
          this.errorMessage = result.message || 'Ошибка при присоединении к команде';
          this.showJoinBox = false;
        }
      } catch (error) {
        // Обрабатываем ошибки
        console.error('Ошибка при присоединении к команде:', error);
        
        this.statusText = 'Ошибка';
        this.statusColor = '#f8d7da'; // Красный фон
        this.errorMessage = 'Ошибка при присоединении к команде. Пожалуйста, обратитесь к организаторам.';
        this.showJoinBox = false;
      } finally {
        // В любом случае убираем состояние загрузки
        this.isJoining = false;
      }
    },
    
    cancelJoin() {
      this.showJoinBox = false;
      this.guestMessage = 'Вы отменили присоединение к команде';
    },
    
    changePoints() {
      const points = prompt('Введите количество баллов для команды:');
      if (points !== null && !isNaN(Number(points))) {
        // Здесь будет логика для изменения баллов
        const confirmMessage = `Вы добавляете ${points} баллов команде "${this.qrData.command.name}". Продолжить?`;
        if (confirm(confirmMessage)) {
          // Заглушка для будущего API
          alert(`Функциональность изменения баллов будет добавлена позднее. Вы ввели: ${points} баллов`);
        }
      } else if (points !== null) {
        alert('Пожалуйста, введите корректное число баллов');
      }
    },
    
    markAttendance() {
      const confirmMessage = `Вы собираетесь отметить посещение команды "${this.qrData.command.name}". Продолжить?`;
      if (confirm(confirmMessage)) {
        // Заглушка для будущего API
        alert('Функциональность отметки посещения будет добавлена позднее');
      }
    }
  }
}
</script>

<style scoped>
.qr-page {
  font-family: 'Involve', Arial, sans-serif;
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0 0 30px 0;
  background-image: url('@/assets/images/quest_bg.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.result-container {
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.8);
}

.info-box {
  margin: 15px 0;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
  border-radius: 4px;
}

.info-box p {
  margin: 0;
  font-size: 14px;
}

.debug-info {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px dashed #ccc;
  border-radius: 4px;
}

.debug-info p {
  margin: 0;
  font-family: monospace;
  font-size: 14px;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 480px) {
  .container {
    padding: 10px;
  }
}

@font-face {
  font-family: 'Involve';
  src: url('@/assets/fonts/Involve-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}
</style> 
