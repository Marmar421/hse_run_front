<template>
  <header class="sticky-header">
    <div class="header-content">
      <div class="logo">
        <a href="/">
          <img src="@/assets/images/hserun_logo.svg" alt="Логотип" />
        </a>
      </div>
      <nav class="navigation">
        <LanguageSwitcher />
        <a href="#" class="nav-link">{{ $t('header.about') }}</a>
        <a href="#" class="nav-link">{{ $t('header.participation') }}</a>
        <router-link to="/previous" class="nav-link">{{ $t('header.previousQuests') }}</router-link>
        
        <div class="language-selector">
          <router-link to="/profile" class="nav-link">{{ $t('header.signin') }}</router-link>
        </div>
        <div class="mobile-menu-icon">
          <img src="@/assets/images/down-button.svg" alt="header-down-button" class="down-button-mobile">
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
  z-index: 111;
  width: 100%;
  height: 90px;
  background-color: #F3F3F3;
  margin: 0 auto;
  max-width: 1360px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1360px;
}

.navigation {
  display: flex;
  gap: 20px;
  font-family: 'InvolveMedium';
  font-size: 20px;
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
.down-button-mobile{
  display: none;
}

@media screen and (max-width: 1600px) {
  .sticky-header {
    width: 100%;
  }
}
@media (max-width: 768px) {
  .nav-link{
    display: none;
  }
  .language-switcher{
    display: none;
  }
  .down-button-mobile{
    display: block;
    height: 30px;
    width: 30px;
    cursor: pointer;
  }
  .mobile-menu-icon{
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>