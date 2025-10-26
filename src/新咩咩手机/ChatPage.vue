<template>
  <div class="mimi-chat-app">
    <!-- Chat Header -->
    <header
      v-show="currentView !== 'conversation' && currentView !== 'moments'"
      class="mimi-chat-header"
      :style="chatStatusBarStyle"
    >
      <div class="mimi-profile">
        <div class="mimi-avatar">
          <img :src="userAvatar || ''" alt="Avatar" @error="handleAvatarError" />
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
        <button class="mimi-icon-button" type="button" aria-label="添加联系人" @click="handleAddContact">
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Conversation Header -->
    <header
      v-show="currentView === 'conversation'"
      class="mimi-chat-header mimi-chat-header--conversation"
      :style="conversationHeaderStyle"
    >
      <div class="mimi-conversation-header">
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
        <div v-if="activeContact" class="mimi-conversation-info">
          <span class="mimi-conversation-name">{{ activeContact.昵称 }}</span>
          <span class="mimi-conversation-meta">{{ activeContact.签名 }}</span>
        </div>
        <button class="mimi-header-button mimi-header-button--more" type="button" aria-label="更多操作" @click="handleMoreOptions">
          <svg viewBox="0 0 24 24" style="shape-rendering: crispEdges;">
            <rect x="6" y="8" width="12" height="2" rx="1" fill="currentColor" />
            <rect x="6" y="11" width="12" height="2" rx="1" fill="currentColor" />
            <rect x="6" y="14" width="12" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Chat Content -->
    <main class="mimi-chat-content" :class="{ 'mimi-chat-content--conversation': currentView === 'conversation' }">
      <!-- Messages List View -->
      <div v-show="currentView === 'messages' && activeTab === 'messages'" class="mimi-messages-page">
        <div v-if="filteredMessages.length" class="mimi-message-list">
          <button
            v-for="message in filteredMessages"
            :key="message?.contactName || ''"
            class="mimi-message-item"
            :class="{ pinned: message?.pinned }"
            type="button"
            @click="openConversation(message?.contactName || '')"
          >
            <div class="mimi-avatar-wrapper">
              <img :src="message?.avatar || ''" alt="avatar" />
            </div>
            <div class="mimi-message-details">
              <div class="mimi-message-top">
                <span class="mimi-name">{{ message?.name }}</span>
                <span class="mimi-timestamp">{{ message?.time }}</span>
              </div>
              <div class="mimi-message-bottom" :class="{ pinned: message?.pinned }">
                <span class="mimi-last-message">{{ message?.lastMessage }}</span>
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
      <div v-show="currentView === 'messages' && activeTab === 'contacts'" class="mimi-contacts-page">
        <div v-if="hasContacts" class="mimi-contacts-list">
          <div v-for="section in contactSections" :key="section.title" class="mimi-contact-section">
            <div class="mimi-section-title">{{ section.title }}</div>
            <button
              v-for="contact in section.items"
              :key="`${section.keyPrefix}-${contact.contactName}`"
              class="mimi-contact-item"
              type="button"
              @click="openConversation(contact.contactName)"
            >
              <div class="mimi-avatar-wrapper">
                <img :src="contact.avatar || ''" alt="联系人头像" />
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
      <div v-show="currentView === 'conversation'" class="mimi-conversation-view">
        <div ref="messagesContainer" class="mimi-conversation-messages">
          <div
            v-for="message in conversationMessages"
            :key="message.timestamp"
            class="mimi-conversation-message"
            :class="{ 'mimi-message--user': message.is_user }"
          >
            <div v-if="!message.is_user" class="mimi-message-avatar">
              <img :src="activeContact?.头像 || ''" alt="avatar" />
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
            />
            <button class="mimi-send-button" @click="sendMessage">
              <svg viewBox="0 0 24 24">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Moments View -->
      <div v-show="currentView === 'moments'" class="mimi-moments-view">
        <MomentsPage :moments-data="momentsData" @go-back="goBackFromMoments" />
      </div>
    </main>

    <!-- Chat Footer -->
    <footer
      v-show="currentView === 'messages' || currentView === 'contacts'"
      class="mimi-chat-footer"
      :style="chatStatusBarStyle"
    >
      <nav>
        <button
          class="mimi-nav-item"
          :class="{ 'mimi-nav-item--active': activeTab === 'messages' }"
          @click="activeTab = 'messages'"
        >
          <svg viewBox="0 0 24 24" class="mimi-nav-icon">
            <path
              fill="currentColor"
              d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
            />
          </svg>
          <span>消息</span>
        </button>
        <button
          class="mimi-nav-item"
          :class="{ 'mimi-nav-item--active': activeTab === 'contacts' }"
          @click="activeTab = 'contacts'"
        >
          <svg viewBox="0 0 24 24" class="mimi-nav-icon">
            <path
              fill="currentColor"
              d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
            />
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
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue';
import MomentsPage from './MomentsPage.vue';
import { resolveAvatar, convertAvatarToThumbnail } from './utils/avatar';

// 定义发射事件
const emit = defineEmits<{
  'go-home': [];
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


// 组件状态
const currentView = ref<'messages' | 'conversation' | 'moments' | 'contacts'>('messages');
const activeTab = ref<'messages' | 'contacts' | 'moments'>('messages');
const activeContactName = ref<string>('');
const messageInput = ref('');
const userAvatar = ref<string>('');
const messagesContainer = ref<HTMLElement | null>(null);

// 防抖相关变量
let scrollTimeout: number | null = null;
let isScrolling = ref(false);

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

// 联系人数据 - 从外部加载
const contactsData = ref<Record<string, ContactData>>({});

// 计算属性
const activeContact = computed(() => {
  return contactsData.value[activeContactName.value];
});

const conversationMessages = computed(() => {
  if (!activeContact.value) return [];

  const messages = Object.entries(activeContact.value.聊天记录)
    .map(([timeStr, msg]) => {
      // 将格式化的时间字符串转换为时间戳
      const timestamp = new Date(timeStr).getTime();
      return {
        ...msg,
        timestamp: isNaN(timestamp) ? 0 : timestamp,
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  return messages;
});

const hasContacts = computed(() => Object.keys(contactsData.value).length > 0);

const contactSections = computed(() => {
  const contacts = contactsData.value;
  const contactsEntries = Object.entries(contacts);
  if (contactsEntries.length === 0) return [];

  const items = contactsEntries.map(([key, contact]) => ({
    contactName: key,
    displayName: contact.昵称,
    signature: contact.签名,
    avatar: contact.头像,
  }));

  return [
    {
      title: '联系人',
      keyPrefix: 'friend',
      items,
    },
  ];
});

const filteredMessages = computed(() => {
  const contacts = contactsData.value;
  const contactsEntries = Object.entries(contacts);
  if (contactsEntries.length === 0) return [];

  const now = Date.now();
  return contactsEntries
    .map(([key, contact]) => {
      const chatRecords = Object.entries(contact.聊天记录);
      if (chatRecords.length === 0) return null;

      const [lastTimeStr, lastMessage] = chatRecords[chatRecords.length - 1];
      const timestamp = new Date(lastTimeStr).getTime();
      const validTimestamp = isNaN(timestamp) ? 0 : timestamp;

      return {
        contactName: key,
        name: contact.昵称,
        lastMessage: lastMessage.message,
        timestamp: validTimestamp,
        avatar: contact.头像,
        time: formatTimestamp(validTimestamp, now),
        pinned: false, // Add pinned property with default value
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => b.timestamp - a.timestamp);
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

// 重置滚动位置到顶部
function resetScrollPosition() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = 0;
  }
}

// 带防抖的滚动到底部功能方法
function scrollToBottom(immediate = false) {
  // 清除之前的防抖定时器
  if (scrollTimeout !== null) {
    clearTimeout(scrollTimeout);
    scrollTimeout = null;
  }

  const doScroll = () => {
    if (messagesContainer.value && currentView.value === 'conversation') {
      isScrolling.value = true;
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;

      // 滚动完成后重置状态
      setTimeout(() => {
        isScrolling.value = false;
      }, 300);
    }
  };

  if (immediate) {
    doScroll();
  } else {
    // 使用防抖，避免频繁滚动
    scrollTimeout = window.setTimeout(() => {
      doScroll();
      scrollTimeout = null;
    }, 150);
  }
}

function openConversation(contactName: string) {
  activeContactName.value = contactName;
  currentView.value = 'conversation';
  // 切换到对话界面后重置滚动位置，然后立即滚动到底部
  nextTick(() => {
    resetScrollPosition();
    scrollToBottom(true);
  });
}

function goBack() {
  currentView.value = 'messages';
  activeContactName.value = '';
  // 清除任何正在进行的滚动操作
  if (scrollTimeout !== null) {
    clearTimeout(scrollTimeout);
    scrollTimeout = null;
  }
  isScrolling.value = false;
}

function goToMoments() {
  currentView.value = 'moments';
  loadTavernData();
}

function goBackFromMoments() {
  currentView.value = 'messages';
  activeTab.value = 'messages';
}

function sendMessage() {
  if (!messageInput.value.trim() || !activeContactName.value) return;

  // 加工消息格式，添加角色名前缀
  const processedMessage = `[手机系统：对${activeContact.value?.昵称 || activeContactName.value}发送消息-"${messageInput.value}"]`;

  // 将消息填入酒馆输入框
  fillMessageToTavernInput(processedMessage);

  console.log('发送消息:', processedMessage);
  messageInput.value = '';
}

// 将消息填入酒馆输入框的函数
function fillMessageToTavernInput(message: string) {
  try {
    // 使用jQuery来操作酒馆的输入框
    const $tavernTextarea = $('#send_textarea');

    if ($tavernTextarea.length === 0) {
      console.warn('[ChatPage] 未找到酒馆输入框 #send_textarea');
      toastr.warning('未找到酒馆输入框', '提示');
      return;
    }

    // 获取当前输入框的内容
    const currentContent = $tavernTextarea.val()?.toString().trim() || '';

    // 如果输入框已有内容，需要在前面添加换行
    let newContent: string;
    if (currentContent) {
      newContent = currentContent + '\n' + message;
    } else {
      newContent = message;
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

    console.log('[ChatPage] 消息已填入酒馆输入框:', message);
    toastr.success('消息已填入输入框', '成功');

  } catch (error) {
    console.error('[ChatPage] 填入消息到输入框时出错:', error);
    toastr.error('填入消息失败', '错误');
  }
}

function handleAddContact() {
  toastr.info('添加联系人功能暂未完成，敬请期待！', '提示');
}

function handleMoreOptions() {
  toastr.info('更多操作功能暂未完成，敬请期待！', '提示');
}

// 处理头像加载错误 - 隐藏图片而不是显示默认头像
function handleAvatarError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
}

function loadContactsData(contactsDataParam: Record<string, any>) {
  const formattedContacts: Record<string, ContactData> = {};

  Object.entries(contactsDataParam).forEach(([contactName, contactInfo]) => {
    if (!contactInfo || typeof contactInfo !== 'object') return;

    const info = contactInfo as any;
    const rawAvatar = info.头像 || '';

    let processedAvatar = rawAvatar;
    if (rawAvatar && (rawAvatar === 'char' || rawAvatar.startsWith('char:'))) {
      const resolvedAvatar = resolveAvatar(rawAvatar);
      processedAvatar = resolvedAvatar ? convertAvatarToThumbnail(resolvedAvatar) : rawAvatar;
    } else if (rawAvatar) {
      processedAvatar = convertAvatarToThumbnail(rawAvatar);
    }

    formattedContacts[contactName] = {
      昵称: info.昵称 || contactName,
      签名: info.签名 || '',
      头像: processedAvatar,
      聊天记录: info.聊天记录 || {},
      空间动态: info.空间动态 || [],
    };
  });

  contactsData.value = formattedContacts;
}

const momentsData = computed(() => {
  const contacts = contactsData.value;
  if (Object.keys(contacts).length === 0) return [];

  const now = Date.now();
  const moments: any[] = [];

  Object.entries(contacts).forEach(([contactName, contact]) => {
    const contactMoments = contact.空间动态;
    if (!Array.isArray(contactMoments)) return;

    contactMoments.forEach((moment, i) => {
      if (!moment?.时间 || !moment.内容) return;

      const comments = (moment.评论列表 || [])
        .filter((comment: any) => comment?.发言内容)
        .map((comment: any, j: number) => ({
          id: `${contactName}-${moment.时间}-${j}`,
          author: comment.ID || `访客${j + 1}`,
          content: comment.发言内容,
        }));

      const timestamp = new Date(moment.时间).getTime();
      const validTimestamp = isNaN(timestamp) ? 0 : timestamp;

      moments.push({
        id: `${contactName}-${moment.时间}-${i}`,
        contactName,
        name: contact.昵称 || contactName,
        content: moment.内容,
        timestamp: formatMomentTimestamp(validTimestamp, now),
        timeValue: validTimestamp,
        comments,
        avatar: contact.头像,
      });
    });
  });

  return moments.sort((a, b) => b.timeValue - a.timeValue);
});

// 格式化动态时间戳
function formatMomentTimestamp(timestamp: number, nowMs: number): string {
  const now = new Date(nowMs);
  const date = new Date(timestamp);
  const diff = nowMs - timestamp;
  const pad = (value: number) => value.toString().padStart(2, '0');
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

// 简单的防抖变量
let isLoadingData = false;

const loadTavernData = async () => {
  if (isLoadingData) return; // 防止重复加载

  isLoadingData = true;

  try {
    // 等待MVU初始化
    if (typeof waitGlobalInitialized === 'function') {
      await waitGlobalInitialized('Mvu');
    }

    if (typeof Mvu === 'undefined') return;

    const mvuData = Mvu.getMvuData({ type: 'chat' });
    const phoneData = Mvu.getMvuVariable(mvuData, '手机数据', { default_value: {} });

    if (phoneData?.联系人) {
      loadContactsData(phoneData.联系人);

      // 如果当前在对话页面，自动滚动到底部以显示新消息
      if (currentView.value === 'conversation' && !isScrolling.value) {
        nextTick(() => {
          scrollToBottom();
        });
      }
    }
  } catch (error) {
    console.warn('[ChatPage] 加载酒馆数据时出错:', error);
  } finally {
    isLoadingData = false;
  }
};

// 数据监听和加载
const setupTavernDataListener = () => {
  // 初始化时立即加载一次数据
  loadTavernData();

  // 监听MVU变量变化事件 - 关键！
  if (typeof eventOn === 'function' && typeof Mvu !== 'undefined') {
    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, loadTavernData);

    // 监听消息楼层变量变化 - 这是最重要的！
    if (Mvu.events.MESSAGE_VARIABLE_CHANGED) {
      eventOn(Mvu.events.MESSAGE_VARIABLE_CHANGED, () => {
        console.log('[ChatPage] 消息楼层变量变化，强制刷新');
        setTimeout(loadTavernData, 100);
      });
    }
  }

  // 监听酒馆消息事件 - 添加必要的延迟
  if (typeof eventOn === 'function') {
    eventOn(tavern_events.MESSAGE_UPDATED, () => {
      console.log('[ChatPage] 消息更新');
      setTimeout(loadTavernData, 200);
    });

    eventOn(tavern_events.GENERATION_ENDED, () => {
      console.log('[ChatPage] 消息生成完成');
      setTimeout(loadTavernData, 300); // 延迟确保变量已更新
    });

    eventOn(tavern_events.CHAT_CHANGED, () => {
      console.log('[ChatPage] 聊天切换');
      loadTavernData(); // 聊天切换立即执行
    });

    eventOn(tavern_events.MESSAGE_DELETED, () => {
      console.log('[ChatPage] 消息删除');
      setTimeout(loadTavernData, 200);
    });

    eventOn(tavern_events.MESSAGE_SENT, () => {
      console.log('[ChatPage] 消息发送');
      setTimeout(loadTavernData, 500); // 发送后延迟更长时间
    });
  }

  return () => {}; // 清理函数
};

// 公开方法
defineExpose({
  loadContactsData,
  refreshData: loadTavernData,
});

// 监听联系人数据变化（性能优化：浅层监听 + 手动检查）
watch(
  () => {
    return {
      keys: Object.keys(contactsData.value),
      count: Object.keys(contactsData.value).length,
    };
  },
  () => {
    // 只需要知道数据变化了，计算属性会自动更新
  },
  { flush: 'post' },
);

// 监听对话消息变化，自动滚动到底部
watch(
  conversationMessages,
  () => {
    if (currentView.value === 'conversation' && !isScrolling.value) {
      scrollToBottom();
    }
  },
  { flush: 'post', deep: true },
);

// 监听当前联系人变化，当切换联系人时也自动滚动到底部
watch(
  activeContactName,
  (newName, oldName) => {
    if (newName && oldName !== newName && currentView.value === 'conversation') {
      // 清除之前的滚动操作
      if (scrollTimeout !== null) {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
      }
      // 使用 nextTick 确保DOM更新后再滚动
      nextTick(() => {
        resetScrollPosition();
        scrollToBottom(true);
      });
    }
  },
  { flush: 'post' },
);

onMounted(() => {
  // 初始化
  try {
    // 启动酒馆数据监听器
    const cleanup = setupTavernDataListener();

    // 组件卸载时清理监听器和定时器
    onUnmounted(() => {
      cleanup?.();
      if (scrollTimeout !== null) {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
      }
    });

    // 立即尝试获取用户头像，避免出现头像覆盖问题
    const loadUserAvatar = async () => {
      if (typeof triggerSlash !== 'function') return;

      try {
        const avatarPath = await triggerSlash('/pass {{userAvatarPath}}');
        let avatarSrc: string | undefined;

        if (typeof avatarPath === 'string' && avatarPath && avatarPath !== 'undefined') {
          // 检查是否为char URL
          if (avatarPath === 'char' || avatarPath.startsWith('char:')) {
            const resolvedChar = resolveAvatar(avatarPath);
            avatarSrc = resolvedChar ? convertAvatarToThumbnail(resolvedChar) : undefined;
          } else {
            // 普通用户头像路径，转换为缩略图
            avatarSrc = convertAvatarToThumbnail(avatarPath);
          }
        } else {
          // 使用默认char头像
          const resolvedChar = resolveAvatar('char');
          avatarSrc = resolvedChar ? convertAvatarToThumbnail(resolvedChar) : undefined;
        }

        if (avatarSrc) {
          userAvatar.value = avatarSrc;
        }
      } catch (error) {
        console.warn('[ChatPage] 获取用户头像失败:', error);
      }
    };

    // 立即执行头像获取
    loadUserAvatar();
  } catch (error) {
    console.warn('[ChatPage] 初始化时出错:', error);
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
  width: 100%;
  max-width: 100%;
  overflow: hidden;
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
  cursor: default;
  user-select: none;
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
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.mimi-chat-content--conversation {
  background-color: #f2f3f5;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

.mimi-messages-page,
.mimi-contacts-page {
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

.mimi-message-list,
.mimi-contacts-list {
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
  display: flex;
  gap: 12px;
  padding: 12px;
  border: none;
  background: transparent;
  width: 100%;
  max-width: 100%;
  text-align: left;
  cursor: pointer;
  align-items: center;
  min-height: 72px;
  max-height: 72px;
  height: 72px;
  overflow: hidden;
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
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

.mimi-message-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  width: 100%;
  overflow: hidden;
  justify-content: space-between;
}

.mimi-message-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
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
  width: 100%;
  overflow: hidden;
}

.mimi-last-message {
  flex: 1;
  font-size: 13px;
  color: #5a5a5f;
  min-width: 0;
  width: 0;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
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
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  outline: none;
  box-shadow: none;
  text-shadow: none;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.mimi-nav-item:focus {
  outline: none;
  box-shadow: none;
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

/* 手机应用输入框样式隔离 */
.mimi-chat-app input[type='text'],
.mimi-chat-app input[type='number'],
.mimi-chat-app input:not([type]),
.mimi-chat-app textarea:not([type='search']) {
  background-color: #f6f6f7 !important;
  border: 1px solid #e5e5e8 !important;
  color: #1f1f1f !important;
}

.mimi-chat-app .mimi-message-input {
  background-color: #f6f6f7 !important;
  border: 1px solid #e5e5e8 !important;
  color: #1f1f1f !important;
}

.mimi-chat-app .mimi-message-input:focus {
  border-color: #007aff !important;
  background-color: #ffffff !important;
}

.mimi-chat-app .mimi-moment-reply-input {
  background-color: #f3f4f6 !important;
  border: none !important;
  color: #2c2c2e !important;
}

.mimi-chat-app .mimi-moment-reply-input::placeholder {
  color: #9b9b9f !important;
}
</style>
