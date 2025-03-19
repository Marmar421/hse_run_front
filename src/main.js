// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '@/assets/styles/variables.css';
import '@/assets/styles/main.css';
import UI from "./components/UI/index"
import HomeHeader from "./components/Home/HomeHeader.vue";
import HomeStart from "./components/Home/HomeStart.vue";
import HomeParticipation from "./components/Home/HomeParticipation.vue";
import HomeFAQ from "./components/Home/HomeFAQ.vue";
import HomePartners from "./components/Home/HomePartners.vue";
import HomeFooter from "./components/Home/HomeFooter.vue";
import ProfileMain from "./components/Profile/ProfileMain.vue";
import BaseButton from "./components/UI/BaseButton.vue";
import QuestBlocks from "./components/Quest/QuestBlocks.vue";
import '@/assets/styles/fonts.css';
import TelegramLogin from "./components/Registration/TelegramLogin.vue";
import i18n from './i18n';



const app = createApp(App);

app.use(store);
app.use(router);
app.use(UI);
app.use(i18n);

app.mount('#app');

app.component('HomeHeader', HomeHeader);
app.component('HomeStart', HomeStart);
app.component('HomeParticipation', HomeParticipation);
app.component('HomeFAQ', HomeFAQ);
app.component('HomePartners', HomePartners);
app.component('HomeFooter', HomeFooter);
app.component('ProfileMain', ProfileMain);
app.component('BaseButton', BaseButton);
app.component('QuestBlocks', QuestBlocks);
app.component('TelegramLogin', TelegramLogin);

