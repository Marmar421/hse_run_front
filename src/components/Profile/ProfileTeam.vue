<template>
  <div class="profile-team">
    <div class="profile-card">
      <div class="team-header">
        <h3>{{ $t('profile.team') }}</h3>
        <div v-if="team" class="dropdown">
          <button v-if="isUserCaptain" @click="handleCopyQrLink" class="settings-btn">
            <img src="@/assets/images/copy.svg" alt="Копировать" class="copy-icon">
          </button>
          <button v-if="isUserCaptain" @click="toggleEditMode" class="edit-btn">
            <transition name="fade" mode="out-in">
              <img v-if="!isEditing" key="edit" src="@/assets/images/edit-button-84380.svg" alt="Редактировать" class="edit-icon">
              <img v-else key="verify" src="@/assets/images/verification.svg" alt="Подтвердить" class="edit-icon" style="width: 24px; height: 24px;">
            </transition>
          </button>
          <button v-if="team && !isUserCaptain" @click="handleLeaveTeam" class="exit-btn">
            <img src="@/assets/images/exit.svg" alt="Выйти из команды" class="exit-icon">
          </button>
        </div>
      </div>
      
      <!-- Если команды нет - показываем форму создания -->
      <div v-if="!team" class="team-creation">
        <p class="no-team-message">{{ $t('profile.noTeam') }}</p>
        
        <form @submit.prevent="handleCreateTeam" class="team-form">
          <div class="form-field">
            <label for="team-name">{{ $t('profile.teamName') }}:</label>
            <input type="text" id="team-name" v-model="newTeamName" :placeholder="$t('profile.enterTeamName')" required>
          </div>
          
          <div class="form-field">
            <label for="team-language">{{ $t('profile.teamLanguage') }}:</label>
            <select id="team-language" v-model.number="selectedLanguage" class="language-select">
              <option :value="1">{{ $t('profile.russian') }}</option>
              <option :value="2">{{ $t('profile.english') }}</option>
            </select>
          </div>
          
          <button type="submit" class="create-button">
            {{ $t('profile.createTeam') }}
          </button>
        </form>
        
        <div v-if="error" class="team-error">{{ error }}</div>
        
        <!-- Статус "Ищу команду" -->
        <div class="looking-status-container">
          <div class="looking-status" :class="{ 'active': isLookingForTeam }">
            <span>{{ $t('profile.lookingForTeam') }}</span>
            <span class="status-indicator">{{ isLookingForTeam ? $t('profile.lookingStatusOn') : $t('profile.lookingStatusOff') }}</span>
          </div>
          <div class="looking-toggle">
            <label class="switch">
              <input type="checkbox" 
                :checked="isLookingForTeam" 
                @change="toggleLookingStatus">
              <span class="slider round"></span>
            </label>
            <span class="toggle-label">{{ $t('profile.showLookingStatus') }}</span>
          </div>
        </div>
      </div>
      
      <!-- Если команда есть - показываем информацию о ней -->
      <div v-else class="team-info">
        <div class="team-details">
          <p v-if="!isEditing">
            <span>{{ $t('profile.teamName') }}: {{ team.name }}</span>
          </p>
          <p v-else class="edit-field">
            {{ $t('profile.teamName') }}: <input 
              type="text" 
              v-model="editedTeamName" 
              :placeholder="$t('profile.enterTeamName')"
            >
          </p>
          
          <p v-if="!isEditing">
            {{ $t('profile.teamLanguage') }}: {{ team.language_id === 1 ? $t('profile.russian') : $t('profile.english') }}
          </p>
          <p v-else class="edit-field">
            {{ $t('profile.teamLanguage') }}: 
            <select v-model.number="editedTeamLanguage">
              <option :value="1">{{ $t('profile.russian') }}</option>
              <option :value="2">{{ $t('profile.english') }}</option>
            </select>
          </p>
          
          <h4>{{ $t('profile.participants') }} ({{ team.participants ? team.participants.length : 0 }}/6):</h4>
          <div class="team-participants">
            <div v-for="(participant, index) in team.participants" :key="participant.id" class="participant-item">
              <p>{{ index + 1 }}. {{ participant.full_name }}{{ participant.role === 'captain' ? ' 👑' : '' }}</p>
              <button 
                v-if="isEditing && isUserCaptain && participant.role !== 'captain' && participant.id !== userData.id" 
                type="button" 
                class="remove-btn" 
                @click="handleRemoveParticipant(participant.id)"
              >✕</button>
            </div>
          </div>
          
          <!-- Статус "Ищу сокомандников" только для капитана при редактировании -->
          <div v-if="isEditing && isUserCaptain" class="looking-status-container">
            <div class="looking-status" :class="{ 'active': isLookingForTeam }">
              <span>{{ $t('profile.lookingForTeammates') }}</span>
              <span class="status-indicator">{{ isLookingForTeam ? $t('profile.lookingStatusOn') : $t('profile.lookingStatusOff') }}</span>
            </div>
            <div class="looking-toggle">
              <label class="switch">
                <input type="checkbox" 
                  :checked="isLookingForTeam" 
                  @change="toggleLookingStatus">
                <span class="slider round"></span>
              </label>
              <span class="toggle-label">{{ $t('profile.showLookingStatus') }}</span>
            </div>
          </div>
          
          <div v-if="isEditing && isUserCaptain" class="edit-actions">
            <button @click="showDeleteTeamModal" class="delete-team-btn">
              {{ $t('profile.deleteTeam') }}
            </button>
          </div>
          
          <div v-if="showCopyNotification" class="copy-notification">
            {{ $t('profile.linkCopied') }}
          </div>
          <div v-if="showCopyError" class="copy-error-notification">
            {{ $t('profile.linkCopyError') }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно для подтверждения удаления команды -->
    <div v-if="isDeleteTeamModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="hideModals">&times;</span>
        <h3>{{ $t('profile.deleteTeam') }}</h3>
        <p>{{ $t('profile.confirmDeleteTeam') }}</p>
        <button @click="handleDeleteTeam" class="delete-btn">{{ $t('profile.delete') }}</button>
        <button @click="hideModals" class="cancel-btn">{{ $t('profile.cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileTeam',
  props: {
    team: {
      type: Object,
      default: null
    },
    userData: {
      type: Object,
      required: true
    },
    qrLink: {
      type: String,
      default: ''
    },
    isLookingForTeam: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newTeamName: '',
      selectedLanguage: this.getDefaultLanguageId(),
      editedTeamName: '',
      editedTeamLanguage: 1,
      isDeleteTeamModalVisible: false,
      isEditing: false,
      isSaving: false,
      showCopyNotification: false,
      showCopyError: false,
      error: null
    };
  },
  computed: {
    isUserCaptain() {
      return this.team && this.team.role === 'captain';
    }
  },
  watch: {
    team: {
      immediate: true,
      handler(newTeam) {
        if (newTeam) {
          this.editedTeamName = newTeam.name || '';
          this.editedTeamLanguage = parseInt(newTeam.language_id) || this.getDefaultLanguageId();
        }
      }
    }
  },
  methods: {
    getDefaultLanguageId() {
      // Получаем текущий язык системы из i18n
      const currentLocale = this.$i18n.locale;
      // Преобразуем код языка в соответствующий ID
      return currentLocale === 'en' ? 2 : 1; // 1 для русского, 2 для английского
    },
    
    hideModals() {
      this.isDeleteTeamModalVisible = false;
    },
    
    toggleEditMode() {
      if (this.isEditing) {
        this.handleEditTeam();
      } else {
        this.isEditing = true;
      }
    },
    
    showDeleteTeamModal() {
      this.isDeleteTeamModalVisible = true;
    },
    
    handleCopyQrLink() {
      if (!this.qrLink) return;
      
      try {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(this.qrLink)
            .then(() => {
              this.showCopyNotification = true;
              this.showCopyError = false;
              
              setTimeout(() => {
                this.showCopyNotification = false;
              }, 3000);
            })
            .catch(error => {
              console.error('Ошибка при копировании:', error);
              this.showCopyError = true;
              
              setTimeout(() => {
                this.showCopyError = false;
              }, 3000);
              
              this.fallbackCopyToClipboard();
            });
        } else {
          // Запасной метод для браузеров без поддержки navigator.clipboard
          this.fallbackCopyToClipboard();
        }
      } catch (error) {
        console.error('Ошибка при копировании ссылки:', error);
        this.showCopyError = true;
        
        setTimeout(() => {
          this.showCopyError = false;
        }, 3000);
      }
    },
    
    fallbackCopyToClipboard() {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = this.qrLink;
        textArea.style.position = 'fixed';  // Чтобы не влиять на вёрстку
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        if (successful) {
          this.showCopyNotification = true;
          this.showCopyError = false;
          
          setTimeout(() => {
            this.showCopyNotification = false;
          }, 3000);
        } else {
          console.error('Не удалось скопировать текст');
          this.showCopyError = true;
          
          setTimeout(() => {
            this.showCopyError = false;
          }, 3000);
        }
        
        document.body.removeChild(textArea);
      } catch (err) {
        console.error('Ошибка при резервном копировании:', err);
        this.showCopyError = true;
        
        setTimeout(() => {
          this.showCopyError = false;
        }, 3000);
      }
    },
    
    async handleCreateTeam() {
      try {
        this.error = null;
        // Преобразуем language_id в число перед отправкой, используя текущее значение
        const languageId = parseInt(this.selectedLanguage) || this.getDefaultLanguageId();
        
        const response = await this.makeRequest('/api/auth/command/create', 'POST', {
          name: this.newTeamName,
          language_id: languageId
        });
        
        // Получаем данные новой команды из ответа и отправляем их в родительский компонент
        // без необходимости полной перезагрузки
        this.$emit('team-created', {
          ...response, // Предполагаем, что API возвращает созданную команду
          name: this.newTeamName,
          language_id: languageId
        });
        
        this.newTeamName = '';
      } catch (error) {
        this.error = error.message;
      }
    },
    
    async handleEditTeam() {
      if (this.isSaving) return;
      
      // Преобразуем значения для корректного сравнения
      const currentLanguageId = parseInt(this.editedTeamLanguage);
      
      if (this.editedTeamName === this.team.name && 
          currentLanguageId === parseInt(this.team.language_id)) {
        this.isEditing = false;
        return;
      }
      
      this.isSaving = true;
      try {
        await this.makeRequest('/api/auth/command/rename', 'POST', {
          name: this.editedTeamName,
          language_id: currentLanguageId // Отправляем как число
        });
        
        // Оповещаем родительский компонент об изменениях
        this.$emit('update', { 
          name: this.editedTeamName, 
          language_id: currentLanguageId 
        });
        
        // Закрываем режим редактирования после успешного запроса
        this.isEditing = false;
      } catch (error) {
        alert(error.message);
        
        // В случае ошибки, возвращаем исходные значения
        this.editedTeamName = this.team.name;
        this.editedTeamLanguage = parseInt(this.team.language_id) || this.getDefaultLanguageId();
      } finally {
        this.isSaving = false;
      }
    },
    
    async handleDeleteTeam() {
      try {
        await this.makeRequest('/api/auth/command/delete', 'POST');
        this.hideModals();
        // Отправляем отдельное событие для удаления команды
        this.$emit('team-deleted');
      } catch (error) {
        alert(error.message);
      }
    },
    
    async handleLeaveTeam() {
      if (confirm(this.$t('profile.leaveTeam') + "?")) {
        try {
          await this.makeRequest('/api/auth/command/leave', 'POST');
          // Отправляем отдельное событие для ухода из команды
          this.$emit('team-left');
        } catch (error) {
          alert(error.message);
        }
      }
    },
    
    async handleRemoveParticipant(participantId) {
      try {
        await this.makeRequest('/api/auth/command/kick', 'POST', {
          participant_id: participantId
        });
        
        // Обновляем список участников локально
        if (this.team && this.team.participants) {
          const updatedParticipants = this.team.participants.filter(
            p => p.id !== participantId
          );
          
          this.$emit('update', { participants: updatedParticipants });
        }
      } catch (error) {
        alert(error.message);
      }
    },
    
    toggleLookingStatus() {
      this.$emit('toggle-looking-status');
    },
    
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
    }
  },
  created() {
    // Инициализация параметров при создании компонента
    this.selectedLanguage = this.getDefaultLanguageId();
  }
};
</script>

<style scoped>
@import './ProfileStyles.css';

h4 {
  margin: 0;
}

/* Стили для переключателей и статуса */
.looking-status-container {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.looking-status {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f5f5f5;
  color: #666;
}

.looking-status.active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-indicator {
  font-size: 12px;
  font-style: italic;
}

.looking-toggle {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.toggle-label {
  margin-left: 10px;
  font-size: 14px;
  color: #666;
}

/* Стили для переключателя (switch) */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #4369AC;
}

input:focus + .slider {
  box-shadow: 0 0 1px #4369AC;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

.copy-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.copy-icon:hover {
  transform: scale(1.1);
}

/* Специфичные стили только для этого компонента */
.profile-team {
  margin-bottom: 30px;
}

.team-card {
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.team-header h3 {
  color: #333;
  margin: 0;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.settings-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.team-creation, .team-info {
  padding: 0;
}

.no-team-message {
  margin-top: 0;
  margin-bottom: 20px;
  color: #666;
}

.team-form {
  display: grid;
  gap: 15px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.form-field input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.language-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.team-error {
  margin-top: 10px;
  color: #C80002;
  font-size: 14px;
}

.team-participants {
  margin-bottom: 20px;
}

.team-participants p {
  margin: 5px 0;
}

.edit-team-participants {
  margin-bottom: 20px;
}

.participant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.participant-item p {
  margin: 0;
}

.remove-btn {
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #C80002;
  transition: transform 0.2s ease;
}

.remove-btn:hover {
  transform: scale(1.2);
}
.cancel-btn {
  margin-left: 5px;
}

.submit-btn {
  margin-top: 15px;
  width: 100%;
  padding: 8px 16px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    padding: 15px;
  }
  
  .participant-item {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
  }
  
  .participant-item p {
    margin: 0;
  }
  
  .remove-btn {
    margin-top: 0;
  }
  
  .edit-field {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .edit-field input, .edit-field select {
    margin-top: 0px;
    width: 100%;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.edit-icon {
  height: 20px;
  width: 20px;
  transition: transform 0.2s ease;
}

.edit-icon:hover, .edit-btn:hover {
  transform: scale(1.1);
}

.exit-btn {
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.exit-icon {
  height: 20px;
  width: 20px;
  transition: transform 0.2s ease;
}

.exit-icon:hover, .exit-btn:hover {
  transform: scale(1.1);
}

.edit-actions {
  margin-top: 15px;
}

.delete-team-btn {
  background-color: #C80002;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.copy-notification {
  margin-top: 15px;
  padding: 10px;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
  text-align: center;
  animation: fadeIn 0.3s, fadeOut 0.5s 2.5s;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.copy-error-notification {
  margin-top: 15px;
  padding: 10px;
  background-color: #ffebee;
  color: #C80002;
  border-radius: 4px;
  text-align: center;
  animation: fadeIn 0.3s, fadeOut 0.5s 2.5s;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
