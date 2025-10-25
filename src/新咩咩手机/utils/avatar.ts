const avatarCache = new Map<string, boolean>();
const thumbnailCache = new Map<string, string>();
const resolveCache = new Map<string, string | undefined>();

// 统一缓存管理
export function getCacheStats() {
  return {
    preloadCache: avatarCache.size,
    thumbnailCache: thumbnailCache.size,
    resolveCache: resolveCache.size,
    globalCache: window.__phoneAvatarCache?.size || 0,
  };
}

export function logCacheStats(context: string) {
  const stats = getCacheStats();
  // Check if development mode based on hostname or console presence
  const isDevelopment = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1' ||
                        window.location.hostname === '' ||
                        console.clear !== undefined;

  if (isDevelopment) {
    console.log(`[${context}] 缓存状态:`, stats);
  }
}

type CharAvatarGetter = (character: string, cache?: boolean) => string | undefined;

function getCharAvatarGetter(): CharAvatarGetter | undefined {
  const directGetter = (globalThis as any)?.getCharAvatarPath;
  if (typeof directGetter === 'function') {
    return directGetter as CharAvatarGetter;
  }

  const helperGetter = (globalThis as any)?.TavernHelper?.getCharAvatarPath;
  if (typeof helperGetter === 'function') {
    return helperGetter;
  }

  return undefined;
}

function toCharKey(source?: string): string | undefined {
  if (!source || !source.startsWith('char')) {
    return undefined;
  }

  const [, charName] = source.split(':');
  const trimmed = charName?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : 'current';
}

/**
 * 将原始头像URL转换为缩略图URL（使用SillyTavern官方API）
 * @param originalUrl 原始头像URL
 * @returns 缩略图URL或原始URL
 *
 * 说明：
 * - 用户头像支持两种格式：'/User%20Avatars/' 和 './User Avatars/'，使用 'persona' 类型
 * - 角色头像(/characters/)使用 'avatar' 类型
 * - 支持中文文件名，自动进行URL解码
 * - 使用SillyTavern.getThumbnailUrl()官方API
 */
function convertToThumbnailUrl(originalUrl: string): string {
  if (thumbnailCache.has(originalUrl)) {
    return thumbnailCache.get(originalUrl)!;
  }

  try {
    if (typeof SillyTavern !== 'undefined' && SillyTavern.getThumbnailUrl) {
      let thumbnailType: string;
      let fileName: string;

      if (originalUrl.includes('/User%20Avatars/') || originalUrl.includes('./User Avatars/')) {
        thumbnailType = 'persona';
        fileName = originalUrl.includes('/User%20Avatars/')
          ? originalUrl.split('/User%20Avatars/')[1]
          : originalUrl.split('./User Avatars/')[1];
      } else if (originalUrl.includes('/characters/')) {
        thumbnailType = 'avatar';
        fileName = originalUrl.split('/characters/')[1];
      } else {
        thumbnailCache.set(originalUrl, originalUrl);
        return originalUrl;
      }

      if (fileName) {
        try {
          fileName = decodeURIComponent(fileName);
        } catch (error) {
          // 使用原始文件名
        }

        const thumbnailUrl = SillyTavern.getThumbnailUrl(thumbnailType, fileName);
        thumbnailCache.set(originalUrl, thumbnailUrl);
        return thumbnailUrl;
      }
    }

    thumbnailCache.set(originalUrl, originalUrl);
    return originalUrl;
  } catch (error) {
    thumbnailCache.set(originalUrl, originalUrl);
    return originalUrl;
  }
}

export function resolveAvatar(source?: string): string | undefined {
  if (!source || source === 'undefined' || source === 'null') {
    return undefined;
  }

  if (resolveCache.has(source)) {
    return resolveCache.get(source);
  }

  const charKey = toCharKey(source);
  let finalUrl: string | undefined;

  if (!charKey) {
    finalUrl = convertToThumbnailUrl(source);
  } else {
    const getter = getCharAvatarGetter();
    if (!getter) {
      resolveCache.set(source, undefined);
      return undefined;
    }

    try {
      const resolved = getter(charKey, true);
      finalUrl = resolved ? convertToThumbnailUrl(resolved) : undefined;
    } catch (error) {
      finalUrl = undefined;
    }
  }

  resolveCache.set(source, finalUrl);
  return finalUrl;
}

export function preloadAvatar(src?: string): Promise<void> {
  if (!src || typeof window === 'undefined' || typeof Image === 'undefined') {
    return Promise.resolve();
  }

  if (avatarCache.has(src)) {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      avatarCache.set(src, true);
      resolve();
    };
    img.onerror = () => {
      avatarCache.set(src, false);
      resolve();
    };
    img.src = src;
  });
}

/**
 * 手动将头像URL转换为缩略图URL（供调试使用）
 * @param originalUrl 原始头像URL
 * @returns 缩略图URL
 */
export function convertAvatarToThumbnail(originalUrl: string): string {
  return convertToThumbnailUrl(originalUrl);
}

export function clearAvatarCache(): void {
  avatarCache.clear();
  thumbnailCache.clear();
  resolveCache.clear();
}
