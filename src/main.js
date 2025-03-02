// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import components from "@/components/Quest";
import '@/assets/styles/variables.css';
import '@/assets/styles/main.css';

const app = createApp(App);

components.forEach((component) => {
  app.component(component.name, component);
});

app.use(store);
app.use(router);
app.mount("#app");