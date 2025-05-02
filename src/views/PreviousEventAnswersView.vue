<template>
  <div class="previous-event-answers-wrapper">
    <HomeHeader />
    <div class="page-container">
      <h1 v-if="eventName" class="main-title">Ответы на квест: {{ eventName }}</h1>
      <h1 v-else class="main-title">Ответы на квест</h1>

      <div v-if="loading" class="loading-message">Загрузка данных...</div>
      <div v-if="error" class="error-message">Ошибка загрузки: {{ error }}</div>

      <div v-if="questStructure" class="quest-structure">
        <div v-for="block in questStructure.blocks" :key="block.name" class="quest-block">
          <h2 class="block-title">{{ block.name }}</h2>
          <div v-if="block.tasks && block.tasks.length > 0" class="tasks-list">
            <div v-for="(task, index) in block.tasks" :key="index" class="task-item">
              <p class="task-question"><strong>Задание {{ index + 1 }}:</strong> {{ task.question || 'Текст задания отсутствует' }}</p>
              <p class="task-answer"><strong>Ответ:</strong> {{ task.answer || 'Ответ отсутствует' }}</p>
            </div>
          </div>
          <p v-else class="no-tasks">Задания для этого блока отсутствуют.</p>
        </div>
      </div>
      <div v-else-if="!loading && !error" class="no-data">
        Структура квеста не найдена.
      </div>

    </div>
    <HomeFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import HomeHeader from '@/components/Home/HomeHeader.vue';
import HomeFooter from '@/components/Home/HomeFooter.vue';

const route = useRoute();
const eventName = ref(route.params.event_name);
const questStructure = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchQuestStructure = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Предполагаем, что /api/ проксируется к бэкенду
    const response = await fetch(`/api/quest/events/${eventName.value}/answers`);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();
    // Предполагаемая структура ответа: { blocks: [{ name: string, tasks: [{ question: string, answer: string }] }] }
    questStructure.value = data; 
  } catch (err) {
    console.error("Ошибка при загрузке структуры квеста:", err);
    error.value = err.message || 'Не удалось загрузить данные';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (eventName.value) {
    fetchQuestStructure();
  } else {
    error.value = 'Не указано имя события.';
    loading.value = false;
  }
});
</script>

<style scoped>
.previous-event-answers-wrapper {
  background: none; 
}

.page-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Involve', sans-serif;
}

.main-title {
  color: var(--hse-blue);
  text-align: center;
  margin-bottom: 40px;
  font-weight: bold;
}

.loading-message,
.error-message,
.no-data {
  text-align: center;
  margin-top: 30px;
  font-size: 1.1rem;
  color: #555;
}

.error-message {
  color: var(--hse-red);
}

.quest-structure {
  margin-top: 20px;
}

.quest-block {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.block-title {
  color: var(--hse-blue);
  font-family: 'Phonk Sans', sans-serif;
  font-size: clamp(24px, 2vw, 30px);
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-item {
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 15px;
  border: 1px solid #eee;
}

.task-question,
.task-answer {
  margin: 0;
  line-height: 1.6;
  color: #333;
}

.task-answer {
  margin-top: 8px;
  color: var(--hse-green); /* Можно выбрать другой цвет для ответов */
}

.no-tasks {
    color: #777;
    font-style: italic;
}

/* Адаптация */
@media (max-width: 768px) {
  .main-title {
    font-size: clamp(28px, 5vw, 32px);
  }
  .block-title {
     font-size: clamp(22px, 4vw, 26px);
  }
}
</style> 