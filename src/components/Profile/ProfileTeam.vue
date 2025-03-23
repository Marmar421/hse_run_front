<template>
  <div class="profile-team">
    <div class="team-card">
      <div class="team-header">
        <h3>{{ $t('profile.team') }}</h3>
        <button v-if="team" @click="showSettings = !showSettings" class="settings-button">
          <span>⚙️</span>
        </button>
      </div>
      
      <!-- Если команды нет - показываем форму создания -->
      <div v-if="!team" class="team-creation">
        <p class="no-team-message">{{ $t('profile.noTeamMessage') }}</p>
        
        <form @submit.prevent="handleCreateTeam" class="team-form">
          <div class="form-field">
            <label for="team-name">{{ $t('profile.teamName') }}:</label>
            <input type="text" id="team-name" v-model="teamName" :placeholder="$t('profile.teamNamePlaceholder')" required>
          </div>
          
          <button type="submit" class="create-button">
            {{ $t('profile.createTeam') }}
          </button>
        </form>
        
        <div v-if="error" class="team-error">{{ error }}</div>
      </div>
      
      <!-- Если команда есть - показываем информацию о ней -->
      <div v-else class="team-info">
        <div class="team-details">
          <h4 class="team-name">{{ team.name }}</h4>
          <p class="team-members-count">{{ $t('profile.teamMembers') }}: {{ team.members_count || 0 }}/6</p>
        </div>
        
        <div class="team-members">
          <div v-for="(member, index) in members" :key="index" class="team-member">
            <div class="member-role" v-if="member.is_captain">👑</div>
            <div class="member-name">{{ member.name }}</div>
          </div>
        </div>
        
        <!-- Настройки команды (отображаются по клику на шестеренку) -->
        <div v-if="showSettings" class="team-settings">
          <button @click="confirmLeaveTeam" class="leave-button">
            {{ $t('profile.leaveTeam') }}
          </button>
          
          <div v-if="isCaptain" class="captain-options">
            <button class="invite-button">
              {{ $t('profile.inviteMembers') }}
            </button>
          </div>
        </div>
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
    username: {
      type: String,
      required: true
    },
    error: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      teamName: '',
      showSettings: false,
      members: [] // В реальном приложении здесь будут данные из API
    };
  },
  computed: {
    isCaptain() {
      // Проверка является ли текущий пользователь капитаном
      // В реальном приложении это будет определяться по данным из API
      return this.team && this.team.captain_id === this.userId;
    },
    userId() {
      // Получение ID текущего пользователя 
      // В реальном приложении это будет определяться по данным из API
      return 1;
    }
  },
  watch: {
    team: {
      immediate: true,
      handler(newTeam) {
        if (newTeam) {
          // Тут должна быть загрузка членов команды с сервера
          // Эмулируем данные для примера
          this.members = [
            { name: this.username, is_captain: true },
            { name: 'Пушкин Александр Сергеевич', is_captain: false }
          ];
        }
      }
    }
  },
  methods: {
    async handleCreateTeam() {
      const success = await this.$emit('createTeam', this.teamName);
      if (success) {
        this.teamName = '';
      }
    },
    
    confirmLeaveTeam() {
      const confirmed = confirm(this.$t('profile.confirmLeaveTeam'));
      if (confirmed) {
        this.$emit('leaveTeam');
        this.showSettings = false;
      }
    }
  }
};
</script>

<style scoped>
.profile-team {
  margin-bottom: 30px;
}

.team-card {
  border: 1px solid #d0e1f9;
  border-radius: 8px;
  overflow: hidden;
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f0f7ff;
  border-bottom: 1px solid #d0e1f9;
}

.team-header h3 {
  color: #4369AC;
  margin: 0;
}

.settings-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.team-creation, .team-info {
  padding: 20px;
  background-color: white;
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
  background-color: #4369AC;
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

.team-name {
  font-size: 20px;
  color: #4369AC;
  margin: 0 0 5px 0;
}

.team-members-count {
  color: #666;
  margin: 0;
}

.team-members {
  display: grid;
  gap: 10px;
}

.team-member {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.member-role {
  margin-right: 10px;
}

.team-settings {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.leave-button {
  width: 100%;
  padding: 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

.captain-options {
  margin-top: 10px;
}

.invite-button {
  width: 100%;
  padding: 10px;
  background-color: #4369AC;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .team-member {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .member-role {
    margin-right: 0;
    margin-bottom: 5px;
  }
}
</style>
