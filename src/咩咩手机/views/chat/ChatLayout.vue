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
      <template v-else>
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
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAvatarSrc } from '../../utils/avatarPlaceholder';
import { getConversationById } from './conversationData';

const ownerName = '咩咩助手';
const ownerStatus = '在线';
const ownerAvatar = computed(() => getAvatarSrc(undefined, 'owner', 40));

const route = useRoute();
const router = useRouter();

const activeConversation = computed(() => {
  if (route.name !== 'chat-conversation') {
    return undefined;
  }
  const id = Number(route.params.id);
  if (Number.isNaN(id)) {
    return undefined;
  }
  return getConversationById(id);
});

function goBack() {
  router.push({ name: 'chat-messages' });
}
</script>

<style scoped>
.chat-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f6f6f7;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 12px;
  background-color: #ffffff;
  border-bottom: 1px solid #e8e8ea;
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
