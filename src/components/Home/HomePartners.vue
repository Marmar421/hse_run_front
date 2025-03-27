<template>
  <section class="partners">
    <h2>{{ $t('partners.title') }}</h2>
    <div class="partners-carousel">
      <div class="carousel-inner">
        <div 
          v-for="(partner, index) in partners" 
          :key="index"
          class="carousel-item"
          :class="{ active: index === currentIndex }"
        >
          <img 
            :src="partner.logo" 
            @click="goToPartnerSite(partner.url)"
            class="partner-logo"
            alt="Partner logo"
          >
        </div>
      </div>
      
      <button class="carousel-control-prev" @click="prevSlide">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" @click="nextSlide">
        <span class="carousel-control-next-icon"></span>
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
      autoSlideInterval: null,
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
        transition: 'transform 0.5s'
      };
    }
  },
  methods: {
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.partners.length;
    },
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.partners.length) % this.partners.length;
    },
    goToPartnerSite(url) {
      if (url) {
        window.open(url, '_blank');
      }
    },
    startAutoSlide() {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, 5000); // Интервал в 5 секунд
    },
    stopAutoSlide() {
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval);
      }
    }
  },
  mounted() {
    this.startAutoSlide();
  },
  beforeDestroy() {
    this.stopAutoSlide();
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
  margin: 0 auto;
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

.partners-carousel {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.carousel-inner {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  transform: translateX(-${100 * currentIndex}%);
}

.carousel-item.active {
  opacity: 1;
}

.partner-logo {
  height: 60px;
  width: auto;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.partner-logo:hover {
  transform: scale(1.05);
}

.carousel-control-prev,
.carousel-control-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.3);
  border: none;
  padding: 10px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.carousel-control-prev {
  left: 0;
}

.carousel-control-next {
  right: 0;
}

.carousel-control-prev:hover,
.carousel-control-next:hover {
  opacity: 0.9;
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
  
  .carousel-arrow {
    width: 30px;
    height: 30px;
    font-size: 14px;
    margin: 0 5px;
  }
  .partner-logo img {
  max-height: 60px;
}
}

/* Для особых случаев */
.partner-logo[src*="specific-partner"] {
  height: 70px; /* особая высота для конкретного партнера */
}
</style>
