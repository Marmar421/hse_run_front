<template>
  <div ref="telegramLogin"></div>
</template>

<script>
export default {
  props: {
    botName: {
      type: String,
      required: true
    }
  },
  methods: {
    onTelegramAuth(user) {
      this.$emit('auth', {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username
      });
    }
  },
  computed: {
    onAuthCallback() {
      return `onTelegramAuth_${this._uid}`;
    }
  },
  mounted() {
    // Создаем скрипт динамически
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.dataset.telegramLogin = this.botName;
    script.dataset.size = 'large';
    script.dataset.onauth = this.onAuthCallback;
    script.dataset.requestAccess = 'write';
    
    // Добавляем скрипт в DOM
    this.$refs.telegramLogin.appendChild(script);
    
    // Регистрируем callback
    window[this.onAuthCallback] = this.onTelegramAuth.bind(this);
  },
  beforeDestroy() {
    // Удаляем callback при уничтожении компонента
    delete window[this.onAuthCallback];
  }
}
</script>