<template>
    <div class = "/quest">
      <QuestBlocks />
    </div>
</template>

<script>
import QuestBlocks from '@/components/Quest/QuestBlocks.vue';
export default {
name: 'QuestView',
components: {
  QuestBlocks
}
};
</script>