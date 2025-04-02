<template>
  <div class="profile-team">
    <div class="team-card">
      <div class="team-header">
        <h3>Команда</h3>
        <div v-if="team" class="dropdown">
          <button @click="toggleTeamDropdown" class="settings-btn">⚙️</button>
          <div v-show="isTeamDropdownVisible" class="dropdown-content">
            <a v-if="isUserCaptain" href="#" @click.prevent="handleCopyQrLink">Пригласить</a>
            <a v-if="isUserCaptain" href="#" @click.prevent="showEditTeamModal">Редактировать</a>
            <a v-if="isUserCaptain" href="#" @click.prevent="showDeleteTeamModal">Удалить команду</a>
            <a v-if="!isUserCaptain" href="#" @click.prevent="handleLeaveTeam">Выйти из команды</a>
          </div>
        </div>
      </div>
      
      <!-- Если команды нет - показываем форму создания -->
      <div v-if="!team" class="team-creation">
        <p class="no-team-message">У вас нет команды. Создайте свою или присоединитесь к существующей.</p>
        
        <form @submit.prevent="handleCreateTeam" class="team-form">
          <div class="form-field">
            <label for="team-name">Название команды:</label>
            <input type="text" id="team-name" v-model="newTeamName" placeholder="Введите название команды" required>
          </div>
          
          <button type="submit" class="create-button">
            Создать команду
          </button>
        </form>
        
        <div v-if="error" class="team-error">{{ error }}</div>
      </div>
      
      <!-- Если команда есть - показываем информацию о ней -->
      <div v-else class="team-info">
        <div class="team-details">
          <p>Название: <span>{{ team.name }} ({{ team.participants ? team.participants.length : 0 }}/6)</span></p>
          <h4>Участники:</h4>
          <div class="team-participants">
            <p v-for="participant in team.participants" :key="participant.id">
              {{ participant.role === 'captain' ? 'Капитан: ' : '' }}{{ participant.full_name }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно для редактирования команды -->
    <div v-if="isEditTeamModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="hideModals">&times;</span>
        <h3>Редактировать команду</h3>
        <form @submit.prevent="handleEditTeam">
          <label for="edit-team-name">Название команды:</label>
          <input v-model="editedTeamName" type="text" id="edit-team-name" required>
          <h4>Участники команды:</h4>
          <div class="edit-team-participants">
            <div v-for="participant in team.participants" :key="participant.id" class="participant-item">
              {{ participant.role === 'captain' ? 'Капитан: ' : '' }}{{ participant.full_name }}
              <button 
                v-if="isUserCaptain && participant.role !== 'captain' && participant.id !== userData.id" 
                type="button" 
                class="remove-btn" 
                @click="handleRemoveParticipant(participant.id)"
              >✕</button>
            </div>
          </div>
          <button type="submit" class="submit-btn">Сохранить</button>
        </form>
      </div>
    </div>
    
    <!-- Модальное окно для подтверждения удаления команды -->
    <div v-if="isDeleteTeamModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="hideModals">&times;</span>
        <h3>Удалить команду</h3>
        <p>Вы уверены, что хотите удалить команду? Это действие нельзя отменить.</p>
        <button @click="handleDeleteTeam" class="delete-btn">Удалить</button>
        <button @click="hideModals" class="cancel-btn">Отмена</button>
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
    }
  },
  data() {
    return {
      newTeamName: '',
      editedTeamName: '',
      isTeamDropdownVisible: false,
      isEditTeamModalVisible: false,
      isDeleteTeamModalVisible: false,
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
        }
      }
    }
  },
  methods: {
    toggleTeamDropdown(event) {
      event.stopPropagation();
      this.isTeamDropdownVisible = !this.isTeamDropdownVisible;
    },
    
    hideModals() {
      this.isEditTeamModalVisible = false;
      this.isDeleteTeamModalVisible = false;
      this.isTeamDropdownVisible = false;
    },
    
    showEditTeamModal() {
      this.isEditTeamModalVisible = true;
      this.isTeamDropdownVisible = false;
    },
    
    showDeleteTeamModal() {
      this.isDeleteTeamModalVisible = true;
      this.isTeamDropdownVisible = false;
    },
    
    handleCopyQrLink() {
      this.$emit('copy-qr-link');
      this.isTeamDropdownVisible = false;
    },
    
    async handleCreateTeam() {
      try {
        this.error = null;
        await this.makeRequest('/api/auth/command/create', 'POST', {
          name: this.newTeamName
        });
        
        this.$emit('team-created');
        this.newTeamName = '';
      } catch (error) {
        this.error = error.message;
      }
    },
    
    async handleEditTeam() {
      try {
        if (this.editedTeamName === this.team.name) {
          this.hideModals();
          return;
        }
        
        await this.makeRequest('/api/auth/command/rename', 'POST', {
          name: this.editedTeamName
        });
        
        this.hideModals();
        this.$emit('team-updated');
      } catch (error) {
        alert(error.message);
      }
    },
    
    async handleDeleteTeam() {
      try {
        await this.makeRequest('/api/auth/command/delete', 'POST');
        this.hideModals();
        this.$emit('team-deleted');
      } catch (error) {
        alert(error.message);
      }
    },
    
    async handleLeaveTeam() {
      if (confirm('Вы уверены, что хотите выйти из команды?')) {
        try {
          await this.makeRequest('/api/auth/command/leave', 'POST');
          this.$emit('team-left');
        } catch (error) {
          alert(error.message);
        }
      }
    },
    
    async handleRemoveParticipant(userId) {
      if (confirm('Вы уверены, что хотите исключить этого участника из команды?')) {
        try {
          await this.makeRequest('/api/auth/command/remove_user', 'POST', {
            user_id: userId
          });
          
          this.hideModals();
          this.$emit('team-updated');
        } catch (error) {
          alert(error.message);
        }
      }
    },
    
    async makeRequest(url, method, body) {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка запроса');
      }
      
      return response.json();
    }
  }
};
</script>

<style scoped>
.profile-team {
  margin-bottom: 30px;
}

.team-card {
  background-color: #f9f9f9;
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

.dropdown-content {
  position: absolute;
  right: 0;
  background-color: white;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 4px;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
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

.create-button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.team-error {
  margin-top: 10px;
  color: #e74c3c;
  font-size: 14px;
}

.team-details {
  margin-bottom: 20px;
}

.team-participants {
  margin-bottom: 20px;
}

.team-participants p {
  margin: 5px 0;
}

/* Модальные окна */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

.edit-team-participants {
  margin-bottom: 20px;
}

.participant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.remove-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  margin-top: 15px;
  width: 100%;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
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
    flex-direction: column;
    align-items: flex-start;
  }
  
  .remove-btn {
    margin-top: 5px;
  }
}
</style>
