<template>
  <section class="HomeFAQ">
    <h2>{{ $t('faq.title') }}</h2>
    <div class="questions">
      <div 
        v-for="index in 6" 
        :key="index" 
        class="question-container"
        @click="toggleFlip(index)"
      >
        <div class="question-card" :class="{ 'is-flipped': flippedCards[index] }">
          <!-- Передняя сторона карточки с вопросом -->
          <div class="question-card__front">
            <div class="question__content">
              <h3>{{ $t(`faq.question${index}`) }}</h3>
            </div>
          </div>
          
          <!-- Обратная сторона карточки с ответом -->
          <div class="question-card__back">
            <div class="question__content">
              <p>{{ $t(`faq.answer${index}`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import LanguageSwitcher from '../UI/LanguageSwitcher.vue';
export default {
  name: "HomeFAQ",
  components: {
    LanguageSwitcher
  },
  data() {
    return {
      flippedCards: {}
    }
  },
  methods: {
    toggleFlip(index) {
  this.flippedCards[index] = !this.flippedCards[index];
}
  }
};
</script>

<style scoped>
.HomeFAQ {
  padding: 30px 20px;
}

h2 {
  margin-bottom: 35px;
  font-size: 24px;
  text-align: center;
}

.questions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.question-container {
  perspective: 1000px; /* Это важно для 3D эффекта */
  height: 200px;
  cursor: pointer;
}

.question-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 1s;
}

.question-card.is-flipped {
  transform: rotateY(180deg);
}

.question-card__front,
.question-card__back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.question-card__back {
  transform: rotateY(180deg);
  background-color: #f0f7ff;
}

.question__content {
  text-align: left;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.question__content h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.question__content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.click-hint {
  margin-top: auto;
  font-size: 12px;
  color: #999;
  font-style: italic;
  text-align: center;
}

/* Анимация при наведении */
.question-card:hover {
  box-shadow: 0 6px 12px rgba(67, 105, 172, 0.2);
}

/* Адаптив для мобильных */
@media (max-width: 768px) {
  .questions {
    grid-template-columns: 1fr;
  }
  
  .question-container {
    height: 180px;
  }
}
</style>