import { defineStore } from 'pinia';
import { resolveAvatar } from '../utils/avatar';

type ChatLogEntry = {
  is_user?: boolean;
  message?: string;
};

type MomentCommentRaw = {
  ID?: string;
  发言内容?: string;
};

type MomentRaw = {
  时间?: number | string;
  内容?: string;
  评论列表?: unknown;
};

type ContactRaw = {
  昵称?: string;
  签名?: string;
  头像?: string;
  聊天记录?: Record<string, ChatLogEntry>;
  空间动态?: MomentRaw[];
};

type ContactRecord = {
  key: string;
  displayName: string;
  signature: string;
  avatarSource?: string;
  avatar?: string;
  chatLog: Record<string, ChatLogEntry>;
  dynamics: MomentRaw[];
};

type ContactListItem = {
  contactName: string;
  displayName: string;
  signature: string;
  avatar?: string;
};

type MessageSummary = {
  contactName: string;
  name: string;
  lastMessage: string;
  timestamp: number;
  avatar?: string;
};

type MomentComment = {
  id: string;
  author: string;
  content: string;
};

type MomentSummary = {
  id: string;
  contactName: string;
  name: string;
  content: string;
  timestamp: number;
  comments: MomentComment[];
  avatar?: string;
};

type ConversationMessage = {
  id: number;
  type: 'message' | 'system';
  sender?: 'friend' | 'me';
  author?: string;
  text: string;
  time?: string;
};

type ConversationDetail = {
  id: string;
  name: string;
  avatar?: string;
  meta: string;
  isGroup: boolean;
  messages: ConversationMessage[];
};

declare const waitGlobalInitialized: (key: string) => Promise<void>;
declare const eventOn: (event: string, handler: (...args: any[]) => void) => void;

declare const Mvu: {
  events: {
    VARIABLE_UPDATE_ENDED: string;
  };
  getMvuData: (options: { type: string }) => Mvu.MvuData;
  getMvuVariable: <T>(
    data: Mvu.MvuData,
    path: string,
    options: { default_value: T },
  ) => T;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toNumber(value: unknown): number | null {
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

function extractComments(raw: unknown, contactName: string, timestamp: number): MomentComment[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const comments: MomentComment[] = [];

  raw.forEach((item, index) => {
    if (!isObject(item)) {
      return;
    }

    const comment = item as MomentCommentRaw;
    const commentText = typeof comment.发言内容 === 'string' ? comment.发言内容.trim() : '';
    if (!commentText) {
      return;
    }

    const id =
      typeof comment.ID === 'string' && comment.ID.trim().length > 0
        ? comment.ID.trim()
        : `访客${index + 1}`;

    comments.push({
      id: `${contactName}-${timestamp}-${index}`,
      author: id,
      content: commentText,
    });
  });

  return comments;
}

function parseDynamics(
  contactName: string,
  rawItems: MomentRaw[],
): MomentSummary[] {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return [];
  }

  const items: MomentSummary[] = [];

  rawItems.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      return;
    }

    const timestamp = toNumber(item.时间);
    const content = typeof item.内容 === 'string' ? item.内容 : '';

    if (!timestamp || !content) {
      return;
    }

    const comments = extractComments(item.评论列表, contactName, timestamp);

    items.push({
      id: `${contactName}-${timestamp}-${index}`,
      contactName,
      name: contactName,
      content,
      timestamp,
      comments,
    });
  });

  return items;
}

function normalizeChatLog(raw: unknown): Record<string, ChatLogEntry> {
  if (!isObject(raw)) {
    return {};
  }
  const entries = raw as Record<string, ChatLogEntry>;
  return entries;
}

function buildConversationMessages(
  contactName: string,
  displayName: string,
  chatLog: Record<string, ChatLogEntry>,
  timeFormatter: (timestamp: number) => string,
): ConversationMessage[] {
  const timestamps = Object.keys(chatLog)
    .map(key => Number(key))
    .filter(value => Number.isFinite(value))
    .sort((a, b) => a - b);

  const messages: ConversationMessage[] = [];

  timestamps.forEach(timestamp => {
    const entry = chatLog[String(timestamp)];
    if (!entry || typeof entry !== 'object' || typeof entry.message !== 'string') {
      return;
    }
    messages.push({
      id: timestamp,
      type: 'message',
      sender: entry.is_user ? 'me' : 'friend',
      author: entry.is_user ? '我' : displayName || contactName,
      text: entry.message,
      time: timeFormatter(timestamp),
    });
  });

  return messages;
}

export const useChatStore = defineStore('chatStore', {
  state: () => ({
    initialized: false,
    listenerRegistered: false,
    currentTime: Date.now(),
    contacts: {} as Record<string, ContactRecord>,
    contactOrder: [] as string[],
    dynamics: [] as MomentSummary[],
  }),
  getters: {
    contactList(state): ContactListItem[] {
      return state.contactOrder
        .map(contactName => state.contacts[contactName])
        .filter((record): record is ContactRecord => Boolean(record))
        .map(record => ({
          contactName: record.key,
          displayName: record.displayName,
          signature: record.signature,
          avatar: record.avatar,
        }));
    },
    messageSummaries(state): MessageSummary[] {
      const summaries: MessageSummary[] = [];

      state.contactOrder.forEach(contactName => {
        const record = state.contacts[contactName];
        if (!record) {
          return;
        }

        const timestamps = Object.keys(record.chatLog)
          .map(key => Number(key))
          .filter(value => Number.isFinite(value))
          .sort((a, b) => b - a);

        if (timestamps.length === 0) {
          return;
        }

        const lastTimestamp = timestamps[0];
        const lastEntry = record.chatLog[String(lastTimestamp)];
        if (!lastEntry || typeof lastEntry.message !== 'string') {
          return;
        }

        summaries.push({
          contactName: record.key,
          name: record.displayName,
          lastMessage: lastEntry.message,
          timestamp: lastTimestamp,
          avatar: record.avatar,
        });
      });

      return summaries.sort((a, b) => b.timestamp - a.timestamp);
    },
    momentSummaries(state): MomentSummary[] {
      return state.dynamics.slice().sort((a, b) => b.timestamp - a.timestamp);
    },
    contactDetail(state) {
      return (contactName: string): ContactRecord | undefined => state.contacts[contactName];
    },
    conversationFactory(state) {
      return (
        contactName: string,
        timeFormatter: (timestamp: number) => string,
      ): ConversationDetail | undefined => {
        const record = state.contacts[contactName];
        if (!record) {
          return undefined;
        }

        const messages = buildConversationMessages(
          contactName,
          record.displayName,
          record.chatLog,
          timeFormatter,
        );

        return {
          id: contactName,
          name: record.displayName,
          avatar: record.avatar,
          meta: record.signature,
          isGroup: false,
          messages,
        };
      };
    },
  },
  actions: {
    async ensureInitialized(): Promise<void> {
      if (this.initialized) {
        return;
      }

      try {
        await this.refreshFromMvu();
        await this.registerListener();
        this.initialized = true;
      } catch (error) {
        console.error('[chatStore] 初始化失败:', error);
        // 即使初始化失败，也标记为已初始化，避免重复尝试
        this.initialized = true;
      }
    },
    async refreshFromMvu(): Promise<void> {
      try {
        console.log('[chatStore] 开始重新读取MVU数据');

        // 设置超时，避免无限等待
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('MVU初始化超时')), 3000);
        });

        const mvuPromise = waitGlobalInitialized('Mvu');
        await Promise.race([mvuPromise, timeoutPromise]);

        const mvuData = Mvu.getMvuData({ type: 'chat' });
        console.log('[chatStore] 获取到MVU数据:', mvuData);
        this.applyMvuSnapshot(mvuData);

        console.log('[chatStore] MVU数据重新读取完成，聊天记录和动态已更新');
      } catch (error) {
        console.warn('[chatStore] MVU初始化失败，使用默认数据:', error);
        // 使用默认数据初始化
        this.applyMvuSnapshot({} as Mvu.MvuData);
      }
    },
    applyMvuSnapshot(mvuData: Mvu.MvuData): void {
      try {
        const currentTimeValue = typeof Mvu !== 'undefined'
          ? Mvu.getMvuVariable(mvuData, '手机数据.当前时间', {
              default_value: Date.now(),
            })
          : Date.now();
        this.updateCurrentTime(currentTimeValue);

        const contactsData = typeof Mvu !== 'undefined'
          ? Mvu.getMvuVariable(mvuData, '手机数据.联系人', {
              default_value: {},
            })
          : {};

        console.log('[chatStore] 开始应用MVU快照，联系人数据:', contactsData);
        this.updateContacts(contactsData);
        console.log('[chatStore] MVU快照应用完成，聊天记录和动态已更新');
      } catch (error) {
        console.warn('[chatStore] 应用MVU数据失败，使用默认值:', error);
        this.updateCurrentTime(Date.now());
        this.updateContacts({});
      }
    },
    updateCurrentTime(value: unknown): void {
      const parsed = toNumber(value);
      this.currentTime = parsed ?? Date.now();
    },
    updateContacts(rawContacts: Record<string, unknown>): void {
      const nextContacts: Record<string, ContactRecord> = {};
      const nextOrder: string[] = [];
      const nextDynamics: MomentSummary[] = [];

      console.log('[chatStore] 开始更新联系人，原始数据:', rawContacts);

      for (const [contactName, info] of Object.entries(rawContacts)) {
        if (!info || !isObject(info)) {
          continue;
        }

        const raw = info as ContactRaw;
        const avatar = resolveAvatar(raw.头像);

        const contact: ContactRecord = {
          key: contactName,
          displayName:
            typeof raw.昵称 === 'string' && raw.昵称.trim().length > 0
              ? raw.昵称.trim()
              : contactName,
          signature: typeof raw.签名 === 'string' ? raw.签名 : '',
          avatarSource: raw.头像,
          avatar: avatar ?? undefined,
          chatLog: normalizeChatLog(raw.聊天记录),
          dynamics: Array.isArray(raw.空间动态) ? raw.空间动态 : [],
        };

        console.log(`[chatStore] 处理联系人 ${contactName}:`, {
          displayName: contact.displayName,
          chatLogEntries: Object.keys(contact.chatLog).length,
          dynamicsCount: contact.dynamics.length
        });

        const dynamics = parseDynamics(contact.displayName, contact.dynamics);
        dynamics.forEach(item => {
          nextDynamics.push({
            ...item,
            name: contact.displayName,
            avatar: contact.avatar,
          });
        });

        nextContacts[contactName] = contact;
        nextOrder.push(contactName);
      }

      // 使用Vue的响应式更新方式
      this.$patch({
        contacts: nextContacts,
        contactOrder: nextOrder,
        dynamics: nextDynamics
      });

      console.log('[chatStore] 联系人更新完成:', {
        contactCount: nextOrder.length,
        totalDynamics: nextDynamics.length
      });

      // 手动触发更新以确保响应式
      this.currentTime = Date.now();
    },
    async registerListener(): Promise<void> {
      if (this.listenerRegistered) {
        return;
      }

      try {
        console.log('[chatStore] 开始注册MVU变量更新监听器');

        // 设置超时，避免无限等待
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('MVU监听器初始化超时')), 3000);
        });

        const mvuPromise = waitGlobalInitialized('Mvu');
        await Promise.race([mvuPromise, timeoutPromise]);

        console.log('[chatStore] MVU框架初始化成功，注册事件监听器:', Mvu.events.VARIABLE_UPDATE_ENDED);

        eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables: Mvu.MvuData) => {
          console.log('[chatStore] 监听到MVU变量更新事件');
          try {
            this.applyMvuSnapshot(variables);
            console.log('[chatStore] MVU变量事件处理完成');
          } catch (error) {
            console.error('[chatStore] 更新 MVU 数据失败:', error);
          }
        });

        console.log('[chatStore] MVU事件监听器注册成功');
      } catch (error) {
        console.warn('[chatStore] MVU监听器初始化失败:', error);
      }

      this.listenerRegistered = true;
    },
  },
});
