const avatarCache = new Map<string, boolean>();

type CharAvatarGetter = (character: string, cache?: boolean) => string | undefined;

declare global {
  interface Window {
    TavernHelper?: {
      getCharAvatarPath?: CharAvatarGetter;
    };
  }
}

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
 * 将原始头像URL转换为缩略图URL
 * @param originalUrl 原始头像URL
 * @returns 缩略图URL或原始URL
 */
function convertToThumbnailUrl(originalUrl: string): string {
  try {
    const url = new URL(originalUrl);

    // 解析路径确定类型
    const pathname = url.pathname;

    if (pathname.includes('/User%20Avatars/')) {
      // 用户头像
      const fileName = pathname.split('/User%20Avatars/')[1];
      if (fileName) {
        const thumbnailUrl = `${url.protocol}//${url.host}/thumbnail?type=avatar&file=${encodeURIComponent(fileName)}`;
        console.log('[avatar] 用户头像转换:', {
          original: originalUrl,
          thumbnail: thumbnailUrl
        });
        return thumbnailUrl;
      }
    } else if (pathname.includes('/characters/')) {
      // 角色头像
      const fileName = pathname.split('/characters/')[1];
      if (fileName) {
        const thumbnailUrl = `${url.protocol}//${url.host}/thumbnail?type=persona&file=${encodeURIComponent(fileName)}`;
        console.log('[avatar] 角色头像转换:', {
          original: originalUrl,
          thumbnail: thumbnailUrl
        });
        return thumbnailUrl;
      }
    }

    // 如果不匹配转换条件，返回原始URL
    console.log('[avatar] 头像无需转换:', originalUrl);
    return originalUrl;
  } catch (error) {
    console.warn('[avatar] 缩略图URL转换失败:', error);
    return originalUrl;
  }
}

export function resolveAvatar(source?: string): string | undefined {
  if (!source || source === 'undefined' || source === 'null') {
    return undefined;
  }

  const charKey = toCharKey(source);
  if (!charKey) {
    // 如果不是char前缀，也尝试转换为缩略图
    return convertToThumbnailUrl(source);
  }

  const getter = getCharAvatarGetter();
  if (!getter) {
    return undefined;
  }

  try {
    const resolved = getter(charKey, true);
    const finalUrl = resolved || undefined;

    // 将解析后的URL转换为缩略图
    return finalUrl ? convertToThumbnailUrl(finalUrl) : undefined;
  } catch (error) {
    console.warn(`[avatar] 获取角色卡头像失败(${charKey}):`, error);
    return undefined;
  }
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
}
