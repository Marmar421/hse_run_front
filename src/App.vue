<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { RouterView } from 'vue-router';

export default {
  name: 'App'
}
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  background-image: url('@/assets/images/quest_bg.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Минимальная высота на весь экран */
  
}

/* ... остальные стили ... */
</style>
