import { createI18n } from 'vue-i18n'
import ru from './locales/ru.js'
import en from './locales/en.js'

const messages = {
  ru,
  en
}

// Определение языка по умолчанию
function getDefaultLanguage() {
  const savedLanguage = localStorage.getItem('userLanguage')
  if (savedLanguage && ['ru', 'en'].includes(savedLanguage)) {
    return savedLanguage
  }
  
  const browserLang = navigator.language || navigator.userLanguage
  const shortLang = browserLang.split('-')[0]
  
  if (['ru', 'en'].includes(shortLang)) {
    return shortLang
  }
  
  return 'ru'
}

// Обратите внимание на изменение настроек
const i18n = createI18n({
  legacy: true, // Используем режим совместимости с Vue 2 для простоты
  globalInjection: true, // Добавляем $t и другие методы глобально
  locale: getDefaultLanguage(),
  fallbackLocale: 'en',
  messages
})

export default i18n