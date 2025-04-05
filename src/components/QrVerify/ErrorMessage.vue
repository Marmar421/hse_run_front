<template>
  <div class="error-message">
    <h3>Ошибка</h3>
    <p>{{ message }}</p>
    <p v-if="showHelp">Если проблема повторяется, обратитесь к организаторам.</p>
    <button v-if="showRetry" @click="$emit('retry')" class="btn retry-button">Повторить попытку</button>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    message: {
      type: String,
      required: true
    },
    showHelp: {
      type: Boolean,
      default: true
    },
    showRetry: {
      type: Boolean,
      default: true
    }
  },
  emits: ['retry']
}
</script>

<style scoped>
.error-message {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff8f8;
  border-radius: 5px;
  border-left: 4px solid #dc3545;
  animation: slideIn 0.5s;
  font-size: 16px;
  color: #721c24;
}

.error-message h3 {
  display: flex;
  align-items: center;
  margin-top: 0;
  margin-bottom: 10px;
  color: #dc3545;
}

.error-message h3::before {
  content: "⚠️";
  margin-right: 8px;
  font-size: 20px;
}

.error-message p {
  margin-bottom: 8px;
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

.retry-button {
  margin-top: 15px;
}

@keyframes slideIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style> 