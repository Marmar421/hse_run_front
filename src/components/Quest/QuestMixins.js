export const qrCodeMixin = {
  data() {
    return {
      qrModalVisible: false,
      qrImageSrc: '',
    }
  },
  methods: {
    async showQR() {
      try {
        const response = await fetch('/api/auth/qr')
        if (!response.ok) throw new Error('Ошибка загрузки QR-кода')
        
        const qrData = await response.json()
        this.qrImageSrc = 'data:image/png;base64,' + qrData.qr_image
        this.qrModalVisible = true
      } catch (error) {
        alert('Ошибка при загрузке QR-кода')
      }
    },
    
    closeQR() {
      this.qrModalVisible = false
    }
  }
} 