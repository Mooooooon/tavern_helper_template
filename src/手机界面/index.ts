import { createApp } from 'vue';
import QQ from './QQ/QQ.vue';
import RandomHead from './worldbook/随机头像.txt?raw';
import EmojiList from './worldbook/表情包列表.txt?raw';
import PhoneSetttings from './worldbook/基本设置.txt?raw';
import 格式 from './worldbook/格式.txt?raw';
import 规则重述 from './worldbook/规则重述.txt?raw';
import phone from './index.vue';
import momo from './worldbook/momo头像.txt?raw';

import { sharedState, addQQNpc, MyINI, IndexedDB } from './shared-state';

const bookVersion = `1019`;

async function init_ST() {
  await sharedState.ST.worldInit();
  console.log(`世界书名称:${sharedState.ST.worldName}`);
  sharedState.ST.userName = await triggerSlash('/pass {{user}}');
  sharedState.ST.userHead = (await triggerSlash('/pass {{userAvatarPath}}')) ?? '';
  sharedState.ST.charName = await triggerSlash('/pass {{char}}');
  sharedState.ST.charHead = (await triggerSlash('/pass {{charAvatarPath}}')) ?? '';

  sharedState.RedNote.randomHead = momo.split(/\r?\n/g);

  sharedState.QQ.chars = {};
  sharedState.QQ.chathistory = {};
  sharedState.QQ.post = [];

  sharedState.ST.isMobile = await SillyTavern.isMobile();

  await CheckEntry();
  await CheckRegex();
  await worldBookUpdate();

  await LoadEmoji();
  await LoadRandomHead();
  await LoadChar();

  // sharedState.RedNote.addPost({
  //   id: '123',
  //   sender: 'momo',
  //   title: '救命,俺不中嘞',
  //   img: '家人们谁懂啊家人们谁懂啊家人们谁懂啊家人们谁懂啊',
  //   content: '帖子正文',
  //   time: '10-18',
  //   comments: [
  //     { sender: 'momo', content: '这是第一条评论', like: '58', time: '10-09' },
  //     { sender: 'momo', content: '这是第二条评论', like: '28', time: '10-09' },
  //   ],
  //   like: '54',
  //   star: '32',
  //   comment: '18',
  // });

  // await parseMsg();
}

async function worldBookUpdate() {
  try {
    const entry = sharedState.ST.getEntry(['手机-基本设置'], true);
    if (!entry) {
      return;
    }
    const ini = new MyINI();
    ini.loadText(entry.content);
    const iniVer = ini.readValue('基本设置', '世界书版本');
    if (!iniVer || Number(bookVersion) > Number(iniVer)) {
      // 检测到版本不对进行的操作,修改格式世界书
      let setVer = false;
      let formatEntry = sharedState.ST.getEntry(['手机-格式'], true);
      if (formatEntry) {
        await setLorebookEntries(sharedState.ST.worldName, [
          { uid: formatEntry.uid, content: 格式, position: 'after_character_definition', order: 3333 },
        ]);
        setVer = true;
      }
      if (setVer) {
        ini.writeValue('基本设置', '世界书版本', bookVersion);
        await setLorebookEntries(sharedState.ST.worldName, [{ uid: entry.uid, content: ini.getAllText() }]);
      }
    }
    sharedState.phone.colorSettings.background = ini.readValue('基本设置', '内框颜色');
    sharedState.phone.colorSettings.border = ini.readValue('基本设置', '外框颜色');
    sharedState.phone.colorSettings.button = ini.readValue('基本设置', '侧边按钮');
    sharedState.phone.sendModel = ini.readValue('基本设置', '发送模式') || 'normal';
    const bubble = ini.readValue('基本设置', '气泡颜色');
    if (bubble) {
      sharedState.QQ.default.bubble = bubble;
    }
    const text = ini.readValue('基本设置', '字体颜色');
    if (text) {
      sharedState.QQ.default.text = text;
    }
    console.log(`${JSON.stringify(sharedState.phone.colorSettings)}`);
  } catch {}
}

async function CheckEntry() {
  const dict = {
    '手机-表情包': {
      name: '手机-表情包',
      enabled: false,
      position: { type: 'after_character_definition' },
      strategy: { type: 'selective', keys: ['此世界书仅存放数据,永不触发'] },
      content: EmojiList,
    },
    '手机-随机头像': {
      name: '手机-随机头像',
      enabled: false,
      position: { type: 'after_character_definition' },
      strategy: { type: 'selective', keys: ['此世界书仅存放数据,永不触发'] },
      content: RandomHead,
    },
    '手机-基本设置': {
      name: '手机-基本设置',
      enabled: false,
      position: { type: 'after_character_definition' },
      strategy: { type: 'selective', keys: ['此世界书仅存放数据,永不触发'] },
      content: PhoneSetttings,
    },
    '手机-角色': {
      name: '手机-角色',
      enabled: true,
      position: { type: 'after_character_definition' },
      strategy: { type: 'constant' },
      content: '',
    },
    '手机-格式': {
      name: '手机-格式',
      enabled: true,
      position: { type: 'after_character_definition', order: 3333 },
      strategy: { type: 'constant' },
      content: 格式,
    },
    '手机-规则重述': {
      name: '手机-规则重述',
      enabled: true,
      position: { type: 'at_depth', role: 'system', depth: 0, order: 3333 },
      strategy: { type: 'constant' },
      content: 规则重述,
    },
  } as { [key: string]: any };

  let reload = false;
  for (const entry_name in dict) {
    const entry = sharedState.ST.getEntry([entry_name], true);
    if (!entry) {
      reload = true;
      await createWorldbookEntries(sharedState.ST.worldName, [dict[entry_name]]);
    } else if (entry && !entry?.content) {
      reload = true;
      await setLorebookEntries(sharedState.ST.worldName, [{ uid: entry.uid, content: dict[entry_name].content }]);
    }
  }

  if (reload) {
    reload = false;
    await sharedState.ST.worldInit();
  }

  // 以下是自动修改旧版世界书的代码
  // 删除旧格式世界书
  sharedState.ST.entries = sharedState.ST.entries.filter(entry => {
    let has = false;
    if (entry.name.match(/手机-格式\d+-/)) {
      has = true;
      reload = true;
    }
    return !has;
  });

  // 修正群ID
  const charEntry = sharedState.ST.getEntry(['手机-角色'], true);
  if (charEntry?.content) {
    const ini = new MyINI();
    ini.loadText(charEntry.content);
    let overWrite = false;
    for (const char of ini.getAllSections()) {
      if (ini.readValue(char, '类型') != '群聊') {
        continue;
      }

      const match = char.match(/[0-9a-zA-Z]+/);
      if (match && match[0] == char && char.length == 6) {
        continue;
      }

      // 重新赋值ID
      overWrite = true;
      let newId = sharedState.GetRandomId(6, true);
      ini.writeValue(newId, '群名', char);
      ini.getAllKeys(char).map(item => {
        const value = ini.readValue(char, item);
        ini.writeValue(newId, item, value);
      });
      ini.removeSection(char);
    }

    if (overWrite) {
      charEntry.content = ini.getAllText();
    }
  }

  // 读取旧界面设置
  const oldEntry = sharedState.ST.getEntry(['手机-界面基本设置'], true);
  if (oldEntry?.content) {
    console.log(`存在旧的格式世界书!!!!!!!!!!!!`);
    const oldIni = new MyINI();
    const newIni = new MyINI();
    const newEntry = sharedState.ST.getEntry(['手机-基本设置'], true);
    oldIni.loadText(oldEntry.content);
    newIni.loadText(newEntry.content);
    const keys = ['外框颜色', '内框颜色', '侧边按钮'];
    keys.map(key => {
      const value = oldIni.readValue('下面是基本设置', key);
      newIni.writeValue('基本设置', key, value);
    });
    newEntry.content = newIni.getAllText();
    oldEntry.name = '删除此项';
    sharedState.ST.entries = sharedState.ST.entries.filter(entry => {
      return entry.name != '删除此项';
    });
    reload = true;
  }

  if (reload) {
    await replaceWorldbook(sharedState.ST.worldName, sharedState.ST.entries);
  }
}

function CheckRegex() {
  let replace = false;
  const regexes = getTavernRegexes({ scope: 'character' });
  let exists = regexes.some(item => item['find_regex'] === '/<PhoneAnalysis>[\\s\\S]+?<\\/PhoneAnalysis>/g');
  if (!exists) {
    // 创建隐藏思维链
    regexes.push({
      id: '7df2d177-0e2d-4e42-b9c2-d849e00ad9fe',
      script_name: '隐藏手机思维链',
      enabled: true,
      run_on_edit: true,
      scope: 'character',
      find_regex: '/<PhoneAnalysis>[\\s\\S]+?<\\/PhoneAnalysis>/g',
      replace_string: '',
      source: {
        user_input: true,
        ai_output: true,
        slash_command: false,
        world_info: false,
      },
      destination: {
        display: true,
        prompt: true,
      },
      min_depth: null,
      max_depth: null,
    });
    replace = true;
  }
  exists = regexes.some(item => item['find_regex'] === '/<phone>[\\s\\S]+?<\\/phone>/g');
  if (!exists) {
    regexes.push({
      id: '49119623-e1e5-4193-9e79-c97b148aad4b',
      script_name: '隐藏手机格式',
      enabled: true,
      run_on_edit: true,
      scope: 'character',
      find_regex: '/<phone>[\\s\\S]+?<\\/phone>/g',
      replace_string: '',
      source: {
        user_input: true,
        ai_output: true,
        slash_command: false,
        world_info: false,
      },
      destination: {
        display: true,
        prompt: false,
      },
      min_depth: null,
      max_depth: null,
    });
    replace = true;
  }

  if (replace) {
    replaceTavernRegexes(regexes, { scope: 'character' });
    console.log(`自动创建了所需要的正则`);
  }
}

function LoadChar() {
  let content = sharedState.ST.getEntry(['手机-角色'], true)?.content;
  if (!content) {
    return;
  }

  sharedState.QQ.charini.loadText(content);
  for (const char of sharedState.QQ.charini.getAllSections()) {
    let id = '';
    const obj = {} as { [key: string]: any };
    if (char == 'char') {
      id = sharedState.ST.charName;
      obj.name = id;
      obj.head = sharedState.QQ.charini.readValue(char, '头像') || sharedState.ST.charHead;
    } else {
      id = char;
      const name = sharedState.QQ.charini.readValue(char, '群名');
      obj.name = name ? name : id;
      if (sharedState.QQ.charini.readValue(char, '头像') == 'char') {
        obj.head = sharedState.ST.charHead;
      } else {
        obj.head = sharedState.QQ.charini.readValue(char, '头像') || sharedState.GetRandomHead();
      }
    }
    const { bgColor, textColor } = sharedState.generateBubbleColor();
    obj.bubble = sharedState.QQ.charini.readValue(char, '气泡颜色') || bgColor;
    obj.text = sharedState.QQ.charini.readValue(char, '字体颜色') || textColor;
    obj.background = sharedState.QQ.charini.readValue(char, '聊天壁纸') || '';
    obj.phone = sharedState.QQ.charini.readValue(char, '手机型号') || '隐藏机型';
    obj.inputColor = sharedState.QQ.charini.readValue(char, '输入框颜色') || '#FFFFFF';

    const chartype = sharedState.QQ.charini.readValue(char, '类型');
    if (chartype == '群聊') {
      obj.chartype = 'Group';
    } else if (chartype.toLowerCase() == 'npc') {
      obj.chartype = 'npc';
    } else {
      obj.chartype = 'friend';
    }

    if (obj.chartype == 'friend' && sharedState.QQ.charini.readValue(char, '备注')) {
      obj.name = sharedState.QQ.charini.readValue(char, '备注');
    }

    sharedState.QQ.chars[id] = obj;
  }
}

async function LoadEmoji() {
  let content = '';
  const entry = sharedState.ST.getEntry(['手机-表情包'], true);
  if (!entry) {
    return;
  } else {
    content = entry.content;
  }

  if (!content) {
    return;
  }
  content = content.replace(/http:\/\/sharkpan/g, 'https://sharkpan');
  content = content.replace(/--\n/g, '--');
  const regex = new RegExp('(.+?)--(http.+)', 'g');
  const matches = [...content.matchAll(regex)];
  if (!matches) {
    return;
  }
  for (const match of matches) {
    sharedState.emoji[match[1]] = match[2];
  }

  // 写入表情包列表到世界书
  let sendEntry = sharedState.ST.getEntry(['手机-发给Ai的表情包列表'], true);
  const sendEntryContent = `<手机可使用的表情包列表>\n${JSON.stringify(Object.keys(sharedState.emoji))}\n</手机可使用的表情包列表>`;
  if (!sendEntry) {
    sendEntry = await createWorldbookEntries(sharedState.ST.worldName, [
      {
        name: '手机-发给Ai的表情包列表',
        enabled: true,
        position: { type: 'at_depth', role: 'system', depth: 4, order: 3333 },
        strategy: { type: 'constant' },
        content: sendEntryContent,
      },
    ]);
    return;
  }
  await setLorebookEntries(sharedState.ST.worldName, [{ uid: sendEntry.uid, content: sendEntryContent }]);
}

async function LoadRandomHead() {
  let content = '';
  const entry = sharedState.ST.getEntry(['手机-随机头像'], true);
  if (!entry) {
    return;
  } else {
    content = entry.content;
  }

  if (!content) {
    return;
  }
  const matches = content.trim().matchAll(/^http.+$/gm);
  for (const match of matches) {
    const obj = {
      url: match[0],
      count: 0,
    };
    sharedState.RandomHead.push(obj);
  }
}

function removeThink(content: string) {
  if (!content) return '';

  content = content.replace(/<think[ing]*?>[\s\S]+?<\/think[ing]*?>/gi, '');
  return content;
}

async function postIdReset(message: ChatMessage, oldId: string) {
  if (!message || !message.message) {
    return;
  }

  let newId = '';
  while (true) {
    let has = false;
    newId = Math.random()
      .toString(36)
      .substring(2, 2 + 6);
    sharedState.QQ.post.map(item => {
      if (item.id == newId) {
        has = true;
        return;
      }
    });

    if (!has) {
      break;
    }
  }
  console.log(`重新取到的ID:${newId}`);
  const content = message.message.replaceAll(`'${oldId}'`, `'${newId}'`);
  await setChatMessages([{ message_id: message.message_id, message: content }], { refresh: 'all' });
  return newId;
}

async function parseMsg(message: ChatMessage) {
  const content = message.message;
  if (!content) {
    return false;
  }
  let messages = removeThink(content);
  // const cmdRegex = new RegExp(`([a-zA-Z]+\.[a-zA-Z]+)\((.+)\);`, 'g');
  const cmdRegex = /([a-zA-Z]+\.[a-zA-Z]+)\((.+)\);/g;
  const matches = messages.matchAll(cmdRegex);
  let hasPhone = false;
  for (const match of matches) {
    const cmd = match[1];
    const trimmedStr = match[2].trim().replace(/^["']|["']$/g, '');
    const result = trimmedStr.split(/['"]\s*?,\s*?['"]/g);
    if (cmd.match(/qq|rednote/i)) {
      hasPhone = true;
      parseQQ(cmd, result, message);
    }
  }

  return hasPhone;
  // console.log(JSON.stringify(sharedState.QQ.chathistory));
}

async function parseQQ(cmd: string, param: string[], message: ChatMessage) {
  console.log(`cmd`);
  if (param.length == 0) {
    return;
  }
  cmd = cmd.toLowerCase();
  if ((cmd == 'qq.private' || cmd == 'qq.group') && param.length >= 4) {
    let other = '';
    const obj: { [key: string]: any } = parseQQmsgtype(param[2]) as { [key: string]: any };
    let banSend = false;
    if (cmd == 'qq.private') {
      const match =
        param[0].match(new RegExp(`${sharedState.ST.userName}和(.+?)的私聊`)) ||
        param[0].match(new RegExp(`(.+?)和${sharedState.ST.userName}的私聊`));
      if (!match) {
        // return;
        // 也许是角色私聊
        const m = param[0].match(/(.+?)和(.+?)的私聊/);
        if (!m) {
          return;
        }
        if (`${m[1]}和${m[2]}的私聊` in sharedState.QQ.chars) {
          other = `${m[1]}和${m[2]}的私聊`;
        } else if (`${m[2]}和${m[1]}的私聊` in sharedState.QQ.chars) {
          other = `${m[1]}和${m[2]}的私聊`;
        } else {
          other = `${m[1]}和${m[2]}的私聊`;
        }
        banSend = true;
        obj.chartype = 'Group';
        addQQNpc(other, 'Group', { banSend: true });
      } else {
        other = match[1];
        addQQNpc(other);
      }
    } else {
      other = param[0];
      addQQNpc(other, 'Group');
    }

    let ctp = '';
    if (cmd == 'qq.private') {
      if (banSend) {
        ctp = 'Group';
      } else {
        ctp = 'private';
      }
    } else {
      ctp = 'Group';
    }
    if (other in sharedState.QQ.chathistory == false) {
      sharedState.QQ.chathistory[other] = {
        chartype: ctp,
        msgs: [],
      };
    }
    obj['sender'] = param[1] == sharedState.ST.userName ? 'user' : param[1];
    if ('content' in obj == false) {
      obj.content = '';
    }
    obj.time = param[3];
    try {
      sharedState.QQ.addMsg(other, obj);
    } catch (e) {
      console.log(`添加新消息时出现错误:${e}`);
    }
  } else if (cmd == 'qq.setgroupname' && param.length >= 4) {
    let addTips = true;
    if (param[0] in sharedState.QQ.chars == false) {
      addQQNpc(param[0], 'Group');
      addTips = false; // 新群不显示修改名字
    }
    let tips = `${param[2]}修改群名称为"${param[1]}"`;
    sharedState.QQ.chars[param[0]].name = param[1];
    if (addTips && tips) {
      sharedState.QQ.addMsg(param[0], {
        content: tips,
        time: param[3],
        sender: 'system',
        msgtype: 'system',
      });
    }
  } else if (cmd == 'qq.post' && param.length >= 4) {
    // return;
    let postId = param[0];
    let a = false;
    sharedState.QQ.post.map(item => {
      if (item.id == postId) {
        a = true;
        return;
      }
    });
    if (a) {
      const newId = (await postIdReset(message, postId)) || '';
      if (!newId) {
        return;
      }
      postId = newId;
    }

    const obj = {
      id: postId,
      sender: param[1],
      time: param[3],
      see: param[4],
      like: param[5],
      imgs: [] as { [key: string]: any }[],
      comment: [] as { [key: string]: any }[],
      content: '',
    };
    let content = param[2];
    const matches = content.matchAll(/\[(.+?)-(.+?)\]/g);
    for (const match of matches) {
      content = content.replace(match[0], '');
      if (match[1] == 'img') {
        obj.imgs.push({
          imgtype: 'img',
          content: match[2],
        });
      } else {
        if (match[2] in sharedState.emoji) {
          let url = sharedState.emoji[match[2]];
          obj.imgs.push({
            imgtype: 'emoji',
            url: url,
          });
        } else {
          obj.imgs.push({
            imgtype: 'img',
            content: `AI编了个不存在的表情包:${match[2]}`,
          });
        }
      }
    }
    obj.content = content;
    sharedState.QQ.post.unshift(obj);
  } else if (cmd == 'qq.comment' && param.length >= 3) {
    const id = param[0];
    const post = sharedState.QQ.post.find(item => item.id == id);
    if (!post) {
      return;
    }
    post.comment.push({
      sender: param[1],
      content: param[2],
    });
  } else if (cmd == 'rednote.post' && param.length >= 9) {
    const post = {
      id: param[0],
      sender: param[1],
      img: param[2],
      title: param[3],
      content: param[4],
      time: param[5],
      like: param[6],
      star: param[7],
      comment: param[8],
    };
    console.log(`添加新动态:${JSON.stringify(post)}`);
    sharedState.RedNote.addPost(post);
  } else if (cmd == 'rednote.comment') {
    const id = param[0];
    const post = sharedState.RedNote.post.find(item => item.id == id);
    if (!post) {
      return;
    }

    let head = '';
    const sender = param[2] || 'momo';
    if (sender == 'user' || sender == sharedState.ST.userName) {
      head = sharedState.ST.userHead;
    } else if (sender in sharedState.QQ.chars) {
      head = sharedState.QQ.chars[sender]?.head || sharedState.RedNote.getRandomHead();
    } else {
      head = sharedState.RedNote.getRandomHead();
    }
    const comment = {
      content: param[1],
      sender: sender,
      time: param[3],
      like: param[4],
      head: head,
    };

    post.comments.unshift(comment);
  }
}

function parseQQmsgtype(content: string) {
  const regex = /\[(.+?)-(.+?)\]/;
  const match = content.match(regex);
  if (!match) {
    return {
      msgtype: 'text',
      content: content,
    };
  }

  const list = ['bqb', 'zz', 'yy', 'music', 'img'];
  let cmd = match[1];
  if (!list.includes(cmd)) {
    // 没有的类型当img处理
    cmd = 'img';
  }

  if (cmd == 'bqb' || cmd == 'img') {
    const additionalText = content.replace(match[0], '').trim();
    if (cmd == 'bqb') {
      if (sharedState.emoji[match[2]]) {
        return {
          msgtype: 'emoji',
          emoji: sharedState.emoji[match[2]] || '',
          additionalText: additionalText,
          content: match[2],
        };
      } else {
        return {
          msgtype: 'img',
          additionalText: additionalText,
          content: `AI编的表情包:\n${match[2]}`,
        };
      }
    } else {
      return {
        msgtype: 'img',
        additionalText: additionalText,
        content: match[2],
      };
    }
  }
  if (cmd == 'yy') {
    return {
      msgtype: 'voice',
      content: match[2],
      voicetime: Math.ceil(match[2].length / 4).toString(),
    };
  }
  if (cmd == 'music') {
    const sp = match[2].split('$');
    if (sp.length < 2) {
      return {
        msgtype: 'text',
        content: '##Ai输出格式错误了的歌曲分享',
      };
    }
    return {
      msgtype: 'music',
      song: sp[0],
      singer: sp[1],
      content: '',
    };
  }
  if (cmd == 'zz') {
    return {
      msgtype: 'transfer',
      content: `转账${match[2]}`,
      count: match[2],
    };
  }
  return {
    msgtype: 'img',
    content: '未处理类型',
  };
}

console.log(`手机加载了10.20 20:53`);

async function getAllChatMessages(new_id?: number) {
  // return;

  if (sharedState.lock) {
    triggerSlash('/echo 处理中,请稍后再试');
    return;
  }

  sharedState.lock = true;

  try {
    sharedState.backup();
    const lastId = await triggerSlash('/pass {{lastMessageId}}');
    if (!lastId) {
      sharedState.QQ.chathistory = {};
      sharedState.QQ.post = [];
      sharedState.RedNote.post = [];
      sharedState.RedNote.activePost = '';
      return;
    }
    const ChatMessages = await getChatMessages(`0-${lastId}`, { role: 'assistant' });
    if (ChatMessages.length > 0) {
      // 清空,全部从聊天记录获取
      sharedState.QQ.chathistory = {};
      sharedState.QQ.post = [];
      sharedState.RedNote.post = [];
      sharedState.RedNote.activePost = '';
    }
    for (const message of ChatMessages) {
      const hasPhone = await parseMsg(message);
      if (new_id && message.message_id == new_id) {
        if (hasPhone && sharedState.phone.autoShow) {
          sharedState.phone.show = true;
        }
        if (!hasPhone && sharedState.phone.autoHide) {
          sharedState.phone.show = false;
        }
      }
    }
    sharedState.loadRead();
  } catch (e) {
  } finally {
    sharedState.lock = false;
  }
}

const app = createApp(phone);

async function loadPhone() {
  // return 123;

  try {
    deteleportStyle();
    destroyScriptIdDiv();
  } catch {}

  let height = await IndexedDB.getData('height');
  let width = await IndexedDB.getData('width');

  if (!height || !width) {
    if (sharedState.ST.isMobile) {
      width = ($('#chat').width() || 0) * 0.85;
      height = $('#chat').height() || 0;
    } else {
      width = 400;
      height = 800;
    }
  }

  sharedState.phone.width.now = width || sharedState.phone.height.min;
  sharedState.phone.height.now = height || sharedState.phone.width.min;

  const $app = createScriptIdDiv();
  $('body').append($app);
  app.mount($app[0]);

  teleportStyle();

  return;
}

function addButton() {
  appendInexistentScriptButtons([
    { name: '手机显隐切换', visible: true },
    { name: '重新处理所有消息', visible: true },
  ]);
}

$(async () => {
  try {
    addButton();
    await init_ST();
    await getAllChatMessages();
    await loadPhone();
    console.log(`手机加载完成!!!!!!!!!!!!!!!!!`);

    eventOn(tavern_events.CHAT_CHANGED, () => eventHandle(`聊天切换`));
    eventOn(tavern_events.MESSAGE_UPDATED, () => eventHandle(`消息更新`));
    eventOn(tavern_events.GENERATION_ENDED, message_id => eventHandle(`消息生成完成`, message_id));
    eventOn(tavern_events.MESSAGE_SWIPED, () => eventHandle(`消息切换`));
    eventOn(tavern_events.MESSAGE_DELETED, () => eventHandle(`消息删除`));
    eventOn(tavern_events.MESSAGE_SENT, () => {
      console.log(`消息已发送`);
      sharedState.generate = true;
    });
    eventOn(tavern_events.GENERATION_STOPPED, () => {
      console.log(`生成暂停`);
      sharedState.generate = false;
    });
  } catch (e) {
    console.error(e);
    toastr.error(`手机出现错误:${e}`);
  }
});

async function eventHandle(type: string, data?: any) {
  if (type == '消息生成完成') {
    sharedState.generate = false;
    console.log(`最新楼层:${data}`);
    data = data - 1;
  }
  console.log(type);
  await getAllChatMessages(data);
}

eventOn(getButtonEvent('手机显隐切换'), () => {
  sharedState.phone.show = !sharedState.phone.show;
});
eventOn(getButtonEvent('重新处理所有消息'), async () => {
  await getAllChatMessages();
});

$(window).on('pagehide', () => {
  console.log(`触发了pagehide`);
  try {
    app.unmount();
    deteleportStyle();
    destroyScriptIdDiv();
  } catch {}
});

function teleportStyle() {
  try {
    if ($(`head > div[script_id="${getScriptId()}"]`).length > 0) {
      return;
    }
    const $div = $(`<div>`).attr('script_id', getScriptId()).append($(`head > style`, document).clone());
    $('head').append($div);
  } catch {
    console.log(`移动css样式时出错`);
  }
}

function deteleportStyle() {
  try {
    $(`head > div[script_id="${getScriptId()}"]`).remove();
  } catch {
    console.log(`移除样式时出现错误`);
  }
}

function createScriptIdDiv(): JQuery<HTMLDivElement> {
  return $('<div>').attr('script_id', getScriptId()) as JQuery<HTMLDivElement>;
}

function destroyScriptIdDiv(): void {
  try {
    $(`div[script_id="${getScriptId()}"]`).remove();
  } catch {
    console.log(`移除div时出现错误`);
  }
}

function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const time = `${hours}:${minutes}`;
  sharedState.phone.time = time;
}

setInterval(updateTime, 1000);
updateTime();
