<template>
  <div class="profile-main">
    <div v-if="isDataLoaded" class="profile-card">
      <div class="profile-avatar">
        <img :src="userAvatar" alt="Avatar">
      </div>
      
      <div class="profile-details">
        <h3 class="profile-name">{{ userName }}</h3>
        <p class="profile-username">@{{ userUsername }}</p>
        <p class="profile-team">{{ teamName }}</p>
      </div>
      
      <div id="qr-code-container" class="profile-qr" @click="showQrModal = true" v-if="qrCodeData">
        <img :src="'data:image/png;base64,' + qrCodeData.qr_image" alt="QR код">
      </div>
    </div>

    <div v-else class="loading-state">
      Загрузка...
    </div>
    
    <div class="qr-modal" v-if="showQrModal && qrCodeData" @click="showQrModal = false">
      <div class="qr-modal-content" @click.stop>
        <button class="close-btn" @click="showQrModal = false">&times;</button>
        <img :src="'data:image/png;base64,' + qrCodeData.qr_image" alt="QR код (увеличенный)">
        <p class="qr-modal-description">{{ $t('profile.qrdescription') }}</p>
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
      required: true
    },
    qrCodeData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showQrModal: false,
      isDataLoaded: false,
      telegramPhotoUrl: null
    };
  },
  computed: {
    
    userName() {
      return this.userData?.full_name || 'Имя не указано';
    },
    userUsername() {
      return this.userData?.telegram_username || 'username';
    },
    userAvatar() {
      const checkImage = (url) => {
        const img = new Image();
        img.src = url;
        return img.complete && img.naturalHeight !== 0;
      };

      if (this.telegramPhotoUrl && checkImage(this.telegramPhotoUrl)) {
        return this.telegramPhotoUrl;
      }
      if (this.userData?.avatar && checkImage(this.userData.avatar)) {
        return this.userData.avatar;
      }
      return require('@/assets/images/default-avatar.png');
    },
    teamName() {
      if (this.userData?.commands && this.userData.commands.length > 0) {
        return this.userData.commands[0].name;
      }
      return 'Нет команды';
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
    
    // Получаем URL фотографии из localStorage
    this.telegramPhotoUrl = localStorage.getItem('telegramPhotoUrl');
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
  background-color: #F3F3F3;
  border: 2px solid #4369AC;
  border-radius: 25px;
  padding: 20px;
  gap: 25px;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  max-width: 200px;
  max-height: 200px;
  min-width: 150px;
  min-height: 150px;
  border-radius: 8%;
  overflow: hidden;
  background-color: #b8c9e5;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-details {
  flex-grow: 1;
  font-family: 'InvolveMedium';
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.profile-name {
  font-size: 22px;
  font-weight: 500;
  color: #333;
  margin: 0 0 5px 0;
  white-space: nowrap;
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
  max-width: 150px;
  max-height: 150px;
  min-width: 120px;
  min-height: 120px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.profile-qr img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    text-align: center;
    gap: 10px;
    border: 1px solid #4369AC;
  }
  
  .profile-avatar {
    width: 100%;
    height: 100%;
    max-width: 120px;
    max-height: 120px;
    min-width: 100px;
    min-height: 100px;
    border-radius: 20%;
    overflow: hidden;
    background-color: #b8c9e5;
    aspect-ratio: 1/1;
    margin-right: 0;
    margin-bottom: 0;
  }

  .profile-name {
    font-size: 18px;
    font-weight: 500;
    white-space: wrap;
  }

  .profile-username {
    font-size: 16px;
  }

  .profile-team {
    font-size: 16px;
    color: #666;
    margin: 0;
  }
  
  .profile-details {
    margin-bottom: 15px;
    margin-top: 15px;
  }
  
  .profile-qr {
    max-width: 120px;
    max-height: 120px;
    min-width: 100px;
    min-height: 100px;
  }
}

/* Оверлей для модального окна */
.qr-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* полупрозрачный фон */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.qr-modal-content {
  background-color: white;
  padding: 20px;
  position: relative;
  max-width: 90%;
  max-height: 90%;
  /* Центрирование */
  margin: auto;
  /* Анимация появления */
  animation: modalAppear 0.3s ease;
  /* Тень для выделения */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  /* Скругление углов */
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Анимация появления */
@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Для мобильных устройств */
@media (max-width: 768px) {
  .qr-modal-content {
    width: 95%;
    padding: 15px;
  }
}

.qr-modal-content img {
  max-width: 100%;
  max-height: 100%;
  width: 200px;
  height: 200px;
  padding: 20px;
}

.qr-modal-description {
  font-family: 'InvolveMedium';
  font-size: 14px;
  color: #666;
  margin-top: 10px;
  text-align: center;
  white-space: wrap;
  max-width: 400px;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  font-size: 45px;
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