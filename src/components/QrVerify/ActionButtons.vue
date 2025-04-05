<template>
  <div class="action-buttons">
    <button @click="$emit('change-points')" class="btn btn-points">Изменить баллы</button>
    <button v-if="isOrganizer" @click="$emit('mark-attendance')" class="btn btn-attendance">Отметить посещение</button>
  </div>
</template>

<script>
export default {
  name: 'ActionButtons',
  props: {
    isOrganizer: {
      type: Boolean,
      default: false
    },
    commandName: {
      type: String,
      required: true
    }
  },
  emits: ['change-points', 'mark-attendance']
}
</script>

<style scoped>
.action-buttons {
  margin-top: 20px;
}
.btn {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}
.btn:hover {
  opacity: 0.9;
}
.btn-points {
  background-color: #2196F3;
}
.btn-attendance {
  background-color: #FF9800;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 480px) {
  .btn {
    width: 100%;
    margin: 5px 0;
  }
}
</style> 