<template>
  <div class="moments-page">
    <header class="moments-header">
      <button @click="$router.back()" class="back-button" type="button" aria-label="返回">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <span>动态</span>
      <button class="publish-button" type="button" aria-label="发布动态">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 5v6H6v2h6v6h2v-6h6v-2h-6V5z" />
        </svg>
      </button>
    </header>

    <div class="profile-section">
      <img :src="getAvatarSrc(profile.avatar, 'profile', 80)" alt="User Avatar" class="profile-avatar">
      <div class="profile-info">
        <div class="profile-id">{{ profile.name }}</div>
        <div class="profile-bio">{{ profile.bio }}</div>
      </div>
    </div>

    <main class="moments-list">
      <article v-for="moment in moments" :key="moment.id" class="moment-card">
        <header class="moment-card-header">
          <div class="moment-user">
            <img :src="getAvatarSrc(moment.avatar, moment.id, 42)" alt="" class="moment-avatar">
            <div class="moment-user-info">
              <span class="moment-name">{{ moment.name }}</span>
              <span class="moment-timestamp">{{ moment.timestamp }}</span>
            </div>
          </div>
          <button class="moment-more" type="button" aria-label="更多">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </header>
        <p class="moment-content">{{ moment.content }}</p>
        <footer class="moment-footer">
          <span class="moment-meta">👍 {{ moment.likes }}</span>
          <span class="moment-meta">💬 {{ moment.comments }}</span>
        </footer>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAvatarSrc } from '../../utils/avatarPlaceholder';

interface Profile {
  name: string;
  bio: string;
  avatar?: string;
}

interface MomentItem {
  id: number;
  name: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  avatar?: string;
}

const profile = ref<Profile>({
  name: '咩咩助手',
  bio: '愿你所有的星辰都闪烁着希望。',
});

const moments = ref<MomentItem[]>([
  {
    id: 1,
    name: '喵喵',
    content: '今天的云彩像棉花糖一样软软的，想分给你一朵～',
    timestamp: '5分钟前',
    likes: 36,
    comments: 4,
  },
  {
    id: 2,
    name: '阿狸',
    content: '新上线的副本太刺激啦！集合开荒队伍，今晚继续冲💪',
    timestamp: '1小时前',
    likes: 58,
    comments: 12,
  },
  {
    id: 3,
    name: '星云工作室',
    content: '我们发布了全新的视觉指南，欢迎来围观并留下你的灵感。',
    timestamp: '昨天',
    likes: 102,
    comments: 23,
  },
]);
</script>

<style scoped>
.moments-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f6f6f7;
}

.moments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #e8e8ea;
  color: #1f1f1f;
}

.moments-header span {
  font-weight: 600;
  font-size: 16px;
}

.back-button,
.publish-button {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid #e0e0e2;
  background: #f8f8f9;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.back-button:hover,
.publish-button:hover {
  background: #ededf0;
}

.back-button svg,
.publish-button svg {
  width: 18px;
  height: 18px;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 16px;
  background-color: #fff;
  border-bottom: 1px solid #ededf0;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  object-fit: cover;
  border: 1px solid #e5e5e8;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-id {
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
}

.profile-bio {
  color: #5a5a5f;
  font-size: 13px;
  max-width: 220px;
}

.moments-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scrollbar-width: none;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.moment-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #ededf0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.moment-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.moment-user {
  display: flex;
  gap: 12px;
  align-items: center;
}

.moment-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e5e5e8;
}

.moment-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.moment-name {
  font-weight: 600;
  color: #1f1f1f;
}

.moment-timestamp {
  font-size: 12px;
  color: #9b9b9f;
}

.moment-more {
  border: none;
  background: none;
  color: #9b9b9f;
  cursor: pointer;
  padding: 4px;
}

.moment-more svg {
  width: 16px;
  height: 16px;
}

.moment-content {
  color: #2c2c2e;
  font-size: 14px;
  line-height: 1.5;
}

.moment-footer {
  display: flex;
  gap: 16px;
  color: #5a5a5f;
  font-size: 13px;
}

.moment-meta {
  display: flex;
  align-items: center;
  gap: 4px;
}

.moments-list:hover {
  scrollbar-width: thin;
}

.moments-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.moments-list:hover::-webkit-scrollbar {
  width: 4px;
}

.moments-list:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 999px;
}

.moments-list:hover::-webkit-scrollbar-track {
  background: transparent;
}
</style>
