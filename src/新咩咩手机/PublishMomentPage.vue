<template>
  <div class="mimi-publish-moment-page">
    <header class="mimi-publish-header" :style="publishHeaderStyle">
      <button
        class="mimi-header-button mimi-header-button--back"
        type="button"
        aria-label="返回动态列表"
        @click="goBack"
      >
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <span class="mimi-publish-title">发布动态</span>
      <div class="mimi-actions">
        <button class="mimi-publish-button" type="button" :disabled="!canPublish" @click="handlePublish">
          发布
        </button>
      </div>
    </header>

    <main class="mimi-publish-content">
      <div class="mimi-publish-textarea-wrapper">
        <textarea
          ref="publishTextarea"
          v-model="momentContent"
          class="mimi-publish-textarea"
          placeholder="分享你的想法..."
          rows="8"
          maxlength="500"
          @input="handleInput"
        ></textarea>
        <div class="mimi-publish-counter">
          {{ momentContent.length }}/500
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';

// 定义发射事件
const emit = defineEmits<{
  goBack: [];
  publish: [content: string];
}>();

// 组件状态
const momentContent = ref('');
const publishTextarea = ref<HTMLTextAreaElement | null>(null);

// 发布页面头部样式
const publishHeaderStyle = computed(() => ({
  backgroundColor: '#ffffff',
  color: '#222222',
}));

// 计算是否可以发布
const canPublish = computed(() => {
  return momentContent.value.trim().length > 0;
});

function goBack() {
  emit('goBack');
}

function handleInput() {
  // 自动调整textarea高度
  if (publishTextarea.value) {
    publishTextarea.value.style.height = 'auto';
    publishTextarea.value.style.height = publishTextarea.value.scrollHeight + 'px';
  }
}

function handlePublish() {
  if (!canPublish.value) return;

  const content = momentContent.value.trim();
  if (content) {
    emit('publish', content);
    momentContent.value = '';
  }
}

// 组件挂载后聚焦到输入框
nextTick(() => {
  if (publishTextarea.value) {
    publishTextarea.value.focus();
  }
});
</script>

<style lang="scss" scoped>
.mimi-publish-moment-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: #ffffff;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mimi-publish-moment-page::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.mimi-publish-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 12px;
  width: 100%;
  box-sizing: border-box;
  background: #ffffff;
  border-bottom: 1px solid #e8e8ea;
  color: #1f1f1f;
  cursor: default;
  user-select: none;
}

.mimi-publish-title {
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

.mimi-publish-button {
  border: none;
  background: #007aff;
  color: white;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mimi-publish-button:hover:not(:disabled) {
  background: #0051d5;
}

.mimi-publish-button:disabled {
  background: #c7c7cc;
  color: #ffffff;
  cursor: not-allowed;
}

.mimi-publish-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mimi-publish-textarea-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mimi-publish-textarea {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 16px;
  line-height: 1.5;
  color: #1f1f1f;
  background: transparent;
  padding: 0;
  font-family: inherit;
  min-height: 120px;
  max-height: 400px;
  overflow-y: auto;
}

.mimi-publish-textarea::placeholder {
  color: #c7c7cc;
}

.mimi-publish-counter {
  text-align: right;
  font-size: 12px;
  color: #c7c7cc;
  margin-top: 8px;
  padding-right: 4px;
}

/* WebKit 隐藏滚动条 */
.mimi-publish-content::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.mimi-publish-textarea::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* 手机应用输入框样式隔离 */
.mimi-publish-moment-page textarea {
  background-color: transparent !important;
  border: none !important;
  color: #1f1f1f !important;
  font-size: 16px !important;
  line-height: 1.5 !important;
}

.mimi-publish-moment-page .mimi-publish-textarea {
  background-color: transparent !important;
  border: none !important;
  color: #1f1f1f !important;
  font-size: 16px !important;
  line-height: 1.5 !important;
}

.mimi-publish-moment-page .mimi-publish-textarea::placeholder {
  color: #c7c7cc !important;
}
</style>