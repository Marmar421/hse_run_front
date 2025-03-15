<template>
  <section class="home-start">
    <div class="start-container">
      <div class="tag-line">разгадай каждую загадку</div>
      
      <div class="main-content">
        <h1 class="main-title">КУЛЬТУРНО-ИСТОРИЧЕСКИЙ<br>КВЕСТ ПО МОСКВЕ</h1>
        
        <p class="subtitle">
          Бегать совсем не обязательно!<br>
          Главное — решить как можно больше загадок за время квеста.
        </p>
        
        <div class="buttons-container">
          <router-link to="/registration">
            <BaseButton 
              class="register-btn" 
              type="primary">
              ЗАРЕГИСТРИРОВАТЬСЯ
            </BaseButton>
          </router-link>
          
          <router-link to="/quest">
            <BaseButton 
              class="start-quest-btn" 
              type="outlined">
              НАЧАТЬ КВЕСТ
            </BaseButton>
          </router-link>
        </div>
        
        <p class="event-info">29 АПРЕЛЯ 12:00 ПОКРОВСКИЙ БУЛЬВАР ДОМ 11</p>
      </div>
      
      <div class="brand-mark">hse run 29</div>
    </div>
  </section>
  <section class="home-about">
    <div class="about-container">
      <div class="about-text">
        <p class="about-description">
          текст рыба текст рыба текст рыба<br>
          текст рыба текст рыба<br>
          текст рыба текст рыба<br>
          текст рыба
        </p>
      </div>
      <div class="team-cards">
        <div class="card card-dark">
          <div class="card-label">КОМАНДА</div>
          <div class="card-content"> 2-6<br>Человек</div>
        </div>
        <div class="card card-blue">
          <div class="card-label">КВЕСТ</div>
          <div class="card-content">4<br>Часа на решение</div>
        </div>
        <div class="card card-red">
          <div class="card-label">УЗНАЙ МОСКВУ</div>
          <div class="card-content">Загадки про<br>интересные места</div>
        </div>
        <div class="card card-gray">
          <div class="card-label">ПРИЗЫ</div>
          <div class="card-content">Подарки<br>от наших партнеров</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseButton from '@/components/UI/BaseButton.vue';

export default {
  name: 'HomeStart',
  components: {
    BaseButton
  }
}
</script>

<style scoped>
.tag-line {
  font-family: 'DisruptorScript';
  position: absolute;
  top: -30px;
  left: 60px;
  color: #4369AC;
  font-size: 60px;
}
.main-title {
  font-family: 'PhonkSans';
  font-size: 42px;
  font-weight: 900;
  color: #B71C1C;
  line-height: 1.2;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 18px;
  font-family: 'InvolveMedium';
  color: #333;
  margin-bottom: 40px;
  line-height: 1.5;
}

.home-start {
  position: relative;
  weight: 1360 px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-image: url('@/assets/images/StartFrame.svg');
  background-position: center;
  background-color: #f0f0f0;
  overflow: hidden;
}

.start-container {
  position: relative;
  max-width: 1200px;
  width: 100%;
  border-radius: 40px;
  border: 2px solid #B71C1C;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}


.main-content {
  max-width: 600px;
}

.buttons-container {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.register-btn, .start-quest-btn {
  padding: 15px 30px;
  font-weight: bold;
  font-size: 16px;
}

.register-btn {
  background-color: #B71C1C;
  color: white;
  border: none;
}

.start-quest-btn {
  background-color: white;
  color: #B71C1C;
  border: 2px solid #B71C1C;
}

.event-info {
  font-size: 16px;
  color: #333;
  font-weight: bold;
}

.brand-mark {
  position: absolute;
  bottom: 20px;
  right: 40px;
  font-family: 'InvolveMedium', cursive;
  color: #4369AC;
  font-size: 20px;
}

.start-container::before {
  content: "";
  position: absolute;
  top: 60%;
  right: -20px;
  width: 40px;
  height: 40px;
  background-color: #B71C1C;
  transform: rotate(45deg);
}

.start-container::after {
  content: "";
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-image: url('@/assets/images/hserun_logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
}

@media (max-width: 768px) {
  .start-container {
    padding: 30px 20px;
    border-radius: 20px;
  }
  
  .main-title {
    font-size: 28px;
  }
  
  .tag-line {
    font-size: 18px;
    top: -20px;
    left: 30px;
  }
  
  .buttons-container {
    flex-direction: column;
  }
}
.home-about {
  background-color: #F3F3F3;
  padding: 80px 20px;
  color: white;
  position: relative;
  overflow: hidden;
}

.home-about::before {
  content: '?';
  position: absolute;
  margin-left: 10%;
  font-size: 300px;
  opacity: 0.5;
  color: #4369AC;
  font-weight: bold;
}
.about-container {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  gap: 40px;
}
.about-text {
  flex: 1;
  /* min-width: 300px; */
  margin-left: 10%;
}

.about-title {
  font-size: 24px;

  font-weight: bold;
  margin-bottom: 30px;
  margin-left: 10%;
  color:#191A1E;
}

.about-description {
  font-size: 18px;
  line-height: 1.6;
  margin-left: 10%;
  color: #191A1E;
}
.team-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  flex: 1;
  min-width: 300px;
}

.card {
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  aspect-ratio: 1/1;
  transform: perspective(800px) rotateY(10deg);
}

.card:hover {
  transform: perspective(800px) rotateY(0);
}
.card-dark {
  background: linear-gradient(135deg,#CACACA, #191A1E);
}

.card-blue {
  background: linear-gradient(35deg, #CACACA, #4369AC);
}

.card-red {
  background: linear-gradient(100deg, #CACACA, #ac4343);
}

.card-gray {
  background-color: #2d2d2d;
}

.card-label {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 10px;
}
.card-content {
  font-size: 24px;
  font-weight: bold;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .about-container {
    flex-direction: column;
  }
  
  .team-cards {
    width: 100%;
  }
}

</style>