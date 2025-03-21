<template>
  <div class="language-switcher">
    <select v-model="selectedLocale">
      <option value="ru">RU</option>
      <option value="en">EN</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      selectedLocale: this.$i18n.locale
    }
  },
  watch: {
    selectedLocale(newLocale) {
      // Обновляем язык в i18n
      this.$i18n.locale = newLocale
      
      // Сохраняем выбранный язык в localStorage
      localStorage.setItem('userLanguage', newLocale)
    }
  },
  created() {
    // Получаем сохраненный язык при создании компонента
    const savedLanguage = localStorage.getItem('userLanguage')
    
    // Если язык сохранен и он поддерживается, устанавливаем его
    if (savedLanguage && ['ru', 'en'].includes(savedLanguage)) {
      this.selectedLocale = savedLanguage
      this.$i18n.locale = savedLanguage
    }
  }
}
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}

select {
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: #4369AC;
}
</style>
