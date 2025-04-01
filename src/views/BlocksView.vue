<template>
  <div class="blocks-view">
    <QuestBlocks />
  </div>
</template>

<script>
import QuestBlocks from '@/components/Quest/QuestBlocks.vue';

export default {
  name: 'BlocksView',
  components: {
    QuestBlocks
  }
}
</script>

<style scoped>
.blocks-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .blocks-view {
    padding: 10px;
  }
}
</style>
