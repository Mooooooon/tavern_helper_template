<template>
  <div class="messages-page">
    <div v-if="filteredMessages.length" class="message-list">
      <button
        v-for="message in filteredMessages"
        :key="message.contactName"
        class="message-item"
        :class="{ pinned: message.pinned }"
        type="button"
        @click="openConversation(message.contactName)"
      >
        <div class="avatar-wrapper">
          <CachedAvatar
            :src="message.avatar || ''"
            alt="avatar"
            class-name=""
            fallback-src=""
          />
          <span v-if="message.unread" class="badge">{{ message.unread }}</span>
        </div>
        <div class="message-details">
          <div class="message-top">
            <span class="name">{{ message.name }}</span>
            <span class="timestamp">{{ message.time }}</span>
          </div>
          <div class="message-bottom" :class="{ pinned: message.pinned }">
            <span class="last-message">{{ message.lastMessage }}</span>
          </div>
        </div>
      </button>
    </div>

    <div v-else class="empty-state">
      <svg viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 2a9 9 0 00-9 9v7l-1 1v1h20v-1l-1-1v-7a9 9 0 00-9-9zm0 2a7 7 0 017 7v7H5v-7a7 7 0 017-7zm0 2a5 5 0 00-5 5h2a3 3 0 016 0h2a5 5 0 00-5-5z"
        />
      </svg>
      <p>暂无匹配的对话</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '../../stores/chatStore';
import CachedAvatar from '../../components/CachedAvatar.vue';

interface DisplayMessage {
  contactName: string;
  name: string;
  lastMessage: string;
  timestamp: number;
  avatar?: string;
  time: string;
  unread?: number;
  pinned?: boolean;
}

// 定义发射事件
const emit = defineEmits<{
  navigate: [page: string, params?: any]
}>();

const chatStore = useChatStore();
const { messageSummaries, currentTime, contactList, contactOrder } = storeToRefs(chatStore);


function formatTimestamp(timestamp: number, nowMs: number): string {
  const date = new Date(timestamp);
  const now = new Date(nowMs);
  const diff = nowMs - timestamp;

  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDiff = Math.floor((startOfNow - startOfDate) / (24 * 60 * 60 * 1000));

  if (dayDiff <= 0) {
    if (diff < 60 * 1000) {
      return '刚刚';
    }

    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes}分钟前`;
    }

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  if (dayDiff === 1) {
    return '昨天';
  }
  if (dayDiff === 2) {
    return '前天';
  }
  if (dayDiff === 3) {
    return '三天前';
  }

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const isSameYear = date.getFullYear() === now.getFullYear();
  return isSameYear ? `${month}/${day}` : `${date.getFullYear()}/${month}/${day}`;
}

const messages = computed<DisplayMessage[]>(() => {
  const now = currentTime.value ?? Date.now();
  return messageSummaries.value.map(summary => ({
    contactName: summary.contactName,
    name: summary.name,
    lastMessage: summary.lastMessage,
    timestamp: summary.timestamp,
    avatar: summary.avatar,
    time: formatTimestamp(summary.timestamp, now),
  }));
});

const filteredMessages = computed(() =>
  messages.value
    .slice()
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned)),
);

function openConversation(contactName: string) {
  emit('navigate', `/chat/messages/${contactName}`, { id: contactName });
}
</script>

<style>
.messages-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.messages-page::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.message-item {
  display: flex;
  gap: 12px;
  padding: 12px 12px;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.message-item:focus-visible {
  outline: 2px solid #376afc;
  outline-offset: -2px;
}

.message-item.pinned {
  background: #f5f5f6;
  border-radius: 8px;
}

.message-item:first-of-type {
  padding-top: 16px;
}

.message-item:last-of-type {
  padding-bottom: 16px;
}

/* WebKit 隐藏滚动条 */
.message-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar-wrapper img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e5e5e8;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
  background: #2b2b2d;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.message-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.name {
  font-weight: 600;
  font-size: 15px;
  color: #1f1f1f;
}

.timestamp {
  font-size: 12px;
  color: #9b9b9f;
  flex-shrink: 0;
}

.message-bottom {
  display: flex;
  align-items: center;
  gap: 8px;
}

.last-message {
  flex: 1;
  font-size: 13px;
  color: #5a5a5f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-bottom.pinned {
  background: none;
  padding: 0;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #9b9b9f;
}

.empty-state svg {
  width: 48px;
  height: 48px;
}
</style>
