<template>
  <div class="moments-page">
    <header class="moments-header">
      <button @click="emit('navigate', 'back')" class="header-button header-button--back" type="button" aria-label="返回">
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
            <img :src="moment.avatar || ''" alt="" class="moment-avatar">
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
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '../../stores/chatStore';

interface MomentComment {
  id: string;
  author: string;
  content: string;
}

interface MomentItem {
  id: string;
  contactName: string;
  name: string;
  content: string;
  timestamp: string;
  timeValue: number;
  comments: MomentComment[];
  avatar?: string;
}

// 定义发射事件
const emit = defineEmits<{
  navigate: [page: string]
}>();

const chatStore = useChatStore();
const { momentSummaries, currentTime } = storeToRefs(chatStore);

function formatMomentTimestamp(timestamp: number, nowMs: number): string {
  const now = new Date(nowMs);
  const date = new Date(timestamp);
  const diff = nowMs - timestamp;
  const pad = (value: number) => value.toString().padStart(2, '0');
  const timeText = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  if (diff < 0) {
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${timeText}`;
  }

  if (diff < 60 * 1000) {
    return '刚刚';
  }

  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}分钟前`;
  }

  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDiff = Math.floor((startOfNow - startOfDate) / (24 * 60 * 60 * 1000));

  if (dayDiff === 0) {
    return `今天 ${timeText}`;
  }

  if (dayDiff === 1) {
    return `昨天 ${timeText}`;
  }

  if (dayDiff === 2) {
    return `前天 ${timeText}`;
  }

  if (dayDiff > 2 && dayDiff < 7) {
    return `${dayDiff}天前 ${timeText}`;
  }

  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${timeText}`;
}

const moments = computed<MomentItem[]>(() => {
  const now = currentTime.value ?? Date.now();
  return momentSummaries.value.map(item => ({
    id: item.id,
    contactName: item.contactName,
    name: item.name,
    content: item.content,
    timestamp: formatMomentTimestamp(item.timestamp, now),
    timeValue: item.timestamp,
    comments: item.comments,
    avatar: item.avatar,
  }));
});
</script>

<style scoped>
.moments-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: #f6f6f7;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.moments-page::-webkit-scrollbar {
  width: 0;
  height: 0;
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
  background-color: #ffffff;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
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

/* WebKit 隐藏滚动条 */
.moments-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
