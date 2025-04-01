// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProfileView from "@/views/ProfileView.vue";
import PreviousView from "@/views/PreviousView.vue";
import RegistrationView from "@/views/RegistrationView.vue";
import QuestView from "@/views/QuestView.vue";
import BlocksView from "@/views/BlocksView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { title: "Культурно-исторический квест по Москве" }
  },
  {
     path: "/quest",
     name: "quest",
     component: QuestView,
     meta: { title: "Прохождение квеста" }
   },
  {
    path: "/quest/:id",
    name: "questBlock",
    component: BlocksView,
    meta: { title: "Блок квеста" }
  },
   {
     path: "/profile",
     name: "profile",
     component: ProfileView,
     meta: { title: "Личный кабинет" }
   },
   {
    path: "/previous",
    name: "previous",
    component: PreviousView,
    meta: { title: "Предыдущие квесты" }
  },
  {
    path: "/registration",
    name: "registration",
    component: RegistrationView,
    meta: { title: "Регистрация на квест" }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Update page title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "HSE RUN - Культурно-исторический квест";
  next();
});

export default router;
