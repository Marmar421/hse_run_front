<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <QuestHeader />
    
    <main>
      <section class="hero">
        <h1>КУЛЬТУРНО-ИСТОРИЧЕСКИЙ КВЕСТ ПО МОСКВЕ</h1>
        <p class="subtitle">10 апреля</p>
        
        <div class="hero__buttons">
          <router-link to="/registration" class="btn btn-primary">Регистрация</router-link>
          <router-link to="/about" class="btn btn-secondary">Узнать квест</router-link>
        </div>
        
        <div class="hero__image">
          <img src="@/assets/images/moscow-building.png" alt="Москва" />
        </div>
      </section>
      
      <section class="quest-info">
        <div class="info-block">
          <h2>HSE RUN</h2>
          <p>"Культурно-исторический квест" – это увлекательное путешествие по местам, связанным с русской культурой. Вы познакомитесь с историей и судьбой многих знаменитых мест.</p>
        </div>
        
        <div class="participants">
          <img src="@/assets/images/participants-photos.png" alt="Участники квеста" />
          <p>Каждый год до 2023 HSE RUN собирал сотни студентов, выпускников и преподавателей для участия в квесте.</p>
        </div>
        
        <div class="quote">
          <p>Собирай команду и приготовься отправиться в интерактивный погружение в историю и культуру Москвы!</p>
        </div>
      </section>
      
      <QuestHowToParticipate />
      
      <section class="faq">
        <h2>Остались вопросы?</h2>
        <div class="faq-cards">
          <div class="faq-card" v-for="(question, index) in faqQuestions" :key="index">
            <div class="question">
              <img src="@/assets/images/location-icon.png" alt="локация" v-if="question.icon === 'location'" />
              <p>{{ question.text }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <section class="partners">
        <h2>Наши партнеры</h2>
        <div class="partners-logos">
          <!-- Partner logos will go here -->
        </div>
      </section>
    </main>
    
    <footer>
      <p>&copy; 2025 HSE RUN. Все права защищены.</p>
    </footer>
  </div>
</template>

<script>
import QuestHeader from '@/components/Quest/QuestHeader.vue';
import QuestHowToParticipate from '@/components/Quest/QuestHowToParticipate.vue';

export default {
  name: 'HomeView',
  components: {
    QuestHeader,
    QuestHowToParticipate
  },
  data() {
    return {
      faqQuestions: [
        { icon: 'location', text: 'Где проходит квест?' },
        { icon: 'location', text: 'Где начинается квест?' },
        { icon: 'question', text: 'А сколько будет участников?' },
        { icon: 'time', text: 'Какое ограничение по времени?' }
      ]
    };
  }
};
</script>

<style scoped>
.home {
  font-family: Arial, sans-serif;
  max-width: 100%;
  overflow-x: hidden;
}

.hero {
  background: linear-gradient(180deg, #e6f0ff 0%, #ffffff 100%);
  padding: 20px;
  text-align: center;
  position: relative;
}

h1 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.subtitle {
  font-size: 18px;
  margin-bottom: 30px;
}

.hero__buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: bold;
  text-decoration: none;
  text-align: center;
}

.btn-primary {
  background-color: #ff0000;
  color: white;
}

.btn-secondary {
  background-color: #ffffff;
  color: #333;
  border: 1px solid #ccc;
}

.hero__image {
  width: 100%;
  margin-top: 20px;
}

.hero__image img {
  width: 100%;
  height: auto;
}

.quest-info {
  padding: 30px 20px;
}

.info-block {
  margin-bottom: 30px;
  text-align: left;
}

.info-block h2 {
  font-size: 24px;
  margin-bottom: 15px;
}

.participants {
  margin-bottom: 30px;
}

.participants img {
  width: 100%;
  margin-bottom: 15px;
  border-radius: 8px;
}

.quote {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  font-style: italic;
  margin-bottom: 30px;
}

.faq {
  padding: 30px 20px;
  background-color: #f9f9f9;
}

.faq h2 {
  margin-bottom: 20px;
  text-align: left;
}

.faq-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.faq-card {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.question {
  display: flex;
  align-items: center;
  gap: 10px;
}

.question img {
  width: 24px;
  height: 24px;
}

.partners {
  padding: 30px 20px;
}

.partners h2 {
  margin-bottom: 20px;
  text-align: left;
}

.partners-logos {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

footer {
  background-color: #333;
  color: white;
  padding: 20px;
  text-align: center;
}
</style>
