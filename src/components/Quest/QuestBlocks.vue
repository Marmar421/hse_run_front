<template>
  <QuestShell :teamScore="teamScore" :teamCoins="teamCoins">
    <button @click="$router.back()" class="back-btn">Назад</button>
    <h2>{{ blockTitle }}</h2>
    
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="riddles-container">
      <div 
        v-for="(riddle, index) in riddles" 
        :key="riddle.id"
        class="riddle-block"
        :class="{'insider-visited': riddle.has_insider_attempt}"
      >
        <h3 class="riddle-title" v-html="riddle.title || ''"></h3>
        
        <!-- Если загадка уже отвечена -->
        <template v-if="isAnswered(riddle)">
          <p v-if="riddle.geo_answered" class="riddle-text" v-html="riddle.geo_answered"></p>
          <p class="riddle-text">{{ riddle.text_answered || 'Нет данных' }}</p>
          <div v-if="riddle.image_path_answered" v-html="createFileHTML(riddle.image_path_answered, '100%')" class="riddle-image"></div>
        </template>
        
        <!-- Если загадка не отвечена -->
        <template v-else>
          <div class="hint-section">
            <button 
              @click="toggleHint(riddle.id, riddle.has_hint ? riddle.hint : '')"
              :class="['hint-button', {'active': riddle.has_hint}]"
              :id="`hint-button-${riddle.id}`"
            >
              {{ 'Подсказка' }}
            </button>
          </div>
          
          <div :id="`hint-container-${riddle.id}`" class="hint-container">
            <div v-if="riddle.has_hint" v-html="createFileHTML(riddle.hint, '100%', 'border: 2px dashed #2196f3;')"></div>
          </div>
          
          <div v-if="riddle.image_path" v-html="createFileHTML(riddle.image_path, '100%', 'display: block; margin: 0 auto 20px;')" class="riddle-image"></div>
          
          <form @submit.prevent="handleRiddleSubmit($event, riddle.id)" class="answer-form">
            <input placeholder="Введите ваш ответ" required class="answer-input">
            <button type="submit" class="submit-button">Ок</button>
          </form>

          <div :id="`hint-error-${riddle.id}`" class="hint-error"></div>
          

        </template>
        
        <div v-if="riddle.has_insider_attempt" class="insider-badge">Отсканировано инсайдером</div>
      </div>
    </div>
    
    <!-- Модальное окно для просмотра изображений -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="modal-content">
        <span class="modal-close" @click="closeImageModal">&times;</span>
        <img :src="modalImageSrc" class="modal-image" @click="closeImageModal">
      </div>
    </div>
  </QuestShell>
</template>

<script>
import QuestShell from './QuestShell.vue'

export default {
  name: 'QuestBlocks',
  components: {
    QuestShell
  },
  data() {
    return {
      blockId: null,
      blockTitle: '',
      riddles: [],
      teamScore: 0,
      teamCoins: 0,
      loading: true,
      error: null,
      showImageModal: false,
      modalImageSrc: ''
    }
  },
  created() {
    this.blockId = this.$route.params.id;
    this.loadBlock();
  },
  mounted() {
    // Добавляем делегированный обработчик кликов на изображения
    document.addEventListener('click', this.handleImageClick);
    // Добавляем обработчик нажатия клавиш для закрытия модального окна
    document.addEventListener('keydown', this.handleKeyDown);
  },
  beforeDestroy() {
    // Удаляем обработчики при уничтожении компонента
    document.removeEventListener('click', this.handleImageClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    
    // Обработчик клика по изображению
    handleImageClick(event) {
      const target = event.target;
      if (target.tagName === 'IMG' && !target.closest('.modal-content')) {
        this.openImageModal(target.src);
      }
    },
    
    // Открыть модальное окно с изображением
    openImageModal(imgSrc) {
      this.modalImageSrc = imgSrc;
      this.showImageModal = true;
      document.body.style.overflow = 'hidden'; // Блокируем прокрутку
    },
    
    // Закрыть модальное окно
    closeImageModal() {
      this.showImageModal = false;
      document.body.style.overflow = ''; // Возвращаем прокрутку
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
        html = '<img src="' + fileSrc + '" style="max-width: ' + maxWidth + '; cursor: pointer; ' + additionalStyle + '">';
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
    },
    
    // Обработчик нажатия клавиш
    handleKeyDown(event) {
      // Закрываем модальное окно при нажатии Escape
      if (event.key === 'Escape' && this.showImageModal) {
        this.closeImageModal();
      }
    }
  }
}
</script>

<style scoped>
.riddles-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0 auto;
  width: 100%;
  max-width: 700px;
  align-self: center;
}

.riddle-block {
  border: 2px solid #ff5252;
  border-radius: 15px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  transition: transform 0.2s ease;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.insider-visited {
  border-color: #4caf50;
}

.riddle-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-top: 0;
  margin-bottom: 3px;
  text-align: center;
  width: 100%;
}

.riddle-text {
  margin: 5px 0;
  text-align: center;
  width: 100%;
}

.riddle-image {
  text-align: center;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 10px 0;
}

.riddle-image img {
  max-width: 90%;
  margin: 0 auto;
  border-radius: 8px;
}

.hint-section {
  margin: 5px 0;
  text-align: center;
  width: 100%;
}

.hint-button {
  font-family: 'Involve', Arial, sans-serif;
  background-color: #f0f0f0;
  color: #555;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  width: 80%;
  max-width: 300px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid #e0e0e0;
}

.hint-button.active {
  background-color: white;
  color: black;
  border: 2px solid #1976d2;
}

.hint-button:hover {
  opacity: 0.9;
}

.hint-container {
  display: none;
  margin: 10px auto;
  border-radius: 5px;
  width: 90%;
  max-width: 600px;
}

.hint-error {
  display: none;
  color: red;
  padding: 10px;
  border: 1px solid red;
  border-radius: 4px;
  margin: 10px 0;
  width: 90%;
  max-width: 600px;
  text-align: center;
}

.answer-form {
  
  display: flex;
  flex-direction: row;
  gap: 5px;
  width: 90%;
  max-width: 600px;
  align-items: center;
}

.answer-input {
  font-family: 'Involve', Arial, sans-serif;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
  text-align: center;
}

.submit-button {
  font-family: 'Involve', Arial, sans-serif;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.submit-button:hover {
  background-color: #3367d6;
}

.insider-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  margin-top: 10px;
  text-align: center;
}

.insider-badge {
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
  border: 1px solid #4caf50;
}

.hint-badge {
  color: #2196f3;
  background-color: rgba(33, 150, 243, 0.1);
  border: 1px solid #2196f3;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
}

.loading {
  color: #666;
}

.error {
  color: #e74c3c;
  border: 1px solid #e74c3c;
}



.back-btn {
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
  margin-bottom: 15px;
}

.back-btn:hover {
  background-color: #3367d6;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-content {
  position: relative;
  background-color: transparent;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: zoomIn 0.3s ease;
}

.modal-close {
  position: absolute;
  top: -40px;
  right: -40px;
  color: white;
  font-size: 36px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1001;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.modal-image {
  max-width: 100%;
  max-height: 90vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

</style>
