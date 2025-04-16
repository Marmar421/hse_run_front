<template>
  <div class="profile-info">
    <div class="profile-card">
      <div class="profile-header">
        <h3>{{ $t('profile.personalInfo') }}</h3>
        <button @click="toggleEditMode" class="edit-btn">
          <img v-if="!isEditing" src="@/assets/images/edit-button-84380.svg" alt="Редактировать" class="edit-icon">
          <img v-else src="@/assets/images/verification.svg" alt="Подтвердить" class="edit-icon" style="width: 24px; height: 24px;">
        </button>
      </div>
      
      <div class="info-display">
        <p v-if="!isEditing">
          {{ $t('profile.fullName') }}: <span>{{ userData.full_name || $t('profile.notSpecified') }}</span>
        </p>
        <p v-else class="edit-field">
          {{ $t('profile.fullName') }}: <input 
            type="text" 
            v-model="editedFullName" 
            :placeholder="$t('profile.fullName')"
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileInfo',
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
      editedFullName: '',
      isSaving: false
    };
  },
  watch: {
    userData: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.editedFullName = newValue.full_name || '';
        }
      }
    }
  },
  methods: {
    toggleEditMode() {
      if (this.isEditing) {
        // Если уже в режиме редактирования, то сохраняем данные
        this.saveChanges();
      } else {
        // Иначе переходим в режим редактирования
        this.isEditing = true;
      }
    },
    
    async saveChanges() {
      if (this.isSaving) return;
      
      // Проверяем, были ли внесены изменения
      if (this.editedFullName === this.userData.full_name) {
        // Если данные не изменились, просто выходим из режима редактирования
        this.isEditing = false;
        return;
      }
      
      this.isSaving = true;
      try {
        const response = await fetch('/api/auth/update_profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name: this.editedFullName })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || this.$t('profile.error'));
        }
        
        // Оповещаем родительский компонент об изменениях
        this.$emit('update', { full_name: this.editedFullName });
        this.isEditing = false;
      } catch (error) {
        alert(`${this.$t('profile.error')}: ${error.message}`);
      } finally {
        this.isSaving = false;
      }
    }
  }
};
</script>

<style scoped>
@import './ProfileStyles.css';
.edit-icon {
  height: 20px;
  width: 20px;
  transition: transform 0.2s ease;
}

.edit-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.edit-icon:hover, .edit-btn:hover {
  transform: scale(1.1);
}

/* Специфичные стили только для этого компонента */
.profile-info {
  margin-bottom: 30px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.profile-header h3 {
  color: #333;
  margin: 0;
}

.info-display p {
  margin: 8px 0;
  font-size: 16px;
}

.info-display span {
  font-weight: 500;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .edit-field {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .edit-field input {
    margin-left: 0;
    margin-top: 5px;
    width: 100%;
  }
}
</style>
