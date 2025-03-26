<template>
  <section class="home-start">
    <div class="start-container">
      <div class="tag-line">{{ $t('start.tagline') }}</div>
      
      <div class="main-content">
        <div class="hero-content">
          <div class="hero-title-section">
            <h1 class="main-title">{{ $t('start.maintitle') }}</h1>
            <p class="subtitle">
                <span class="bold-subtitle">{{ $t('start.subtitle1') }}</span> <br />
                {{ $t('start.subtitle2') }}
            </p>
          </div>
          
          <div class="buttons-info-section">
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
          
          </div>
      </div>
      <div class="hero-img-section">
        <img src="@/assets/images/hero.png" class ="hero-img" />
        <img src="@/assets/images/hero-mobile.png" class="hero-img hero-img-mobile" />
      </div>
      <div class="brand-mark">hse run 29</div>
    </div>
  </section>
  <section class="home-cards">
    <div class="cards-container">
          <div class="card-content">
            <p class="card-title">{{ $t('start.card1')}}</p>
          </div>
          <div class="card-content">
            <p class="card-title">{{ $t('start.card2')}}</p>
          </div>
          <div class="card-content">
            <p class="card-title">{{ $t('start.card3')}}</p>
          </div>
          <div class="card-content">
            <p class="card-title">{{ $t('start.card4')}}</p>
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
  display: flex;
  justify-content: center;
  background-image: url('@/assets/images/плашка.svg');
  background-size: contain;
  background-color: #F3F3F3;
  background-repeat: no-repeat;
  max-width: 1360px;
  z-index: 100;
  margin: 48px auto;
  height: 600px;
  box-sizing: border-box;
}
.start-container {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding-bottom: 12px;
  box-sizing: border-box;
}
.hero-img-section {
  position: absolute;
  right: 1px;
  top: -9px;
  width: 50%;
}
.hero-img-mobile {
  display: none;
}
.hero-img {
  width: 100%;
  border-radius: 0px 0px 80px 0px;
}
.tag-line {
  font-family: 'DisruptorScript';
  position: absolute;
  top: -50px;
  left: 60px;
  color: #4369AC;
  font-size: 55px;
  z-index: 1000;
}

.main-content {
  display: flex;
  flex-direction: column;
  padding-bottom: 93px;

  overflow: hidden;
  
}
.hero-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 53px;
}

.hero-title-section {
  display: flex;
  flex-direction: column;
  gap: 19px;
}

.main-title {
  font-family: 'PhonkSans';
  font-size: 55px;
  font-weight: 300;
  color: #C80002;
  -webkit-text-stroke: 3px #C80002;
  margin-bottom: 0;
  margin-right: 60px;
  box-sizing: border-box;
  margin-top: 40.5px;
  z-index: 1;
}

.subtitle {
  font-size: 24px;
  font-family: 'InvolveMedium';
  color: #191A1E;
  margin: 0px;
  margin-bottom: 15px;
  line-height: 1.5;
  margin-bottom: 40.5px;
  max-width: 540px;

}
.bold-subtitle {
  font-family: 'InvolveBold';
}

.buttons-info-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
  justify-content: center;
}
.buttons-container {
  display: flex;
  margin-top: 60px;
  gap: 16px;
}

.register-btn, .start-quest-btn {
  padding: 15px 30px;
  font-weight: bold;
  font-size: 16px;
  font-family: 'InvolveMedium';
}

.register-btn {
  background-color: #C80002;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 24px 32px;
  font-size: 20px;
  font-family: 'InvolveMedium';
}

.start-quest-btn {
  background-color: white;
  color: #C80002;
  border: 2.5px solid #C80002;
  border-radius: 24px;
  padding: 22px 32px;
  font-size: 20px;
  font-family: 'InvolveMedium';
  outline: none;
}

.event-info {
  font-size: 20px;
  color: #191A1E;
  margin: 0;
  font-weight: bold;
  margin-left: 12px;
  font-family: 'InvolveMedium';
}

.brand-mark {
  position: absolute;
  bottom: -60px;
  right: 15px;
  color: #4369AC;
  font-size: 66px;
  font-family: 'DisruptorScript';
}

.home-cards {
  background-color: #F3F3F3;
  padding: 80px 0px;
  color: white;
  position: relative;
  overflow: hidden;
}

.cards-container {
  max-width: 1360px;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
}
.card-content { 
  font-size: 24px;
  color: #333030;
  font-family: 'InvolveMedium';
  border: 2px solid #C80002;
  padding: 36px 62px ;
  border-radius: 39px;
  max-height: 114px;
  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
}
.card-title {
  max-width:  140px;
  text-align: center;
  margin: 0;
}
.card:hover {
  transform: perspective(800px) rotateY(0);
}

@media (max-width: 1360px) {
  .main-title{
    font-size: 40px;
    -webkit-text-stroke: 2px #C80002;
    margin-top: 25px;
  }
  .buttons-container{
    flex-direction: column;
    margin-top: 65px;
  }
  .hero-img-section{
    top: -7px;
  }
  .hero-img {
    border-radius: 0px 0px 60px 0px;
  }
  .subtitle{
    margin-bottom: 25px;
    font-size: 22px;
  }
  
  
}
@media (max-width: 1150px) {
  .buttons-container{
    margin-top: 35px;
  }
  .brand-mark {
    bottom: 30px;
  }
  .home-cards{
    padding-top: 0px;
  }
  .subtitle {
    font-size: 20px;
    margin-bottom: 10px;
  }
  .card-title {
    font-size: 20px;
  }
}
@media (max-width: 768px) {


  .home-start {
    background-image: url('@/assets/images/плашка-мобайл.svg');
    margin: 24px auto;
  }
  .hero-content {
    margin: 0;
  }
  .hero-title-section {
    margin-left: 15px;
    gap: 5px;
  }
  .main-title {
    margin-top: 25px;
    font-size: 22px;
    margin-right: 15px;
    -webkit-text-stroke: 1px #C80002;
  }
  .subtitle {
    font-size: 15px;

  }
  .tag-line {
    font-size: 30px;
  }
  .hero-img-section {
    width: 46%;
    right: 2px;
    top: 0px;
  }
  .hero-img {
    display: none;
    margin: 0;
    border-radius: 0px 0px 18px 0px;
  }
  .hero-img-mobile {
    display: block;
    margin: 0;
  }
  .register-btn {
  font-size: 13px;
  padding: 15px 18px;
  border-radius: 20px;
}
.start-quest-btn {
  font-size: 13px;
  padding: 14px 20px;
  border-radius: 20px;
  border: 1px solid #C80002;
}
.event-info {
  font-size: 15px;
  max-width: 165px;
}
  .brand-mark {
    font-size: 30px;
    bottom: 10px;
  }
  .home-cards {
    padding-bottom: 29px;
  }
  .cards-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 13px;
    column-gap: 28px;
}
.card-content {
  padding: 20px 30px;
  border-radius: 20px;
  border: 1px solid #C80002;
}
.card-title {
  font-size: 15px;
}
}
</style>