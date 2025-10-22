<template>
  <div class="messages-page">
    <div v-if="filteredMessages.length" class="message-list">
      <div
        v-for="message in filteredMessages"
        :key="message.id"
        class="message-item"
        :class="{ pinned: message.pinned }"
      >
        <div class="avatar-wrapper">
          <img :src="getAvatarSrc(message.avatar, message.id, 48)" alt="avatar">
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
      </div>
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
import { computed, ref } from 'vue';
import { getAvatarSrc } from '../../utils/avatarPlaceholder';

interface MessageItem {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  pinned?: boolean;
  avatar?: string;
}

const messages = ref<MessageItem[]>([
  {
    id: 1,
    name: '咩咩战队',
    lastMessage: '今晚八点开黑，记得上线！',
    time: '下午 6:12',
    unread: 3,
    pinned: true,
  },
  {
    id: 2,
    name: '喵喵',
    lastMessage: '好的，那我们明天再确认～',
    time: '下午 3:40',
  },
  {
    id: 3,
    name: '羊村事务群',
    lastMessage: '会议记录已同步至文档，请查收。',
    time: '下午 1:05',
    unread: 5,
  },
  {
    id: 4,
    name: '小狐狸',
    lastMessage: '哈哈哈这表情太好笑了！',
    time: '上午 10:22',
    avatar: '',
  },
  {
    id: 5,
    name: '星见旅人',
    lastMessage: '收到，今晚星观台见。',
    time: '昨天',
    pinned: true,
  },
  {
    id: 6,
    name: '星云工作室',
    lastMessage: '项目进度已经更新，辛苦查看。',
    time: '昨天',
  },
  {
    id: 7,
    name: '纸飞机',
    lastMessage: '那份资料我发你邮箱了～',
    time: '昨天',
  },
  {
    id: 8,
    name: '系统助手',
    lastMessage: '你的安全登录验证已通过。',
    time: '周一',
  },
  {
    id: 9,
    name: '向阳电台',
    lastMessage: '今晚八点直播见！',
    time: '周一',
  },
  {
    id: 10,
    name: '旅行手账',
    lastMessage: '行程表已更新在云端。',
    time: '周日',
    unread: 2,
  },
  {
    id: 11,
    name: '咖啡研究社',
    lastMessage: '最新烘焙报告已经发给大家。',
    time: '周日',
  },
  {
    id: 12,
    name: '拾光书屋',
    lastMessage: '这周的读书会主题确定啦～',
    time: '周六',
  },
  {
    id: 13,
    name: '山顶见',
    lastMessage: '明天早上 6 点集合，别迟到！',
    time: '周六',
    unread: 1,
  },
  {
    id: 14,
    name: '拾贰',
    lastMessage: '照片已经发在共享相册。',
    time: '周五',
  },
  {
    id: 15,
    name: '白夜开发组',
    lastMessage: '下个版本的需求评审安排一下？',
    time: '周五',
  },
  {
    id: 16,
    name: '夜跑群',
    lastMessage: '今晚路线在群公告里。',
    time: '周四',
  },
  {
    id: 17,
    name: '咩咩妈妈',
    lastMessage: '记得多穿点衣服，天气凉了。',
    time: '周三',
  },
]);

const filteredMessages = computed(() =>
  messages.value
    .slice()
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned)),
);
</script>

<style scoped>
.messages-page {
  display: flex;
  flex-direction: column;
  height: 100%;
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
