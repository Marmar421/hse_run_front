<template>
  <div class="profile-view">
    <HomeHeader />
      <div class="header-actions">
      </div>
    
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-if="userData" class="profile-content">
      <h2 class="profile-title">{{ $t('profile.title') }}</h2>
      
      <!-- Основной блок с личной информацией -->
      <ProfileMain :userData="userData" />
      
      <!-- Блок с дополнительной персональной информацией -->
      <ProfileInfo :userData="userData" @update="fetchUserData" />
      
      <!-- Блок с информацией о команде -->
      <ProfileTeam 
        :team="userData.team" 
        :username="userData.full_name"
        @createTeam="createTeam" 
        @leaveTeam="leaveTeam" 
        :error="teamError" 
      />
    </div>
    
    <div class="logout-container">
      <button @click="logout" class="logout-btn-bottom">{{ $t('profile.logout') }}</button>
    </div>
  </div>
</template>

<script>
import HomeHeader from '@/components/Home/HomeHeader.vue';
import ProfileMain from '@/components/Profile/ProfileMain.vue';
import ProfileInfo from '@/components/Profile/ProfileInfo.vue';
import ProfileTeam from '@/components/Profile/ProfileTeam.vue';
import LanguageSwitcher from '@/components/UI/LanguageSwitcher.vue';

export default {
  name: 'ProfileView',
  components: {
    ProfileMain,
    ProfileInfo,
    ProfileTeam,
    LanguageSwitcher,
    HomeHeader,
  },
  data() {
    return {
      loading: true,
      error: null,
      userData: null,
      teamError: null
    };
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        this.loading = true;
        const res = await fetch('/api/auth/me/');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || 'Ошибка загрузки данных');
        }
        this.userData = await res.json();
        this.loading = false;
      } catch (e) {
        console.error('Ошибка при получении данных пользователя:', e);
        this.error = null;
        this.loading = false;
        
        this.userData = {
          id: 1,
          full_name: 'Пупкин Василий Васильевич',
          telegram_username: 'vasilypupkin',
          birth_date: '1990-01-01',
          work_place: 'НИУ ВШЭ',
          team: {
            id: 1,
            name: 'Ананасики',
            members_count: 2,
            captain_id: 1
          }
        };
      }
    },
    
    async logout() {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        this.$router.push('/');
      } catch (error) {
        this.error = 'Ошибка при выходе из системы';
      }
    },
    
    async createTeam(teamName) {
      this.teamError = null;
      try {
        const response = await fetch('/api/teams/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: teamName })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Ошибка при создании команды');
        }
        
        this.fetchUserData(); // Обновляем данные для отображения созданной команды
        return true;
      } catch (error) {
        this.teamError = error.message;
        return false;
      }
    },
    
    async leaveTeam() {
      if (!this.userData.team) return;
      
      try {
        const response = await fetch(`/api/teams/${this.userData.team.id}/leave`, {
          method: 'POST'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Ошибка при выходе из команды');
        }
        
        this.fetchUserData(); // Обновляем данные
        return true;
      } catch (error) {
        this.teamError = error.message;
        return false;
      }
    }
  }
};
</script>

<style scoped>
.profile-view {
  padding: 0 0 30px 0;
  max-width: 1600px;
  margin: 0 auto;
}

h1 {
  color: #4369AC;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 20px;
}

.profile-title {
  text-align: center;
  color: #4369AC;
  margin: 20px 0;
  font-size: 28px;
}

.back-link {
  color: #4369AC;
  text-decoration: none;
  font-weight: 500;
}

.logout-btn, .logout-btn-bottom {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.logout-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.logout-btn-bottom {
  font-size: 16px;
  padding: 10px 20px;
}

.profile-content {
  padding: 0 20px;
}

.loading {
  text-align: center;
  padding: 40px 0;
  font-size: 18px;
  color: #666;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 4px;
  margin: 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    padding: 10px;
  }
  
  h1 {
    margin-bottom: 10px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>