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

// 头像缓存
const avatarCache = new Map<string, HTMLImageElement>();

// 预加载头像函数
function preloadAvatar(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (avatarCache.has(src)) {
      resolve();
      return;
    }

    const img = new Image();
    img.onload = () => {
      avatarCache.set(src, img);
      resolve();
    };
    img.onerror = () => {
      reject(new Error(`Failed to load avatar: ${src}`));
    };
    img.src = src;
  });
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    initialized: true, // 默认为true，避免阻塞显示
    userName: '咩咩助手',
    userAvatar: '',
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
      await this.loadUserInfo();
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

        if (typeof triggerSlash === 'function') {
          const avatarPath = await triggerSlash('/pass {{userAvatarPath}}');
          const resolved = resolveAvatar(avatarPath);
          if (resolved && resolved !== 'undefined') {
            avatarSrc = resolved;
          } else if (typeof avatarPath === 'string' && avatarPath && avatarPath !== 'undefined') {
            avatarSrc = avatarPath;
          }
        }

        if (!avatarSrc) {
          const helperAvatar = resolveAvatar('char');
          if (helperAvatar) {
            avatarSrc = helperAvatar;
          }
        }

        if (avatarSrc && avatarSrc !== this.userAvatar) {
          // 预加载新头像
          try {
            await preloadAvatar(avatarSrc);
            this.userAvatar = avatarSrc;
          } catch (preloadError) {
            console.warn('[userStore] 头像预加载失败，但仍然设置头像路径', preloadError);
            this.userAvatar = avatarSrc;
          }
        }
      } catch (error) {
        console.warn('[userStore] 获取用户头像失败', error);
      }
    },
  },
});