import { createRouter, createMemoryHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';
import SettingsPage from './views/SettingsPage.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
    },
  ],
});

export default router;
