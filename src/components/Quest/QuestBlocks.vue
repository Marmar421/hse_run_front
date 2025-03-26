<template>
  <div class="quest-blocks-container">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else>
      <QuestBlock 
        v-for="quest in quests" 
        :key="quest.id"
        :title="quest.title"
        :progress="quest.progress"
        @click="startQuest(quest.id)"
      />
    </template>
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
      quests: [],
      loading: true,
      error: null
    }
  },
  mounted() {
    this.fetchQuests()
  },
  methods: {
    async fetchQuests() {
      try {
        this.loading = true
        const response = await fetch('/api/quest')
        
        if (!response.ok) {
          throw new Error('Ошибка загрузки квестов')
        }
        
        const { blocks } = await response.json()
        this.quests = blocks.map(block => ({
          id: block.id,
          title: block.title,
          progress: block.progress || 0
        }))
        
        this.loading = false
      } catch (error) {
        this.error = error.message
        this.loading = false
        
        // Если ошибка авторизации, перенаправляем на страницу регистрации
        if (error.message.includes('Ошибка сервера')) {
          this.$router.push('/registration')
        }
      }
    },
    startQuest(questId) {
      this.$router.push(`/quest/${questId}`)
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

.loading, .error {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #e74c3c;
}
</style>
