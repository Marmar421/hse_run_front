<template>
  <div 
    class="riddle-block"
    :class="{'insider-visited': riddle.has_insider_attempt}"
  >
    <h3 class="riddle-title" v-html="riddle.title || ''"></h3>
    
    <!-- Если загадка уже отвечена -->
    <template v-if="isAnswered(riddle)">
      <!-- Отображаем координаты как обычный текст -->
      <p v-if="riddle.geo_answered" class="riddle-text">
        <span v-html="riddle.geo_answered"></span> <!-- Координаты без ссылки -->
      </p>
      <!-- Контейнер для иконок-ссылок инсайдеров -->
      <div v-if="riddle.insiderLinks && riddle.insiderLinks.length > 0" class="insider-links-container">
        <!-- Отображаем до 2х иконок -->
        <a 
          v-for="(link, index) in riddle.insiderLinks.slice(0, 2)" 
          :key="index" 
          :href="link" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="insider-icon-link"
        >
          <img 
            :src="index === 0 ? require('@/assets/images/insider1.svg') : require('@/assets/images/insider2.svg')" 
            alt="Местоположение инсайдера"
            width="50" 
            height="50" 
          />
        </a>
      </div>
      <p class="riddle-text">{{ riddle.text_answered || 'Нет данных' }}</p>
      <!-- Используем ImageViewer для отвеченного изображения -->
      <ImageViewer 
        v-if="riddle.image_path_answered && getFileType(riddle.image_path_answered) === 'image'"
        :filePath="riddle.image_path_answered"
        maxWidth="100%"
        @image-click="openImageModal"
        class="riddle-image" />
      <!-- Используем VideoPlayer -->
      <VideoPlayer
        v-else-if="riddle.image_path_answered && getFileType(riddle.image_path_answered) === 'video'"
        :filePath="riddle.image_path_answered"
        maxWidth="100%"
        class="riddle-image" />
      <!-- Используем AudioPlayer -->
      <AudioPlayer
        v-else-if="riddle.image_path_answered && getFileType(riddle.image_path_answered) === 'audio'"
        :filePath="riddle.image_path_answered"
        maxWidth="100%"
        class="riddle-image" />
      <!-- Используем TextViewer -->
      <TextViewer
        v-else-if="riddle.image_path_answered && getFileType(riddle.image_path_answered) === 'document' && riddle.image_path_answered.endsWith('.txt')"
        :filePath="riddle.image_path_answered"
        additionalStyle="max-width: 100%;"
        class="riddle-image" />
      <!-- Используем GenericFileDownloader для остального -->
      <GenericFileDownloader
        v-else-if="riddle.image_path_answered"
        :filePath="riddle.image_path_answered"
        maxWidth="100%"
        class="riddle-image" />
    </template>
    
    <!-- Если загадка не отвечена -->
    <template v-else>
      <!-- Используем HintSection -->
      <HintSection :riddle="riddle" @image-click="openImageModal" />
      <!-- Основной контент загадки (FileViewers) -->
       <ImageViewer 
        v-if="riddle.image_path && getFileType(riddle.image_path) === 'image'"
        :filePath="riddle.image_path"
        maxWidth="100%"
        additionalStyle="display: block; margin: 0 auto 20px;"
        @image-click="openImageModal"
        class="riddle-image" />
       <VideoPlayer
        v-else-if="riddle.image_path && getFileType(riddle.image_path) === 'video'"
        :filePath="riddle.image_path"
        maxWidth="100%"
        additionalStyle="display: block; margin: 0 auto 20px;"
        class="riddle-image" />
       <AudioPlayer
        v-else-if="riddle.image_path && getFileType(riddle.image_path) === 'audio'"
        :filePath="riddle.image_path"
        maxWidth="100%"
        additionalStyle="display: block; margin: 0 auto 20px;"
        class="riddle-image" />
       <TextViewer
        v-else-if="riddle.image_path && getFileType(riddle.image_path) === 'txt'"
        :filePath="riddle.image_path"
        additionalStyle="max-width: 100%; display: block; margin: 0 auto 20px;"
        class="riddle-image" />
       <GenericFileDownloader
        v-else-if="riddle.image_path"
        :filePath="riddle.image_path"
        maxWidth="100%"
        additionalStyle="display: block; margin: 0 auto 20px;"
        class="riddle-image" />
      
      <AnswerForm 
        :riddleId="riddle.id" 
        :disabled="questStore.checkingAnswer"
        @submit-answer="handleRiddleSubmit"
      />
    </template>
    
    <div v-if="riddle.has_insider_attempt" class="insider-badge">Отсканировано инсайдером</div>

    <!-- Модальное окно для просмотра изображений -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="modal-content">
        <span class="modal-close" @click="closeImageModal">&times;</span>
        <img :src="modalImageSrc" class="modal-image" @click="closeImageModal">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useQuestStore } from '@/stores/quest';
import ImageViewer from './FileViewers/ImageViewer.vue'; // Импортируем ImageViewer
import VideoPlayer from './FileViewers/VideoPlayer.vue'; // Импортируем VideoPlayer
import AudioPlayer from './FileViewers/AudioPlayer.vue'; // Импортируем AudioPlayer
import TextViewer from './FileViewers/TextViewer.vue'; // Импортируем TextViewer
import GenericFileDownloader from './FileViewers/GenericFileDownloader.vue'; // Импортируем GenericFileDownloader
import AnswerForm from './AnswerForm.vue'; // Импортируем AnswerForm
import HintSection from './HintSection.vue'; // Импортируем HintSection

const props = defineProps({
  riddle: {
    type: Object,
    required: true
  }
});

const questStore = useQuestStore();

const showImageModal = ref(false);
const modalImageSrc = ref('');

// --- Логика модального окна изображений ---
// openImageModal вызывается событием @image-click от ImageViewer
const openImageModal = (imgSrc) => {
  modalImageSrc.value = imgSrc;
  showImageModal.value = true;
  document.body.style.overflow = 'hidden';
};

const closeImageModal = () => {
  showImageModal.value = false;
  document.body.style.overflow = '';
};

const handleKeyDown = (event) => {
  if (event.key === 'Escape' && showImageModal.value) {
    closeImageModal();
  }
};

onMounted(() => {
  // Удаляем старый обработчик кликов на документе
  document.addEventListener('keydown', handleKeyDown); // Обработчик Escape оставляем
});

onUnmounted(() => {
  // Удаляем старый обработчик кликов на документе
  document.removeEventListener('keydown', handleKeyDown);
});

// --- Логика Загадок ---

const handleRiddleSubmit = async (answer) => {
  const riddleId = props.riddle.id; // Получаем ID из props
  
  try {
    const result = await questStore.checkAnswer(riddleId, answer); // Вызываем action
    if (result.ok && result.isCorrect) {
      console.log(`Riddle ${riddleId}: Correct answer!`);
      // Опционально: Очистка поля ввода теперь может быть в AnswerForm 
      // или можно сгенерировать событие из AnswerForm и очистить здесь.
    } else if (result.ok && !result.isCorrect) {
      alert('Неправильный ответ'); 
    } else {
      alert('Ошибка проверки: ' + (result.message || 'Unknown error'));
    }
  } catch (error) {
    alert('Client-side error checking answer.');
    console.error('Client-side error in handleRiddleSubmit:', error);
  }
};

const isAnswered = (riddle) => {
  // Используем props.riddle внутри компоненты
  return riddle.text_answered || riddle.image_path_answered || riddle.geo_answered;
};

// --- Логика отображения файлов ---
const getFileType = (filePath) => {
   if (!filePath) return 'unknown';
  const extension = filePath.split('.').pop().toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'rtf'];
  
  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  if (audioExtensions.includes(extension)) return 'audio';
  if (extension === 'txt') return 'txt';
  if (documentExtensions.includes(extension)) return 'document';
  return 'unknown';
};

</script>

<style scoped>
/* Стили скопированы из QuestBlocks.vue, относящиеся к .riddle-block и его содержимому */
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

.insider-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  margin-top: 10px;
  text-align: center;
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
  border: 1px solid #4caf50;
}

/* Стили для иконки-ссылки инсайдера (одиночной или в контейнере) */
.insider-icon-link {
  display: inline-block; /* Изменяем на inline-block для размещения в flex */
  margin-top: 8px; 
  line-height: 0; 
}

/* Новый контейнер для ссылок */
.insider-links-container {
  display: flex; /* Ставим иконки в ряд */
  justify-content: center; /* Центрируем по горизонтали */
  gap: 15px; /* Добавляем отступ между иконками */
  width: 100%; /* Занимаем всю ширину для центрирования */
}

/* Стили для модального окна изображения */
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
  z-index: 1000; /* Должно быть выше других элементов */
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
  top: -40px; /* Позиционирование может потребовать подстройки */
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