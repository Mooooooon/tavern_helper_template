<template>
  <div class="conversation-page" v-if="currentConversation">
    <div class="conversation-thread">
      <div
        v-for="item in currentConversation.messages"
        :key="item.id"
        class="message-row"
        :class="item.type === 'message' ? `from-${item.sender}` : 'system'"
      >
        <div v-if="item.type === 'system'" class="system-tag">{{ item.text }}</div>
        <template v-else>
          <div v-if="item.sender === 'friend'" class="friend-message">
            <img
              :src="getAvatarSrc(currentConversation.avatar, currentConversation.id, 36)"
              alt="联系人头像"
              class="avatar"
            >
            <div class="friend-content">
              <span class="friend-author">{{ item.author }}</span>
              <div class="friend-bubble">
                <p class="text">{{ item.text }}</p>
              </div>
            </div>
          </div>
          <div v-else class="bubble bubble--me">
            <p class="text">{{ item.text }}</p>
          </div>
        </template>
      </div>
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
import { useRoute, useRouter } from 'vue-router';
import { getAvatarSrc } from '../../utils/avatarPlaceholder';
import { getConversationById } from './conversationData';

const router = useRouter();
const route = useRoute();

const currentConversation = computed(() => {
  const id = Number(route.params.id);
  if (Number.isNaN(id)) {
    return undefined;
  }
  return getConversationById(id);
});

function goBack() {
  router.push({ name: 'chat-messages' });
}
</script>

<style scoped>
.conversation-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f2f3f5;
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
}

.message-row.system {
  justify-content: center;
  color: #8c9099;
  font-size: 12px;
}

.system-tag {
  background: rgba(140, 144, 153, 0.18);
  padding: 6px 12px;
  border-radius: 999px;
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
}

.system-tag {
  background: rgba(140, 144, 153, 0.18);
  padding: 6px 12px;
  border-radius: 999px;
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
  margin-left: auto;
}

.text {
  margin: 0;
  font-size: 14px;
  line-height: 1.45;
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
