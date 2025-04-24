<template>
  <div class="user-info">
    <h3 class="user-info-header">
      <span>Информация о пользователе</span>
      <span v-if="user.role" 
            class="role-badge" 
            :class="{'role-ctc': user.role === 'ctc', 'role-organizer': user.role === 'organizer'}">
        {{ user.role === 'ctc' ? 'CTC' : (user.role === 'organizer' ? 'Организатор' : user.role) }}
      </span>
    </h3>
    <div 
      v-for="field in fields" 
      :key="field.key" 
      class="copy-field" 
      @click="copyToClipboard(getFieldValue(field, user))"
    >
      <strong>{{ field.label }}:</strong> {{ getFieldValue(field, user) }}
      <span class="tooltip">{{ tooltipText }}</span>
    </div>
    <div v-if="copySuccess" class="copy-notification">Скопировано!</div>
  </div>
</template>

<script>
import { QrVerifyFieldsMixin } from '@/mixins/QrVerifyFieldsMixin';

export default {
  name: 'UserInfo',
  mixins: [QrVerifyFieldsMixin],
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'full_name', label: 'Имя' },
        { key: 'telegram_id', label: 'Telegram ID' },
        { key: 'telegram_username', label: 'Telegram Username', defaultValue: 'Не указано' }
      ]
    };
  }
}
</script>

<style scoped>
@import '@/assets/styles/CopyFieldStyles.css';

.user-info {
  margin-bottom: 15px;
  position: relative;
}

/* Стили для заголовка, чтобы разнести текст и значок */
.user-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px; /* Восстанавливаем отступ снизу */
}

/* Стили для значка роли */
.role-badge {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 12px;
  color: white;
  margin-left: 10px;
  vertical-align: middle; /* Выравнивание по центру заголовка */
}

.role-ctc {
  /* background-color: #2c3e50; */ /* Старый стиль */
  background-color: #6f42c1; /* Фиолетовый фон */
  color: #ffc107; /* Желтый текст */
}

.role-organizer {
  background-color: #e74c3c;
}
</style> 