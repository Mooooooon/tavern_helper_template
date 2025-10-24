import { defineStore } from 'pinia';
import { preloadAvatar, resolveAvatar, convertAvatarToThumbnail } from '../utils/avatar';

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
      // 用户信息只在初始化时加载一次，之后永不改变
      if (!this.userAvatar && !this.userAvatarSource) {
        await this.loadUserInfo();
      } else {
        console.log('[userStore] 用户信息已初始化，跳过重复加载');
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

      // 如果已有头像，不重复加载
      if (this.userAvatar && this.userAvatarSource) {
        console.log('[userStore] 用户头像已存在，跳过重复加载');
        return;
      }

      console.log('[userStore] 开始加载用户头像');

      try {
        let avatarSrc: string | undefined;
        let avatarSource: string | undefined;

        if (typeof triggerSlash === 'function') {
          const avatarPath = await triggerSlash('/pass {{userAvatarPath}}');
          avatarSource = avatarPath; // 保存原始源用于比较

          if (typeof avatarPath === 'string' && avatarPath && avatarPath !== 'undefined') {
            // 直接使用原始路径转换为缩略图
            console.log('[userStore] 获取到用户头像路径，转换为缩略图:', avatarPath);
            avatarSrc = convertAvatarToThumbnail(avatarPath);
            console.log('[userStore] 转换后的缩略图URL:', avatarSrc);
          } else {
            // 如果没有获取到用户头像路径，尝试使用角色头像
            console.log('[userStore] 未获取到用户头像路径，尝试使用角色头像');
            const resolvedChar = resolveAvatar('char');
            avatarSrc = resolvedChar ? convertAvatarToThumbnail(resolvedChar) : undefined;
            console.log('[userStore] 使用char头像，转换后的缩略图URL:', avatarSrc);
          }
        }

        // 如果通过triggerSlash没有获取到头像，尝试使用char头像
        if (!avatarSrc) {
          console.log('[userStore] 主要方法失败，使用char头像作为备用');
          avatarSource = 'char';
          const resolvedChar = resolveAvatar('char');
          avatarSrc = resolvedChar ? convertAvatarToThumbnail(resolvedChar) : undefined;
        }

        // 严格检查是否需要更新
        const shouldUpdate = avatarSrc &&
          (!this.userAvatar || !this.userAvatarSource ||
           avatarSource !== this.userAvatarSource || avatarSrc !== this.userAvatar);

        if (shouldUpdate && avatarSrc) {
          console.log('[userStore] 更新用户头像:', { avatarSrc, avatarSource });
          // 只有在真正需要更新时才预加载
          await preloadAvatar(avatarSrc);
          this.userAvatar = avatarSrc;
          this.userAvatarSource = avatarSource || '';
        } else {
          console.log('[userStore] 用户头像无需更新，跳过');
        }
      } catch (error) {
        console.warn('[userStore] 获取用户头像失败', error);
      }
    },
  },
});
