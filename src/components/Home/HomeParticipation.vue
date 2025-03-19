<!-- src/components/Quest/QuestHowToParticipate.vue -->
<template>
    <section class="HomeParticipation">
      <h2>{{ $t('participation.titlemain') }}</h2>
      <div class="steps">
        <div class="step" v-for="(step, index) in steps" :key="index">
          <div class="step__number">{{ index + 1 }}</div>
          <div class="step__content">
            <h3>{{ $t('participation.title') }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import LanguageSwitcher from '../UI/LanguageSwitcher.vue';
  export default {
    name: "Participation",
    components: {
    LanguageSwitcher
  },
    data() {
      return {
        steps: [
          {
            title: "hi",
            description: ('participation.titlemain'), 
          }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .how-to-participate {
    padding: 30px 20px;
  }
  
  h2 {
    margin-bottom: 25px;
    font-size: 24px;
    text-align: left;
  }
  
  .steps {
    display: flex;
    flex-direction: column;
    gap: 20px;
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
  }
  
  .step__content h3 {
    margin: 0 0 5px 0;
    font-size: 18px;
  }
  
  .step__content p {
    margin: 0;
    font-size: 14px;
    color: #666;
  }
  </style>