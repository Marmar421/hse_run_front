<template>
  <div class="command-info">
    <h3>Информация о команде</h3>
    <p><strong>ID:</strong> {{ command.id }}</p>
    <p><strong>Название:</strong> {{ command.name }}</p>
    <p><strong>ID события:</strong> {{ command.event_id }}</p>
  </div>
</template>

<script>
export default {
  name: 'CommandInfo',
  props: {
    command: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.command-info {
  margin-bottom: 15px;
}
</style> 