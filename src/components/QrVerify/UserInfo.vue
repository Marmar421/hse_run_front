<template>
  <div class="user-info">
    <h3>Информация о пользователе</h3>
    <p><strong>ID:</strong> {{ user.id }}</p>
    <p><strong>Имя:</strong> {{ user.full_name }}</p>
    <p><strong>Роль:</strong> {{ user.role }}</p>
    <p><strong>Telegram ID:</strong> {{ user.telegram_id }}</p>
    <p><strong>Telegram Username:</strong> {{ user.telegram_username || 'Не указано' }}</p>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.user-info {
  margin-bottom: 15px;
}
</style> 