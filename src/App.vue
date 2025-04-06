<template>
  <div id="app" :class="{ 'home-route': isHomePage }">
    <router-view />
  </div>
</template>

<script>
import { RouterView } from 'vue-router';

export default {
  name: 'App',
  computed: {
    isHomePage() {
      console.log('Текущий путь:', this.$route.path);
      return this.$route.path === '/' || this.$route.path === '';
    }
  }
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

#app.home-route {
  background-image: none !important;
}

/* Для маршрутов, отличных от главной страницы */
.quest-route #app,
.profile-route #app,
.registration-route #app,
.previous-route #app,
.qrVerify-route #app {
  background-image: url('@/assets/images/quest_bg.png') !important;
}

/* ... остальные стили ... */
</style>
