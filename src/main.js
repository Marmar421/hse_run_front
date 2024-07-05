import "primeflex/primeflex.css";

import "@/assets/theme.css";

import "@/assets/themePrimeVue.css";
import "primeicons/primeicons.css";

import { createApp } from "vue";
import App from "./App";
import router from "@/router/router";
import components from "@/components/UI";
import directives from "@/directives";
import store from "@/store";

import axiosApp from "@/router/axios";
import PrimeVue from "primevue/config";
import { createMetaManager, plugin as metaPlugin } from "vue-meta";

const app = createApp(App);

components.forEach((component) => {
  app.component(component.name, component);
});

directives.forEach((directive) => {
  app.directive(directive.name, directive);
});

app.config.globalProperties.$axios = axiosApp;
store.$axios = axiosApp;

app.use(PrimeVue, { ripple: true });
app.use(store);
app.use(router);
app.use(createMetaManager());
app.use(metaPlugin);
app.mount("#app");
