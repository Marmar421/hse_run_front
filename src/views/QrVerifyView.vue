<template>
  <div class="container">
    <h1>QR-код</h1>
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
    <GuestMessage v-if="guestMessage" :message="guestMessage" />
    
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
      :show-help="true"
      :show-retry="showRetryButton"
      @retry="retry"
    />
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
    StatusDisplay
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
      showRetryButton: false,
      isJoining: false
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
  methods: {
    async verifyToken() {
      if (!this.token) return;
      
      try {
        // Показываем состояние загрузки
        this.statusText = 'Проверка токена...';
        this.statusColor = '#fff3cd'; // Желтый фон
        this.errorMessage = null;
        this.guestMessage = null;
        this.showJoinBox = false;
        this.showRetryButton = false;

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
        this.showRetryButton = true;
        
        // Общее сообщение об ошибке
        let errorMessage = 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.';
        
        // Проверяем, не связана ли ошибка с истечением срока действия токена
        if (error.message && (
          error.message.includes('401') || 
          error.message.includes('Unauthorized')
        )) {
          errorMessage = 'Срок действия ссылки истек или QR-код недействителен. Пожалуйста, получите новую ссылку в профиле.';
          this.handleUnauthorizedError();
          return;
        }
        
        // Если это 500 ошибка - серверная ошибка
        if (error.message && error.message.includes('500')) {
          errorMessage = 'Произошла ошибка на сервере. Пожалуйста, обратитесь к организаторам.';
        }
        
        this.errorMessage = errorMessage;
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
      this.showRetryButton = true;
    },
    
    async handleExpiredToken(response) {
      this.statusText = 'Ошибка';
      this.statusColor = '#f8d7da'; // Красный фон
      
      // Пробуем получить текст ошибки
      const result = response.data;
      this.errorMessage = result?.detail || 'Срок действия QR-кода или ссылки истек. Пожалуйста, получите новую ссылку в профиле.';
      
      // Проверяем, связана ли ошибка с неавторизованным пользователем
      this.checkForAuthErrors(result?.detail, response.status);
    },
    
    handleUnauthorizedError(response = null) {
      this.statusText = 'Ошибка';
      this.statusColor = '#f8d7da'; // Красный фон
      
      this.errorMessage = 'Для продолжения необходимо авторизоваться. Сейчас вы будете перенаправлены на страницу регистрации.';
      // Перенаправление через 3 секунды
      setTimeout(() => {
        this.$router.push('/register');
      }, 3000);
    },
    
    checkForAuthErrors(errorMessage, statusCode) {
      if (statusCode === 401 || 
          (errorMessage && (
            errorMessage.includes('Unauthorized') || 
            errorMessage.includes('unauthorized') || 
            errorMessage.includes('авторизац') ||
            errorMessage.includes('Необходима авторизация') ||
            errorMessage.includes('login') ||
            errorMessage.includes('войти')
          ))
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
        this.showRetryButton = true;
      }
    },
    
    determineUserView() {
      if (!this.qrData) return;
      
      // Если пользователь уже в команде - показать сообщение об этом
      if (this.qrData.scanner_is_in_team) {
        this.guestMessage = "Вы уже состоите в команде и не можете присоединиться к другой";
        return;
      }
      
      // Если можно присоединиться к команде (для любой роли)
      if (this.qrData.can_join) {
        // Показываем кнопку присоединения
        this.showJoinBox = true;
        return;
      }
      
      // Если успешно добавились в команду
      if (this.qrData.message === "Вы успешно добавлены в команду") {
        this.guestMessage = this.qrData.message;
        return;
      }
      
      // Для ошибок и других сообщений
      if (this.qrData.message) {
        this.guestMessage = this.qrData.message;
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
          this.guestMessage = 'Вы успешно присоединились к команде!';
          this.showJoinBox = false;
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
    },
    
    retry() {
      this.errorMessage = null;
      this.showRetryButton = false;
      this.verifyToken();
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.result-container {
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 480px) {
  .container {
    padding: 10px;
  }
}
</style> 