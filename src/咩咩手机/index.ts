import $ from 'jquery';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import type { App, Component } from 'vue';
import toastr from 'toastr';

let phoneAppComponent: Component | null = null;
let resourceLoadPromise: Promise<void> | null = null;
let capturedStyleElements: HTMLStyleElement[] = [];

let shadowHost: HTMLDivElement | null = null;
let shadowRootRef: ShadowRoot | null = null;
let shadowAppContainer: HTMLDivElement | null = null;
let initPromise: Promise<void> | null = null;
const pinia = createPinia();

const STYLE_CLONE_ATTR = 'data-phone-style-clone';
const BASE_STYLE_ATTR = 'data-phone-style-base';
const PHONE_ROOT_ATTR = 'data-phone-app-root';
const BASE_STYLE_CONTENT = `
  :host {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color-scheme: light;
  }
  :host *, :host *::before, :host *::after {
    box-sizing: border-box;
  }
`.trim();
const STYLE_KEYWORDS = ['phone-', 'settings-', 'chat-', 'moments-', 'status-bar', '咩咩', 'message-', 'avatar-', 'badge-', 'empty-state', 'timestamp', 'conversation-', 'profile-', 'nav-item', 'header-button'];

function pickPhoneStyles(styleNodes: HTMLStyleElement[]): HTMLStyleElement[] {
  return styleNodes.filter(styleNode => {
    const content = styleNode.textContent ?? '';

    // 检查是否包含咩咩手机相关样式
    if (STYLE_KEYWORDS.some(keyword => content.includes(keyword))) {
      return true;
    }

    // 检查是否包含Vue组件样式（通过data-v-属性识别）
    if (content.includes('data-v-')) {
      // 进一步检查是否包含手机UI相关的类名
      const phoneClasses = [
        'chat-layout', 'messages-page', 'message-item', 'message-list',
        'message-details', 'message-top', 'message-bottom', 'avatar-wrapper',
        'profile', 'profile-info', 'profile-name', 'profile-status',
        'nav-item', 'nav-icon', 'header-button', 'conversation-info',
        'conversation-name', 'conversation-meta', 'chat-content',
        'chat-header', 'chat-footer', 'status-dot', 'actions',
        'icon-button', 'badge', 'empty-state', 'last-message',
        'timestamp', 'name', 'contacts-page', 'contact-item',
        'contact-info', 'contact-status', 'moments-page', 'moment-item',
        'moment-header', 'moment-content', 'moment-actions',
        'conversation-page', 'conversation-messages', 'conversation-input',
        'phone-frame', 'phone-screen', 'status-bar', 'home-page',
        'settings-page', 'chat-app', 'settings-item', 'settings-title'
      ];

      return phoneClasses.some(className => content.includes(`.${className}`));
    }

    return false;
  });
}

// 辅助函数：创建带script_id的div
function createScriptIdDiv(): JQuery<HTMLDivElement> {
  return $('<div>').attr('script_id', getScriptId()) as JQuery<HTMLDivElement>;
}

// 辅助函数：销毁带script_id的div
function destroyScriptIdDiv(): void {
  try {
    $(`div[script_id="${getScriptId()}"]`).remove();
  } catch {
    console.log('移除div时出现错误');
  } finally {
    shadowHost = null;
    shadowRootRef = null;
    shadowAppContainer = null;
  }
}

// 全局头像缓存接口
declare global {
  interface Window {
    __phoneAvatarCache?: Map<string, boolean>;
  }
}

// 获取或创建全局缓存
function getGlobalAvatarCache(): Map<string, boolean> {
  if (!window.__phoneAvatarCache) {
    window.__phoneAvatarCache = new Map();
    console.log('[getGlobalAvatarCache] 创建新的全局头像缓存');
  } else {
    console.log(`[getGlobalAvatarCache] 复用现有缓存，当前有 ${window.__phoneAvatarCache.size} 个头像`);
  }
  return window.__phoneAvatarCache;
}

// 全局头像预加载函数 - 只在初始化时使用
async function preloadAllAvatars(userStore: any, chatStore: any): Promise<void> {
  const cache = getGlobalAvatarCache();
  const avatarUrls = new Set<string>();
  const newAvatarUrls = new Set<string>();

  // 收集所有头像URL（包括用户头像和联系人头像）
  if (userStore.userInfo?.avatar) {
    avatarUrls.add(userStore.userInfo.avatar);
  }

  if (chatStore.messageSummaries) {
    chatStore.messageSummaries.forEach((summary: any) => {
      if (summary.avatar) {
        avatarUrls.add(summary.avatar);
      }
    });
  }

  if (chatStore.contactList) {
    Object.values(chatStore.contactList).forEach((contact: any) => {
      if (contact.avatar) {
        avatarUrls.add(contact.avatar);
      }
    });
  }

  // 筛选出需要预加载的新头像
  avatarUrls.forEach(url => {
    if (!cache.has(url)) {
      newAvatarUrls.add(url);
      console.log(`[preloadAllAvatars] 发现未缓存的头像: ${url}`);
    } else {
      console.log(`[preloadAllAvatars] 头像已在缓存中，跳过: ${url}`);
    }
  });

  if (newAvatarUrls.size === 0) {
    console.log('[preloadAllAvatars] 没有新的头像需要预加载');
    return;
  }

  console.log(`[preloadAllAvatars] 开始预加载 ${newAvatarUrls.size} 个新头像`);

  // 并行预加载新头像
  const preloadPromises = Array.from(newAvatarUrls).map(url => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        cache.set(url, true);
        console.log(`[preloadAllAvatars] 成功预加载并缓存头像: ${url}`);
        resolve();
      };
      img.onerror = () => {
        console.warn(`[preloadAllAvatars] 头像预加载失败: ${url}`);
        cache.set(url, false); // 标记为失败，避免重复尝试
        resolve();
      };
      img.src = url;
    });
  });

  try {
    await Promise.all(preloadPromises);
    console.log(`[preloadAllAvatars] 预加载完成，共处理 ${newAvatarUrls.size} 个新头像`);
  } catch (error) {
    console.warn('[preloadAllAvatars] 部分头像预加载失败:', error);
  }
}

// 联系人头像预加载函数 - MVU更新时使用
async function preloadContactAvatars(chatStore: any): Promise<void> {
  const cache = getGlobalAvatarCache();
  const avatarUrls = new Set<string>();
  const newAvatarUrls = new Set<string>();

  // 只收集联系人头像，不包括用户头像
  if (chatStore.messageSummaries) {
    chatStore.messageSummaries.forEach((summary: any) => {
      if (summary.avatar) {
        avatarUrls.add(summary.avatar);
      }
    });
  }

  if (chatStore.contactList) {
    Object.values(chatStore.contactList).forEach((contact: any) => {
      if (contact.avatar) {
        avatarUrls.add(contact.avatar);
      }
    });
  }

  // 筛选出需要预加载的新头像
  avatarUrls.forEach(url => {
    if (!cache.has(url)) {
      newAvatarUrls.add(url);
    }
  });

  if (newAvatarUrls.size === 0) {
    console.log('[preloadContactAvatars] 没有新的联系人头像需要预加载');
    return;
  }

  console.log(`[preloadContactAvatars] 开始预加载 ${newAvatarUrls.size} 个新联系人头像`);

  // 并行预加载新头像
  const preloadPromises = Array.from(newAvatarUrls).map(url => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        cache.set(url, true);
        console.log(`[preloadContactAvatars] 成功预加载并缓存联系人头像: ${url}`);
        resolve();
      };
      img.onerror = () => {
        console.warn(`[preloadContactAvatars] 联系人头像预加载失败: ${url}`);
        cache.set(url, false); // 标记为失败，避免重复尝试
        resolve();
      };
      img.src = url;
    });
  });

  try {
    await Promise.all(preloadPromises);
    console.log(`[preloadContactAvatars] 预加载完成，共处理 ${newAvatarUrls.size} 个新联系人头像`);
  } catch (error) {
    console.warn('[preloadContactAvatars] 部分联系人头像预加载失败:', error);
  }
}

// 样式传送函数
function teleportStyle(target: ShadowRoot) {
  try {
    const scriptId = getScriptId();
    target
      .querySelectorAll(`style[${STYLE_CLONE_ATTR}="${scriptId}"]`)
      .forEach(styleNode => styleNode.remove());

    const stylesToClone =
      capturedStyleElements.length > 0
        ? capturedStyleElements
        : pickPhoneStyles(Array.from(document.head.querySelectorAll<HTMLStyleElement>('style')));

    if (stylesToClone.length === 0) {
      console.warn('未找到可传送的手机UI样式，可能导致样式异常');
    }

    stylesToClone.forEach(styleNode => {
      if (!styleNode.textContent?.trim()) return;
      const clone = styleNode.cloneNode(true) as HTMLStyleElement;
      clone.setAttribute(STYLE_CLONE_ATTR, scriptId);
      target.appendChild(clone);
    });
  } catch (error) {
    console.log('移动css样式时出错', error);
  }
}

function deteleportStyle() {
  try {
    const scriptId = getScriptId();
    if (!shadowRootRef) return;
    shadowRootRef
      .querySelectorAll(`style[${STYLE_CLONE_ATTR}="${scriptId}"], style[${BASE_STYLE_ATTR}="${scriptId}"]`)
      .forEach(styleNode => styleNode.remove());
  } catch {
    console.log('移除样式时出现错误');
  }
}

async function ensurePhoneResources(): Promise<void> {
  if (phoneAppComponent) {
    return;
  }

  if (!resourceLoadPromise) {
    const initialStyles = new Set(document.head.querySelectorAll<HTMLStyleElement>('style'));
    resourceLoadPromise = Promise.all([import('./PhoneApp.vue')])
      .then(([phoneModule]) => {
        phoneAppComponent = phoneModule.default as Component;

        if (capturedStyleElements.length === 0) {
          const currentStyles = Array.from(document.head.querySelectorAll<HTMLStyleElement>('style'));
          const diffStyles = currentStyles.filter(styleNode => !initialStyles.has(styleNode));
          let selected = pickPhoneStyles(diffStyles);

          if (selected.length === 0) {
            selected = pickPhoneStyles(currentStyles);
          }

          capturedStyleElements = selected;
        }
      })
      .catch(error => {
        phoneAppComponent = null;
        resourceLoadPromise = null;
        throw error;
      });
  }

  await resourceLoadPromise;
}

function injectBaseStyle(target: ShadowRoot) {
  const scriptId = getScriptId();
  if (target.querySelector(`style[${BASE_STYLE_ATTR}="${scriptId}"]`)) {
    return;
  }

  const baseStyle = document.createElement('style');
  baseStyle.setAttribute(BASE_STYLE_ATTR, scriptId);
  baseStyle.textContent = BASE_STYLE_CONTENT;
  target.appendChild(baseStyle);
}

// 手机UI状态
let vueApp: App | null = null;
let isPhoneVisible = false;

function isPhoneMounted(): boolean {
  return Boolean(vueApp && shadowHost && shadowAppContainer);
}

function updatePhoneVisibility(visible: boolean): void {
  if (!shadowHost || !shadowAppContainer) {
    return;
  }
  const displayValue = visible ? 'block' : 'none';
  shadowHost.style.display = displayValue;
  shadowAppContainer.style.display = displayValue;
}

function showPhoneUI(): void {
  if (initPromise) {
    console.log('手机UI正在初始化，请稍候...');
    return;
  }

  if (!isPhoneMounted()) {
    void initPhoneUI();
    return;
  }

  if (isPhoneVisible) {
    console.log('手机UI已显示，无需重复操作');
    return;
  }

  updatePhoneVisibility(true);
  isPhoneVisible = true;
  toastr.success('手机UI已显示');
}

function hidePhoneUI(): void {
  if (!isPhoneMounted()) {
    console.log('手机UI未初始化或已销毁，无法隐藏');
    return;
  }

  if (!isPhoneVisible) {
    console.log('手机UI已隐藏，无需重复操作');
    return;
  }

  updatePhoneVisibility(false);
  isPhoneVisible = false;
  toastr.info('手机UI已隐藏');
}

// 初始化手机UI
async function initPhoneUI(): Promise<void> {
  if (vueApp) {
    console.log('手机UI已存在，跳过初始化');
    return;
  }

  if (initPromise) {
    console.log('手机UI正在初始化，跳过重复调用');
    await initPromise;
    return;
  }

  console.log('开始初始化手机UI');

  const initialization = (async () => {
    try {
      deteleportStyle();
      destroyScriptIdDiv();
    } catch (cleanupError) {
      console.log('清理旧容器时出现错误', cleanupError);
    }

    const $app = createScriptIdDiv();
    $app.css({
      position: 'fixed',
      top: '0',
      left: '0',
      width: '0',
      height: '0',
      zIndex: '9999',
      pointerEvents: 'none', // 允许点击穿透到下方内容
    });
    $('body').append($app);

    console.log('容器已创建');

    shadowHost = $app[0];
    shadowRootRef = shadowHost.attachShadow({ mode: 'open' });
    shadowAppContainer = document.createElement('div');
    shadowAppContainer.setAttribute(PHONE_ROOT_ATTR, getScriptId());
    shadowAppContainer.style.pointerEvents = 'auto';
    shadowRootRef.appendChild(shadowAppContainer);

    injectBaseStyle(shadowRootRef);

    await ensurePhoneResources();

    if (!shadowRootRef) {
      throw new Error('ShadowRoot 初始化失败');
    }

    teleportStyle(shadowRootRef);

    if (!phoneAppComponent || !shadowAppContainer) {
      throw new Error('手机UI资源加载失败');
    }

    vueApp = createApp(phoneAppComponent);
    vueApp.use(pinia);

    vueApp.mount(shadowAppContainer);

    // 等待下一个tick，确保Vue应用完全挂载后再初始化stores
    await new Promise(resolve => setTimeout(resolve, 0));

    // 异步初始化全局用户信息，不阻塞挂载（只在初始化时执行一次）
    const { useUserStore } = await import('./stores/userStore');
    const userStore = useUserStore();

    // 确保用户信息已经加载完成，特别是头像（只加载一次，永不改变）
    if (!userStore.userAvatar) {
      console.log('[initPhoneUI] 首次初始化用户信息');
      await userStore.ensureInitialized();
      // 额外等待一下确保头像加载完成
      await new Promise(resolve => setTimeout(resolve, 100));
    } else {
      console.log('[initPhoneUI] 用户信息已存在，跳过重复加载');
    }

    // 也初始化chatStore，确保它在Vue应用上下文中被创建
    const { useChatStore } = await import('./stores/chatStore');
    const chatStore = useChatStore();
    await chatStore.ensureInitialized();

    // 检查当前缓存状态
    const existingCache = getGlobalAvatarCache();
    console.log(`[initPhoneUI] 检查现有缓存: ${existingCache.size} 个头像`);

  // 预加载所有头像
    await preloadAllAvatars(userStore, chatStore);

    console.log('Vue应用已挂载');

    // 调试：输出最终缓存状态
    console.log(`[initPhoneUI] 初始化完成，全局缓存中有 ${existingCache.size} 个头像:`);
    existingCache.forEach((_, key) => {
      console.log(`  - ${key}`);
    });

    updatePhoneVisibility(true);
    isPhoneVisible = true;
    toastr.success('手机UI已打开');
  })().catch(error => {
    console.error('初始化手机UI失败:', error);
    if (vueApp) {
      try {
        vueApp.unmount();
      } catch (unmountError) {
        console.error('初始化失败时卸载Vue应用出错:', unmountError);
      }
      vueApp = null;
    }
    deteleportStyle();
    destroyScriptIdDiv();
    isPhoneVisible = false;
    toastr.error('手机UI打开失败');
    throw error;
  });

  initPromise = initialization;

  try {
    await initialization;
  } catch {
    // 已在上方处理错误并提示，无需重复抛出
  } finally {
    initPromise = null;
  }
}

// 销毁手机UI
function destroyPhoneUI(reason?: string) {
  if (initPromise) {
    console.log('手机UI正在初始化，暂时无法销毁');
    return;
  }

  if (!vueApp && !shadowHost) {
    console.log('手机UI不存在，跳过销毁');
    return;
  }

  console.log('开始销毁手机UI', reason ? `原因: ${reason}` : '');

  // 保护缓存 - 在销毁前记录缓存状态
  const cacheBeforeDestroy = window.__phoneAvatarCache;
  const cacheSize = cacheBeforeDestroy?.size || 0;
  console.log(`[destroyPhoneUI] 销毁前缓存状态: ${cacheSize} 个头像`);

  try {
    updatePhoneVisibility(false);
    if (vueApp) {
      vueApp.unmount();
      vueApp = null;
    }

    // 移除样式和容器
    deteleportStyle();
    destroyScriptIdDiv();

    // 确保缓存没有被清理
    if (cacheBeforeDestroy && window.__phoneAvatarCache !== cacheBeforeDestroy) {
      console.warn('[destroyPhoneUI] 缓存被意外重置，恢复缓存');
      window.__phoneAvatarCache = cacheBeforeDestroy;
    }

    console.log(`[destroyPhoneUI] 销毁完成，缓存保持: ${window.__phoneAvatarCache?.size || 0} 个头像`);

    isPhoneVisible = false;
    toastr.info(reason ? `手机UI已关闭（${reason}）` : '手机UI已关闭');
  } catch (e) {
    console.error('销毁手机UI时出错:', e);
  }
}

// 切换手机UI显示状态
function togglePhoneUI() {
  console.log('togglePhoneUI 被调用，当前状态:', isPhoneVisible, '初始化中:', Boolean(initPromise));

  if (initPromise) {
    console.log('手机UI正在初始化，请稍候...');
    return;
  }

  if (!isPhoneMounted()) {
    void initPhoneUI();
    return;
  }

  if (isPhoneVisible) {
    hidePhoneUI();
  } else {
    showPhoneUI();
  }
}

// 初始化全局缓存
function initGlobalCache(): void {
  if (!window.__phoneAvatarCache) {
    window.__phoneAvatarCache = new Map();
    console.log('[initGlobalCache] 创建全局头像缓存');
  } else {
    console.log(`[initGlobalCache] 全局缓存已存在，包含 ${window.__phoneAvatarCache.size} 个头像`);
  }
}

// 调试函数：手动清理缓存（仅用于调试）
function clearAvatarCache(): void {
  const cache = window.__phoneAvatarCache;
  if (cache) {
    const size = cache.size;
    cache.clear();
    console.log(`[clearAvatarCache] 手动清理了 ${size} 个头像缓存`);
  }

  // 同时清理avatar.ts中的缓存
  import('./utils/avatar').then(({ clearAvatarCache: clearUtilCache }) => {
    clearUtilCache();
  });
}

// 调试函数：显示缓存状态
function showCacheStatus(): void {
  if (window.__phoneAvatarCache) {
    console.log(`[showCacheStatus] 当前缓存状态: ${window.__phoneAvatarCache.size} 个头像`);
    window.__phoneAvatarCache.forEach((_, url) => {
      console.log(`  - ${url}`);
    });
  } else {
    console.log('[showCacheStatus] 缓存不存在');
  }
}

// 检查是否有新的联系人头像需要预加载（排除用户头像）
async function checkForNewContactAvatars(chatStore: any): Promise<boolean> {
  const cache = getGlobalAvatarCache();
  const newAvatarUrls = new Set<string>();

  // 只检查联系人头像，不检查用户头像（用户头像永远不变）
  if (chatStore.messageSummaries) {
    chatStore.messageSummaries.forEach((summary: any) => {
      if (summary.avatar && !cache.has(summary.avatar)) {
        newAvatarUrls.add(summary.avatar);
      }
    });
  }

  // 检查联系人列表中的头像
  if (chatStore.contactList) {
    Object.values(chatStore.contactList).forEach((contact: any) => {
      if (contact.avatar && !cache.has(contact.avatar)) {
        newAvatarUrls.add(contact.avatar);
      }
    });
  }

  if (newAvatarUrls.size > 0) {
    console.log(`[checkForNewContactAvatars] 发现 ${newAvatarUrls.size} 个新联系人头像需要预加载`);
    return true;
  }

  return false;
}

// 防抖机制
let mvuUpdateDebounce: Timer | null = null;
let isMvuUpdating = false;

// MVU变量更新后重新读取聊天记录和动态
async function handleMvuVariableUpdate(): Promise<void> {
  if (!vueApp) {
    return; // 手机UI未初始化，跳过处理
  }

  // 如果正在更新中，跳过
  if (isMvuUpdating) {
    console.log('[咩咩手机] MVU更新正在进行中，跳过重复请求');
    return;
  }

  // 防抖处理
  if (mvuUpdateDebounce) {
    clearTimeout(mvuUpdateDebounce);
  }

  mvuUpdateDebounce = setTimeout(async () => {
    try {
      isMvuUpdating = true;
      console.log('[咩咩手机] MVU变量更新，开始重新读取数据');

      // 等待MVU初始化
      await waitGlobalInitialized('Mvu');

      // 获取chatStore实例并重新读取数据
      const { useChatStore } = await import('./stores/chatStore');
      const chatStore = useChatStore();

      // 重新从MVU读取数据
      await chatStore.refreshFromMvu();

      console.log('[咩咩手机] 数据重新读取完成');

      // 只检查新的联系人头像（用户头像永远不变，不需要重新处理）
      const hasNewContactAvatars = await checkForNewContactAvatars(chatStore);
      if (hasNewContactAvatars) {
        console.log('[咩咩手机] 发现新联系人头像，开始预加载');
        // 只预加载联系人头像，不包括用户头像
        await preloadContactAvatars(chatStore);
      } else {
        console.log('[咩咩手机] 没有新联系人头像，跳过预加载');
      }

      // 强制触发Vue组件更新
      vueApp.config.globalProperties.$forceUpdate?.();

      // 使用暴露的强制更新函数
      try {
        if (typeof (window as any).__phoneAppForceUpdate === 'function') {
          (window as any).__phoneAppForceUpdate();
        }
      } catch (e) {
        console.log('[咩咩手机] 调用强制更新函数失败:', e);
      }

      toastr.success('手机数据已刷新');

    } catch (error) {
      console.error('[咩咩手机] MVU变量更新处理失败:', error);
      toastr.error('数据刷新失败');
    } finally {
      isMvuUpdating = false;
    }
  }, 500); // 500ms防抖延迟
}

// 加载时注册事件
$(() => {
  console.log('脚本加载完成，开始注册按钮');

  // 立即初始化全局缓存
  initGlobalCache();

  // 注册按钮
  replaceScriptButtons([
    { name: '召唤手机', visible: true },
    { name: '刷新手机数据', visible: true }
  ]);
  console.log('按钮已注册');

  // 注册按钮点击事件
  eventOn(getButtonEvent('召唤手机'), () => {
    console.log('召唤手机按钮被点击');
    togglePhoneUI();
  });

  // 注册刷新数据按钮点击事件
  eventOn(getButtonEvent('刷新手机数据'), () => {
    console.log('刷新手机数据按钮被点击');
    void handleMvuVariableUpdate();
    toastr.info('正在刷新手机数据...');
  });
  console.log('按钮事件已绑定');

  const destroyEventConfigs = [
    { event: tavern_events.CHAT_CHANGED, reason: '聊天切换' },
    { event: tavern_events.CHARACTER_PAGE_LOADED, reason: '角色卡切换' },
    { event: tavern_events.CHAT_DELETED, reason: '聊天已删除' },
    { event: tavern_events.GROUP_CHAT_DELETED, reason: '群聊已删除' },
  ] as const;

  destroyEventConfigs.forEach(({ event, reason }) => {
    eventOn(event, () => {
      console.log(`[咩咩手机] 监听到事件 ${String(event)}，准备销毁手机UI`);
      if (initPromise) {
        initPromise.finally(() => destroyPhoneUI(reason));
        return;
      }
      destroyPhoneUI(reason);
    });
  });

  // 注册MVU变量更新事件监听
  let mvuListenerRegistered = false;

  try {
    // 等待MVU框架初始化
    waitGlobalInitialized('Mvu').then(() => {
      if (mvuListenerRegistered) {
        console.log('[咩咩手机] MVU事件监听器已注册，跳过重复注册');
        return;
      }

      console.log('[咩咩手机] MVU框架已初始化，注册变量更新事件监听');

      // 优先使用Mvu的官方事件常量
      if (typeof Mvu !== 'undefined' && Mvu.events?.VARIABLE_UPDATE_ENDED) {
        eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables: any) => {
          console.log('[咩咩手机] 监听到MVU事件:', Mvu.events.VARIABLE_UPDATE_ENDED);
          void handleMvuVariableUpdate();
        });
        mvuListenerRegistered = true;
      } else {
        // 备用方案：使用字符串事件名
        eventOn('MvuVariableUpdateEnded', () => {
          console.log('[咩咩手机] 监听到MVU变量更新事件（备用方案）');
          void handleMvuVariableUpdate();
        });
        mvuListenerRegistered = true;
      }
    }).catch((error) => {
      console.warn('[咩咩手机] MVU框架初始化失败:', error);
    });
  } catch (error) {
    console.warn('[咩咩手机] 注册MVU事件监听失败:', error);
  }

  toastr.success('咩咩手机脚本已加载');

  // 暴露调试函数到全局
  (window as any).__phoneDebug = {
    clearCache: clearAvatarCache,
    showCache: showCacheStatus,
    initCache: initGlobalCache,
    refreshMvu: handleMvuVariableUpdate,
    refreshMvuSync: () => {
      void handleMvuVariableUpdate();
    },
    // 添加头像转换测试函数
    testThumbnail: (url: string) => {
      import('./utils/avatar').then(({ convertAvatarToThumbnail }) => {
        const thumbnail = convertAvatarToThumbnail(url);
        console.log('[Debug] 原始URL:', url);
        console.log('[Debug] 缩略图URL:', thumbnail);
        return thumbnail;
      });
    },
    // 添加缓存状态检查函数
    cacheStats: () => {
      import('./utils/avatar').then(({ logCacheStats }) => {
        logCacheStats('Debug');
      });
    }
  };
  console.log('[init] 调试函数已暴露到 window.__phoneDebug');

  // 也暴露handleMvuVariableUpdate到全局，方便其他脚本调用
  (window as any).__phoneMvuRefresh = handleMvuVariableUpdate;
});

// 卸载时清理
$(window).on('pagehide', () => {
  console.log('页面卸载，清理手机UI');
  try {
    if (initPromise) {
      initPromise.finally(() => {
        destroyPhoneUI('页面卸载');
      });
      return;
    }
    destroyPhoneUI('页面卸载');
  } catch (e) {
    console.error('卸载时清理出错:', e);
  }
});
