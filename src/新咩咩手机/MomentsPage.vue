<template>
  <div class="mimi-moments-page">
    <header class="mimi-moments-header" :style="momentsHeaderStyle" @click="handleMomentsHeaderClick">
      <button class="mimi-header-button mimi-header-button--back" type="button" aria-label="返回聊天列表" @click="goBack">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <span class="mimi-moments-title">动态</span>
      <div class="mimi-actions">
        <button class="mimi-icon-button" type="button" aria-label="发布动态">
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

    <main class="mimi-moments-list">
      <article v-for="moment in moments" :key="moment.id" class="mimi-moment-card">
        <header class="mimi-moment-card-header">
          <div class="mimi-moment-user">
            <img :src="moment.avatar || ''" alt="" class="mimi-moment-avatar">
            <div class="mimi-moment-user-info">
              <span class="mimi-moment-name">{{ moment.name }}</span>
            </div>
          </div>
          <button class="mimi-moment-more" type="button" aria-label="更多">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </header>
        <div class="mimi-moment-body">
          <p class="mimi-moment-content">{{ moment.content }}</p>
          <span class="mimi-moment-timestamp">{{ moment.timestamp }}</span>
        </div>
        <ul v-if="moment.comments.length" class="mimi-moment-comments">
          <li v-for="comment in moment.comments" :key="comment.id" class="mimi-moment-comment">
            <span class="mimi-moment-comment-author">{{ comment.author }}</span>：{{ comment.content }}
          </li>
        </ul>
        <div class="mimi-moment-reply">
          <input class="mimi-moment-reply-input" type="text" placeholder="说点什么吧">
        </div>
      </article>

      <div v-if="moments.length === 0" class="mimi-empty-state">
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2.5l2.47 5.01 5.53.8-4 3.89.94 5.5L12 15.77 7.06 17.7l.94-5.5-4-3.89 5.53-.8L12 2.5z"
          />
        </svg>
        <p>暂无动态</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 定义发射事件和props
const emit = defineEmits<{
  goBack: []
}>();

const props = defineProps<{
  momentsData?: any[]
}>();

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

// 双击返回主页功能
const momentsLastTapTime = ref(0);
const MOMENTS_TAP_TIMEOUT = 300; // 双击间隔时间（毫秒）

// 双击顶部header返回主页
function handleMomentsHeaderClick(event: MouseEvent) {
  // 如果点击的是按钮或其子元素，不触发双击返回
  const target = event.target as HTMLElement;
  if (target.closest('button')) {
    return;
  }

  const currentTimeMs = Date.now();

  if (currentTimeMs - momentsLastTapTime.value < MOMENTS_TAP_TIMEOUT) {
    // 双击检测到，返回主页
    emit('goBack');
  }

  momentsLastTapTime.value = currentTimeMs;
}

// 动态页面状态栏颜色计算
const momentsHeaderStyle = computed(() => ({
  backgroundColor: '#ffffff',
  color: '#222222',
}));


const moments = computed<MomentItem[]>(() => {
  return (props.momentsData && Array.isArray(props.momentsData))
    ? props.momentsData
    : [];
});

function goBack() {
  emit('goBack');
}
</script>

<style lang="scss" scoped>
.mimi-moments-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: #f6f6f7;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mimi-moments-page::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.mimi-moments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 12px;
  width: 100%;
  box-sizing: border-box;
  background: #ffffff;
  border-bottom: 1px solid #e8e8ea;
  color: #1f1f1f;
  cursor: grab;
  user-select: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.mimi-moments-header:active {
  cursor: grabbing;
}

.mimi-moments-header:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.mimi-moments-header:active {
  background-color: rgba(0, 0, 0, 0.05);
}

.mimi-moments-title {
  font-weight: 600;
  font-size: 16px;
}

.mimi-header-button {
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

.mimi-header-button:hover {
  color: #1f1f1f;
}

.mimi-header-button svg {
  width: 32px;
  height: 32px;
}

.mimi-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.mimi-icon-button {
  border: none;
  background: none;
  color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
}

.mimi-icon-button svg {
  width: 32px;
  height: 32px;
}

.mimi-moments-list {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #ffffff;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mimi-moment-card {
  background-color: #fff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid #ededf0;
}

.mimi-moment-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.mimi-moment-user {
  display: flex;
  gap: 12px;
  align-items: center;
}

.mimi-moment-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e5e5e8;
}

.mimi-moment-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mimi-moment-name {
  font-weight: 600;
  color: #1f1f1f;
}

.mimi-moment-timestamp {
  font-size: 12px;
  color: #9b9b9f;
}

.mimi-moment-more {
  border: none;
  background: none;
  color: #9b9b9f;
  cursor: pointer;
  padding: 4px;
}

.mimi-moment-more svg {
  width: 16px;
  height: 16px;
}

.mimi-moment-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.mimi-moment-content {
  color: #2c2c2e;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}

.mimi-moment-comments {
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

.mimi-moment-comment {
  line-height: 1.4;
}

.mimi-moment-comment-author {
  color: #3271ff;
  font-weight: 500;
}

.mimi-moment-reply {
  margin-top: 4px;
}

.mimi-moment-reply-input {
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 12px;
  background-color: #f3f4f6;
  color: #2c2c2e;
  font-size: 14px;
  outline: none;
}

.mimi-moment-reply-input::placeholder {
  color: #9b9b9f;
}

.mimi-empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #9b9b9f;
  padding: 32px;
}

.mimi-empty-state svg {
  width: 48px;
  height: 48px;
}

/* WebKit 隐藏滚动条 */
.mimi-moments-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>