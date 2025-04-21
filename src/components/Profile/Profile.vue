<template>
  <LogoComponent />   
  <div class="profile-container">
    <div class="container">   
      <h2>{{ $t('profile.title') }}</h2>
      <div v-if="isOrganizer" class="admin-panel-container">
        <a href="/admin" class="admin-btn">{{ $t('profile.adminPanel') }}</a>
      </div>
      <!-- Главная информация о пользователе -->
      <ProfileMain 
        v-if="userData" 
        :userData="userData" 
        :qrCodeData="!isInsider ? qrCodeData : null"
        :qrLink="!isInsider ? qrLink : null"
        @copy-qr-link="copyQrLink"
      />
      
      <!-- Личная информация и QR-код -->
      <ProfileInfo 
        v-if="userData" 
        :userData="userData" 
        :qrCodeData="!isInsider ? qrCodeData : null" 
        :qrLink="!isInsider ? qrLink : null" 
        @update="updateUserData" 
      />
      
      <!-- Информация о команде или форма создания -->
      <ProfileTeam 
        v-if="userData && isNotInsider" 
        :team="userTeam" 
        :userData="userData" 
        :qrLink="qrLink" 
        :isLookingForTeam="isLookingForTeam"
        @copy-qr-link="copyQrLink" 
        @update="updateUserData" 
        @team-created="fetchUserData" 
        @team-deleted="fetchUserData" 
        @team-left="fetchUserData"
        @team-updated="fetchUserData"
        @toggle-looking-status="toggleLookingStatus"
      />
    </div>
    <a @click="logout" class="logout-btn">{{ $t('profile.logout') }}</a>
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
      qrLink: null,
      isLookingForTeam: false
    };
  },
  computed: {
    isOrganizer() {
      return this.userData?.role?.name === 'organizer';
    },
    isNotInsider() {
      return this.userData?.role?.name !== 'insider';
    },
    isInsider() {
      return this.userData?.role?.name === 'insider';
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

        if (!userRes.ok || !qrRes.ok) throw new Error(this.$t('profile.error'));

        this.userData = await userRes.json();
        this.qrCodeData = await qrRes.json();
        
        this.qrLink = this.qrCodeData.qr_link;
        this.isLookingForTeam = !!this.userData.is_looking_for_friends;
        
        // Обрабатываем данные о команде
        if (this.userData.commands && this.userData.commands.length > 0) {
          console.log('Обновление userTeam из fetchUserData');
          this.userTeam = this.userData.commands[0];
        } else {
          this.userTeam = null;
        }
        
        console.log('Данные загружены');
      } catch (error) {
        console.error(this.$t('profile.error') + ':', error);
        this.$router.push('/registration');
      }
    },
    
    // Обработчики действий пользователя
    async logout() {
      try {
        await this.makeRequest('/api/auth/logout', 'POST');
        this.$router.push('/');
      } catch (error) {
        console.error(this.$t('profile.logoutError') + ':', error);
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
        
        alert(this.$t('profile.linkCopied'));
      } catch (error) {
        console.error('Ошибка при копировании ссылки:', error);
        alert('Не удалось скопировать ссылку: ' + error.message);
      }
    },
    
    // Обновляем данные в родительском компоненте
    updateUserData(updatedData) {
      // Клонируем текущие данные
      const newUserData = { ...this.userData };
      
      // Обновляем ФИО
      if (updatedData.full_name) {
        newUserData.full_name = updatedData.full_name;
      }
      
      // Обновляем информацию инсайдера, если она есть
      if (updatedData.insider_info && newUserData.role && newUserData.role.name === 'insider') {
        // Если у пользователя еще нет объекта insider_info, создаем его
        if (!newUserData.insider_info) {
          newUserData.insider_info = {};
        }
        
        // Обновляем поля
        if (updatedData.insider_info.student_organization !== undefined) {
          newUserData.insider_info.student_organization = updatedData.insider_info.student_organization;
        }
        
        if (updatedData.insider_info.geo_link !== undefined) {
          newUserData.insider_info.geo_link = updatedData.insider_info.geo_link;
        }
      }
      
      // Устанавливаем обновленные данные
      this.userData = newUserData;
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
        throw new Error(errorData.detail || this.$t('profile.error'));
      }
      
      return response.json();
    },
    
    // Метод переключения статуса поиска команды
    async toggleLookingStatus() {
      try {
        const response = await this.makeRequest('/api/auth/toggle_looking_for_team', 'POST');
        this.isLookingForTeam = response.is_looking_for_friends;
        this.userData = { ...this.userData, is_looking_for_friends: this.isLookingForTeam };
      } catch (error) {
        console.error('Ошибка при изменении статуса поиска:', error);
      }
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
