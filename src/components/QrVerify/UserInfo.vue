<template>
  <div class="user-info">
    <h3>Информация о пользователе</h3>
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
        { key: 'role', label: 'Роль' },
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
</style> 