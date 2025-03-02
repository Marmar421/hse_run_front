// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

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
     component: () => import("../views/QuestView.vue"),
     meta: { title: "Прохождение квеста" }
   },
  {
    path: "/registration",
     name: "registration",
     component: () => import("../views/RegistrationView.vue"),
     meta: { title: "Регистрация на квест" }
   },
   {
     path: "/about",
     name: "about",
     component: () => import("../views/AboutProjectView.vue"),
     meta: { title: "О проекте" }
   },
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
