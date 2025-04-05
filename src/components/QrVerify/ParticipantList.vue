<template>
  <div class="participant-list">
    <h3>Участники команды</h3>
    <ul>
      <li v-for="participant in participants" :key="participant.id">
        {{ participant.full_name }} - <i>{{ participant.role }}</i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ParticipantList',
  props: {
    participants: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.participant-list {
  margin-bottom: 15px;
}
</style> 