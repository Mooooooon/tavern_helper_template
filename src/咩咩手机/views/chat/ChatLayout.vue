<template>
  <div class="chat-layout">
    <header class="chat-header">
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
    </header>
    <main class="chat-content">
      <router-view></router-view>
    </main>
    <footer class="chat-footer">
      <nav>
        <router-link to="/chat/messages" class="nav-item">
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
import { computed } from 'vue';
import { getAvatarSrc } from '../../utils/avatarPlaceholder';

const ownerName = '咩咩助手';
const ownerStatus = '在线';
const ownerAvatar = computed(() => getAvatarSrc(undefined, 'owner', 40));
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
.nav-item.router-link-exact-active {
  color: #1f1f1f;
  font-weight: 600;
}

.nav-item.router-link-active::after,
.nav-item.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: #1f1f1f;
}
</style>
