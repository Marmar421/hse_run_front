<template>
  <div class="profile-container">
    <h1>HSE RUN</h1>
    <router-link to="/" class="back-link">Назад</router-link>
    <div class="container">
      <button @click="logout" class="logout-btn">Выйти</button>
      
      <div v-if="isOrganizer" class="admin-panel-container">
        <a href="/admin" class="admin-btn">Админ-панель</a>
      </div>
      
      <h2>Профиль</h2>
      
      <!-- Главная информация о пользователе -->
      <ProfileMain 
        v-if="userData" 
        :userData="userData" 
        :qrCodeData="qrCodeData"
        :qrLink="qrLink"
        @copy-qr-link="copyQrLink"
      />
      
      <!-- Личная информация и QR-код -->
      <ProfileInfo 
        v-if="userData" 
        :userData="userData" 
        :qrCodeData="qrCodeData" 
        :qrLink="qrLink" 
        @update="updateUserData" 
      />
      
      <!-- Информация о команде или форма создания -->
      <ProfileTeam 
        v-if="userData" 
        :team="userTeam" 
        :userData="userData" 
        :qrLink="qrLink" 
        @copy-qr-link="copyQrLink" 
        @team-created="fetchUserData" 
        @team-updated="fetchUserData" 
        @team-deleted="fetchUserData" 
        @team-left="fetchUserData" 
      />
    </div>
  </div>
</template>

<script>
import ProfileMain from './ProfileMain.vue';
import ProfileInfo from './ProfileInfo.vue';
import ProfileTeam from './ProfileTeam.vue';

export default {
  name: 'Profile',
  components: {
    ProfileMain,
    ProfileInfo,
    ProfileTeam
  },
  data() {
    return {
      userData: null,
      userTeam: null,
      qrCodeData: null,
      qrLink: null
    };
  },
  computed: {
    isOrganizer() {
      return this.userData?.role?.name === 'organizer';
    }
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    // Запрос данных
    async fetchUserData() {
      try {
        // Загружаем данные пользователя и QR код параллельно
        const [userRes, qrRes] = await Promise.all([
          fetch('/api/auth/me/'),
          fetch('/api/auth/qr')
        ]);

        if (!userRes.ok || !qrRes.ok) throw new Error('Ошибка загрузки данных');

        this.userData = await userRes.json();
        this.qrCodeData = await qrRes.json();
        
        this.qrLink = this.qrCodeData.qr_link;
        
        // Обрабатываем данные о команде
        if (this.userData.commands && this.userData.commands.length > 0) {
          this.userTeam = this.userData.commands[0];
        } else {
          this.userTeam = null;
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        this.$router.push('/registration');
      }
    },
    
    // Обработчики действий пользователя
    async logout() {
      try {
        await this.makeRequest('/api/auth/logout', 'POST');
        this.$router.push('/');
      } catch (error) {
        console.error('Ошибка при выходе:', error);
      }
    },
    
    // Метод для копирования QR-кода
    async copyQrLink() {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(this.qrLink);
        } else {
          // Запасной вариант для старых браузеров
          const textArea = document.createElement('textarea');
          textArea.value = this.qrLink;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        
        alert('Ссылка для приглашения скопирована!');
      } catch (error) {
        console.error('Ошибка при копировании ссылки:', error);
        alert('Не удалось скопировать ссылку: ' + error.message);
      }
    },
    
    // Обновление данных пользователя
    updateUserData(updates) {
      if (updates && this.userData) {
        this.userData = { ...this.userData, ...updates };
      }
    },
    
    // Метод для выполнения запросов к API
    async makeRequest(url, method, body) {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка запроса');
      }
      
      return response.json();
    }
  }
};
</script>

<style scoped>
.profile-container {
  font-family: Arial, sans-serif;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2, h3, h4 {
  color: #333;
  margin-bottom: 15px;
}

h1 {
  font-size: 28px;
  text-align: center;
}

h2 {
  font-size: 24px;
  margin-top: 30px;
}

.container {
  position: relative;
}

.back-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 20px;
}

.back-link:hover {
  text-decoration: underline;
}

.logout-btn {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.admin-btn {
  display: inline-block;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 10px;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }
  
  .logout-btn {
    position: static;
    margin-bottom: 15px;
    display: block;
    width: 100%;
  }
}
</style> 