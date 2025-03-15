<template>
  <div class="profile">
    <h1>Профиль</h1>
    <div class="welcome">
      <p>Добро пожаловать!</p>
      <p>Telegram ID: 870424192</p>
      <p>Username: burlak1n</p>
      <label for="fullname">ФИО:</label>
      <input id="fullname" v-model="fullname" />
      <button @click="saveProfile">Сохранить</button>
      <button @click="deleteProfile" class="delete">Удалить профиль</button>
      <template>
  <div>
    <BaseButton>Обычная кнопка</BaseButton>
    <BaseButton variant="secondary">Вторичная</BaseButton>
    <BaseButton variant="danger">Удалить</BaseButton>
    <BaseButton variant="success">Сохранить</BaseButton>
    <BaseButton variant="outline">Контурная</BaseButton>
    <BaseButton disabled>Недоступная</BaseButton>
    <BaseButton block>На всю ширину</BaseButton>
  </div>
</template>
    </div>
    <div class="team">
      <h2>Команда</h2>
      <label for="teamName">Название команды:</label>
      <input id="teamName" v-model="teamName" />
      <button @click="createTeam">Создать команду</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileMain',
  data() {
    return {
      fullname: 'burlak1n',
      teamName: ''
    };
  },
  methods: {
    saveProfile() {
      // Логика для сохранения профиля
      console.log('Профиль сохранен:', this.fullname);
    },
    deleteProfile() {
      // Логика для удаления профиля
      console.log('Профиль удален');
    },
    createTeam() {
      // Логика для создания команды
      console.log('Команда создана:', this.teamName);
    }
  }
}
</script>

<style scoped>
.profile {
  padding: 20px;
}
.welcome, .team {
  margin-bottom: 20px;
}
button {
  margin-top: 10px;
}
.delete {
  background-color: red;
  color: white;
}
</style>