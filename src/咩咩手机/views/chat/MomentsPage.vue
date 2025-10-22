<template>
  <div class="moments-page">
    <header class="moments-header">
      <button @click="$router.back()" class="header-button header-button--back" type="button" aria-label="返回">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <span>动态</span>
      <button class="icon-button" type="button" aria-label="发布动态">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 5v6H6v2h6v6h2v-6h6v-2h-6V5z" />
        </svg>
      </button>
    </header>

    <main class="moments-list">
      <article v-for="moment in moments" :key="moment.id" class="moment-card">
        <header class="moment-card-header">
          <div class="moment-user">
            <img :src="getAvatarSrc(moment.avatar, moment.id, 42)" alt="" class="moment-avatar">
            <div class="moment-user-info">
              <span class="moment-name">{{ moment.name }}</span>
            </div>
          </div>
          <button class="moment-more" type="button" aria-label="更多">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </header>
        <div class="moment-body">
          <p class="moment-content">{{ moment.content }}</p>
          <span class="moment-timestamp">{{ moment.timestamp }}</span>
        </div>
        <ul v-if="moment.comments.length" class="moment-comments">
          <li v-for="comment in moment.comments" :key="comment.id" class="moment-comment">
            <span class="moment-comment-author">{{ comment.author }}</span>：{{ comment.content }}
          </li>
        </ul>
        <div class="moment-reply">
          <input class="moment-reply-input" type="text" placeholder="说点什么吧">
        </div>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAvatarSrc } from '../../utils/avatarPlaceholder';

interface MomentComment {
  id: number;
  author: string;
  content: string;
}

interface MomentItem {
  id: number;
  name: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: MomentComment[];
  avatar?: string;
}

const moments = ref<MomentItem[]>([
  {
    id: 1,
    name: '喵喵',
    content: '今天的云彩像棉花糖一样软软的，想分给你一朵～',
    timestamp: '5分钟前',
    likes: 36,
    comments: [
      { id: 1, author: '小狐狸', content: '分我一朵！' },
      { id: 2, author: '月影', content: '看完心情都变甜了。' },
    ],
  },
  {
    id: 2,
    name: '阿狸',
    content: '新上线的副本太刺激啦！集合开荒队伍，今晚继续冲💪',
    timestamp: '1小时前',
    likes: 58,
    comments: [
      { id: 1, author: '骑士团长', content: '随时待命！' },
      { id: 2, author: '纸风车', content: '昨晚差一点点就过了。' },
    ],
  },
  {
    id: 3,
    name: '星云工作室',
    content: '我们发布了全新的视觉指南，欢迎来围观并留下你的灵感。',
    timestamp: '昨天',
    likes: 102,
    comments: [
      { id: 1, author: '色块', content: '太酷了，已经收藏！' },
      { id: 2, author: '点点', content: '期待更多配色案例~' },
    ],
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

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: #444;
  padding: 0;
  cursor: pointer;
}

.icon-button svg {
  width: 32px;
  height: 32px;
}

.moments-list {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scrollbar-width: none;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  background-color: #ffffff;
}

.moment-card {
  background-color: #fff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid #ededf0;
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

.moment-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.moment-content {
  color: #2c2c2e;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}

.moment-comments {
  margin: 0;
  padding: 8px 0;
  border-radius: 12px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #4c4c52;
  font-size: 15px;
}

.moment-comment {
  line-height: 1.4;
}

.moment-comment-author {
  color: #3271ff;
  font-weight: 500;
}

.moment-reply {
  margin-top: 4px;
}

.moment-reply-input {
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 12px;
  background-color: #f3f4f6;
  color: #2c2c2e;
  font-size: 14px;
  outline: none;
}

.moment-reply-input::placeholder {
  color: #9b9b9f;
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
