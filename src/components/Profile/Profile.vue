<template>
  <LogoComponent />   
  <div class="profile-container">
    <div class="container">   
      <h2>Профиль</h2>
      <div v-if="isOrganizer" class="admin-panel-container">
        <a href="/admin" class="admin-btn">Админ-панель</a>
      </div>
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
        @update="updateUserData" 
        @team-created="fetchUserData" 
        @team-deleted="fetchUserData" 
        @team-left="fetchUserData" 
      />
    </div>
    <a @click="logout" class="logout-btn">Выйти</a>
  </div>
</template>

<script>
import ProfileMain from './ProfileMain.vue';
import ProfileInfo from './ProfileInfo.vue';
import ProfileTeam from './ProfileTeam.vue';
import LogoComponent from '@/components/UI/LogoComponent.vue';

export default {
  name: 'Profile',
  components: {
    ProfileMain,
    ProfileInfo,
    ProfileTeam,
    LogoComponent
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
      console.log('Вызов fetchUserData - загрузка данных с сервера');
      try {
        // Загружаем данные пользователя и QR код параллельно
        const [userRes, qrRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/auth/qr')
        ]);

        if (!userRes.ok || !qrRes.ok) throw new Error('Ошибка загрузки данных');

        this.userData = await userRes.json();
        this.qrCodeData = await qrRes.json();
        
        this.qrLink = this.qrCodeData.qr_link;
        
        // Обрабатываем данные о команде
        if (this.userData.commands && this.userData.commands.length > 0) {
          console.log('Обновление userTeam из fetchUserData');
          this.userTeam = this.userData.commands[0];
        } else {
          this.userTeam = null;
        }
        
        console.log('Данные загружены');
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
        // Если это обновление для команды
        if (updates.name || updates.language_id || updates.participants) {
          console.log('Обновление свойств команды:', updates);
          
          // Обновляем свойства команды локально
          if (this.userTeam) {
            this.userTeam = { ...this.userTeam, ...updates };
            
            // Также обновляем команду в userData
            if (this.userData.commands && this.userData.commands.length > 0) {
              this.userData.commands[0] = { ...this.userData.commands[0], ...updates };
            }
          }
        } else {
          // Иначе обновляем данные пользователя
          this.userData = { ...this.userData, ...updates };
        }
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

<style>
@import './ProfileStyles.css';
h2 {
  text-align: center;
}

/* Специфичные стили только для этого компонента */
.admin-panel-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
</style>
