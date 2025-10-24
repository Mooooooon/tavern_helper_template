<template>
  <PhoneFrame
    :current-page="currentPage"
    :status-bar-color="getStatusBarColor()"
    @navigate="navigateTo"
  >
    <!-- 首页 -->
    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />

    <!-- 设置页面 -->
    <SettingsPage v-if="currentPage === 'settings'" @navigate="navigateTo" />

    <!-- 聊天应用 -->
    <ChatApp v-if="currentPage === 'chat'" @navigate="navigateTo">
      <ChatLayout
        v-if="currentPage === 'chat'"
        :active-conversation-id="conversationId"
        :active-page="currentChatPage"
        @navigate="navigateTo"
      >
        <!-- 消息列表 -->
        <MessagesPage
          v-if="currentChatPage === 'messages'"
          :key="`messages-${chatStoreUpdateKey}`"
          @navigate="navigateTo"
        />

        <!-- 联系人页面 -->
        <ContactsPage
          v-if="currentChatPage === 'contacts'"
          :key="`contacts-${chatStoreUpdateKey}`"
          @navigate="navigateTo"
        />

        <!-- 动态页面 -->
        <MomentsPage
          v-if="currentChatPage === 'moments'"
          :key="`moments-${chatStoreUpdateKey}`"
          @navigate="navigateTo"
        />

        <!-- 对话页面 -->
        <ConversationPage
          v-if="currentChatPage === 'conversation' && !!conversationId"
          :contact-id="conversationId"
          :key="`conversation-${conversationId}-${chatStoreUpdateKey}`"
          @navigate="navigateTo"
        />
      </ChatLayout>
    </ChatApp>
  </PhoneFrame>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
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

// 用于强制组件更新的key
const chatStoreUpdateKey = ref(0);

const chatStore = useChatStore();
const userStore = useUserStore();

// 监听chatStore的变化，触发组件更新
watch(
  () => [
    chatStore.currentTime,
    chatStore.contactOrder,
    chatStore.dynamics,
    Object.keys(chatStore.contacts).length
  ],
  () => {
    console.log('[PhoneApp] 检测到chatStore数据变化，更新UI组件');
    chatStoreUpdateKey.value++;
  },
  { deep: true }
);

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

// 暴露给外部调用的强制更新函数
function forceUpdateChatUI() {
  console.log('[PhoneApp] 强制更新聊天UI');
  chatStoreUpdateKey.value++;
}

// 将函数暴露到全局，供外部调用
if (typeof window !== 'undefined') {
  (window as any).__phoneAppForceUpdate = forceUpdateChatUI;
}
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
