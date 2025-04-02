<template>
  <div>
    <h1>HSE RUN</h1>
    <router-link to="/">Назад</router-link>
    <div class="container">
      <div class="team-stats">
        <span>Счёт: <span>{{ teamScore }}</span></span>
        <span>Монеты: <span>{{ teamCoins }}</span></span>
        <button @click="showQR" style="margin-left: 20px;">Мой QR-код</button>
      </div>

      <!-- Модальное окно для QR-кода -->
      <div class="qr-modal" v-if="qrModalVisible">
        <div class="qr-modal-content">
          <img :src="qrImageSrc" alt="QR Code">
          <button @click="closeQR">Закрыть</button>
        </div>
      </div>

      <h2>Квест</h2>
      <div class="blocks-grid">
        <div 
          v-for="block in blocks" 
          :key="block.id" 
          class="block"
          :style="block.progress === 100 ? 'background-color: #e8f5e9; border: 1px solid #c8e6c9;' : ''"
        >
          <button @click="startBlock(block.id)">{{ block.title }}</button>
          <div class="progress-container">
            <div 
              class="progress-bar" 
              :style="`width: ${block.progress || 0}%; background-color: #2196f3;`"
            ></div>
          </div>
          <div class="progress-text">
            {{ block.progress || 0 }}% ({{ block.solved_count || 0 }}/{{ block.total_count || 0 }})
          </div>
          <div class="progress-container" style="margin-top: 5px;">
            <div 
              class="progress-bar" 
              :style="`width: ${(block.insider_count / block.total_count) * 100 || 0}%; background-color: #f44336;`"
            ></div>
          </div>
          <div class="progress-text" style="color: #f44336;">
            Посещено: {{ block.insider_count || 0 }}/{{ block.total_count || 0 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestComponent',
  data() {
    return {
      blocks: [],
      teamScore: 0,
      teamCoins: 0,
      qrModalVisible: false,
      qrImageSrc: '',
    }
  },
   created() {
     this.fetchUserData()
    
     // Обновление данных при возвращении на страницу
     document.addEventListener('visibilitychange', this.handleVisibilityChange)
   },
   beforeUnmount() {
     // Очистка слушателя событий
     document.removeEventListener('visibilitychange', this.handleVisibilityChange)
   },
  methods: {
    async fetchUserData() {
      try {
        const res = await fetch('/api/quest')
        if (!res.ok) throw new Error('Ошибка сервера')
        
        const data = await res.json()
        this.blocks = data.blocks
        this.teamScore = data.team_score
        this.teamCoins = data.team_coins
      } catch (e) {
        // При ошибке перенаправляем на страницу регистрации
        this.$router.push('/registration')
      }
    },
    
    startBlock(blockId) {
      this.$router.push(`/quest/${blockId}`)
    },
    
    handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        this.fetchUserData()
      }
    },
    
    async showQR() {
      try {
        const response = await fetch('/api/auth/qr')
        if (!response.ok) throw new Error('Ошибка загрузки QR-кода')
        
        const qrData = await response.json()
        this.qrImageSrc = 'data:image/png;base64,' + qrData.qr_image
        this.qrModalVisible = true
      } catch (error) {
        alert('Ошибка при загрузке QR-кода')
      }
    },
    
    closeQR() {
      this.qrModalVisible = false
    }
  }
}
</script>

<style scoped>
.block {
  width: 300px;
  margin: 10px auto;
  padding: 10px;
}

.block button {
  width: 100%;
  padding: 8px;
  margin-bottom: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.progress-container {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 3px;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
}

.progress-text {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: 3px;
}

.blocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.qr-modal {
  display: block;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
}

.qr-modal-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.qr-modal-content img {
  max-width: 300px;
}

.qr-modal-content button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.team-stats {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 18px;
}

.team-stats span {
  margin-right: 15px;
}

h1, h2 {
  color: #333;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .blocks-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .block {
    width: 100%;
  }
  
  .qr-modal-content img {
    max-width: 250px;
  }
}

@media (max-width: 480px) {
  .blocks-grid {
    grid-template-columns: 1fr;
  }
  
  .team-stats {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .team-stats button {
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>
