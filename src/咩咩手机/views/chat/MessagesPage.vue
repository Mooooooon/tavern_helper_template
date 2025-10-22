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
          <img :src="getAvatarSrc(message.avatar, message.contactName, 48)" alt="avatar">
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
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAvatarSrc } from '../../utils/avatarPlaceholder';

interface MessageItem {
  contactName: string; // MVU 变量中的联系人名称
  name: string; // 显示的昵称
  lastMessage: string;
  time: string;
  timestamp: number;
  unread?: number;
  pinned?: boolean;
  avatar?: string;
}

const router = useRouter();
const messages = ref<MessageItem[]>([]);
const mvuInitialized = ref(false);
const loadError = ref<string | null>(null);

// 从 MVU 变量加载消息列表
async function loadMessagesFromMvu() {
  try {
    // 等待 MVU 初始化
    await waitGlobalInitialized('Mvu');
    mvuInitialized.value = true;

    // 从聊天变量中获取 MVU 数据
    const mvuData = Mvu.getMvuData({ type: 'chat' });
    const contactsData = Mvu.getMvuVariable(mvuData, '手机数据.联系人', {
      default_value: {},
    });

    // 将 MVU 数据转换为 MessageItem 数组
    const messagesList: MessageItem[] = [];

    for (const [contactName, info] of Object.entries(contactsData)) {
      if (typeof info !== 'object' || info === null) continue;

      const contact = info as {
        昵称?: string;
        签名?: string;
        头像?: string;
        聊天记录?: Record<string, { is_user: boolean; message: string }>;
      };

      // 获取最后一条聊天记录
      if (!contact.聊天记录) continue;

      const timestamps = Object.keys(contact.聊天记录).map(Number).sort((a, b) => b - a);
      if (timestamps.length === 0) continue;

      const lastTimestamp = timestamps[0];
      const lastMsg = contact.聊天记录[String(lastTimestamp)];
      if (!lastMsg) continue;

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
            console.warn(`[MessagesPage] 获取角色卡头像失败:`, error);
          }
        } else {
          avatarUrl = contact.头像;
        }
      }

      messagesList.push({
        contactName,
        name: contact.昵称 || contactName,
        lastMessage: lastMsg.message,
        time: formatTimestamp(lastTimestamp),
        timestamp: lastTimestamp,
        avatar: avatarUrl,
      });
    }

    // 按时间戳排序（最新的在前）
    messagesList.sort((a, b) => b.timestamp - a.timestamp);

    messages.value = messagesList;
    loadError.value = null;
  } catch (error) {
    console.error('加载消息列表失败:', error);
    loadError.value = '消息列表加载失败';
    messages.value = [];
  }
}

// 格式化时间戳
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (diff < oneDay && date.getDate() === now.getDate()) {
    // 今天
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours < 12 ? '上午' : '下午';
    const hour12 = hours % 12 || 12;
    return `${ampm} ${hour12}:${minutes}`;
  } else if (diff < 2 * oneDay) {
    // 昨天
    return '昨天';
  } else if (diff < 7 * oneDay) {
    // 一周内
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  } else {
    // 更早
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}

// 监听 MVU 变量更新
async function setupMvuListener() {
  try {
    await waitGlobalInitialized('Mvu');

    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables: Mvu.MvuData) => {
      try {
        const contactsData = Mvu.getMvuVariable(variables, '手机数据.联系人', {
          default_value: {},
        });

        const messagesList: MessageItem[] = [];

        for (const [contactName, info] of Object.entries(contactsData)) {
          if (typeof info !== 'object' || info === null) continue;

          const contact = info as {
            昵称?: string;
            签名?: string;
            头像?: string;
            聊天记录?: Record<string, { is_user: boolean; message: string }>;
          };

          if (!contact.聊天记录) continue;

          const timestamps = Object.keys(contact.聊天记录).map(Number).sort((a, b) => b - a);
          if (timestamps.length === 0) continue;

          const lastTimestamp = timestamps[0];
          const lastMsg = contact.聊天记录[String(lastTimestamp)];
          if (!lastMsg) continue;

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
                console.warn(`[MessagesPage] 获取角色卡头像失败:`, error);
              }
            } else {
              avatarUrl = contact.头像;
            }
          }

          messagesList.push({
            contactName,
            name: contact.昵称 || contactName,
            lastMessage: lastMsg.message,
            time: formatTimestamp(lastTimestamp),
            timestamp: lastTimestamp,
            avatar: avatarUrl,
          });
        }

        messagesList.sort((a, b) => b.timestamp - a.timestamp);
        messages.value = messagesList;
      } catch (error) {
        console.error('更新消息列表失败:', error);
      }
    });
  } catch (error) {
    console.error('设置 MVU 监听器失败:', error);
  }
}

onMounted(() => {
  loadMessagesFromMvu();
  setupMvuListener();
});

const filteredMessages = computed(() =>
  messages.value
    .slice()
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned)),
);

function openConversation(contactName: string) {
  router.push({ name: 'chat-conversation', params: { id: contactName } });
}
</script>

<style scoped>
.messages-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  scrollbar-width: none;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
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

.message-list:hover {
  scrollbar-width: thin;
}

.message-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.message-list:hover::-webkit-scrollbar {
  width: 4px;
}

.message-list:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 999px;
}

.message-list:hover::-webkit-scrollbar-track {
  background: transparent;
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
