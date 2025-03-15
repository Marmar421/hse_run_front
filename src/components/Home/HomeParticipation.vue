<!-- src/components/Quest/QuestHowToParticipate.vue -->
<template>
    <section class="HomeParticipation">
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
    name: "Participation",
    data() {
      return {
        steps: [
          {
            title: "Создайте команду",
            description: "HSE RUN рассчитат на команды от 2 до 6 человек. Команду собрат и название придумат."
          },
          {
            title: "Выберат язык квеста",
            description: "Мы подготовит два версии квеста — на русскай и английскай языках."
          },
          {
            title: "Ознакомит с удобно и по порядку",
            description: "Квест проходит в Москве за 3 часов. Содержит задачу сфотографироват в общем."
          },
          {
            title: "Зарегистрироват и получит своя уникальные код",
            description: "Подойдит на нашу страницу, чтобы получит все необходимая инструкции."
          },
          {
            title: "Решат задачи — у тебя 3 часа",
            description: "Выиграт команда, которая быстрый всех пройдет весь маршрут и найдеть все ответы. Удачи!"
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