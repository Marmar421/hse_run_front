<template>
  <section class="partners">
    <h2>{{ $t('partners.title') }}</h2>
    <div class="carousel-container">
      <button class="carousel-arrow arrow-left" @click="slideLeft">
        <span>&#10094;</span>
      </button>
      
      <div class="partners-logos">
        <div class="logos-container" :style="slidesStyle">
          <div v-for="(partner, index) in visiblePartners" :key="index" class="partner-logo">
            <img :src="partner.logo" :alt="partner.name">
          </div>
        </div>
      </div>
      
      <button class="carousel-arrow arrow-right" @click="slideRight">
        <span>&#10095;</span>
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomePartners",
  data() {
    return {
      currentIndex: 0,
      partners: [
        {logo: require('@/assets/images/WKUP.png') },
        {logo: require('@/assets/images/Ahmad_Tea_logo.jpg') },
        {logo: require('@/assets/images/sborka_logo.svg') },
        {logo: require('@/assets/images/alfa-logo.jpg') },
        {logo: require('@/assets/images/clothing_supply_logo.png') },
        // { name: "Партнер 6", logo: require('@/assets/images/partner-placeholder.png') },
        // { name: "Партнер 7", logo: require('@/assets/images/partner-placeholder.png') },
      ]
    };
  },
  computed: {
    visiblePartners() {
      // Создаем зацикленный массив из партнеров для отображения
      const result = [];
      const count = this.partners.length;
      
      // Показываем 3 партнера, начиная с текущего индекса
      for (let i = 0; i < 3; i++) {
        const index = (this.currentIndex + i) % count;
        result.push(this.partners[index]);
      }
      
      return result;
    },
    slidesStyle() {
      // Для плавного перехода между слайдами
      return {
        transition: 'transform 0.1s ease-in-out'
      };
    }
  },
  methods: {
    slideLeft() {
      // Прокрутка влево с зацикливанием
      this.currentIndex = (this.currentIndex - 1 + this.partners.length) % this.partners.length;
    },
    slideRight() {
      // Прокрутка вправо с зацикливанием
      this.currentIndex = (this.currentIndex + 1) % this.partners.length;
    }
  }
};
</script>

<style scoped>
.partners {
  padding: 30px 20px;
  text-align: center;
}

h2 {
  margin-bottom: 25px;
  font-size: 24px;
}

.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}

.partners-logos {
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 100%;
}

.logos-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.partner-logo {
  flex: 0 0 calc(100% / 3);
  padding: 15px;
  box-sizing: border-box;
  text-align: center;
  transition: transform 0.3s ease;
}

.partner-logo img {
  max-width: 100%;
  max-height: 100px;
  margin-bottom: 10px;
  object-fit: contain;
}

.partner-logo p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.carousel-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(67, 105, 172, 0.1);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  margin: 0 15px;
  color: #4369AC;
  transition: background-color 0.3s ease;
}

.carousel-arrow:hover {
  background-color: rgba(67, 105, 172, 0.2);
}

.carousel-arrow:focus {
  outline: none;
}

/* Адаптив для мобильных устройств */
@media (max-width: 768px) {
  .partner-logo {
    flex: 0 0 100%;
  }
  
  .carousel-arrow {
    width: 30px;
    height: 30px;
    font-size: 14px;
    margin: 0 5px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .partner-logo {
    flex: 0 0 50%;
  }
}
</style>
