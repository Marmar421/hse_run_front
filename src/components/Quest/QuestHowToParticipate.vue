<!-- src/components/Quest/QuestHowToParticipate.vue -->
<template>
    <section class="how-to-participate">
      <h2>Как принять участие</h2>
      <div class="steps">
        <div class="step" v-for="(step, index) in steps" :key="index">
          <div class="step__number">{{ index + 1 }}</div>
          <div class="step__content">
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: "QuestHowToParticipate",
    data() {
      return {
        steps: [
          {
            title: "Создайте команду",
            description: "HSE RUN рассчитан на команды от 2 до 6 человек. Соберите команду и придумайте ей название."
          },
          {
            title: "Выбери язык квеста",
            description: "Мы подготовили две версии квеста — на русском и английском языках."
          },
          {
            title: "Ознакомься с удобно и по порядку",
            description: "Квест проходит в Москве за 3 часов. Содержит задачу сфотографироваться в общем."
          },
          {
            title: "Зарегистрируйся и получи свой уникальный код",
            description: "Подойдите на нашу страницу, чтобы получить все необходимые инструкции."
          },
          {
            title: "Решай задачи — у тебя 3 часа",
            description: "Выиграет команда, которая быстрее всех пройдет весь маршрут и найдет все ответы. Удачи!"
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