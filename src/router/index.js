// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProfileView from "@/views/ProfileView.vue";
import PreviousView from "@/views/PreviousView.vue";
import RegistrationView from "@/views/RegistrationView.vue";
import QuestView from "@/views/QuestView.vue";
import BlocksView from "@/views/BlocksView.vue";
import QrVerifyView from "@/views/QrVerifyView.vue";

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
     meta: { title: "Прохождение квеста", requiresActiveEvent: true }
   },
  {
    path: "/quest/:id",
    name: "questBlock",
    component: BlocksView,
    meta: { title: "Блок квеста", requiresActiveEvent: true }
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
  },
  {
    path: "/qr/verify",
    name: "qrVerify",
    component: QrVerifyView,
    meta: { title: "QR-код" }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Update page title and check event status
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title || "HSE RUN - Культурно-исторический квест";
  
  // Если путь /qr/verify - добавим обработку чтобы фронтенд обрабатывал этот маршрут
  if (to.path === '/qr/verify') {
    return next();
  }
  
  // Проверяем, требуется ли активный квест для маршрута
  if (to.meta.requiresActiveEvent) {
    try {
      const response = await fetch('/api/auth/event/status');
      const data = await response.json();
      
      if (!data.is_active) {
        // Если квест не активен, перенаправляем на главную
        alert('Квест ещё не начался или уже закончился');
        return next('/');
      }
    } catch (error) {
      console.error('Ошибка при проверке статуса события:', error);
      // При ошибке также перенаправляем на главную
      return next('/');
    }
  }
  
  next();
});

export default router;
