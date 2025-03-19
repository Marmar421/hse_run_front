<template>
  <div ref="telegramWidget"></div>
</template>

<script>
export default {
  props: {
    botName: {
      type: String,
      default: 'test_burlak1n_bot'
    }
  },
  mounted() {
    this.loadTelegramWidget();
  },
  methods: {
    async onTelegramAuth(user) {
      try {
        const res = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        
        const data = await res.json();
        
        if (!res.ok || !data.ok) {
          throw new Error(data.message || 'Ошибка');
        }
        
        if (data.user.is_active) {
          window.location.href = '/profile';
        } else {
          this.$emit('show-registration-form');
        }
        
      } catch (error) {
        this.$emit('error', error.message);
      }
    },
    
    loadTelegramWidget() {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', this.botName);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      
      window.onTelegramAuth = this.onTelegramAuth;
      this.$refs.telegramWidget.appendChild(script);
    }
  }
}
</script>


