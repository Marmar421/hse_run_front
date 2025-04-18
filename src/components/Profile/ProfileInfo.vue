<template>
  <div class="profile-info">
    <div class="profile-card">
      <div class="profile-header">
        <h3>{{ $t('profile.personalInfo') }}</h3>
        <button @click="toggleEditMode" class="edit-btn">
          <transition name="fade" mode="out-in">
            <img v-if="!isEditing" key="edit" src="@/assets/images/edit-button-84380.svg" alt="Редактировать" class="edit-icon">
            <img v-else key="verify" src="@/assets/images/verification.svg" alt="Подтвердить" class="edit-icon" style="width: 24px; height: 24px;">
          </transition>
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
        
        <!-- Дополнительная информация инсайдера -->
        <template v-if="isInsider">
          <p v-if="!isEditing">
            {{ $t('profile.studentOrganization') || 'Студенческая организация' }}: 
            <span>{{ (userData.insider_info && userData.insider_info.student_organization) || $t('profile.notSpecified') }}</span>
          </p>
          <p v-else class="edit-field">
            {{ $t('profile.studentOrganization') || 'Студенческая организация' }}: 
            <input 
              type="text" 
              v-model="editedStudentOrganization" 
              :placeholder="$t('profile.studentOrganization') || 'Студенческая организация'"
            >
          </p>
          
          <p v-if="!isEditing">
            {{ $t('profile.geoLink') || 'Ссылка на 2ГИС' }}: 
            <span v-if="userData.insider_info && userData.insider_info.geo_link">
              <a :href="userData.insider_info.geo_link" target="_blank" class="geo-link">{{ userData.insider_info.geo_link }}</a>
            </span>
            <span v-else>{{ $t('profile.notSpecified') }}</span>
          </p>
          <p v-else class="edit-field">
            {{ $t('profile.geoLink') || 'Ссылка на 2ГИС' }}: 
            <input type="text" v-model="editedGeoLink">
          </p>
        </template>
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
      editedStudentOrganization: '',
      editedGeoLink: '',
      isSaving: false
    };
  },
  computed: {
    isInsider() {
      return this.userData && this.userData.role && this.userData.role.name === 'insider';
    }
  },
  watch: {
    userData: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.editedFullName = newValue.full_name || '';
          
          // Инициализируем поля инсайдера, если они есть
          if (newValue.insider_info) {
            this.editedStudentOrganization = newValue.insider_info.student_organization || '';
            this.editedGeoLink = newValue.insider_info.geo_link || '';
          }
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
      const noChanges = this.editedFullName === this.userData.full_name && 
        (!this.isInsider || (
          this.editedStudentOrganization === (this.userData.insider_info?.student_organization || '') &&
          this.editedGeoLink === (this.userData.insider_info?.geo_link || '')
        ));
      
      if (noChanges) {
        // Если данные не изменились, просто выходим из режима редактирования
        this.isEditing = false;
        return;
      }
      
      this.isSaving = true;
      try {
        // Подготавливаем данные для отправки
        const updateData = { full_name: this.editedFullName };
        
        // Если пользователь - инсайдер, добавляем дополнительные поля
        if (this.isInsider) {
          updateData.student_organization = this.editedStudentOrganization;
          updateData.geo_link = this.editedGeoLink;
        }
        
        const response = await fetch('/api/auth/update_profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || this.$t('profile.error'));
        }
        
        // Обновляем локальные данные
        const updatedData = {
          full_name: this.editedFullName
        };
        
        if (this.isInsider) {
          updatedData.insider_info = {
            student_organization: this.editedStudentOrganization,
            geo_link: this.editedGeoLink
          };
        }
        
        // Оповещаем родительский компонент об изменениях
        this.$emit('update', updatedData);
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

.geo-link {
  color: #389ce9;
  text-decoration: underline;
  word-break: break-all;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
