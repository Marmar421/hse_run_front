<template>
  <div class="profile-info">
    <div class="info-card">
      <div class="info-header">
        <h3>{{ $t('profile.personalInfo') }}</h3>
        <button @click="editMode = !editMode" class="edit-button">
          <span>P</span>
        </button>
      </div>
      
      <div class="info-content">
        <div v-if="!editMode" class="info-fields">
          <div class="info-field">
            <label>{{ $t('profile.fullName') }}:</label>
            <span>{{ userData.full_name }}</span>
          </div>
          
          <div class="info-field">
            <label>{{ $t('profile.birthDate') }}:</label>
            <span>{{ userData.birth_date || $t('profile.notSpecified') }}</span>
          </div>
          
          <div class="info-field">
            <label>{{ $t('profile.workPlace') }}:</label>
            <span>{{ userData.work_place || $t('profile.notSpecified') }}</span>
          </div>
        </div>
        
        <form v-else @submit.prevent="savePersonalInfo" class="edit-form">
          <div class="form-field">
            <label for="full-name">{{ $t('profile.fullName') }}:</label>
            <input type="text" id="full-name" v-model="form.full_name" required>
          </div>
          
          <div class="form-field">
            <label for="birth-date">{{ $t('profile.birthDate') }}:</label>
            <input type="date" id="birth-date" v-model="form.birth_date">
          </div>
          
          <div class="form-field">
            <label for="work-place">{{ $t('profile.workPlace') }}:</label>
            <input type="text" id="work-place" v-model="form.work_place">
          </div>
          
          <div class="form-actions">
            <button type="button" @click="cancelEdit" class="cancel-button">
              {{ $t('common.cancel') }}
            </button>
            <button type="submit" class="save-button">
              {{ $t('common.save') }}
            </button>
          </div>
        </form>
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
      editMode: false,
      form: {
        full_name: '',
        birth_date: '',
        work_place: ''
      },
      error: null
    };
  },
  watch: {
    userData: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.form.full_name = newValue.full_name || '';
          this.form.birth_date = newValue.birth_date || '';
          this.form.work_place = newValue.work_place || '';
        }
      }
    }
  },
  methods: {
    cancelEdit() {
      this.editMode = false;
      this.form.full_name = this.userData.full_name || '';
      this.form.birth_date = this.userData.birth_date || '';
      this.form.work_place = this.userData.work_place || '';
    },
    
    async savePersonalInfo() {
      try {
        const response = await fetch('/api/auth/update-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || 'Ошибка при обновлении профиля');
        }
        
        this.editMode = false;
        this.$emit('update'); // Уведомляем родительский компонент о необходимости обновления данных
      } catch (error) {
        this.error = error.message;
      }
    }
  }
};
</script>

<style scoped>
.profile-info {
  margin-bottom: 30px;
}

.info-card {
  border: 1px solid #d0e1f9;
  border-radius: 8px;
  overflow: hidden;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f0f7ff;
  border-bottom: 1px solid #d0e1f9;
}

.info-header h3 {
  color: #4369AC;
  margin: 0;
}

.edit-button {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #4369AC;
  color: white;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
}

.info-content {
  padding: 20px;
  background-color: white;
}

.info-fields {
  display: grid;
  gap: 15px;
}

.info-field {
  display: flex;
  flex-direction: column;
}

.info-field label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.info-field span {
  font-size: 16px;
  color: #333;
}

.edit-form {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.cancel-button {
  padding: 8px 15px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  padding: 8px 15px;
  background-color: #4369AC;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-button, .save-button {
    width: 100%;
  }
}
</style>
