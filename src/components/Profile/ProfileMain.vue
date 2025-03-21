<template>
  <div class="profile">
    <h1>{{ $t('profile.title') }}</h1>
    <LanguageSwitcher />
    <div class="welcome">
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
  </div>
</template>
    </div>
    <div class="team">
      <h2>{{ $t('profile.team') }}</h2>
      <label for="teamName">Название команды:</label>
      <input id="teamName" v-model="teamName" />
      <button @click="createTeam">Создать команду</button>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/UI/BaseButton.vue';
import LanguageSwitcher from '@/components/UI/LanguageSwitcher.vue';
export default {
  name: 'ProfileMain',
  components: {
    BaseButton,
    LanguageSwitcher,
  },
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