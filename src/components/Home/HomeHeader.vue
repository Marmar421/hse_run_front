<template>
  <header class="sticky-header">
    <div class="header-content">
      <div class="logo">
        <img src="@/assets/images/hserun_logo.svg" alt="Логотип" />
      </div>
      <nav class="navigation">
        <a href="#" class="nav-link">О проекте</a>
        <a href="#" class="nav-link">Как участвовать?</a>
        <a href="#" class="nav-link">Партнеры</a>
        <router-link to="/previous" class="nav-link">Предыдущие квесты</router-link>
        
        <div class="language-selector">
          <button @click="toggleLanguageDropdown" class="language-button">
            {{ currentLanguage }}
            <span class="arrow-down">▼</span>
          </button>
          <div v-if="isLanguageDropdownOpen" class="language-dropdown">
            <a href="#" @click.prevent="changeLanguage('RU')" class="language-option">Русский</a>
            <a href="#" @click.prevent="changeLanguage('EN')" class="language-option">English</a>
          </div>
          <router-link to="/profile" class="nav-link">Войти</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HomeHeader'
}
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 1600px;
  height: 80px;
  background-color: #F3F3F3;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 30px;
}

/* .logo {
  font-size: 24px;
  font-weight: bold;
} */

.navigation {
  display: flex;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #4369AC;
}

@media screen and (max-width: 1600px) {
  .sticky-header {
    width: 100%;
  }
}
</style>