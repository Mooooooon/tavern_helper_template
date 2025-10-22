<template>
  <div class="conversation-page" v-if="currentConversation">
    <div class="conversation-thread">
      <template v-for="(item, index) in currentConversation.messages" :key="item.id">
        <!-- 显示时间分隔符 -->
        <div
          v-if="shouldShowTimestamp(item, index)"
          class="message-row system"
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
                :src="getAvatarSrc(currentConversation.avatar, currentConversation.id, 36)"
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
            <div v-else class="bubble bubble--me">
              <p class="text">{{ item.text }}</p>
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
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAvatarSrc } from '../../utils/avatarPlaceholder';

interface ConversationMessage {
  id: number;
  type: 'message' | 'system';
  sender?: 'friend' | 'me';
  author?: string;
  text: string;
  time?: string;
}

interface ConversationDetail {
  id: string;
  name: string;
  avatar?: string;
  meta: string;
  isGroup: boolean;
  messages: ConversationMessage[];
}

const router = useRouter();
const route = useRoute();

const mvuInitialized = ref(false);
const loadError = ref<string | null>(null);
const conversationData = ref<ConversationDetail | undefined>(undefined);

// 从 MVU 变量加载聊天记录
async function loadConversationFromMvu(contactName: string) {
  try {
    // 等待 MVU 初始化
    await waitGlobalInitialized('Mvu');
    mvuInitialized.value = true;

    // 从聊天变量中获取 MVU 数据
    const mvuData = Mvu.getMvuData({ type: 'chat' });
    const contactsData = Mvu.getMvuVariable(mvuData, '手机数据.联系人', {
      default_value: {},
    });

    // 查找指定联系人
    const contactInfo = contactsData[contactName];
    if (!contactInfo || typeof contactInfo !== 'object') {
      conversationData.value = undefined;
      loadError.value = '未找到联系人';
      return;
    }

    const contact = contactInfo as {
      昵称?: string;
      签名?: string;
      头像?: string;
      聊天记录?: Record<string, { is_user: boolean; message: string }>;
    };

    // 处理头像
    let avatarUrl: string | undefined;
    if (contact.头像) {
      if (contact.头像.startsWith('char')) {
        try {
          const parts = contact.头像.split(':');
          const charName = parts.length > 1 ? parts[1] : 'current';
          const charAvatarPath = typeof getCharAvatarPath === 'function'
            ? getCharAvatarPath(charName, true)
            : (window as any).TavernHelper?.getCharAvatarPath?.(charName, true);
          avatarUrl = charAvatarPath || undefined;
        } catch (error) {
          console.warn(`[ConversationPage] 获取角色卡头像失败:`, error);
        }
      } else {
        avatarUrl = contact.头像;
      }
    }

    // 转换聊天记录
    const messages: ConversationMessage[] = [];
    if (contact.聊天记录) {
      const sortedTimestamps = Object.keys(contact.聊天记录).sort(
        (a, b) => Number(a) - Number(b)
      );

      for (const timestamp of sortedTimestamps) {
        const msg = contact.聊天记录[timestamp];
        if (msg && typeof msg === 'object') {
          messages.push({
            id: Number(timestamp),
            type: 'message',
            sender: msg.is_user ? 'me' : 'friend',
            author: msg.is_user ? '我' : contact.昵称 || contactName,
            text: msg.message,
            time: formatTimestamp(Number(timestamp)),
          });
        }
      }
    }

    conversationData.value = {
      id: contactName,
      name: contact.昵称 || contactName,
      avatar: avatarUrl,
      meta: contact.签名 || '',
      isGroup: false,
      messages,
    };

    loadError.value = null;
  } catch (error) {
    console.error('加载聊天记录失败:', error);
    loadError.value = '聊天记录加载失败';
    conversationData.value = undefined;
  }
}

// 格式化时间戳
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 监听 MVU 变量更新
async function setupMvuListener() {
  try {
    await waitGlobalInitialized('Mvu');

    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables: Mvu.MvuData) => {
      try {
        const contactName = route.params.id as string;
        if (!contactName) return;

        const contactsData = Mvu.getMvuVariable(variables, '手机数据.联系人', {
          default_value: {},
        });

        const contactInfo = contactsData[contactName];
        if (!contactInfo || typeof contactInfo !== 'object') {
          conversationData.value = undefined;
          return;
        }

        const contact = contactInfo as {
          昵称?: string;
          签名?: string;
          头像?: string;
          聊天记录?: Record<string, { is_user: boolean; message: string }>;
        };

        // 处理头像
        let avatarUrl: string | undefined;
        if (contact.头像) {
          if (contact.头像.startsWith('char')) {
            try {
              const parts = contact.头像.split(':');
              const charName = parts.length > 1 ? parts[1] : 'current';
              const charAvatarPath = typeof getCharAvatarPath === 'function'
                ? getCharAvatarPath(charName, true)
                : (window as any).TavernHelper?.getCharAvatarPath?.(charName, true);
              avatarUrl = charAvatarPath || undefined;
            } catch (error) {
              console.warn(`[ConversationPage] 获取角色卡头像失败:`, error);
            }
          } else {
            avatarUrl = contact.头像;
          }
        }

        // 转换聊天记录
        const messages: ConversationMessage[] = [];
        if (contact.聊天记录) {
          const sortedTimestamps = Object.keys(contact.聊天记录).sort(
            (a, b) => Number(a) - Number(b)
          );

          for (const timestamp of sortedTimestamps) {
            const msg = contact.聊天记录[timestamp];
            if (msg && typeof msg === 'object') {
              messages.push({
                id: Number(timestamp),
                type: 'message',
                sender: msg.is_user ? 'me' : 'friend',
                author: msg.is_user ? '我' : contact.昵称 || contactName,
                text: msg.message,
                time: formatTimestamp(Number(timestamp)),
              });
            }
          }
        }

        conversationData.value = {
          id: contactName,
          name: contact.昵称 || contactName,
          avatar: avatarUrl,
          meta: contact.签名 || '',
          isGroup: false,
          messages,
        };
      } catch (error) {
        console.error('更新聊天记录失败:', error);
      }
    });
  } catch (error) {
    console.error('设置 MVU 监听器失败:', error);
  }
}

onMounted(() => {
  const contactName = route.params.id as string;
  if (contactName) {
    loadConversationFromMvu(contactName);
    setupMvuListener();
  }
});

const currentConversation = computed(() => conversationData.value);

const isGroupConversation = computed(() => currentConversation.value?.isGroup ?? false);

// 判断是否应该显示时间戳（第一条消息或与上一条消息时间间隔较大）
function shouldShowTimestamp(item: ConversationMessage, index: number): boolean {
  if (item.type === 'system') return false;
  if (index === 0) return true;

  const messages = currentConversation.value?.messages;
  if (!messages) return false;

  const prevItem = messages[index - 1];
  if (prevItem.type === 'system') return true;

  // 如果时间间隔超过5分钟，显示时间戳
  const currentTime = item.id; // id 就是 timestamp
  const prevTime = prevItem.id;
  const timeDiff = currentTime - prevTime;
  const fiveMinutes = 5 * 60 * 1000;

  return timeDiff > fiveMinutes;
}

function goBack() {
  router.push({ name: 'chat-messages' });
}
</script>

<style scoped>
.conversation-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
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
