export const CopyToClipboardMixin = {
  data() {
    return {
      copySuccess: false,
      tooltipText: 'Нажмите, чтобы скопировать'
    }
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.copySuccess = true;
          setTimeout(() => {
            this.copySuccess = false;
          }, 2000);
        })
        .catch(err => {
          console.error('Ошибка при копировании: ', err);
        });
    }
  }
} 