<template>
  <div class="guest-message">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'GuestMessage',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.guest-message {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
  border-left: 4px solid #4CAF50;
  animation: slideIn 0.5s;
}

@keyframes slideIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style> 