<template>
  <router-link to="/" class="logo-link" :class="customClass">
    <img src="@/assets/images/hserun_logo.svg" :alt="altText" class="logo">
  </router-link>
</template>

<script>
export default {
  name: 'LogoComponent',
  props: {
    altText: {
      type: String,
      default: 'HSE RUN Logo'
    },
    customClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.logo-link {
  text-decoration: none;
  margin: 20px 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  margin: 0;
  color: #ff5252;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .logo {
    font-size: 32px;
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 28px;
  }
}
</style> 