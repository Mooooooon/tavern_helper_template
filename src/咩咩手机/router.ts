import { createRouter, createMemoryHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';
import SettingsPage from './views/SettingsPage.vue';
import ChatApp from './views/chat/ChatApp.vue';
import ChatLayout from './views/chat/ChatLayout.vue';
import MessagesPage from './views/chat/MessagesPage.vue';
import ContactsPage from './views/chat/ContactsPage.vue';
import MomentsPage from './views/chat/MomentsPage.vue';
import ConversationPage from './views/chat/ConversationPage.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { statusBarColor: 'transparent' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
      meta: { statusBarColor: '#f6f8ff' },
    },
    {
      path: '/chat',
      component: ChatApp,
      meta: { statusBarColor: '#fff' },
      children: [
        {
          path: '',
          component: ChatLayout,
          children: [
            { path: '', redirect: '/chat/messages' },
            { path: 'messages', name: 'chat-messages', component: MessagesPage },
            {
              path: 'messages/:id',
              name: 'chat-conversation',
              component: ConversationPage,
              meta: { statusBarColor: '#fff', parentRoute: 'chat-messages' },
            },
            { path: 'contacts', name: 'chat-contacts', component: ContactsPage },
          ],
        },
        {
          path: 'moments',
          name: 'chat-moments',
          component: MomentsPage,
        },
      ],
    },
  ],
});

export default router;
