<template>
  <div class="chat-layout">
    <header v-if="!shouldHideHeader" class="chat-header" :class="{ 'chat-header--conversation': !!activeConversation }">
      <template v-if="activeConversation">
        <button class="header-button header-button--back" type="button" aria-label="返回聊天列表" @click="goBack">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <div class="conversation-info">
          <span class="conversation-name">{{ activeConversation.name }}</span>
          <span class="conversation-meta">{{ activeConversation.meta }}</span>
        </div>
        <button class="header-button header-button--more" type="button" aria-label="更多操作">
          <svg viewBox="0 0 24 24">
            <rect x="6" y="8" width="12" height="1.8" rx="0.9" fill="currentColor" />
            <rect x="6" y="12" width="12" height="1.8" rx="0.9" fill="currentColor" />
            <rect x="6" y="16" width="12" height="1.8" rx="0.9" fill="currentColor" />
          </svg>
        </button>
      </template>
      <template v-else-if="initialized">
        <div class="profile">
          <img :src="userInfo.avatar" alt="Avatar" class="avatar">
          <div class="profile-info">
            <span class="profile-name">{{ userInfo.name }}</span>
            <span class="profile-status">
              <span class="status-dot" aria-hidden="true"></span>
              {{ userInfo.status }}
            </span>
          </div>
        </div>
        <div class="actions">
          <button class="icon-button" type="button" aria-label="添加联系人">
            <svg viewBox="0 0 24 24">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
      </template>
    </header>
    <main class="chat-content" :class="{ 'chat-content--conversation': !!activeConversation }">
      <slot></slot>
    </main>
    <footer v-if="!activeConversation && initialized && activePage !== 'moments'" class="chat-footer">
      <nav>
        <button
          class="nav-item"
          :class="{ 'nav-item--active': isMessagesActive }"
          @click="emit('navigate', '/chat/messages')"
        >
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
          <span>消息</span>
        </button>
        <button class="nav-item" :class="{ 'nav-item--active': isContactsActive }" @click="emit('navigate', '/chat/contacts')">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          <span>联系人</span>
        </button>
        <button class="nav-item" :class="{ 'nav-item--active': isMomentsActive }" @click="emit('navigate', '/chat/moments')">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path
              fill="currentColor"
              d="M12 2.5l2.47 5.01 5.53.8-4 3.89.94 5.5L12 15.77 7.06 17.7l.94-5.5-4-3.89 5.53-.8L12 2.5z"
            />
          </svg>
          <span>动态</span>
        </button>
      </nav>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '../../stores/chatStore';
import { useUserStore } from '../../stores/userStore';

// 定义props和emits
const props = defineProps<{
  activeConversationId?: string | null,
  activePage?: string
}>();

const emit = defineEmits<{
  navigate: [page: string, params?: any]
}>();

const chatStore = useChatStore();
const userStore = useUserStore();

const { userInfo } = storeToRefs(userStore);
const initialized = ref(true); // 临时设为true，不阻塞显示

// 根据当前活跃的页面来判断是否为消息页面
const isMessagesActive = computed(() => {
  return props.activePage === 'messages' || (!props.activeConversationId && props.activePage !== 'contacts' && props.activePage !== 'moments');
});

// 判断联系人页面是否激活
const isContactsActive = computed(() => {
  return props.activePage === 'contacts';
});

// 判断动态页面是否激活
const isMomentsActive = computed(() => {
  return props.activePage === 'moments';
});

// 判断是否应该隐藏header（动态页面有自定义header）
const shouldHideHeader = computed(() => {
  return props.activePage === 'moments';
});

const activeConversation = computed(() => {
  if (!props.activeConversationId) {
    return undefined;
  }
  const detail = chatStore.contactDetail(props.activeConversationId);
  if (!detail) {
    return undefined;
  }
  return {
    name: detail.displayName,
    meta: detail.signature,
  };
});

function goBack() {
  emit('navigate', 'back');
}

onMounted(() => {
  // 确保stores已经初始化（应该在全局已经初始化过了）
  if (!chatStore.initialized) {
    void chatStore.ensureInitialized();
  }
  if (!userStore.initialized) {
    void userStore.ensureInitialized();
  }
});
</script>

<style>
.chat-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background-color: #f6f6f7;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.chat-layout::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 0 16px 12px;
  background-color: #ffffff;
  color: #222;
  width: 100%;
  box-sizing: border-box;
}

.profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ededed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  object-fit: cover;
  object-position: center;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.1;
}

.profile-name {
  font-size: 16px;
  font-weight: 600;
}

.profile-status {
  font-size: 12px;
  color: #6f6f73;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #3cc77a;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.icon-button {
  border: none;
  background: none;
  color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
}

.icon-button svg {
  width: 32px;
  height: 32px;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  background-color: #ffffff;
}

.chat-content--conversation {
  background-color: #f2f3f5;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

.chat-footer {
  border-top: 1px solid #e8e8ea;
  background-color: #ffffff;
  padding: 6px 12px;
}

nav {
  display: flex;
  justify-content: center;
  gap: 0;
  align-items: center;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-decoration: none;
  color: #909097;
  font-size: 12px;
  gap: 2px;
  position: relative;
  transition: color 0.2s ease;
  /* 强制重置按钮样式 */
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

.nav-item:focus {
  outline: none !important;
  box-shadow: none !important;
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.nav-item.router-link-active,
.nav-item.router-link-exact-active,
.nav-item.nav-item--active {
  color: #1f1f1f;
  font-weight: 600;
}

.nav-item.router-link-active::after,
.nav-item.router-link-exact-active::after,
.nav-item.nav-item--active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: #1f1f1f;
}

.chat-header--conversation {
  gap: 12px;
}

.header-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: #424249;
  padding: 4px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.header-button:hover {
  color: #1f1f1f;
}

.header-button svg {
  width: 32px;
  height: 32px;
}

.header-button.header-button--more {
  margin-left: auto !important;
}

.conversation-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.conversation-name {
  font-weight: 600;
  font-size: 16px;
  color: #1f1f1f;
}

.conversation-meta {
  font-size: 12px;
  color: #8c9099;
}
</style>
