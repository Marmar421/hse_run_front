<template>
  <header class="sticky-header">
    <div class="header-content">
      <div class="logo">
        <img src="@/assets/images/hserun_logo.svg" alt="Логотип" />
      </div>
      <nav class="navigation">
        <LanguageSwitcher />
        <a href="#" class="nav-link">{{ $t('header.about') }}</a>
        <a href="#" class="nav-link">{{ $t('header.participation') }}</a>
        <router-link to="/previous" class="nav-link">{{ $t('header.previousQuests') }}</router-link>
        
        <div class="language-selector">
          <router-link to="/registration" class="nav-link">{{ $t('header.signin') }}</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import LanguageSwitcher from '../UI/LanguageSwitcher.vue';

export default {
  name: 'HomeHeader',
  components: {
    LanguageSwitcher
  }
}
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
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

.navigation {
  display: flex;
  gap: 20px;
  font-family: 'InvolveMedium';
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