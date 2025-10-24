import { defineStore } from 'pinia';
import { preloadAvatar, resolveAvatar } from '../utils/avatar';

declare const triggerSlash: (command: string) => Promise<string>;

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
          avatarSource = avatarSource ?? 'char';
          avatarSrc = resolveAvatar('char') ?? avatarSrc;
        }

        const shouldUpdate =
          avatarSrc &&
          (avatarSource !== this.userAvatarSource || avatarSrc !== this.userAvatar);

        if (shouldUpdate && avatarSrc) {
          await preloadAvatar(avatarSrc);
          this.userAvatar = avatarSrc;
          this.userAvatarSource = avatarSource || '';
        } else if (avatarSrc && !this.userAvatar) {
          this.userAvatar = avatarSrc;
          this.userAvatarSource = avatarSource || '';
        }
      } catch (error) {
        console.warn('[userStore] 获取用户头像失败', error);
      }
    },
  },
});
