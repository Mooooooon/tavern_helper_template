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
  isGroup: boolean;
  messages: ConversationMessage[];
}

const conversations: ConversationDetail[] = [
  {
    id: 1,
    name: '咩咩战队',
    meta: '小队群 · 在线 6 人',
    isGroup: true,
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
    isGroup: false,
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
  {
    id: 5,
    name: '星见旅人',
    meta: '最近在线 · 5 分钟前',
    isGroup: false,
    messages: [
      { id: 1, type: 'system', text: '昨天 下午 9:12' },
      {
        id: 2,
        type: 'message',
        sender: 'friend',
        author: '星见旅人',
        text: '今晚的星轨拍到了，发你几张看看？',
        time: '晚上 9:12',
      },
      {
        id: 3,
        type: 'message',
        sender: 'me',
        author: '我',
        text: '想看！你镜头拉到银河中心了吗？',
        time: '晚上 9:13',
      },
      {
        id: 4,
        type: 'message',
        sender: 'friend',
        author: '星见旅人',
        text: '有的，顺便抓到一颗小流星，等下打包发你。',
        time: '晚上 9:14',
      },
      {
        id: 5,
        type: 'message',
        sender: 'me',
        author: '我',
        text: '太棒了！周末要不要一起去郊外再拍一组？',
        time: '晚上 9:14',
      },
      {
        id: 6,
        type: 'message',
        sender: 'friend',
        author: '星见旅人',
        text: '好呀，我找个流光比较干净的山谷，到时候通知你～',
        time: '晚上 9:15',
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
