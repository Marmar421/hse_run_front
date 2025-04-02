<template>
  <div class="profile-info">
    <div class="profile-card">
      <div class="profile-header">
        <h3>Личная информация</h3>
        <button @click="toggleEditMode" class="edit-btn">
          {{ isEditing ? 'Сохранить' : 'Редактировать' }}
        </button>
      </div>
      
      <div class="info-display">
        <p v-if="!isEditing">
          ФИО: <span>{{ userData.full_name || 'Не указано' }}</span>
        </p>
        <p v-else class="edit-field">
          ФИО: <input 
            type="text" 
            v-model="editedFullName" 
            placeholder="Введите ваше полное имя"
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
          throw new Error(error.detail || 'Ошибка при сохранении данных');
        }
        
        // Оповещаем родительский компонент об изменениях
        this.$emit('update', { full_name: this.editedFullName });
        this.isEditing = false;
      } catch (error) {
        alert(`Ошибка: ${error.message}`);
      } finally {
        this.isSaving = false;
      }
    }
  }
};
</script>

<style scoped>
.profile-info {
  margin-bottom: 30px;
}

.profile-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.edit-btn {
  background-color: #4369AC;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.info-display p {
  margin: 8px 0;
  font-size: 16px;
}

.info-display span {
  font-weight: 500;
}

.edit-field {
  display: flex;
  align-items: center;
}

.edit-field input {
  margin-left: 8px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  flex: 1;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .edit-btn {
    margin-top: 10px;
  }
  
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
