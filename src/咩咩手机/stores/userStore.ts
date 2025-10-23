import { defineStore } from 'pinia';

// 头像处理函数
function getCharAvatarGetter():
  | ((character: string, cache?: boolean) => string | undefined)
  | undefined {
  if (typeof getCharAvatarPath === 'function') {
    return getCharAvatarPath;
  }
  const helperGetter = (globalThis as any)?.TavernHelper?.getCharAvatarPath;
  if (typeof helperGetter === 'function') {
    return helperGetter;
  }
  return undefined;
}

function toCharKey(source?: string): string | undefined {
  if (!source) {
    return undefined;
  }
  if (!source.startsWith('char')) {
    return undefined;
  }
  const [, charName] = source.split(':');
  const trimmed = charName?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : 'current';
}

function resolveAvatar(source?: string): string | undefined {
  if (!source) {
    return undefined;
  }
  if (source === 'undefined' || source === 'null') {
    return undefined;
  }

  const charKey = toCharKey(source);
  if (!charKey) {
    return source;
  }

  const getter = getCharAvatarGetter();
  if (!getter) {
    return undefined;
  }

  try {
    const resolved = getter(charKey, true);
    if (resolved) {
      return resolved;
    }
  } catch (error) {
    console.warn(`[userStore] 获取角色卡头像失败(${charKey}):`, error);
  }

  return undefined;
}

declare const triggerSlash: (command: string) => Promise<string>;

// 全局头像缓存接口
declare global {
  interface Window {
    __phoneAvatarCache?: Map<string, boolean>;
  }
}

// 获取或创建全局缓存
function getGlobalCache(): Map<string, boolean> {
  if (!window.__phoneAvatarCache) {
    window.__phoneAvatarCache = new Map();
    console.log('[userStore] 创建新的全局头像缓存');
  } else {
    console.log(`[userStore] 复用现有缓存，当前有 ${window.__phoneAvatarCache.size} 个头像`);
  }
  return window.__phoneAvatarCache;
}

// 预加载头像函数 - 简化版本
function preloadAvatar(src: string): Promise<void> {
  const cache = getGlobalCache();

  // 如果已经缓存，直接返回
  if (cache.has(src)) {
    console.log(`[userStore] 用户头像已在缓存中: ${src}`);
    return Promise.resolve();
  }

  console.log(`[userStore] 开始加载用户头像: ${src}`);

  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      cache.set(src, true);
      console.log(`[userStore] 用户头像加载成功并缓存: ${src}`);
      resolve();
    };
    img.onerror = () => {
      console.warn(`[userStore] 用户头像加载失败: ${src}`);
      resolve(); // 即使失败也继续，不阻塞
    };
    img.src = src;
  });
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    initialized: true, // 默认为true，避免阻塞显示
    userName: '咩咩助手',
    userAvatar: '',
    userAvatarSource: '', // 原始头像源，用于比较是否真的需要重新加载
    status: '在线',
  }),

  getters: {
    userInfo(state) {
      return {
        name: state.userName,
        avatar: state.userAvatar,
        status: state.status,
      };
    },
  },

  actions: {
    async ensureInitialized(): Promise<void> {
      // 总是尝试加载用户信息，但不阻塞显示
      if (!this.userAvatar) {
        await this.loadUserInfo();
      }
    },

    async loadUserInfo(): Promise<void> {
      await Promise.all([
        this.loadUserName(),
        this.loadUserAvatar(),
      ]);
    },

    async loadUserName(): Promise<void> {
      if (typeof window === 'undefined') {
        return;
      }

      try {
        if (typeof triggerSlash === 'function') {
          const userName = await triggerSlash('/pass {{user}}');
          if (userName && userName !== 'undefined') {
            this.userName = userName;
            return;
          }
        }

        const helperUserName = await window.TavernHelper?.triggerSlash?.('/pass {{user}}');
        if (helperUserName && helperUserName !== 'undefined') {
          this.userName = helperUserName;
        }
      } catch (error) {
        console.warn('[userStore] 获取用户名失败', error);
      }
    },

    async loadUserAvatar(): Promise<void> {
      if (typeof window === 'undefined') {
        return;
      }

      try {
        let avatarSrc: string | undefined;
        let avatarSource: string | undefined;

        if (typeof triggerSlash === 'function') {
          const avatarPath = await triggerSlash('/pass {{userAvatarPath}}');
          avatarSource = avatarPath; // 保存原始源用于比较
          const resolved = resolveAvatar(avatarPath);
          if (resolved && resolved !== 'undefined') {
            avatarSrc = resolved;
          } else if (typeof avatarPath === 'string' && avatarPath && avatarPath !== 'undefined') {
            avatarSrc = avatarPath;
          }
        }

        if (!avatarSrc) {
          avatarSource = 'char'; // 保存原始源
          const helperAvatar = resolveAvatar('char');
          if (helperAvatar) {
            avatarSrc = helperAvatar;
          }
        }

        // 只有当头像源发生变化时才重新加载
        if (avatarSrc && avatarSource !== this.userAvatarSource) {
          console.log('[userStore] 用户头像源发生变化，重新加载:', avatarSource, '->', avatarSrc);

          // 预加载新头像
          try {
            await preloadAvatar(avatarSrc);
            this.userAvatar = avatarSrc;
            this.userAvatarSource = avatarSource || '';
          } catch (preloadError) {
            console.warn('[userStore] 头像预加载失败，但仍然设置头像路径', preloadError);
            this.userAvatar = avatarSrc;
            this.userAvatarSource = avatarSource || '';
          }
        } else if (avatarSrc && !this.userAvatar) {
          // 首次加载
          this.userAvatar = avatarSrc;
          this.userAvatarSource = avatarSource || '';
        }
      } catch (error) {
        console.warn('[userStore] 获取用户头像失败', error);
      }
    },
  },
});