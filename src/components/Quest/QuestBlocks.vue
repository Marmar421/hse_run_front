<template>
  <div class="quest-blocks-container">
    <QuestBlock 
      v-for="quest in quests" 
      :key="quest.id"
      :title="quest.title"
      :progress="quest.progress"
    />
  </div>
</template>

<script>
import QuestBlock from '@/components/UI/QuestBlock.vue'

export default {
  components: {
    QuestBlock
  },
  data() {
    return {
      quests: [
        { id: 1, title: 'Москва с видом на', progress: 50 },
        { id: 2, title: 'Москва Булгакова', progress: 85 },
        { id: 3, title: 'Москва деревянная', progress: 75 },
        { id: 4, title: 'Москва круглая', progress: 90 },
        { id: 5, title: 'Москва конструктивистская', progress: 80 },
        { id: 6, title: '125 лет МХТ им. Чехова/ Москва по-Станиславскому', progress: 85 }
      ]
    }
  }
}
</script>

<style scoped>
.quest-blocks-container {
  padding: 15px;
  max-width: 500px;
  margin: 0 auto;
}
</style>
