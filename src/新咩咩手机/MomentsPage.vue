<template>
  <div class="mimi-moments-page">
    <!-- 动态列表页面 -->
    <div v-show="currentView === 'list'" class="mimi-moments-view">
      <header class="mimi-moments-header" :style="momentsHeaderStyle">
        <button
          class="mimi-header-button mimi-header-button--back"
          type="button"
          aria-label="返回聊天列表"
          @click="goBack"
        >
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <span class="mimi-moments-title">动态</span>
        <div class="mimi-actions">
          <button class="mimi-icon-button" type="button" aria-label="发布动态" @click="handlePublishMoment">
            <svg viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <main class="mimi-moments-list">
      <article v-for="moment in moments" :key="moment.id" class="mimi-moment-card">
        <header class="mimi-moment-card-header">
          <div class="mimi-moment-user">
            <img :src="moment.avatar || ''" alt="" class="mimi-moment-avatar" />
            <div class="mimi-moment-user-info">
              <span class="mimi-moment-name">{{ moment.name }}</span>
            </div>
          </div>
          <button class="mimi-moment-more" type="button" aria-label="更多" @click="handleMomentMore">
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"
              />
            </svg>
          </button>
        </header>
        <div class="mimi-moment-body">
          <p class="mimi-moment-content">{{ moment.content }}</p>
          <span class="mimi-moment-timestamp">{{ moment.timestamp }}</span>
        </div>
        <ul v-if="moment.comments.length" class="mimi-moment-comments">
          <li v-for="comment in moment.comments" :key="comment.id" class="mimi-moment-comment">
            <span class="mimi-moment-comment-author">{{ comment.author }}</span
            >：{{ comment.content }}
          </li>
        </ul>
        <div class="mimi-moment-reply">
          <input
            class="mimi-moment-reply-input"
            type="text"
            placeholder="说点什么吧"
            @keypress.enter="handleReplySubmit"
            v-model="replyInputs[moment.id]"
          />
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

    <!-- 发布动态页面 -->
    <div v-show="currentView === 'publish'" class="mimi-publish-view">
      <PublishMomentPage
        @go-back="handlePublishBack"
        @publish="handleMomentPublish"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PublishMomentPage from './PublishMomentPage.vue';

// 定义发射事件和props
const emit = defineEmits<{
  goBack: [];
}>();

const props = defineProps<{
  momentsData?: any[];
}>();

// 页面状态
const currentView = ref<'list' | 'publish'>('list');

// 回复输入框的状态
const replyInputs = ref<Record<string, string>>({});

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

// 动态页面状态栏颜色计算
const momentsHeaderStyle = computed(() => ({
  backgroundColor: '#ffffff',
  color: '#222222',
}));

const moments = computed<MomentItem[]>(() => {
  return props.momentsData && Array.isArray(props.momentsData) ? props.momentsData : [];
});

function goBack() {
  emit('goBack');
}

function handlePublishMoment() {
  currentView.value = 'publish';
}

function handlePublishBack() {
  currentView.value = 'list';
}

function handleMomentPublish(content: string) {
  // 发布成功后返回列表页面
  currentView.value = 'list';

  // 将发布的内容发送到酒馆
  publishMomentToTavern(content);
}

// 将动态发布到酒馆的函数
function publishMomentToTavern(content: string) {
  try {
    // 加工动态格式，添加标识符
    const processedMoment = `[手机系统：发布动态-"${content}"]`;

    // 将动态填入酒馆输入框
    fillMomentToTavernInput(processedMoment);

    console.log('发布动态:', processedMoment);
    toastr.success('动态已发送到酒馆', '成功');

  } catch (error) {
    console.error('[MomentsPage] 发布动态时出错:', error);
    toastr.error('发布动态失败', '错误');
  }
}

// 将动态填入酒馆输入框的函数
function fillMomentToTavernInput(moment: string) {
  try {
    // 使用jQuery来操作酒馆的输入框
    const $tavernTextarea = $('#send_textarea');

    if ($tavernTextarea.length === 0) {
      console.warn('[MomentsPage] 未找到酒馆输入框 #send_textarea');
      toastr.warning('未找到酒馆输入框', '提示');
      return;
    }

    // 获取当前输入框的内容
    const currentContent = $tavernTextarea.val()?.toString().trim() || '';

    // 如果输入框已有内容，需要在前面添加换行
    let newContent: string;
    if (currentContent) {
      newContent = currentContent + '\n' + moment;
    } else {
      newContent = moment;
    }

    // 设置新的内容并触发input事件
    $tavernTextarea
      .val(newContent.trim())
      .get(0)?.dispatchEvent(new Event('input', { bubbles: true }));

    // 将焦点设置到输入框
    $tavernTextarea.focus();

    // 将光标移动到末尾
    const textarea = $tavernTextarea.get(0) as HTMLTextAreaElement;
    if (textarea) {
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }

    console.log('[MomentsPage] 动态已填入酒馆输入框:', moment);

  } catch (error) {
    console.error('[MomentsPage] 填入动态到输入框时出错:', error);
    throw error;
  }
}

function handleMomentMore() {
  toastr.info('动态更多操作功能暂未完成，敬请期待！', '提示');
}

function handleReplySubmit() {
  toastr.info('评论功能暂未完成，敬请期待！', '提示');
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
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.mimi-moments-page::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.mimi-moments-view,
.mimi-publish-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
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
  cursor: default;
  user-select: none;
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

/* 手机应用输入框样式隔离 */
.mimi-moments-page input[type='text'],
.mimi-moments-page input[type='number'],
.mimi-moments-page input:not([type]),
.mimi-moments-page textarea:not([type='search']) {
  background-color: #f3f4f6 !important;
  border: none !important;
  color: #2c2c2e !important;
}

.mimi-moments-page .mimi-moment-reply-input {
  background-color: #f3f4f6 !important;
  border: none !important;
  color: #2c2c2e !important;
}

.mimi-moments-page .mimi-moment-reply-input::placeholder {
  color: #9b9b9f !important;
}
</style>
