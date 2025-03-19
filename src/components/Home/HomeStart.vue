<template>
  <section class="home-start">
    <div class="start-container">
      <div class="tag-line">{{ $t('start.tagline') }}</div>
      
      <div class="main-content">
        <h1 class="main-title">{{ $t('start.maintitle') }}</h1>
        <p class="subtitle">
            {{ $t('start.subtitle1') }} <br />
            {{ $t('start.subtitle2') }}
        </p>
        
        <div class="buttons-container">
          <router-link to="/registration">
            <BaseButton 
              class="register-btn" 
              type="primary">
              {{ $t('start.registration') }}
            </BaseButton>
          </router-link>
          
          <router-link to="/quest">
            <BaseButton 
              class="start-quest-btn" 
              type="outlined">
              {{ $t('start.startquest') }}
            </BaseButton>
          </router-link>
        </div>
        
        <p class="event-info">{{ $t('start.eventinfo') }}</p>
      </div>
      
      <div class="brand-mark">hse run 29</div>
    </div>
  </section>
  <section class="home-cards">
    <div class="cards-container">
      <div class="team-cards">
          <div class="card-content">{{ $t('start.card1')}}</div>
          <div class="card-content">{{ $t('start.card2') }}</div>
          <div class="card-content">{{ $t('start.card3') }}</div>
          <div class="card-content">{{ $t('start.card4') }}</div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseButton from '@/components/UI/BaseButton.vue';
import LanguageSwitcher from '../UI/LanguageSwitcher.vue';

export default {
  name: 'HomeStart',
  components: {
    BaseButton,
    LanguageSwitcher
  }
}
</script>

<style scoped>
.home-start {
  position: relative;
  weight: 1360 px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 20px;
  background-image: url('@/assets/images/StartFrame.svg');
  background-position: center;
  background-color: #f0f0f0;
  overflow: hidden;
}

.start-container::before {
  content: "";
  position: absolute;
  top: 60%;
  right: -20px;
  width: 40px;
  height: 40px;
  background-color: #B71C1C;
  justify-content: start;
}

.tag-line {
  font-family: 'DisruptorScript';
  position: absolute;
  top: -30px;
  left: 60px;
  color: #4369AC;
  font-size: 55px;
}

.main-content {
  max-width: 600px;
  
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

.buttons-container {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.register-btn, .start-quest-btn {
  padding: 15px 30px;
  font-weight: bold;
  font-size: 16px;
  font-family: 'InvolveMedium';
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
  font-family: 'InvolveMedium';
}

.brand-mark {
  position: absolute;
  bottom: 20px;
  right: 40px;
  color: #4369AC;
  font-size: 55px;
  font-family: 'DisruptorScript';
}

.home-cards {
  background-color: #F3F3F3;
  padding: 80px 20px;
  color: white;
  position: relative;
  overflow: hidden;
}

.cards-container {
    max-width: 1360px;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}

.team-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  flex: 1;
  min-width: 300px;
  max-width: 1360px;
}

.card-content {
  font-size: 24px;
  font-weight: bold;
  flex-grow: 1;
  display: flex;
  align-items: center;
  font-family: 'InvolveMedium';
  color: #191A1E;
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

</style>