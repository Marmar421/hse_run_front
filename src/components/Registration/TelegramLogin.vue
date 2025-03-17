<template>
   <button @click="startRegistration" class="register-button">Начать регистрацию</button> 
    <div class="telegram-login-container">
      <div ref="telegramLogin"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: "TelegramLogin",
    mounted() {
      this.loadTelegramScript();
    },
    methods: {
      startRegistration() {
        this.loadTelegramScript();
      },
      loadTelegramScript() {
        if (window.Telegram && window.Telegram.Login) {
          this.initTelegramWidget();
          return;
        }
  
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.onload = this.initTelegramWidget;
        document.head.appendChild(script);
      },
  
      initTelegramWidget() {
        if (!window.Telegram || !window.Telegram.Login) {
          console.error("Ошибка загрузки Telegram Login Widget");
          return;
        }
  
        window.Telegram.Login.auth(
          {
            bot_id: "7190707372", // Замените на ID вашего бота
            request_access: "write",
            lang: "ru",
            data_auth_url: "http://localhost.local:8088/auth/telegram"
          },
          this.onTelegramAuth
        );
      },
  
      onTelegramAuth(user) {
        alert(
          `Logged in as ${user.first_name} ${user.last_name} (${user.id}${
            user.username ? ", @" + user.username : ""
          })`
        );
  
        this.sendUserDataToServer(user);
      },
  
      sendUserDataToServer(userData) {
        fetch("http://localhost.local:8088/auth/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Успешная аутентификация:", data);
            this.$router.push("/home");
          })
          .catch((error) => {
            console.error("Ошибка при аутентификации:", error);
          });
      },
    },
  };
  </script>
  
  <style scoped>
  .telegram-login-container {
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.telegram-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #389ce9; /* Цвет Telegram */
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 25px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.telegram-button:hover {
  background-color: #2d8ad9;
}

.telegram-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
  </style>