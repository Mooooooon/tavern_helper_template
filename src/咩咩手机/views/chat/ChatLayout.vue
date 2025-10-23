<template>
  <div class="chat-layout">
    <header class="chat-header" :class="{ 'chat-header--conversation': !!activeConversation }">
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
          <img :src="ownerAvatar" alt="Avatar" class="avatar">
          <div class="profile-info">
            <span class="profile-name">{{ ownerName }}</span>
            <span class="profile-status">
              <span class="status-dot" aria-hidden="true"></span>
              {{ ownerStatus }}
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
      <router-view v-if="initialized"></router-view>
    </main>
    <footer v-if="!activeConversation && initialized" class="chat-footer">
      <nav>
        <router-link
          to="/chat/messages"
          class="nav-item"
          :class="{ 'nav-item--active': isMessagesActive }"
        >
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
          <span>消息</span>
        </router-link>
        <router-link to="/chat/contacts" class="nav-item">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          <span>联系人</span>
        </router-link>
        <router-link to="/chat/moments" class="nav-item">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path
              fill="currentColor"
              d="M12 2.5l2.47 5.01 5.53.8-4 3.89.94 5.5L12 15.77 7.06 17.7l.94-5.5-4-3.89 5.53-.8L12 2.5z"
            />
          </svg>
          <span>动态</span>
        </router-link>
      </nav>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAvatarSrc, resolveAvatar } from '../../utils/avatarPlaceholder';
import { useChatStore } from '../../stores/chatStore';

const ownerName = ref('咩咩助手');
const ownerStatus = '在线';
const defaultOwnerAvatar = getAvatarSrc(undefined, 'owner', 40);
const ownerAvatar = ref(defaultOwnerAvatar);
const initialized = ref(false);

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();

const isMessagesActive = computed(() => {
  if (route.name === 'chat-messages') {
    return true;
  }
  return route.meta.parentRoute === 'chat-messages';
});

const activeConversation = computed(() => {
  if (route.name !== 'chat-conversation') {
    return undefined;
  }
  const contactName = typeof route.params.id === 'string' ? route.params.id : undefined;
  if (!contactName) {
    return undefined;
  }
  const detail = chatStore.contactDetail(contactName);
  if (!detail) {
    return undefined;
  }
  return {
    name: detail.displayName,
    meta: detail.signature,
  };
});

function goBack() {
  router.push({ name: 'chat-messages' });
}

async function loadOwnerName() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (typeof triggerSlash === 'function') {
      const userName = await triggerSlash('/pass {{user}}');
      if (userName && userName !== 'undefined') {
        ownerName.value = userName;
        return;
      }
    }

    const helperUserName = await window.TavernHelper?.triggerSlash?.('/pass {{user}}');
    if (helperUserName && helperUserName !== 'undefined') {
      ownerName.value = helperUserName;
    }
  } catch (error) {
    console.warn('[ChatLayout] 获取用户名失败', error);
  }
}

async function loadOwnerAvatar() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (typeof triggerSlash === 'function') {
      const avatarPath = await triggerSlash('/pass {{userAvatarPath}}');
      const resolved = resolveAvatar(avatarPath);
      if (resolved && resolved !== 'undefined') {
        ownerAvatar.value = resolved;
        return;
      }
      if (typeof avatarPath === 'string' && avatarPath && avatarPath !== 'undefined') {
        ownerAvatar.value = avatarPath;
        return;
      }
    }

    const helperAvatar = resolveAvatar('char');
    if (helperAvatar) {
      ownerAvatar.value = helperAvatar;
    }
  } catch (error) {
    console.warn('[ChatLayout] 获取用户头像失败', error);
  }
}

onMounted(async () => {
  await chatStore.ensureInitialized();
  initialized.value = true;
  void loadOwnerName();
  void loadOwnerAvatar();
});
</script>

<style scoped>
.chat-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background-color: #f6f6f7;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 12px;
  background-color: #ffffff;
  color: #222;
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
  justify-content: flex-start;
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

.header-button--more {
  margin-left: auto;
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
