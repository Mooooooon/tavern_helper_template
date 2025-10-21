// shared-state.ts
import { reactive, computed } from 'vue';

export class MyINI {
  public sections: Record<string, any>;
  public autoSave: string;
  public save: any;

  constructor() {
    this.sections = {};
    this.autoSave = '';
  }

  loadLines(lines: string[]) {
    this.sections = {};
    let currentSection = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        currentSection = trimmed.slice(1, -1);
      } else if (currentSection && trimmed.includes('=')) {
        const [key, ...values] = trimmed.split('=');
        const value = values.join('=').trim();

        if (!this.sections[currentSection]) {
          this.sections[currentSection] = {};
        }
        this.sections[currentSection][key.trim()] = value;
      }
    }

    return Object.keys(this.sections).length > 0;
  }

  loadText(text: string) {
    // 添加参数校验
    if (typeof text !== 'string') {
      console.error('Invalid text input');
      return false;
    }

    // 处理不同换行符并过滤空行
    const lines = text
      .replace(/\r\n/g, '\n') // 统一换行符
      .split(/\n+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    return this.loadLines(lines); // 使用this调用类方法
  }

  getAllSections() {
    return Object.keys(this.sections);
  }

  getAllKeys(section: string) {
    return this.sections[section] ? Object.keys(this.sections[section]) : [];
  }

  readValue(section: string, key: string) {
    return this.sections[section]?.[key] || '';
  }

  readValueDouble(section: string, key: string) {
    const value = parseFloat(this.readValue(section, key));
    return isNaN(value) ? -1 : value;
  }

  writeValue(section: string, key: string, value: any) {
    if (!key) return false;

    if (!this.sections[section]) {
      this.sections[section] = {};
    }
    this.sections[section][key] = value.toString();

    if (this.autoSave) {
      this.save(this.autoSave);
    }
    return true;
  }

  getKeyByValue(section: string, value: any) {
    const items = this.sections[section] || {};
    return Object.keys(items).find(key => items[key] === value) || '';
  }

  containsKey(section: string) {
    return section in this.sections;
  }

  removeSection(section: string) {
    delete this.sections[section];
    return true;
  }

  getAllText() {
    let result = '';
    for (const section of Object.keys(this.sections)) {
      result += `\n[${section}]`;
      const keyvalue = this.sections[section];
      for (const key of Object.keys(keyvalue)) {
        const value = keyvalue[key];
        result += `\n${key}=${value}`;
      }
    }
    result = result.trim();
    return result;
  }
}

class NamedIndexedDB {
  private dbName: string;
  private db: IDBDatabase | null = null;

  constructor(dbName: string = 'named-storage') {
    this.dbName = dbName;
  }

  // 初始化数据库
  async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('namedData')) {
          // 使用 name 作为键路径，这样我们可以用变量名作为键
          db.createObjectStore('namedData', { keyPath: 'name' });
        }
      };
    });
  }

  // 确保数据库连接
  private async ensureConnected(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    return this.db!;
  }

  /**
   * 存储数据（使用变量名作为键）
   * @param name 变量名称
   * @param data 要存储的数据
   */
  async setData<T = any>(name: string, data: T): Promise<void> {
    const db = await this.ensureConnected();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['namedData'], 'readwrite');
      const objectStore = transaction.objectStore('namedData');

      // 使用变量名作为键
      const request = objectStore.put({ name, data });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 读取数据（使用变量名）
   * @param name 变量名称
   */
  async getData<T = any>(name: string): Promise<T | null> {
    const db = await this.ensureConnected();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['namedData'], 'readonly');
      const objectStore = transaction.objectStore('namedData');
      const request = objectStore.get(name);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 删除数据
   * @param name 变量名称
   */
  async deleteData(name: string): Promise<void> {
    const db = await this.ensureConnected();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['namedData'], 'readwrite');
      const objectStore = transaction.objectStore('namedData');
      const request = objectStore.delete(name);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 获取所有存储的变量名
   */
  async getAllKeys(): Promise<string[]> {
    const db = await this.ensureConnected();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['namedData'], 'readonly');
      const objectStore = transaction.objectStore('namedData');
      const request = objectStore.getAllKeys();

      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => reject(request.error);
    });
  }
}

export const sharedState = reactive({
  QQ: {
    chars: {
      char1: {
        head: 'https://sharkpan.xyz/f/k7eU6/ComfyUI_00033_.png',
        background: '',
        text: '#FFFFFF',
        bubble: '#4d559a',
        chartype: 'friend',
        name: 'char1',
        phone: '苹果21 pro max Ultra',
        inputColor: '#FFFFFF',
      },
      char2: {
        head: 'https://sharkpan.xyz/f/BZjSa/%E5%A4%B4%E5%83%8F%20%282%29.jpg',
        background: '',
        text: '#FFFFFF',
        bubble: '#61aea8',
        chartype: 'friend',
        name: 'char2',
      },
      group1: {
        head: 'https://sharkpan.xyz/f/k7eU6/ComfyUI_00033_.png',
        background: '',
        chartype: 'Group',
        name: '群聊1',
      },
    } as { [key: string]: any },
    chathistory: {
      char1: {
        chartype: 'private',
        msgs: [
          {
            msgtype: 'img',
            content: 'hahaha',
            sender: 'char1',
          },
          {
            msgtype: 'text',
            content: 'hahaha',
            sender: 'user',
            time: '12:12',
          },
        ],
        lastMsg: 'hahaha',
      },
      group1: {
        chartype: 'Group',
        msgs: [
          {
            msgtype: 'text',
            content: 'hahaha',
            sender: 'char2324',
          },
          {
            msgtype: 'img',
            content: 'hahaha',
            sender: 'user',
            additionalText: '这是多出来的文本',
          },
          {
            msgtype: 'music',
            content: '',
            sender: 'user',
            song: '愿与愁',
            singer: '林俊杰',
          },
          {
            msgtype: 'music',
            content: '',
            sender: 'char1',
            song: '愿与愁',
            singer: '林俊杰',
          },
          {
            msgtype: 'emoji',
            emoji: 'http://sharkpan.xyz/f/DnJHK/F12BF133675BA34684A60CF38E17D328_0.gif',
            content: '',
            sender: 'char1',
            additionalText: '',
          },
          {
            msgtype: 'voice',
            content: '这是语音内容',
            voicetime: '2',
            sender: 'char1',
            time: '12:12',
          },
        ],
        lastMsg: '这是语音内容',
        unread: '3',
      },
    } as { [key: string]: any },
    post: [
      {
        id: '34ks6k',
        sender: 'char1',
        content: '这是一条动态内容',
        imgs: [
          { imgtype: 'img', content: '一张配图' },
          { imgtype: 'emoji', url: 'http://sharkpan.xyz/f/rOpu6/9277120A65282CFEAB9E191B34474729_0.gif' },
        ],
        comment: [
          { sender: '路人1', content: '123' },
          { sender: '路人2', content: '456' },
        ],
        time: '12:21',
        like: '0',
        see: '0',
        read: false,
      },
    ] as { [key: string]: any }[],
    postUnread: computed(() => {
      let count = 0;
      for (const value of sharedState.QQ.post) {
        if ('read' in value == false || !value.read) {
          count++;
        }
      }
      return count;
    }),
    activeChatId: null,
    default: {
      bubble: '#a0c6f8',
      text: '#ffffff',
    },
    music: {
      audio: new Audio(),
      id: '',
    },
    chatfunction: {},
    activefunction: null,
    activePage: 1,
    panel: false,
    cacheMsg: [] as string[],
    time: '',
    allUnRead: computed(() => {
      let totalUnread = 0;
      // 使用 Object.values() 获取 chathistory 对象中所有的值（也就是聊天记录对象）组成的数组
      for (const chat of Object.values(sharedState.QQ.chathistory)) {
        // 确保 chat.unread 存在并且是数字
        if (chat && typeof chat.unread === 'number') {
          totalUnread += chat.unread;
        }
      }

      totalUnread += sharedState.QQ.postUnread;
      return totalUnread;
    }),
    addMsg(name: string, message: { [key: string]: any }) {
      if ('time' in message == false || !message.time || message.time == '') {
        // message.time = this.time;
      }

      // 先判断有没有这个聊天
      if (name in this.chathistory == false) {
        this.chathistory[name] = {
          chartype: sharedState.QQ.chars[name]?.chartype == 'Group' ? 'Group' : 'private',
          msgs: [],
        };
      }

      // 判断要不要增加新时间显示
      if (this.chathistory[name].msgs.length == 0) {
        if (!message.time) {
        } else {
          this.chathistory[name].msgs.push({
            msgtype: 'system',
            sender: 'system',
            content: message.time,
            time: message.time,
          });
        }
      } else {
        const lastTime = this.chathistory[name].msgs.at(-1).time;
        if (lastTime) {
          const sp1 = lastTime.replace('：', ':').split(':');
          const sp2 = message.time.replace('：', ':').split(':');
          if (sp1.length >= 2 && sp2.length >= 2) {
            if (Math.abs(sp1[1] - sp2[1]) >= 5) {
              this.chathistory[name].msgs.push({
                msgtype: 'system',
                sender: 'system',
                content: message.time,
                time: message.time,
              });
            }
          }
        }
      }

      sharedState.QQ.chathistory[name].msgs.push(message);
      if (sharedState.QQ.chars[name].chartype == 'npc') {
        sharedState.QQ.chars[name].chartype = 'friend';
      }

      // 重新计算主页tips
      sharedState.QQ.chathistory[name].lastMsg = message.content;
      sharedState.QQ.chathistory[name].time = this.time;

      if (!sharedState.QQ.chathistory[name].unread) {
        sharedState.QQ.chathistory[name].unread = 0;
      }

      if (this.activeChatId == name) {
        sharedState.QQ.chathistory[name].unread = 0;
      } else if (message.sender != 'user') {
        let count = Number(sharedState.QQ.chathistory[name].unread) + 1;
        sharedState.QQ.chathistory[name].unread = count;
      } else if (message.sender == 'user') {
        sharedState.QQ.chathistory[name].unread = 0;
      }
    },
    replaceMsg(messages: object) {
      // this.chathistory = messages;
    },
    charini: new MyINI(),
    async saveChars() {
      for (const char of this.charini.getAllSections()) {
        if (this.charini.readValue(char, 'type').toLowerCase() == 'npc') {
          continue;
        }

        if (this.chars[char]?.text) {
          this.charini.writeValue(char, '字体颜色', this.chars[char].text);
        }
        if (this.chars[char]?.bubble) {
          this.charini.writeValue(char, '气泡颜色', this.chars[char].bubble);
        }
        if (this.chars[char]?.head && this.charini.readValue(char, '头像') != 'char') {
          this.charini.writeValue(char, '头像', this.chars[char].head);
        }
        if (this.chars[char]?.background) {
          this.charini.writeValue(char, '聊天壁纸', this.chars[char].background);
        }
        if (this.chars[char]?.inputColor) {
          this.charini.writeValue(char, '输入框颜色', this.chars[char].inputColor);
        }
        if (this.chars[char]?.chartype == 'friend' && this.chars[char]?.name) {
          this.charini.writeValue(char, '备注', this.chars[char]?.name);
        } else {
          console.log(`${char} type:${this.chars[char]?.chartype} name:${this.chars[char]?.name}`);
          console.log(JSON.stringify(this.chars));
        }

        if ('phone' in this.chars[char] && this.chars[char].phone != '隐藏机型') {
          this.charini.writeValue(char, '手机型号', this.chars[char].phone);
        }
      }

      let entry = sharedState.ST.getEntry(['手机-角色'], true);
      if (!entry) {
        // 不存在条目,自动创建
        await createWorldbookEntries(sharedState.ST.worldName, [
          { name: '手机-角色', position: { type: 'after_character_definition' } },
        ]);
        await sharedState.ST.worldInit();
        entry = sharedState.ST.getEntry(['手机-角色'], true);
      }
      await setLorebookEntries(sharedState.ST.worldName, [{ uid: entry.uid, content: this.charini.getAllText() }]);
    },
  },
  backupQQ: {
    chathistory: {} as { [key: string]: any },
    post: [] as { [key: string]: any }[],
  },
  phone: {
    activeApp: 'QQ', // 默认启动QQ
    show: true,
    colorSettings: {
      border: '',
      background: '',
      button: '',
    },
    panel: false,
    autoShow: true,
    autoHide: true,
    width: {
      now: 0,
      min: 200,
      max: 900,
    },
    height: {
      now: 0,
      min: 200,
      max: 1000,
    },
    logo: '',
    time: '',
    sendModel: 'normal',
  },
  ST: {
    userName: '',
    charName: '',
    userHead: 'http://xsad.sadw/1.jpg',
    charHead: '',
    worldName: '',
    entries: [] as WorldbookEntry[],
    async worldInit() {
      const world = await getCharWorldbookNames('current')?.primary;
      if (!world) {
        return;
      }
      this.worldName = world;
      this.entries = await getWorldbook(world);
    },
    getEntry(name: string[], search?: boolean) {
      if (this.entries.length == 0) {
        return null;
      }
      let list: any = [];
      this.entries.forEach(item => {
        if (search) {
          name.forEach(n => {
            if (item.name.indexOf(n) > -1) {
              list.push(item);
            }
          });
        } else if (name.includes(item.name)) {
          list.push(item);
        }
      });

      if (list.length == 0) {
        return null;
      } else if (list.length == 1) {
        return list[0];
      }

      // 存在多个条目,使用开启的条目,有多个开启条目不做处理
      for (let entry of list) {
        if (entry.enabled) {
          return entry;
        }
      }

      // 全都没开启,直接返回第一个
      return list[0];
    },
    isMobile: false,
  },
  RedNote: {
    post: [] as { [key: string]: any }[],
    unRead: 0,
    activePost: '',
    randomHead: [] as string[],
    addPost(post: any) {
      if ('imgColor' in post == false) {
        post['imgColor'] = this.generatePastelColorRGB();
        post['textColor'] = 'black';
      }
      if ('sender' in post == false || !post.sender) {
        post.sender = 'momo';
        post.head = this.getRandomHead();
      }
      if ('head' in post == false) {
        const name = post.sender;
        if (name == 'user' || name == sharedState.ST.userName) {
          post.head = sharedState.ST.userHead;
        } else if (name in sharedState.QQ.chars) {
          post.head = sharedState.QQ.chars[name].head || this.getRandomHead();
        } else {
          post.head = this.getRandomHead();
        }
      }
      if ('comments' in post == false) {
        post.comments = [];
      }
      this.post.unshift(post);
    },
    generatePastelColorRGB(): string {
      // 通过 HSL 转换确保颜色在浅色范围内
      const hue = Math.floor(Math.random() * 360);
      const saturation = Math.random() * 0.2 + 0.6; // 60%-80%
      const lightness = Math.random() * 0.1 + 0.85; // 85%-95%

      // HSL 转 RGB 的辅助函数
      const hueToRGB = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
      const p = 2 * lightness - q;

      const r = Math.round(hueToRGB(p, q, hue / 360 + 1 / 3) * 255);
      const g = Math.round(hueToRGB(p, q, hue / 360) * 255);
      const b = Math.round(hueToRGB(p, q, hue / 360 - 1 / 3) * 255);

      return `rgb(${r}, ${g}, ${b})`;
    },
    getRandomHead() {
      if (this.randomHead.length == 0) {
        return '';
      }
      return this.randomHead[Math.floor(Math.random() * this.randomHead.length)];
    },
  },
  RandomHead: [] as { [key: string]: any }[],
  emoji: {} as { [key: string]: any },
  GetRandomHead() {
    console.log(`调用了获取随机头像`);
    if (sharedState.RandomHead.length === 0) return null; // 处理空数组

    let minCount = Infinity;
    const candidates: { [key: string]: any }[] = [];

    // 一次遍历找到最小值和候选对象
    for (const obj of sharedState.RandomHead) {
      if (obj.count < minCount) {
        minCount = obj.count;
        candidates.length = 0; // 清空数组，重置候选
        candidates.push(obj);
      } else if (obj.count === minCount) {
        candidates.push(obj);
      }
    }

    // 随机选择一个（即使只有一个元素也适用）
    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    selected.count++; // 直接修改原对象
    return selected.url;
  },
  generateBubbleColor() {
    // 生成背景色参数（HSV模型）
    const hueSegments = [0, 60, 120, 180, 240, 300, 360];
    const segmentIndex = Math.floor(Math.random() * 6); // 0-5
    // 在选定的区间内随机生成色相（避免跨区间混杂）
    const H = hueSegments[segmentIndex] + Math.random() * 60;

    const S = 30 + Math.random() * 40; // 饱和度 30%-70%
    const V = 60 + Math.random() * 30; // 亮度 60%-90%
    const bgRgb = hsvToRgb(H, S, V);
    const bgHex = rgbToHex(...(bgRgb as [number, number, number]));

    // 生成互补色
    const complementH = (H + 180) % 360;
    // 提高饱和度并反转亮度
    const textS = Math.min(S + 20, 100); // 提高20%饱和度
    const textV = 100 - V; // 亮度取反
    const textRgb = hsvToRgb(complementH, textS, textV);
    const textHex = rgbToHex(...(textRgb as [number, number, number]));

    // 计算对比度
    const bgLum = calculateLuminance(bgRgb);
    const textLum = calculateLuminance(textRgb);
    const contrastRatio = (Math.max(bgLum, textLum) + 0.05) / (Math.min(bgLum, textLum) + 0.05);

    // 根据对比度返回颜色（至少4.5:1）
    if (contrastRatio >= 4.5) {
      return { bgColor: bgHex, textColor: textHex };
    } else {
      // 对比度不足时回退到黑白
      const textColor = bgLum > 0.5 ? '#000000' : '#FFFFFF';
      return { bgColor: bgHex, textColor };
    }
  },
  backup() {
    this.backupQQ.chathistory = JSON.parse(JSON.stringify(this.QQ.chathistory));
    this.backupQQ.post = JSON.parse(JSON.stringify(this.QQ.post));
    // 处理聊天记录的已读未读
    for (const chat of Object.values(this.backupQQ.chathistory)) {
      // 没有未读的情况
      if ('unread' in chat == false || !chat.unread || chat.unread == 0) {
        for (const msg of chat.msgs) {
          msg.read = true;
        }
        continue;
      }

      // 存在未读
      let count = Number(chat.unread);
      if (count < 0) {
        count = 0;
      }
      for (let i = chat.msgs.length - 1; i >= 0; i--) {
        if (count > 0 && chat.msgs[i].msgtype != 'system') {
          chat.msgs[i].read = false;
          count = count - 1;
        } else {
          chat.msgs[i].read = true;
        }
      }
    }
    console.log(`处理完的backupQQ:\n${JSON.stringify(this.backupQQ)}`);
  },
  loadRead() {
    // 处理QQ聊天
    for (const char of Object.keys(this.QQ.chathistory)) {
      if (char in this.backupQQ.chathistory == false) {
        // 备份里没有这个聊天,不用处理
        continue;
      }
      if (this.QQ.activeChatId == char) {
        this.QQ.chathistory[char].unread = 0;
        continue;
      }
      const qqlength = this.QQ.chathistory[char].msgs.length;
      const backlength = this.backupQQ.chathistory[char].msgs.length;
      const count = Math.min(qqlength, backlength);
      for (let i = 0; i < count; i++) {
        const qqvalue = this.QQ.chathistory[char].msgs[i];
        const backvalue = this.backupQQ.chathistory[char].msgs[i];
        if (qqvalue.msgtype == 'system') {
          // 系统消息直接已读
          qqvalue.read = true;
          continue;
        }
        let isEqual = areObjectsEqualIgnoringKeys(qqvalue, backvalue, ['read']);
        if (isEqual) {
          if ('read' in backvalue && backvalue.read == true) {
            qqvalue.read = true;
          }
        } else {
          // 消息不一致,后面的不用处理了
          break;
        }
      }

      // 添加read标识成功,倒序统计没有read的
      let unread = 0;
      for (let i = this.QQ.chathistory[char].msgs.length - 1; i >= 0; i--) {
        const value = this.QQ.chathistory[char].msgs[i];
        if (value.sender == 'user') {
          // 读取到user发的消息了,直接返回
          break;
        }
        if ('read' in value && value.read) {
          // 读取到已读消息了,返回
          break;
        }
        if ('read' in value == false || value.read != true) {
          unread++;
        }
      }
      this.QQ.chathistory[char].unread = unread;
    }

    // 处理QQ空间
    const count = Math.min(this.QQ.post.length, this.backupQQ.post.length);
    for (let i = 0; i < count; i++) {
      if (this.QQ.post[i].id == this.backupQQ.post[i].id) {
        if ('read' in this.backupQQ.post[i] && this.backupQQ.post[i].read) {
          this.QQ.post[i].read = true;
        } else {
          this.QQ.post[i].read = false;
        }
      }
    }
  },
  GetRandomId(length: number, allnumber: boolean = false) {
    if (allnumber) {
      let id = '';
      id += Math.floor(Math.random() * 9 + 1);
      for (let i = 0; i < length - 1; i++) {
        id += Math.floor(Math.random() * 10);
      }
      return id;
    }
    return Math.random()
      .toString(36)
      .substring(2, 2 + length);
  },
  async checkAudioAvailability(url: string): Promise<boolean> {
    return new Promise(resolve => {
      // 创建测试用音频对象
      const tester = new Audio();
      let timer: number;

      // 成功加载元数据
      const onLoaded = () => {
        cleanup();
        resolve(true);
      };

      // 发生错误或超时
      const onError = () => {
        cleanup();
        resolve(false);
      };

      // 清理事件监听
      const cleanup = () => {
        tester.removeEventListener('loadedmetadata', onLoaded);
        tester.removeEventListener('error', onError);
        clearTimeout(timer);
        tester.src = ''; // 释放资源
      };

      // 设置检测参数
      tester.preload = 'metadata';
      tester.src = url;
      timer = setTimeout(onError, 3000) as unknown as number; // 3秒超时

      // 绑定事件监听
      tester.addEventListener('loadedmetadata', onLoaded);
      tester.addEventListener('error', onError);
    });
  },
  generate: false,
  lock: false,
});

export const addQQNpc = (name: string, chartype?: string, param?: Object) => {
  if (!name) {
    return;
  }

  if (name in sharedState.QQ.chars) {
    return;
  }

  if (chartype == 'system' || name == 'system') {
    return;
  }

  const { bgColor, textColor } = sharedState.generateBubbleColor();
  const obj = {
    head: sharedState.GetRandomHead(),
    background: '',
    text: textColor,
    inputColor: '#FFFFFF',
    bubble: bgColor,
    chartype: chartype ? chartype : 'npc',
    name: name,
    ...param,
  };

  (sharedState.QQ.chars as any)[name] = obj;
};

export const IndexedDB = new NamedIndexedDB('baibai_phone');

function calculateLuminance([r, g, b]: number[]) {
  const [R, G, B] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B; // 权重系数
}

function hsvToRgb(h: any, s: any, v: any) {
  h /= 360;
  s /= 100;
  v /= 100; // 归一化到 [0,1]

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r, g, b;
  switch (i % 6) {
    case 0:
      [r, g, b] = [v, t, p];
      break;
    case 1:
      [r, g, b] = [q, v, p];
      break;
    case 2:
      [r, g, b] = [p, v, t];
      break;
    case 3:
      [r, g, b] = [p, q, v];
      break;
    case 4:
      [r, g, b] = [t, p, v];
      break;
    case 5:
      [r, g, b] = [v, p, q];
      break;
  }

  // 扩展为 0-255 的 RGB 值
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(...rgb: [number, number, number]) {
  return '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
}

function areObjectsEqualIgnoringKeys(obj1: any, obj2: any, keysToIgnore: string[]): boolean {
  // 复制对象并移除忽略的键
  const filteredObj1 = _.omit(_.cloneDeep(obj1), keysToIgnore);
  const filteredObj2 = _.omit(_.cloneDeep(obj2), keysToIgnore);

  // 深度比较剩下的部分
  return _.isEqual(filteredObj1, filteredObj2);
}
