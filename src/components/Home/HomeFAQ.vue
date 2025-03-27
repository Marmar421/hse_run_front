<template>
  <section class="HomeFAQ">
    <div class="homefaq-wrapper">
      <h2>{{ $t('faq.title') }}</h2>

      <div class="questions-wrapper">
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70px;
  border: 2px solid #C80002;
  margin: 0 auto;
  border-radius: 80px;
  margin-top: 73px;
  margin-bottom: 73px;
  max-width: 1216px;
}
.homefaq-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 54px;
}

.homefaq-wrapper h2 {
  margin: 0;
  font-size: 55px;
  text-align: center;
  font-family: 'PhonkSans';
  color: #C80002;
  -webkit-text-stroke: 3px #C80002;
}
.questions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 29px;
  column-gap: 70px;
}
.question-container {
  border: solid 2px #C80002;
  border-radius: 40px;
  max-width: 575px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 10px 20px
}
.question-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.question-card__front h3 {
  font-size: 33px;
  margin: 0;
  font-family: 'InvolveMedium';
  color: #C80002;
  text-align: center;
}
.question-card__back {
  display: none;
}

@media (max-width: 1360px) {
  .homefaq-wrapper h2 {
    font-size: 40px;
  }
  .question-card__front h3 {
    font-size: 24px;
  }
}
@media (max-width: 768px) {
  .HomeFAQ {
    display: none;
  }
}
</style>