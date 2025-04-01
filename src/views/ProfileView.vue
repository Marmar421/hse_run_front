<template>
  <div class="profile-view">
    <HomeHeader />
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-if="userData" class="profile-content">
      <h2 class="profile-title">{{ $t('profile.title') }}</h2>
      <ProfileMain :userData="userData" />
      <ProfileInfo :userData="userData" @update="fetchUserData" />
      <ProfileTeam 
        :team="userData.team" 
        :username="userData.full_name"
        @createTeam="createTeam" 
        @leaveTeam="leaveTeam" 
        :error="teamError" 
      />
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/api';
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
        const response = await authAPI.getMe();
        this.userData = response.data;
      } catch (error) {
        this.error = error.response?.data?.detail || this.$t('profile.error');
      } finally {
        this.loading = false;
      }
    },
    
    async logout() {
      try {
        await authAPI.logout();
        this.$router.push('/');
      } catch (error) {
        this.error = this.$t('profile.logoutError');
      }
    },

    async createTeam() {
      // Implementation of createTeam method
    },

    async leaveTeam() {
      // Implementation of leaveTeam method
    }
  },
  created() {
    this.fetchUserData();
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
  color: #191A1E;
  margin: 20px 0;
  font-size: 33px;
  font-family: 'InvolveMedium';
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

  .profile-title {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>