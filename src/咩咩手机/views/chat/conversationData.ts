export type Sender = 'friend' | 'me';

export type ConversationMessage =
  | {
      id: number;
      type: 'message';
      sender: Sender;
      author: string;
      text: string;
      time: string;
    }
  | {
      id: number;
      type: 'system';
      text: string;
    };

export interface ConversationDetail {
  id: number;
  name: string;
  avatar?: string;
  meta: string;
  messages: ConversationMessage[];
}

const conversations: ConversationDetail[] = [
  {
    id: 1,
    name: '咩咩战队',
    meta: '小队群 · 在线 6 人',
    messages: [
      { id: 1, type: 'system', text: '下午 6:05' },
      {
        id: 2,
        type: 'message',
        sender: 'friend',
        author: '阿峰',
        text: '队伍集合啦，角色先来报一下状态~',
        time: '下午 6:05',
      },
      {
        id: 3,
        type: 'message',
        sender: 'me',
        author: '我',
        text: '我能上辅助，装备刚刚拉满。',
        time: '下午 6:06',
      },
      {
        id: 4,
        type: 'message',
        sender: 'friend',
        author: '团长',
        text: '那输出位我来顶，待会语音见！',
        time: '下午 6:06',
      },
    ],
  },
  {
    id: 2,
    name: '喵喵',
    meta: '移动在线 · 正在输入...',
    messages: [
      { id: 1, type: 'system', text: '下午 3:20' },
      {
        id: 2,
        type: 'message',
        sender: 'friend',
        author: '喵喵',
        text: '嘿，今晚的进度你觉得还好吗？我担心有些细节没打磨到位。',
        time: '下午 3:21',
      },
      {
        id: 3,
        type: 'message',
        sender: 'me',
        author: '我',
        text: '整体还不错，我这边加班把最后一版整理出来，给你过一遍。',
        time: '下午 3:22',
      },
      {
        id: 4,
        type: 'message',
        sender: 'friend',
        author: '喵喵',
        text: '太感谢啦！那我先把文案优化一下，晚点发你确认。',
        time: '下午 3:23',
      },
      {
        id: 5,
        type: 'message',
        sender: 'me',
        author: '我',
        text: '收到，文案确定后我就打包提交，明天应该能上线。',
        time: '下午 3:23',
      },
      {
        id: 6,
        type: 'message',
        sender: 'friend',
        author: '喵喵',
        text: '好的！上线前我再和喵喵对一遍流程，辛苦啦～',
        time: '下午 3:24',
      },
      {
        id: 7,
        type: 'system',
        text: '咩咩助手已将“夜间模式”加入提醒事项',
      },
    ],
  },
];

export function getConversationById(id: number) {
  return conversations.find((item) => item.id === id);
}

export function listConversations() {
  return conversations;
}
