<!-- src/components/Quest/QuestHowToParticipate.vue -->
<template>
    <section class="HomeParticipation">
      <h2>{{ $t('participation.titlemain') }}</h2>
        <div class="participation-content-wrapper">
          <div class="participation-left-section">
            <img src="@/assets/images/vetka.png" alt="vetka" class="participation-left-section-image">
          </div>

          <div class="participation-middle-section">
            <div v-for="index in 5" :key="index" class="step">
              <div class="step__content">
                <h3>{{ $t(`participation.steps[${index-1}].point`) }}</h3>
                <p>{{ $t(`participation.steps[${index-1}].description`) }}</p>
              </div>
            </div>
          </div>

          <div class="participation-right-section">
            <img src="@/assets/images/participation-first-img.png" alt="" class="participation-first-image">
            <img src="@/assets/images/participation-second-img.png" alt="" class="participation-second-image">
            <img src="@/assets/images/participation-third-image.png" alt="" class="participation-third-image">
          </div>
        </div>
    </section>
  </template>
  
  <script>
  import LanguageSwitcher from '../UI/LanguageSwitcher.vue';
  export default {
    name: "HomeParticipation",
    components: {
    LanguageSwitcher
  },
  };
  </script>
  
  <style scoped>
  .HomeParticipation {
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    max-width: 1360px;
    margin: 0 auto;
    gap: 54px;
  }
  
  .HomeParticipation h2 {
    margin: 0px;
    font-size: 24px;
    text-align: left;
    font-family: 'PhonkSans';
    font-size: 55px;
    font-weight: 300;
    color: #C80002;
    -webkit-text-stroke: 3px #C80002;
    line-height: 1.4;
  }

  .participation-content-wrapper {
    display: flex;
    gap: 62px;
    max-width: 1360px;
    justify-content: space-between;
  }
  .participation-left-section {
    max-height: 1212px;
  }
  .participation-left-section-image {
    max-height: 1212px;
  }

  .participation-middle-section {
    display: flex;
    flex-direction: column;
    gap: 80px;
  }
  .participation-right-section {
    flex: 1;
    position: relative;
    min-width: 490px;
  }
  
  .step {
    display: flex;
    align-items: flex-start;
    gap: 15px;
  }
  
  .step__number {
    width: 30px;
    height: 30px;
    background-color: #ff0000;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .step__content {
    text-align: left;
    max-width: 520px;
    display: flex; 
    flex-direction: column;
    gap: 9px;
  }
  
  .step__content h3 {
    font-family: 'InvolveBold';
    font-size: 33px;
    margin: 0;
    color: #333030;
  }
  
  .step__content p {
    margin: 0;
    font-family: 'InvolveMedium';
    font-size: 24px;
    color: #4F4E4C;
  }
  .participation-first-image {
    position: absolute;
    width: 80%;
    top: 50px;
    left: 0;
  }
  .participation-second-image {
    position: absolute;
    width: 80%;
    top: 388px;
    right: 14px;
    z-index: 1;
  }
  .participation-third-image {
    position: absolute;
    width: 80%;
    left: 28px;
    top: 740px;
  }

  @media (max-width: 1360px) {
    .HomeParticipation h2 {
      font-size: 40px;
    }
    .step__content h3 {
      font-size: 24px;
      min-width: 300px;
    }
    .step__content p {
      font-size: 20px;
      max-width: 350px;
      min-width: 300px;
    }
    
  }
  @media (max-width: 768px) {
    .participation-right-section {
      display: none;
    }
    .HomeParticipation h2 {
      font-size: 22px;
    }
    .step__content h3 {
      font-size: 18px;
    }
    .step__content p {
      font-size: 15px;
    }
    .participation-left-section {
    max-height: 950px;
  }
  .participation-left-section-image {
    max-height: 950px;
  }
  .step__content h3 {
    max-width: 270px;
      min-width: 209px;
    }
    .step__content p {
      max-width: 270px;
      min-width: 209px;
    }
    .step {
    gap: 5px;
  }
  .participation-content-wrapper {
    justify-content:start;
    gap: 20px;
  }
  .participation-middle-section {
    gap: 55px;
  }
  }
  
  
  
  </style>