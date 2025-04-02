<template>
  <QuestShell :teamScore="teamScore" :teamCoins="teamCoins">
    <div class="quest-blocks">
      <div v-for="block in blocks" :key="block.id" 
           class="quest-block" 
           @click="startBlock(block.id)">
        <div class="block-title">
          {{ block.title }}
        </div>
        
        <div class="progress-area">
          <div class="progress-wrapper">
            <div class="progress-container">
              <div 
                class="progress-bar blue" 
                :style="`width: ${block.progress || 0}%`"
              >
                <span class="progress-label" v-if="block.progress > 20">
                  {{ block.progress || 0 }}% ({{ block.solved_count || 0 }}/{{ block.total_count || 0 }})
                </span>
              </div>
              <span class="progress-label outside" v-if="block.progress <= 20">
                {{ block.progress || 0 }}% ({{ block.solved_count || 0 }}/{{ block.total_count || 0 }})
              </span>
            </div>
          </div>
          
          <div class="progress-wrapper">
            <div class="progress-container">
              <div 
                class="progress-bar red" 
                :style="`width: ${(block.insider_count / block.total_count) * 100 || 0}%`"
              >
                <span class="progress-label" v-if="(block.insider_count / block.total_count) * 100 > 20">
                  Посещено: {{ block.insider_count || 0 }}/{{ block.total_count || 0 }}
                </span>
              </div>
              <span class="progress-label outside red-text" v-if="(block.insider_count / block.total_count) * 100 <= 20">
                Посещено: {{ block.insider_count || 0 }}/{{ block.total_count || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </QuestShell>
</template>

<script>
import QuestShell from './QuestShell.vue'

export default {
  name: 'QuestComponent',
  components: {
    QuestShell
  },
  data() {
    return {
      blocks: [],
      teamScore: 0,
      teamCoins: 0,
    }
  },
   created() {
     this.fetchUserData()
    
     // Обновление данных при возвращении на страницу
     document.addEventListener('visibilitychange', this.handleVisibilityChange)
   },
   beforeUnmount() {
     // Очистка слушателя событий
     document.removeEventListener('visibilitychange', this.handleVisibilityChange)
   },
  methods: {
    async fetchUserData() {
      try {
        const res = await fetch('/api/quest')
        if (!res.ok) throw new Error('Ошибка сервера')
        
        const data = await res.json()
        this.blocks = data.blocks
        this.teamScore = data.team_score
        this.teamCoins = data.team_coins
      } catch (e) {
        // При ошибке перенаправляем на страницу регистрации
        this.$router.push('/registration')
      }
    },
    
    startBlock(blockId) {
      this.$router.push(`/quest/${blockId}`)
    },
    
    handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        this.fetchUserData()
      }
    }
  }
}
</script>

<style scoped>
.quest-blocks {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0 auto;
  max-width: 700px;
  overflow: visible;
}

.quest-block {
  border: 2px solid #ff5252;
  border-radius: 15px;
  max-width: 700px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.quest-block:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
}

.block-title {
  padding: 15px 10px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  background: none;
}

.progress-area {
  padding: 0 15px 15px;
}

.progress-wrapper {
  margin-bottom: 10px;
}

.progress-container {
  width: 100%;
  height: 25px;
  background-color: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  border-radius: 15px;
  position: relative;
  display: flex;
  align-items: center;
  transition: width 0.3s ease;
}

.blue {
  background-color: #4285f4;
}

.red {
  background-color: #ff5252;
}

.progress-label {
  color: white;
  font-size: 12px;
  white-space: nowrap;
  padding: 0 10px;
  z-index: 1;
}

.progress-label.outside {
  position: absolute;
  right: 10px;
  color: #666;
  font-size: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.red-text {
  color: #ff5252;
}

</style>
