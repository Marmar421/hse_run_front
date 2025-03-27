<template>
  <div class="profile-main">
    <!-- Добавляем проверку на загрузку данных -->
    <div v-if="isDataLoaded" class="profile-card">
      <div class="profile-avatar">
        <img :src="userAvatar" alt="Avatar">
      </div>
      
      <div class="profile-details">
        <h3 class="profile-name">{{ userName }}</h3>
        <p class="profile-username">@{{ userUsername }}</p>
        <p class="profile-team">{{ $t('profile.team') }}: {{ teamName }}</p>
      </div>
      
      <div class="profile-qr" @click="showQrModal = true">
        <img :src="qrCodeUrl" alt="QR код">
        <p class="qr-description">Это QR-код для входа на площадку и начисления баллов за программу и квест</p>
      </div>
    </div>

    <!-- Добавляем состояние загрузки -->
    <div v-else class="loading-state">
      {{ $t('common.loading') || 'Загрузка...' }}
    </div>
    
    <!-- Модальное окно для увеличенного QR-кода -->
    <div class="qr-modal" v-if="showQrModal" @click="showQrModal = false">
      <div class="qr-modal-content" @click.stop>
        <button class="close-btn" @click="showQrModal = false">&times;</button>
        <img :src="qrCodeUrl" alt="QR код (увеличенный)">
        <p class="qr-modal-description">Это QR-код для входа на площадку и начисления баллов за программу и квест</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileMain',
  props: {
    userData: {
      type: Object,
      required: true,
      default: () => ({
        full_name: '',
        telegram_username: '',
        avatar: '',
        team: null,
        id: null
      })
    }
  },
  data() {
    return {
      showQrModal: false,
      isDataLoaded: false
    };
  },
  computed: {
    userName() {
      return this.userData?.full_name || 'Имя не указано'
    },
    userUsername() {
      return this.userData?.telegram_username || 'username'
    },
    userAvatar() {
      return this.userData?.avatar || '/default-avatar.png'
    },
    teamName() {
      return this.userData?.team?.name || this.$t('profile.noTeam')
    },
    qrCodeUrl() {
      return this.userData?.id 
        ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=user_id:${this.userData.id}`
        : '';
    }
  },
  watch: {
    userData: {
      immediate: true,
      handler(newValue) {
        this.isDataLoaded = !!newValue && Object.keys(newValue).length > 0;
      }
    }
  },
  mounted() {
    // Проверяем наличие данных при монтировании
    this.isDataLoaded = !!this.userData && Object.keys(this.userData).length > 0;
  }
};
</script>

<style scoped>
.profile-main {
  margin-bottom: 30px;
}

.profile-card {
  display: flex;
  align-items: center;
  background-color: #f0f7ff;
  border: 1px solid #d0e1f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #b8c9e5;
  margin-right: 20px;
  flex-shrink: 0;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-details {
  flex-grow: 1;
}

.profile-name {
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin: 0 0 5px 0;
}

.profile-username {
  font-size: 16px;
  color: #4369AC;
  margin: 0 0 10px 0;
}

.profile-team {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.profile-qr {
  width: 140px;
  height: 140px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer; /* Указывает, что элемент кликабельный */
}

.profile-qr img {
  max-width: 100%;
  max-height: 100%;
}

.qr-description {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-avatar {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .profile-details {
    margin-bottom: 15px;
  }
}

/* Стили для модального окна */
.qr-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.qr-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.qr-modal-content img {
  max-width: 100%;
  max-height: 100%;
  width: 400px;
  height: 400px;
}

.qr-modal-description {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

.loading-state {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #666;
}
</style>