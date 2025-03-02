<template>
  <div><div type="dropbox" v-for="dropbox in dropboxs" :key="dropbox.id">
    <p class="greeting">{{ greeting }}</p></div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        greeting: 'Привет всем!'
      }
    }
  }
  </script>
  
  <style scoped>
  .greeting {
    color: red;
    font-weight: bold;
  }
  </style>