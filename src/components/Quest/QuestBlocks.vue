<template>
  <div>
    <h1>HSE RUN</h1>
    <button class="back-button" @click="goBack">← Назад</button>
    <div class="team-stats">
      <span>Счёт: <span>{{ teamScore }}</span></span>
      <span>Монеты: <span>{{ teamCoins }}</span></span>
      <button @click="showQR" style="margin-left: 20px;">Мой QR-код</button>
    </div>
    <h1>{{ blockTitle }}</h1>
    
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div 
        v-for="(riddle, index) in riddles" 
        :key="riddle.id"
        class="riddle" 
        :style="{
          backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#e0e0e0',
          padding: '20px',
          margin: '10px auto',
          borderRadius: '8px',
          maxWidth: '600px',
          textAlign: 'center',
          border: riddle.has_insider_attempt ? '2px solid #4caf50' : 'none'
        }"
      >
        <h3>{{ riddle.title || 'Загадка' }}</h3>
        
        <!-- Если загадка уже отвечена -->
        <template v-if="isAnswered(riddle)">
          <p v-if="riddle.geo_answered">{{ riddle.geo_answered }}</p>
          <p>{{ riddle.text_answered || 'Нет данных' }}</p>
          <div v-if="riddle.image_path_answered" v-html="createFileHTML(riddle.image_path_answered)"></div>
        </template>
        
        <!-- Если загадка не отвечена -->
    <template v-else>
          <div v-if="riddle.image_path" v-html="createFileHTML(riddle.image_path, '300px', 'display: block; margin: 0 auto 20px;')"></div>
          
          <div style="margin-bottom: 20px;">
            <button 
              @click="toggleHint(riddle.id, riddle.has_hint ? riddle.hint : '')"
              :style="riddle.has_hint ? 'background-color: #4caf50;' : ''"
              :id="`hint-button-${riddle.id}`"
            >
              {{ riddle.has_hint ? 'Показать/скрыть подсказку' : 'Получить подсказку' }}
            </button>
          </div>
          
          <div :id="`hint-container-${riddle.id}`" style="display: none; margin-bottom: 20px;">
            <div v-if="riddle.has_hint" v-html="createFileHTML(riddle.hint, '300px', 'border: 2px dashed #2196f3; padding: 10px;')"></div>
          </div>
          
          <div :id="`hint-error-${riddle.id}`" style="display: none; color: red; padding: 10px; border: 1px solid red; border-radius: 4px; margin-bottom: 20px;"></div>
          
          <form @submit.prevent="handleRiddleSubmit($event, riddle.id)" style="margin-top: 20px;">
            <input placeholder="Введите ваш ответ" required style="padding: 8px; margin-right: 10px;">
            <button type="submit">Проверить ответ</button>
          </form>
    </template>
        
        <div v-if="riddle.has_insider_attempt" style="color: #4caf50; margin-top: 10px;">Отсканировано инсайдером</div>
        <div v-if="riddle.has_hint && !isAnswered(riddle)" style="color: #2196f3; margin-top: 10px;">Подсказка запрошена</div>
      </div>
    </div>
    
    <!-- Модальное окно для QR-кода -->
    <div class="qr-modal" v-if="qrModalVisible">
      <div class="qr-modal-content">
        <img :src="qrImageSrc" alt="QR Code">
        <button @click="closeQR">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestBlocks',
  data() {
    return {
      blockId: null,
      blockTitle: '',
      riddles: [],
      teamScore: 0,
      teamCoins: 0,
      loading: true,
      error: null,
      qrModalVisible: false,
      qrImageSrc: ''
    }
  },
  created() {
    this.blockId = this.$route.params.id;
    this.loadBlock();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    
    // Загрузка блока и загадок
    async loadBlock() {
      try {
        this.loading = true;
        const response = await fetch(`/api/quest/${this.blockId}`);
        
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных блока');
        }
        
        const data = await response.json();
        
        this.blockTitle = data.block.title;
        this.riddles = data.block.riddles || [];
        this.teamScore = data.team_score;
        this.teamCoins = data.team_coins;
        this.loading = false;
      } catch (error) {
        this.error = error.message;
        this.loading = false;
      }
    },
    
    // Проверка ответа на загадку
    async handleRiddleSubmit(event, riddleId) {
      const formElement = event.target;
      const answer = formElement.querySelector('input').value;
      
      try {
        const response = await fetch(`/api/quest/check-answer/${riddleId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answer })
        });
        
        if (!response.ok) {
          throw new Error('Ошибка проверки ответа');
        }
        
        const { isCorrect, updatedRiddle, team_score, team_coins } = await response.json();
        
        if (isCorrect) {
          // Обновляем загадку в списке
          const riddleIndex = this.riddles.findIndex(r => r.id === riddleId);
          if (riddleIndex !== -1) {
            this.riddles.splice(riddleIndex, 1, updatedRiddle);
          }
          
          // Обновляем счёт и монеты
          this.teamScore = team_score;
          this.teamCoins = team_coins;
        } else {
          alert('Неправильный ответ, попробуйте ещё раз');
        }
      } catch (error) {
        alert('Ошибка при проверке ответа: ' + error.message);
      }
    },
    
    // Запрос подсказки
    async requestHint(riddleId) {
      if (!confirm('Вы уверены, что хотите запросить подсказку? Это может повлиять на ваш результат.')) return;
      
      try {
        const response = await fetch(`/api/quest/hint/${riddleId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка запроса подсказки');
        }
        
        const data = await response.json();
        
        if (data.hint) {
          // Обновляем счёт и монеты
          if (data.team_score !== null && data.team_coins !== null) {
            this.teamScore = data.team_score;
            this.teamCoins = data.team_coins;
          }
          
          // Обновляем блок для обновления UI
          await this.loadBlock();
          
          // Показываем подсказку
          this.$nextTick(() => {
            const hintContainer = document.getElementById(`hint-container-${riddleId}`);
            if (hintContainer) {
              hintContainer.style.display = 'block';
            }
          });
        } else {
          this.showHintError(riddleId, 'Подсказка недоступна');
        }
      } catch (error) {
        this.showHintError(riddleId, error.message);
      }
    },
    
    // Отображение ошибки подсказки
    showHintError(riddleId, message) {
      this.$nextTick(() => {
        const errorContainer = document.getElementById(`hint-error-${riddleId}`);
        if (errorContainer) {
          errorContainer.textContent = message;
          errorContainer.style.display = 'block';
          
          // Автоматически скрываем ошибку через 5 секунд
          setTimeout(() => {
            errorContainer.style.display = 'none';
          }, 5000);
        } else {
          alert(message); // Fallback
        }
      });
    },
    
    // Отображение QR-кода
    async showQR() {
      try {
        const response = await fetch('/api/auth/qr');
        if (!response.ok) throw new Error('Ошибка загрузки QR-кода');
        
        const blob = await response.blob();
        this.qrImageSrc = URL.createObjectURL(blob);
        this.qrModalVisible = true;
      } catch (error) {
        alert('Ошибка при загрузке QR-кода');
      }
    },
    
    // Закрытие модального окна с QR-кодом
    closeQR() {
      this.qrModalVisible = false;
    },
    
    // Переключение видимости подсказки
    toggleHint(riddleId, hintPath) {
      // Если подсказка еще не запрошена, запрашиваем ее
      if (!hintPath) {
        this.requestHint(riddleId);
        return;
      }
      
      // Если подсказка уже запрошена, переключаем ее видимость
      this.$nextTick(() => {
        const hintContainer = document.getElementById(`hint-container-${riddleId}`);
        if (hintContainer) {
          hintContainer.style.display = hintContainer.style.display === 'none' ? 'block' : 'none';
        }
      });
    },
    
    // Проверка, была ли дан ответ на загадку
    isAnswered(riddle) {
      return riddle.text_answered || riddle.image_path_answered || riddle.geo_answered;
    },
    
    // Определение типа файла по расширению
    getFileType(filePath) {
      if (!filePath) return 'unknown';
      
      const extension = filePath.split('.').pop().toLowerCase();
      
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
      const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
      const audioExtensions = ['mp3', 'wav', 'ogg', 'aac'];
      const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
      
      if (imageExtensions.includes(extension)) return 'image';
      if (videoExtensions.includes(extension)) return 'video';
      if (audioExtensions.includes(extension)) return 'audio';
      if (documentExtensions.includes(extension)) return 'document';
      
      return 'unknown';
    },
    
    // Создание HTML для отображения файла в зависимости от его типа
    createFileHTML(filePath, maxWidth = '300px', additionalStyle = '') {
      if (!filePath) return '';
      
      const fileType = this.getFileType(filePath);
      const fileSrc = `/static/img/${filePath}`;
      const extension = filePath.split('.').pop().toLowerCase();
      let html = '';
      
      // Создаем HTML в зависимости от типа файла
      if (fileType === 'image') {
        html = '<img src="' + fileSrc + '" style="max-width: ' + maxWidth + '; ' + additionalStyle + '">';
      } else if (fileType === 'video') {
        html = '<video controls style="max-width: ' + maxWidth + '; ' + additionalStyle + '">' +
               '<source src="' + fileSrc + '" type="video/' + extension + '">' +
               'Ваш браузер не поддерживает видео.' +
               '</video>';
      } else if (fileType === 'audio') {
        html = '<audio controls style="max-width: ' + maxWidth + '; width: 100%; ' + additionalStyle + '">' +
               '<source src="' + fileSrc + '" type="audio/' + extension + '">' +
               'Ваш браузер не поддерживает аудио.' +
               '</audio>';
      } else if (fileType === 'document' && extension === 'txt') {
        // Для текстовых файлов создаем простой контейнер
        const safeId = filePath.replace(/[^a-zA-Z0-9]/g, '-');
        html = '<div class="txt-content" id="txt-' + safeId + '" ' +
               'style="white-space: pre-wrap; overflow-x: auto; max-height: 300px; overflow-y: auto; text-align: left; font-family: monospace; ' + additionalStyle + '">' +
               'Загрузка содержимого...' +
               '</div>';
        
        // Добавляем скрипт для загрузки содержимого текстового файла
        setTimeout(() => {
          const txtId = 'txt-' + safeId;
          fetch(fileSrc)
            .then(response => {
              if (!response.ok) throw new Error('Не удалось загрузить файл');
              return response.text();
            })
            .then(text => {
              const contentElement = document.querySelector('#' + txtId);
              if (contentElement) {
                contentElement.textContent = text;
              }
            })
            .catch(error => {
              const contentElement = document.querySelector('#' + txtId);
              if (contentElement) {
                contentElement.textContent = 'Ошибка загрузки: ' + error.message;
              }
            });
        }, 0);
      } else {
        // Для документов и неизвестных типов файлов
        html = '<div style="max-width: ' + maxWidth + '; padding: 15px; border: 1px solid #ddd; border-radius: 5px; text-align: center; ' + additionalStyle + '">' +
               '<a href="' + fileSrc + '" target="_blank" style="text-decoration: none; color: #2196f3;">' +
               '<div style="font-size: 48px; margin-bottom: 10px;">📄</div>' +
               '<div>Открыть файл: ' + filePath + '</div>' +
               '</a>' +
               '</div>';
      }
      
      return html;
    }
  }
}
</script>

<style scoped>
.back-button {
  padding: 8px 16px;
  background-color: #f1f1f1;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px;
  font-size: 16px;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.team-stats {
  display: flex;
  align-items: center;
  margin: 15px;
  font-size: 18px;
}

.team-stats span {
  margin-right: 15px;
}

.team-stats button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.team-stats button:hover {
  background-color: #0056b3;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #e74c3c;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

h1 {
  text-align: center;
  color: #333;
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

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .riddle {
    width: 90%;
  }
  
  .qr-modal-content img {
    max-width: 250px;
  }
  
  .team-stats {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
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
