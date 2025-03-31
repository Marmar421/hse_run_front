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
            <img 
              :src="partner.logo" 
              @click="goToPartnerSite(partner.url)"
              class="partner-logo"
              :alt="'Partner logo'"
            >
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
        {
          logo: require('@/assets/images/WKUP.png'),
          url: 'https://wakeupnow.ru'
        },
        {
          logo: require('@/assets/images/Ahmad_Tea_logo.png'),
          url: 'https://ahmadtea.ru'
        },
        {
          logo: require('@/assets/images/sborka_logo.svg'),
          url: 'https://ecosborka.ru'
        },
        {
          logo: require('@/assets/images/alfa-logo.jpg'),
          url: 'https://alfabank.ru'
        },
        {
          logo: require('@/assets/images/clothing_supply_logo.png'),
          url: 'https://clothingsupply.ru'
        },
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
    },
    goToPartnerSite(url) {
      if (url) {
        window.open(url, '_blank');
      }
    }
  }
};
</script>

<style scoped>
.partners {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 64px;
  margin-top: 70px;
  padding: 40px 150px;
  max-width: 1360px;

}

h2 {
  margin: 0;
  font-size: 55px;
  text-align: center;
  font-family: 'PhonkSans';
  color: #C80002;
  -webkit-text-stroke: 3px #C80002;
}

.carousel-container {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.partners-logos {
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.logos-container {
  display: flex;
  justify-content: center;
  flex: 1;
  gap: 82px;
}

.partner-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  box-sizing: border-box;
  text-align: center;
  transition: transform 0.3s ease;
}


.partner-logo:hover {
  transform: scale(1.01);
}

.partner-logo img {
  max-width: 100%;
  max-height: 150px;
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
  width: 60px;
  height: 60px;
  border: none;
  background-color: #F3F3F3;
  cursor: pointer;
  font-size: 28px;
  margin: 0 15px;
  color: #191A1E;
  transition: background-color 0.3s ease;
}

.carousel-arrow:hover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: none;
  background-color: #F3F3F3;
  cursor: pointer;
  font-size: 28px;
  margin: 0 15px;
  color: #C80002;
  transition: background-color 0.3s ease;
}

@media (max-width: 1360px) {
  .partners {
    padding: 40px 50px;
  }
}
/* Адаптив для мобильных устройств */
@media (max-width: 768px) {
  .partners {
  gap: 22px;
  padding: 22px;
}
  h2 {
    font-size: 22px;
    -webkit-text-stroke: 1px #C80002;
  }
  .partner-logo {
    flex: 0 0 100%;
  }
  .partner-logo img {
  max-height: 60px;
  margin-bottom: 0;
  margin-top: 0;
  margin-left: 0;
  margin-right: 0;
  max-width: 200px;
}
}

</style>
