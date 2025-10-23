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

// 头像预加载函数
async function preloadAllAvatars(userStore: any, chatStore: any): Promise<void> {
  const avatarUrls = new Set<string>();

  // 添加用户头像
  if (userStore.userInfo?.avatar) {
    avatarUrls.add(userStore.userInfo.avatar);
  }

  // 添加所有联系人的头像
  if (chatStore.messageSummaries) {
    chatStore.messageSummaries.forEach((summary: any) => {
      if (summary.avatar) {
        avatarUrls.add(summary.avatar);
      }
    });
  }

  // 如果还有联系人列表，也添加
  if (chatStore.contactList) {
    Object.values(chatStore.contactList).forEach((contact: any) => {
      if (contact.avatar) {
        avatarUrls.add(contact.avatar);
      }
    });
  }

  // 并行预加载所有头像
  const preloadPromises = Array.from(avatarUrls).map(url => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // 即使失败也继续
      img.src = url;
    });
  });

  try {
    await Promise.all(preloadPromises);
    console.log(`[preloadAllAvatars] 预加载了 ${avatarUrls.size} 个头像`);
  } catch (error) {
    console.warn('[preloadAllAvatars] 部分头像预加载失败:', error);
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
    shadowAppContainer.style.pointerEvents = 'none';
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

    // 异步初始化全局用户信息，不阻塞挂载
    const { useUserStore } = await import('./stores/userStore');
    const userStore = useUserStore();
    await userStore.ensureInitialized();

    // 也初始化chatStore，确保它在Vue应用上下文中被创建
    const { useChatStore } = await import('./stores/chatStore');
    const chatStore = useChatStore();
    await chatStore.ensureInitialized();

    // 预加载所有头像
    await preloadAllAvatars(userStore, chatStore);

    console.log('Vue应用已挂载');

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
function destroyPhoneUI() {
  if (initPromise) {
    console.log('手机UI正在初始化，暂时无法销毁');
    return;
  }

  if (!vueApp && !shadowHost) {
    console.log('手机UI不存在，跳过销毁');
    return;
  }

  console.log('开始销毁手机UI');

  try {
    if (vueApp) {
      vueApp.unmount();
      vueApp = null;
    }

    // 移除样式和容器
    deteleportStyle();
    destroyScriptIdDiv();

    isPhoneVisible = false;
    toastr.info('手机UI已关闭');
  } catch (e) {
    console.error('销毁手机UI时出错:', e);
  }
}

// 切换手机UI显示状态
function togglePhoneUI() {
  console.log('togglePhoneUI 被调用，当前状态:', isPhoneVisible, '初始化中:', Boolean(initPromise));

  if (isPhoneVisible) {
    destroyPhoneUI();
    return;
  }

  if (initPromise) {
    console.log('手机UI正在初始化，请稍候...');
    return;
  }

  void initPhoneUI();
}

// 加载时注册事件
$(() => {
  console.log('脚本加载完成，开始注册按钮');

  // 注册按钮
  replaceScriptButtons([{ name: '召唤手机', visible: true }]);
  console.log('按钮已注册');

  // 注册按钮点击事件
  eventOn(getButtonEvent('召唤手机'), () => {
    console.log('召唤手机按钮被点击');
    togglePhoneUI();
  });
  console.log('按钮事件已绑定');

  toastr.success('咩咩手机脚本已加载');
});

// 卸载时清理
$(window).on('pagehide', () => {
  console.log('页面卸载，清理手机UI');
  try {
    if (initPromise) {
      initPromise.finally(() => {
        destroyPhoneUI();
      });
      return;
    }
    destroyPhoneUI();
  } catch (e) {
    console.error('卸载时清理出错:', e);
  }
});
