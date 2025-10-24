<template>
  <div v-if="currentConversation" class="conversation-page">
    <div class="conversation-thread">
      <template v-for="(item, index) in currentConversation.messages" :key="item.id">
        <!-- 显示时间分隔符 -->
        <div
          v-if="shouldShowTimestamp(item, index)"
          class="message-row system"
          :class="{ 'first-timestamp': index === 0 }"
        >
          <div class="system-tag">{{ item.time }}</div>
        </div>

        <!-- 显示消息 -->
        <div
          class="message-row"
          :class="item.type === 'message' ? `from-${item.sender}` : 'system'"
        >
          <div v-if="item.type === 'system'" class="system-tag">{{ item.text }}</div>
          <template v-else>
            <div v-if="item.sender === 'friend'" class="friend-message">
              <img
                :src="currentConversation.avatar || ''"
                alt="联系人头像"
                class="avatar"
              >
              <div
                class="friend-content"
                :class="{ 'friend-content--single': !isGroupConversation }"
              >
                <span v-if="isGroupConversation" class="friend-author">{{ item.author }}</span>
                <div class="friend-bubble">
                  <p class="text">{{ item.text }}</p>
                </div>
              </div>
            </div>
            <div v-else class="me-message">
              <div class="bubble bubble--me">
                <p class="text">{{ item.text }}</p>
              </div>
              <img
                :src="userAvatar"
                alt="我的头像"
                class="avatar avatar--me"
              >
            </div>
          </template>
        </div>
      </template>
    </div>
    <form class="composer" @submit.prevent>
      <button class="composer-button" type="button" aria-label="语音输入">
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 3a2 2 0 00-2 2v6a2 2 0 004 0V5a2 2 0 00-2-2zm-5 7a1 1 0 012 0 3 3 0 006 0 1 1 0 012 0 5 5 0 01-4 4.9V18h3a1 1 0 010 2H8a1 1 0 010-2h3v-3.1A5 5 0 017 10z"
          />
        </svg>
      </button>
      <div class="composer-input">
        <input type="text" placeholder="输入消息..." aria-label="输入消息">
      </div>
      <button class="composer-button" type="button" aria-label="插入表情">
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 3a9 9 0 109 9 9.01 9.01 0 00-9-9zm0 2a7 7 0 11-7 7 7 7 0 017-7zm-3.5 4.8a1.25 1.25 0 11-1.25 1.25A1.25 1.25 0 018.5 9.8zm7 0a1.25 1.25 0 11-1.25 1.25A1.25 1.25 0 0115.5 9.8zM12 16.2a4.2 4.2 0 01-3.74-2.25 1 1 0 011.74-1 2.2 2.2 0 003.9 0 1 1 0 011.74 1A4.2 4.2 0 0112 16.2z"
          />
        </svg>
      </button>
      <button class="composer-button" type="button" aria-label="更多操作">
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 5a1 1 0 011 1v5h5a1 1 0 010 2h-5v5a1 1 0 01-2 0v-5H6a1 1 0 010-2h5V6a1 1 0 011-1z"
          />
        </svg>
      </button>
    </form>
  </div>

  <div v-else class="conversation-empty">
    <p>未找到对应的对话</p>
    <button class="back-link" type="button" @click="goBack">返回消息列表</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '../../stores/chatStore';
import { useUserStore } from '../../stores/userStore';

type ConversationMessage = {
  id: number;
  type: 'message' | 'system';
  sender?: 'friend' | 'me';
  author?: string;
  text: string;
  time?: string;
};

// 定义props和emits
const props = defineProps<{
  contactId: string | null
}>();

const emit = defineEmits<{
  navigate: [page: string]
}>();

const chatStore = useChatStore();
const userStore = useUserStore();
const { currentTime } = storeToRefs(chatStore);
const { userInfo } = storeToRefs(userStore);

const userAvatar = computed(() => userInfo.value?.avatar || '');

function formatTimestamp(timestamp: number): string {
  const nowMs = currentTime.value ?? Date.now();
  const date = new Date(timestamp);
  const now = new Date(nowMs);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDiff = Math.floor((startOfNow - startOfDate) / (24 * 60 * 60 * 1000));

  if (dayDiff === 0) {
    return timeString;
  }

  switch (dayDiff) {
    case 1:
      return `昨天 ${timeString}`;
    case 2:
      return `前天 ${timeString}`;
    case 3:
      return `三天前 ${timeString}`;
    default: {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}/${month}/${day} ${timeString}`;
    }
  }
}

const currentConversation = computed(() => {
  if (!props.contactId) {
    return undefined;
  }
  return chatStore.conversationFactory(props.contactId, formatTimestamp);
});

const isGroupConversation = computed(() => currentConversation.value?.isGroup ?? false);

function shouldShowTimestamp(item: ConversationMessage, index: number): boolean {
  if (item.type === 'system') return false;
  if (index === 0) return true;

  const messages = currentConversation.value?.messages;
  if (!messages) return false;

  const prevItem = messages[index - 1];
  if (prevItem.type === 'system') return true;

  const current = item.id;
  const previous = prevItem.id;
  const timeDiff = current - previous;
  const oneHour = 60 * 60 * 1000;

  return timeDiff >= oneHour;
}

function goBack() {
  emit('navigate', 'back');
}
</script>

<style>
.conversation-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: #f2f3f5;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.conversation-page::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.conversation-thread {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 12px 18px;
  overflow-y: auto;
  scrollbar-width: none;
}

.conversation-thread::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.message-row {
  display: flex;
  width: 100%;
  gap: 10px;
}

.message-row.system {
  justify-content: center;
  color: #8c9099;
  font-size: 12px;
  margin: 18px 0 10px;
}

.message-row.system.first-timestamp {
  margin-top: 0;
}

.system-tag {
  padding: 0;
  border-radius: 0;
  line-height: 1;
}

.friend-message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.friend-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.friend-content--single {
  gap: 2px;
}

.friend-content--single .friend-bubble {
  border-radius: 16px;
}

.friend-author {
  font-size: 12px;
  font-weight: 600;
  color: #4a4d57;
  padding-left: 4px;
}

.friend-bubble {
  max-width: 72%;
  background: #ffffff;
  color: #1f1f1f;
  border-radius: 14px;
  padding: 10px 14px;
  box-shadow: 0 4px 12px rgba(31, 35, 48, 0.08);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.me-message {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 6px;
  margin-left: auto;
  max-width: 82%;
}

.bubble {
  max-width: 72%;
  background: #3a73ff;
  color: #f8fbff;
  border-radius: 16px;
  padding: 12px 14px 10px;
  box-shadow: 0 4px 12px rgba(31, 35, 48, 0.08);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.avatar--me {
  width: 36px;
  height: 36px;
}

.text {
  margin: 0;
  font-size: 14px;
  line-height: 1.3;
  display: inline;
  white-space: nowrap;
}

.composer {
  display: flex;
  align-items: center;
  padding: 10px 12px 16px;
  background: #f7f7f7;
}

.composer-button {
  border: none;
  background: none;
  color: #424249;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s ease;
}

.composer-button:hover {
  color: #1f1f1f;
}

.composer-button svg {
  width: 28px;
  height: 28px;
}

.composer-input {
  flex: 1;
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: inset 0 0 0 1px rgba(31, 35, 48, 0.12);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.composer-input input {
  flex: 1;
  border: none !important;
  padding: 10px 14px;
  background: #ffffff !important;
  font-size: 14px;
  color: #14161d;
  box-shadow: none !important;
}

.composer-input input::placeholder {
  color: #9b9fa7;
}

.composer-input input:focus {
  outline: none;
}

.composer-input:focus-within {
  box-shadow: inset 0 0 0 2px #3a73ff;
}

.conversation-empty {
  padding: 20px;
  text-align: center;
  color: #7c7f87;
}

.back-link {
  margin-top: 12px;
  border: none;
  background: none;
  color: #3a73ff;
  font-size: 14px;
  cursor: pointer;
}
</style>
