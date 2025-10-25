<template>
  <div class="mimi-chat-app">
    <!-- Chat Header -->
    <header v-if="currentView !== 'conversation' && currentView !== 'moments'" class="mimi-chat-header" :style="chatStatusBarStyle" @click="handleChatHeaderClick">
      <div class="mimi-profile">
        <div class="mimi-avatar">
          <img :src="userAvatar || 'https://pub-a36fa2b8a8044f89a3426fa759085b6c.r2.dev/%E7%AB%8B%E7%BB%98_%E7%94%98%E9%9B%A8.png'" alt="Avatar">
        </div>
        <div class="mimi-profile-info">
          <span class="mimi-profile-name">我的账号</span>
          <span class="mimi-profile-status">
            <span class="mimi-status-dot"></span>
            在线
          </span>
        </div>
      </div>
      <div class="mimi-actions">
        <button class="mimi-icon-button" type="button" aria-label="添加联系人">
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

    <!-- Conversation Header -->
    <header v-if="currentView === 'conversation'" class="mimi-chat-header mimi-chat-header--conversation" :style="conversationHeaderStyle">
      <div class="mimi-conversation-header">
        <button class="mimi-header-button mimi-header-button--back" type="button" aria-label="返回聊天列表" @click="goBack">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <div class="mimi-conversation-info" v-if="activeContact">
          <span class="mimi-conversation-name">{{ activeContact.昵称 }}</span>
          <span class="mimi-conversation-meta">{{ activeContact.签名 }}</span>
        </div>
        <button class="mimi-header-button mimi-header-button--more" type="button" aria-label="更多操作">
          <svg viewBox="0 0 24 24">
            <rect x="6" y="8" width="12" height="1.8" rx="0.9" fill="currentColor" />
            <rect x="6" y="12" width="12" height="1.8" rx="0.9" fill="currentColor" />
            <rect x="6" y="16" width="12" height="1.8" rx="0.9" fill="currentColor" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Chat Content -->
    <main class="mimi-chat-content" :class="{ 'mimi-chat-content--conversation': currentView === 'conversation' }">
      <!-- Messages List View -->
      <div v-if="currentView === 'messages'" v-show="activeTab === 'messages'" class="mimi-messages-page">
        <div v-if="filteredMessages.length" class="mimi-message-list">
          <button
            v-for="message in filteredMessages"
            :key="message.contactName"
            class="mimi-message-item"
            :class="{ pinned: message.pinned }"
            type="button"
            @click="openConversation(message.contactName)"
          >
            <div class="mimi-avatar-wrapper">
              <img :src="message.avatar || ''" alt="avatar">
              <span v-if="message.unread" class="mimi-badge">{{ message.unread }}</span>
            </div>
            <div class="mimi-message-details">
              <div class="mimi-message-top">
                <span class="mimi-name">{{ message.name }}</span>
                <span class="mimi-timestamp">{{ message.time }}</span>
              </div>
              <div class="mimi-message-bottom" :class="{ pinned: message.pinned }">
                <span class="mimi-last-message">{{ message.lastMessage }}</span>
              </div>
            </div>
          </button>
        </div>
        <div v-else class="mimi-empty-state">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2a9 9 0 00-9 9v7l-1 1v1h20v-1l-1-1v-7a9 9 0 00-9-9zm0 2a7 7 0 017 7v7H5v-7a7 7 0 017-7zm0 2a5 5 0 00-5 5h2a3 3 0 016 0h2a5 5 0 00-5-5z"
            />
          </svg>
          <p>暂无匹配的对话</p>
        </div>
      </div>

      <!-- Contacts List View -->
      <div v-if="currentView === 'messages'" v-show="activeTab === 'contacts'" class="mimi-contacts-page">
        <div v-if="hasContacts" class="mimi-contacts-list">
          <div
            v-for="section in contactSections"
            :key="section.title"
            class="mimi-contact-section"
          >
            <div class="mimi-section-title">{{ section.title }}</div>
            <button
              v-for="contact in section.items"
              :key="`${section.keyPrefix}-${contact.contactName}`"
              class="mimi-contact-item"
              type="button"
              @click="openConversation(contact.contactName)"
            >
              <div class="mimi-avatar-wrapper">
                <img :src="contact.avatar || ''" alt="联系人头像">
              </div>
              <div class="mimi-contact-details">
                <span class="mimi-contact-id">{{ contact.displayName }}</span>
                <span class="mimi-contact-signature">{{ contact.signature }}</span>
              </div>
            </button>
          </div>
        </div>
        <div v-else class="mimi-empty-state">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 00-7 7v3H4l2.29 2.29 2.3 2.3.7-.72.71-.71L8 12H7V9a5 5 0 0110 0v3h-1l-2 3h6l-2-3h-1V9a7 7 0 00-7-7z"
            />
          </svg>
          <p>未找到匹配的联系人</p>
        </div>
      </div>

      <!-- Conversation View -->
      <div v-if="currentView === 'conversation'" class="mimi-conversation-view">
        <div class="mimi-conversation-messages">
          <div
            v-for="message in conversationMessages"
            :key="message.timestamp"
            class="mimi-conversation-message"
            :class="{ 'mimi-message--user': message.is_user }"
          >
            <div v-if="!message.is_user" class="mimi-message-avatar">
              <img :src="activeContact?.头像 || ''" alt="avatar">
            </div>
            <div class="mimi-message-content">
              <div class="mimi-message-bubble">
                {{ message.message }}
              </div>
              <div class="mimi-message-time">
                {{ formatMessageTime(message.timestamp) }}
              </div>
            </div>
          </div>
        </div>
        <div class="mimi-message-input-area">
          <div class="mimi-input-wrapper">
            <input
              v-model="messageInput"
              type="text"
              placeholder="输入消息..."
              class="mimi-message-input"
              @keypress.enter="sendMessage"
            >
            <button class="mimi-send-button" @click="sendMessage">
              <svg viewBox="0 0 24 24">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Moments View -->
      <div v-show="currentView === 'moments'" class="mimi-moments-view">
        <MomentsPage @go-back="goBackFromMoments" />
      </div>
    </main>

    <!-- Chat Footer -->
    <footer v-if="currentView === 'messages' || currentView === 'contacts'" class="mimi-chat-footer" :style="chatStatusBarStyle">
      <nav>
        <button
          class="mimi-nav-item"
          :class="{ 'mimi-nav-item--active': activeTab === 'messages' }"
          @click="activeTab = 'messages'"
        >
          <svg viewBox="0 0 24 24" class="mimi-nav-icon">
            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
          <span>消息</span>
        </button>
        <button
          class="mimi-nav-item"
          :class="{ 'mimi-nav-item--active': activeTab === 'contacts' }"
          @click="activeTab = 'contacts'"
        >
          <svg viewBox="0 0 24 24" class="mimi-nav-icon">
            <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          <span>联系人</span>
        </button>
        <button
          class="mimi-nav-item"
          :class="{ 'mimi-nav-item--active': activeTab === 'moments' }"
          @click="goToMoments"
        >
          <svg viewBox="0 0 24 24" class="mimi-nav-icon">
            <path
              fill="currentColor"
              d="M12 2.5l2.47 5.01 5.53.8-4 3.89.94 5.5L12 15.77 7.06 17.7l.94-5.5-4-3.89 5.53-.8L12 2.5z"
            />
          </svg>
          <span>动态</span>
        </button>
      </nav>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import MomentsPage from './MomentsPage.vue';
import { resolveAvatar, convertAvatarToThumbnail } from './utils/avatar';

// 定义发射事件
const emit = defineEmits<{
  'go-home': []
}>();

// 接口定义
interface ContactData {
  昵称: string;
  签名: string;
  头像: string;
  聊天记录: {
    [timestamp: string]: {
      is_user: boolean;
      message: string;
    };
  };
  空间动态: any[];
}

interface MessageData {
  contactName: string;
  name: string;
  lastMessage: string;
  timestamp: number;
  avatar?: string;
  time: string;
  unread?: number;
  pinned?: boolean;
}

// 组件状态
const currentView = ref<'messages' | 'conversation' | 'moments'>('messages');
const activeTab = ref<'messages' | 'contacts' | 'moments'>('messages');
const activeContactName = ref<string>('');
const messageInput = ref('');
const userAvatar = ref<string>('');

// 聊天页面状态栏颜色计算
const chatStatusBarColor = computed(() => {
  switch (activeTab.value) {
    case 'messages':
    case 'contacts':
      return '#ffffff';
    case 'moments':
      return '#f8f9fa';
    default:
      return '#ffffff';
  }
});

const chatStatusBarTextColor = computed(() => {
  switch (activeTab.value) {
    case 'messages':
    case 'contacts':
      return '#222222';
    case 'moments':
      return '#333333';
    default:
      return '#222222';
  }
});

// 聊天页面状态栏样式
const chatStatusBarStyle = computed(() => {
  if (currentView.value === 'conversation') {
    return {
      backgroundColor: '#ffffff',
      color: '#222222',
    };
  }
  return {
    backgroundColor: chatStatusBarColor.value,
    color: chatStatusBarTextColor.value,
  };
});

// 对话页面header样式
const conversationHeaderStyle = computed(() => ({
  backgroundColor: '#ffffff',
  color: '#222222',
}));

// 双击返回主页功能
const chatLastTapTime = ref(0);
const CHAT_TAP_TIMEOUT = 300; // 双击间隔时间（毫秒）

// 双击顶部header返回主页
function handleChatHeaderClick(event: MouseEvent) {
  // 如果点击的是按钮或其子元素，不触发双击返回
  const target = event.target as HTMLElement;
  if (target.closest('button')) {
    return;
  }

  const currentTimeMs = Date.now();

  if (currentTimeMs - chatLastTapTime.value < CHAT_TAP_TIMEOUT) {
    // 双击检测到，返回主页
    emit('go-home');
  }

  chatLastTapTime.value = currentTimeMs;
}

// 模拟数据 - 从准备好的YAML数据中提取
const contactsData: Record<string, ContactData> = {
  "甘雨": {
    "昵称": "清心花茶",
    "签名": "工作再忙,也要注意休息哦",
    "头像": "https://pub-a36fa2b8a8044f89a3426fa759085b6c.r2.dev/%E7%AB%8B%E7%BB%98_%E7%94%98%E9%9B%A8.png",
    "聊天记录": {
      "1737240000000": {
        "is_user": true,
        "message": "周三晚上要不要一起加班冲一下进度？"
      },
      "1737245400000": {
        "is_user": false,
        "message": "可以，不过我得先把会议纪要整理完。"
      },
      "1737503000000": {
        "is_user": true,
        "message": "最近工作还顺利吗?"
      },
      "1737503100000": {
        "is_user": false,
        "message": "还好,就是有点忙。谢谢关心~"
      },
      "1737503220000": {
        "is_user": true,
        "message": "你也是，别太累了。"
      },
      "1737503340000": {
        "is_user": false,
        "message": "嗯嗯，知道啦。对了，上次你说的那个项目，进行得怎么样了？"
      },
      "1737503460000": {
        "is_user": true,
        "message": "项目进展还算顺利，不过遇到了一些技术难题。"
      },
      "1737503580000": {
        "is_user": false,
        "message": "需要帮忙吗？我这边或许能提供一些参考资料。"
      },
      "1737503700000": {
        "is_user": true,
        "message": "那太好了，多谢！"
      },
      "1737503820000": {
        "is_user": false,
        "message": "不客气，我们是朋友嘛。资料我整理一下晚点发给你。"
      },
      "1737503940000": {
        "is_user": true,
        "message": "好的，等你消息。"
      },
      "1737576000000": {
        "is_user": false,
        "message": "资料已经发你邮箱了，记得查收。"
      },
      "1737579600000": {
        "is_user": true,
        "message": "收到了，今晚好好看看，谢谢！"
      },
      "1737662400000": {
        "is_user": false,
        "message": "明天的答辩如果有需要我也可以帮忙彩排。"
      }
    },
    "空间动态": []
  },
  "神里绫华": {
    "昵称": "白鹭",
    "签名": "心似冰清，意如刀锋",
    "头像": "https://pub-a36fa2b8a8044f89a3426fa759085b6c.r2.dev/%E7%AB%8B%E7%BB%98_%E7%A5%9E%E9%87%8C%E7%BB%AB%E5%8D%8E.png",
    "聊天记录": {
      "1737520000000": {
        "is_user": true,
        "message": "绫华小姐，今天有空一起练习剑术吗？"
      },
      "1737521000000": {
        "is_user": false,
        "message": "好的，我已经准备好茶点，等你来练习。"
      },
      "1737530000000": {
        "is_user": true,
        "message": "最近练习感觉进步很大，谢谢你的指导。"
      },
      "1737531000000": {
        "is_user": false,
        "message": "你很有天赋，继续努力的话一定会有更好的成就。"
      },
      "1737540000000": {
        "is_user": true,
        "message": "明天祭典上你会表演剑舞吗？"
      },
      "1737541000000": {
        "is_user": false,
        "message": "是的，我会为大家表演。希望你也能来观看。"
      },
      "1737550000000": {
        "is_user": true,
        "message": "一定会的！期待看到你的精彩表演。"
      },
      "1737551000000": {
        "is_user": false,
        "message": "谢谢你的支持，我会准备得更加充分的。"
      },
      "1737660000000": {
        "is_user": false,
        "message": "今天的练习很愉快，下次我们继续吧。"
      },
      "1737661000000": {
        "is_user": true,
        "message": "好的，期待下次的练习！"
      }
    },
    "空间动态": []
  },
  "八重神子": {
    "昵称": "油豆腐半价",
    "签名": "世事如棋，落子无悔",
    "头像": "https://pub-a36fa2b8a8044f89a3426fa759085b6c.r2.dev/%E7%AB%8B%E7%BB%98_%E5%85%AB%E9%87%8D%E7%A5%9E%E5%AD%90.png",
    "聊天记录": {},
    "空间动态": []
  },
  "Nova": {
    "昵称": "Nova",
    "签名": "",
    "头像": "char",
    "聊天记录": {},
    "空间动态": []
  }
};

// 计算属性
const activeContact = computed(() => {
  return contactsData[activeContactName.value];
});

const conversationMessages = computed(() => {
  if (!activeContact.value) return [];

  const messages = Object.entries(activeContact.value.聊天记录)
    .map(([timestamp, msg]) => ({
      ...msg,
      timestamp: parseInt(timestamp)
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  return messages;
});

const hasContacts = computed(() => Object.keys(contactsData).length > 0);

const contactSections = computed(() => {
  if (!hasContacts.value) return [];

  return [
    {
      title: '联系人',
      keyPrefix: 'friend',
      items: Object.entries(contactsData).map(([key, contact]) => ({
        contactName: key,
        displayName: contact.昵称,
        signature: contact.签名,
        avatar: contact.头像,
      })),
    },
  ];
});

const filteredMessages = computed<MessageData[]>(() => {
  const now = Date.now();
  return Object.entries(contactsData)
    .filter(([_, contact]) => Object.keys(contact.聊天记录).length > 0)
    .map(([key, contact]) => {
      const chatRecords = Object.entries(contact.聊天记录);
      if (chatRecords.length === 0) return null;

      const lastMessage = chatRecords[chatRecords.length - 1][1];
      const lastTimestamp = parseInt(chatRecords[chatRecords.length - 1][0]);

      return {
        contactName: key,
        name: contact.昵称,
        lastMessage: lastMessage.message,
        timestamp: lastTimestamp,
        avatar: contact.头像,
        time: formatTimestamp(lastTimestamp, now),
        unread: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : undefined,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.timestamp - a.timestamp) as MessageData[];
});

// 方法
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

  if (dayDiff === 1) return '昨天';
  if (dayDiff === 2) return '前天';
  if (dayDiff === 3) return '三天前';

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const isSameYear = date.getFullYear() === now.getFullYear();
  return isSameYear ? `${month}/${day}` : `${date.getFullYear()}/${month}/${day}`;
}

function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function openConversation(contactName: string) {
  activeContactName.value = contactName;
  currentView.value = 'conversation';
}

function goBack() {
  currentView.value = 'messages';
  activeContactName.value = '';
}

function goToHome() {
  emit('go-home');
}

function goToMoments() {
  currentView.value = 'moments';
}

function goBackFromMoments() {
  currentView.value = 'messages';
  activeTab.value = 'messages';
}

function sendMessage() {
  if (!messageInput.value.trim() || !activeContactName.value) return;

  // 这里只是模拟，实际应用中需要发送到服务器
  console.log('发送消息:', messageInput.value);
  messageInput.value = '';
}

onMounted(() => {
  // 初始化
  try {
    // 获取用户头像 - 使用正确的方式
    const getUserAvatar = async () => {
      let avatarSrc: string | undefined;
      let avatarSource: string | undefined;

      if (typeof triggerSlash === 'function') {
        const avatarPath = await triggerSlash('/pass {{userAvatarPath}}');
        avatarSource = avatarPath;

        if (typeof avatarPath === 'string' && avatarPath && avatarPath !== 'undefined') {
          console.log('[ChatPage] 获取到用户头像路径:', avatarPath);

          // 检查是否为char URL
          if (avatarPath === 'char' || avatarPath.startsWith('char:')) {
            console.log('[ChatPage] 检测到char URL，获取角色头像');
            const charName = avatarPath.startsWith('char:') ? avatarPath.substring(5) : 'current';
            const resolvedChar = resolveAvatar(avatarPath);
            avatarSrc = resolvedChar ? convertAvatarToThumbnail(resolvedChar) : undefined;
            console.log('[ChatPage] char头像转换后的缩略图URL:', avatarSrc);
          } else {
            // 普通用户头像路径，转换为缩略图
            console.log('[ChatPage] 普通用户头像路径，转换为缩略图');
            avatarSrc = convertAvatarToThumbnail(avatarPath);
            console.log('[ChatPage] 转换后的缩略图URL:', avatarSrc);
          }
        } else {
          console.log('[ChatPage] 未获取到用户头像路径，尝试使用char头像');
          const resolvedChar = resolveAvatar('char');
          avatarSrc = resolvedChar ? convertAvatarToThumbnail(resolvedChar) : undefined;
          console.log('[ChatPage] 使用默认char头像，转换后的缩略图URL:', avatarSrc);
        }
      }

      // 如果通过triggerSlash没有获取到头像，尝试使用char头像
      if (!avatarSrc) {
        console.log('[ChatPage] 主要方法失败，使用char头像作为备用');
        avatarSource = 'char';
        const resolvedChar = resolveAvatar('char');
        avatarSrc = resolvedChar ? convertAvatarToThumbnail(resolvedChar) : undefined;
        console.log('[ChatPage] 备用char头像转换后的缩略图URL:', avatarSrc);
      }

      if (avatarSrc) {
        userAvatar.value = avatarSrc;
        console.log('[ChatPage] 用户头像设置成功:', avatarSrc);
      } else {
        console.log('[ChatPage] 用户头像获取失败，使用默认头像');
      }
    };

    getUserAvatar();
  } catch (error) {
    console.warn('[ChatPage] 获取用户头像时出错:', error);
  }
});
</script>

<style lang="scss" scoped>
.mimi-chat-app {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background-color: #f6f6f7;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mimi-chat-app::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.mimi-chat-header {
  display: flex;
  align-items: center;
  padding: 0 16px 12px;
  width: 100%;
  box-sizing: border-box;
  cursor: grab;
  user-select: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.mimi-chat-header:active {
  cursor: grabbing;
}

.mimi-chat-header:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.mimi-chat-header:active {
  background-color: rgba(0, 0, 0, 0.05);
}

.mimi-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mimi-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ededed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.mimi-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mimi-profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.1;
}

.mimi-profile-name {
  font-size: 16px;
  font-weight: 600;
}

.mimi-profile-status {
  font-size: 12px;
  color: #6f6f73;
  display: flex;
  align-items: center;
  gap: 6px;
}

.mimi-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #3cc77a;
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

.mimi-conversation-header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  flex: 1;
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

.mimi-header-button--more {
  margin-left: auto !important;
}

.mimi-conversation-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mimi-conversation-name {
  font-weight: 600;
  font-size: 16px;
  color: #1f1f1f;
}

.mimi-conversation-meta {
  font-size: 12px;
  color: #8c9099;
}

.mimi-chat-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  background-color: #ffffff;
}

.mimi-chat-content--conversation {
  background-color: #f2f3f5;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

.mimi-messages-page, .mimi-contacts-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mimi-message-list, .mimi-contacts-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  max-width: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mimi-message-item {
  display: flex !important;
  gap: 12px !important;
  padding: 12px 12px !important;
  border: none !important;
  background: transparent !important;
  width: 100% !important;
  max-width: 100% !important;
  text-align: left !important;
  cursor: pointer !important;
  align-items: center !important;
  min-height: 72px !important;
  max-height: 72px !important;
  height: 72px !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
}

.mimi-message-item:focus-visible {
  outline: 2px solid #376afc;
  outline-offset: -2px;
}

.mimi-message-item.pinned {
  background: #f5f5f6;
  border-radius: 8px;
}

.mimi-avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.mimi-avatar-wrapper img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e5e5e8;
}

.mimi-badge {
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

.mimi-message-details {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: hidden !important;
  justify-content: space-between !important;
}

.mimi-message-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.mimi-name {
  font-weight: 600;
  font-size: 15px;
  color: #1f1f1f;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}

.mimi-timestamp {
  font-size: 12px;
  color: #9b9b9f;
  flex-shrink: 0;
}

.mimi-message-bottom {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.mimi-last-message {
  flex: 1 !important;
  font-size: 13px !important;
  color: #5a5a5f !important;
  min-width: 0 !important;
  max-width: 100% !important;
  display: block !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  line-height: 1.3;
  overflow-wrap: anywhere !important;
}

.mimi-contact-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mimi-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
  letter-spacing: 0.4px;
  padding: 12px 18px 6px;
}

.mimi-section-title::before {
  content: '';
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 6px solid #1f1f1f;
}

.mimi-contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.mimi-contact-item:focus-visible {
  outline: 2px solid #376afc;
  outline-offset: -2px;
}

.mimi-contact-item:hover {
  background: #f8f8f9;
}

.mimi-contact-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.mimi-contact-id {
  font-weight: 600;
  font-size: 15px;
  color: #1f1f1f;
}

.mimi-contact-signature {
  font-size: 13px;
  color: #5a5a5f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mimi-empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #9b9b9f;
}

.mimi-empty-state svg {
  width: 48px;
  height: 48px;
}

.mimi-conversation-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.mimi-conversation-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mimi-conversation-message {
  display: flex;
  gap: 8px;
  max-width: 80%;
}

.mimi-message--user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.mimi-message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.mimi-message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mimi-message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mimi-message-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  background: #ffffff;
  color: #1f1f1f;
  font-size: 15px;
  line-height: 1.4;
  word-wrap: break-word;
}

.mimi-message--user .mimi-message-bubble {
  background: #007aff;
  color: #ffffff;
}

.mimi-message-time {
  font-size: 11px;
  color: #8c9099;
  text-align: center;
}

.mimi-message-input-area {
  padding: 16px;
  background: #ffffff;
  border-top: 1px solid #e5e5e8;
}

.mimi-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.mimi-message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e5e5e8;
  border-radius: 20px;
  background: #f6f6f7;
  font-size: 15px;
  outline: none;
}

.mimi-message-input:focus {
  border-color: #007aff;
  background: #ffffff;
}

.mimi-send-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #007aff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.mimi-send-button:hover {
  background: #0051d5;
}

.mimi-send-button svg {
  width: 16px;
  height: 16px;
}

.mimi-chat-footer {
  border-top: 1px solid #e8e8ea;
  background-color: #ffffff;
  padding: 6px 12px;
}

nav {
  display: flex;
  justify-content: center;
  gap: 0;
  align-items: center;
}

.mimi-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-decoration: none;
  color: #909097;
  font-size: 12px;
  gap: 2px;
  position: relative;
  transition: color 0.2s ease;
  border: none !important;
  background: none !important;
  padding: 0 !important;
  margin: 0 !important;
  outline: none !important;
  box-shadow: none !important;
  text-shadow: none !important;
  cursor: pointer;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
}

.mimi-nav-item:focus {
  outline: none !important;
  box-shadow: none !important;
}

.mimi-nav-icon {
  width: 24px;
  height: 24px;
}

.mimi-nav-item.mimi-nav-item--active {
  color: #1f1f1f;
  font-weight: 600;
}

.mimi-nav-item.mimi-nav-item--active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: #1f1f1f;
}
</style>