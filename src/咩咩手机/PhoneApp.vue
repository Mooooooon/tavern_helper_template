<template>
  <PhoneFrame
    :current-page="currentPage"
    :status-bar-color="getStatusBarColor()"
    @navigate="navigateTo"
  >
    <!-- 首页 -->
    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />

    <!-- 设置页面 -->
    <SettingsPage v-else-if="currentPage === 'settings'" @navigate="navigateTo" />

    <!-- 聊天应用 -->
    <ChatApp v-else-if="currentPage === 'chat'" @navigate="navigateTo">
      <ChatLayout @navigate="navigateTo" :active-conversation-id="conversationId" :active-page="currentChatPage">
        <!-- 消息列表 -->
        <MessagesPage v-if="currentChatPage === 'messages'" @navigate="navigateTo" />

        <!-- 联系人页面 -->
        <ContactsPage v-else-if="currentChatPage === 'contacts'" @navigate="navigateTo" />

        <!-- 动态页面 -->
        <MomentsPage v-else-if="currentChatPage === 'moments'" @navigate="navigateTo" />

        <!-- 对话页面 -->
        <ConversationPage
          v-else-if="currentChatPage === 'conversation'"
          :contact-id="conversationId"
          @navigate="navigateTo"
        />
      </ChatLayout>
    </ChatApp>

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

// 当前页面状态
const currentPage = ref<'home' | 'settings' | 'chat'>('home');
const currentChatPage = ref<'messages' | 'contacts' | 'moments' | 'conversation'>('messages');
const conversationId = ref<string | null>(null);

// 导航处理
function navigateTo(page: string, params?: any) {
  if (page === '/') {
    currentPage.value = 'home';
  } else if (page === '/settings') {
    currentPage.value = 'settings';
  } else if (page === '/chat' || page === '/chat/messages') {
    currentPage.value = 'chat';
    currentChatPage.value = 'messages';
  } else if (page === '/chat/contacts') {
    currentPage.value = 'chat';
    currentChatPage.value = 'contacts';
  } else if (page === '/chat/moments') {
    currentPage.value = 'chat';
    currentChatPage.value = 'moments';
  } else if (page.startsWith('/chat/messages/')) {
    currentPage.value = 'chat';
    currentChatPage.value = 'conversation';
    conversationId.value = params?.id || page.split('/').pop() || null;
  } else if (page === 'back') {
    // 处理返回操作
    if (currentChatPage.value === 'conversation') {
      currentChatPage.value = 'messages';
      conversationId.value = null;
    } else if (currentChatPage.value === 'moments') {
      // 从动态页面返回到消息列表，而不是首页
      currentChatPage.value = 'messages';
    } else if (currentPage.value === 'chat') {
      currentPage.value = 'home';
    } else if (currentPage.value === 'settings') {
      currentPage.value = 'home';
    }
  }
}

// 根据当前页面获取状态栏颜色
function getStatusBarColor(): string {
  if (currentPage.value === 'home') {
    return 'transparent';
  } else if (currentPage.value === 'settings') {
    return '#f6f8ff';
  } else if (currentPage.value === 'chat') {
    if (currentChatPage.value === 'conversation') {
      return '#fff';
    }
    return '#fff';
  }
  return 'transparent';
}

onMounted(() => {
  console.log('手机UI已加载');
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
