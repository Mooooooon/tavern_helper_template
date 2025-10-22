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
            <img :src="getAvatarSrc(moment.avatar, moment.contactName, 42)" alt="" class="moment-avatar">
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
import { onMounted, ref } from 'vue';
import { getAvatarSrc, resolveAvatar as resolveAvatarSource } from '../../utils/avatarPlaceholder';

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

const moments = ref<MomentItem[]>([]);
const currentTime = ref<number>(Date.now());
const mvuInitialized = ref(false);
const loadError = ref<string | null>(null);

function normalizeTimestamp(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function formatMomentTimestamp(timestamp: number): string {
  const nowMs = currentTime.value;
  const now = new Date(nowMs);
  const date = new Date(timestamp);
  const diff = nowMs - timestamp;
  const pad = (num: number) => num.toString().padStart(2, '0');
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

function buildMomentsFromContacts(contactsData: Record<string, unknown>): MomentItem[] {
  const items: MomentItem[] = [];

  for (const [contactName, info] of Object.entries(contactsData)) {
    if (!info || typeof info !== 'object') {
      continue;
    }

    const contact = info as {
      昵称?: string;
      头像?: string;
      空间动态?: unknown;
    };

    const avatarUrl = resolveAvatarSource(contact.头像);
    const dynamics = Array.isArray(contact.空间动态) ? contact.空间动态 : [];

    dynamics.forEach((dynamicItem, index) => {
      if (!dynamicItem || typeof dynamicItem !== 'object') {
        return;
      }

      const momentData = dynamicItem as {
        时间?: number | string;
        内容?: string;
        评论列表?: unknown;
      };

      const timestamp = normalizeTimestamp(momentData.时间);
      const content = typeof momentData.内容 === 'string' ? momentData.内容 : '';

      if (!timestamp || !content) {
        return;
      }

      const commentsSource = Array.isArray(momentData.评论列表) ? momentData.评论列表 : [];
      const comments: MomentComment[] = commentsSource
        .map((commentItem, commentIndex) => {
          if (!commentItem || typeof commentItem !== 'object') {
            return null;
          }

          const comment = commentItem as { ID?: string; 发言内容?: string };
          const author =
            typeof comment.ID === 'string' && comment.ID.trim().length > 0
              ? comment.ID
              : `访客${commentIndex + 1}`;
          const commentContent =
            typeof comment.发言内容 === 'string' ? comment.发言内容.trim() : '';

          if (!commentContent) {
            return null;
          }

          return {
            id: `${contactName}-${timestamp}-${commentIndex}`,
            author,
            content: commentContent,
          };
        })
        .filter((item): item is MomentComment => Boolean(item));

      items.push({
        id: `${contactName}-${timestamp}-${index}`,
        contactName,
        name: contact.昵称 || contactName,
        content,
        timestamp: formatMomentTimestamp(timestamp),
        timeValue: timestamp,
        comments,
        avatar: avatarUrl,
      });
    });
  }

  return items.sort((a, b) => b.timeValue - a.timeValue);
}

async function loadMomentsFromMvu() {
  try {
    await waitGlobalInitialized('Mvu');
    mvuInitialized.value = true;

    const mvuData = Mvu.getMvuData({ type: 'chat' });
    const mvuCurrentTime = Mvu.getMvuVariable(mvuData, '手机数据.当前时间', {
      default_value: Date.now(),
    });
    const parsedTime =
      typeof mvuCurrentTime === 'number' ? mvuCurrentTime : Number(mvuCurrentTime);
    currentTime.value = Number.isFinite(parsedTime) ? parsedTime : Date.now();

    const contactsData = Mvu.getMvuVariable(mvuData, '手机数据.联系人', {
      default_value: {},
    });

    if (contactsData && typeof contactsData === 'object') {
      moments.value = buildMomentsFromContacts(contactsData as Record<string, unknown>);
      loadError.value = null;
    } else {
      moments.value = [];
      loadError.value = null;
    }
  } catch (error) {
    console.error('加载动态失败:', error);
    loadError.value = '动态加载失败';
    moments.value = [];
  }
}

async function setupMvuListener() {
  try {
    await waitGlobalInitialized('Mvu');

    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables: Mvu.MvuData) => {
      try {
        const mvuCurrentTime = Mvu.getMvuVariable(variables, '手机数据.当前时间', {
          default_value: Date.now(),
        });
        const parsedTime =
          typeof mvuCurrentTime === 'number' ? mvuCurrentTime : Number(mvuCurrentTime);
        currentTime.value = Number.isFinite(parsedTime) ? parsedTime : Date.now();

        const contactsData = Mvu.getMvuVariable(variables, '手机数据.联系人', {
          default_value: {},
        });

        if (contactsData && typeof contactsData === 'object') {
          moments.value = buildMomentsFromContacts(contactsData as Record<string, unknown>);
        } else {
          moments.value = [];
        }
      } catch (error) {
        console.error('更新动态失败:', error);
      }
    });
  } catch (error) {
    console.error('设置动态监听失败:', error);
  }
}

onMounted(() => {
  loadMomentsFromMvu();
  setupMvuListener();
});
</script>

<style scoped>
.moments-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
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
