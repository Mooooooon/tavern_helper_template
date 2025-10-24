<template>
  <PhoneFrame
    :current-page="currentPage"
    :status-bar-color="getStatusBarColor()"
    @navigate="navigateTo"
  >
    <!-- 首页 -->
    <KeepAlive>
      <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />
    </KeepAlive>

    <!-- 设置页面 -->
    <KeepAlive>
      <SettingsPage v-if="currentPage === 'settings'" @navigate="navigateTo" />
    </KeepAlive>

    <!-- 聊天应用 -->
    <KeepAlive>
      <ChatApp v-if="currentPage === 'chat'" @navigate="navigateTo">
        <ChatLayout :active-conversation-id="conversationId" :active-page="currentChatPage" @navigate="navigateTo">
          <!-- 消息列表 -->
          <KeepAlive>
            <MessagesPage v-if="currentChatPage === 'messages'" @navigate="navigateTo" />
          </KeepAlive>

          <!-- 联系人页面 -->
          <KeepAlive>
            <ContactsPage v-if="currentChatPage === 'contacts'" @navigate="navigateTo" />
          </KeepAlive>

          <!-- 动态页面 -->
          <KeepAlive>
            <MomentsPage v-if="currentChatPage === 'moments'" @navigate="navigateTo" />
          </KeepAlive>

          <!-- 对话页面 -->
          <KeepAlive>
            <ConversationPage
              v-if="currentChatPage === 'conversation' && !!conversationId"
              :contact-id="conversationId"
              @navigate="navigateTo"
            />
          </KeepAlive>
        </ChatLayout>
      </ChatApp>
    </KeepAlive>
  </PhoneFrame>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PhoneFrame from './components/PhoneFrame.vue';
import HomePage from './views/HomePage.vue';
import SettingsPage from './views/SettingsPage.vue';
import ChatApp from './views/chat/ChatApp.vue';
import ChatLayout from './views/chat/ChatLayout.vue';
import MessagesPage from './views/chat/MessagesPage.vue';
import ContactsPage from './views/chat/ContactsPage.vue';
import MomentsPage from './views/chat/MomentsPage.vue';
import ConversationPage from './views/chat/ConversationPage.vue';
import { useChatStore } from './stores/chatStore';
import { useUserStore } from './stores/userStore';

// 当前页面状态
const currentPage = ref<'home' | 'settings' | 'chat'>('home');
const currentChatPage = ref<'messages' | 'contacts' | 'moments' | 'conversation'>('messages');
const conversationId = ref<string | null>(null);

const chatStore = useChatStore();
const userStore = useUserStore();

function setChatView(target: typeof currentChatPage.value, id: string | null = null) {
  currentPage.value = 'chat';
  currentChatPage.value = target;
  conversationId.value = target === 'conversation' ? id : null;
}

function handleBackNavigation() {
  if (currentChatPage.value === 'conversation') {
    currentChatPage.value = 'messages';
    conversationId.value = null;
    return;
  }

  if (currentChatPage.value === 'moments') {
    currentChatPage.value = 'messages';
    return;
  }

  if (currentPage.value === 'chat' || currentPage.value === 'settings') {
    currentPage.value = 'home';
  }
}

// 导航处理
function navigateTo(page: string, params?: Record<string, any>) {
  const chatPageMap: Record<string, typeof currentChatPage.value> = {
    '/chat': 'messages',
    '/chat/messages': 'messages',
    '/chat/contacts': 'contacts',
    '/chat/moments': 'moments',
  };

  if (page === 'back') {
    handleBackNavigation();
    return;
  }

  if (page in chatPageMap) {
    setChatView(chatPageMap[page]);
    return;
  }

  if (page.startsWith('/chat/messages/')) {
    const id = typeof params?.id === 'string' ? params.id : page.split('/').pop() || null;
    setChatView('conversation', id);
    return;
  }

  switch (page) {
    case '/':
      currentPage.value = 'home';
      break;
    case '/settings':
      currentPage.value = 'settings';
      break;
    default:
      break;
  }
}

// 根据当前页面获取状态栏颜色
function getStatusBarColor(): string {
  switch (currentPage.value) {
    case 'home':
      return 'transparent';
    case 'settings':
      return '#f6f8ff';
    case 'chat':
      return '#fff';
    default:
      return 'transparent';
  }
}

onMounted(() => {
  void chatStore.ensureInitialized();
  void userStore.ensureInitialized();
});
</script>

<style lang="scss">
// 全局样式将在此定义

/* 全局滚动条隐藏 */
* {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

*::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  display: none !important;
}

/* 全局按钮重置样式 */
button {
  border: none !important;
  background: none !important;
  outline: none !important;
  box-shadow: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
}

button:focus {
  outline: none !important;
  box-shadow: none !important;
}

/* 针对特定类名的按钮样式 */
.nav-item,
.header-button,
.icon-button,
.moment-more {
  border: none !important;
  background: none !important;
  padding: 0 !important;
  margin: 0 !important;
  outline: none !important;
  box-shadow: none !important;
  text-shadow: none !important;
  cursor: pointer;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
}

.nav-item:focus,
.header-button:focus,
.icon-button:focus,
.moment-more:focus {
  outline: none !important;
  box-shadow: none !important;
}
</style>
