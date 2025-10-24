const avatarCache = new Map<string, boolean>();
const thumbnailCache = new Map<string, string>();
const resolveCache = new Map<string, string | undefined>();

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
 * 将原始头像URL转换为缩略图URL（使用SillyTavern官方API）
 * @param originalUrl 原始头像URL
 * @returns 缩略图URL或原始URL
 *
 * 说明：
 * - 用户头像(/User%20Avatars/)使用 'persona' 类型
 * - 角色头像(/characters/)使用 'avatar' 类型
 * - 支持中文文件名，自动进行URL解码
 * - 使用SillyTavern.getThumbnailUrl()官方API
 */
function convertToThumbnailUrl(originalUrl: string): string {
  // 检查缓存
  if (thumbnailCache.has(originalUrl)) {
    console.log('[avatar] 使用缓存的缩略图URL:', originalUrl);
    return thumbnailCache.get(originalUrl)!;
  }

  try {
    // 使用SillyTavern官方API获取缩略图
    if (typeof SillyTavern !== 'undefined' && SillyTavern.getThumbnailUrl) {
      let thumbnailType: string;
      let fileName: string;

      // 解析URL确定类型和文件名
      if (originalUrl.includes('/User%20Avatars/')) {
        thumbnailType = 'persona'; // 用户头像使用persona类型
        fileName = originalUrl.split('/User%20Avatars/')[1];
      } else if (originalUrl.includes('/characters/')) {
        thumbnailType = 'avatar'; // 角色头像使用avatar类型
        fileName = originalUrl.split('/characters/')[1];
      } else {
        // 如果不匹配转换条件，返回原始URL
        console.log('[avatar] 头像无需转换:', originalUrl);
        thumbnailCache.set(originalUrl, originalUrl);
        return originalUrl;
      }

      if (fileName) {
        // 解码文件名，因为从URL路径中提取的文件名可能是URL编码的
        try {
          fileName = decodeURIComponent(fileName);
        } catch (error) {
          console.warn('[avatar] 文件名解码失败，使用原始文件名:', error);
        }

        const thumbnailUrl = SillyTavern.getThumbnailUrl(thumbnailType, fileName);
        console.log('[avatar] 使用官方API转换头像:', {
          original: originalUrl,
          type: thumbnailType,
          file: fileName,
          thumbnail: thumbnailUrl
        });

        // 缓存结果
        thumbnailCache.set(originalUrl, thumbnailUrl);
        return thumbnailUrl;
      }
    }

    // 如果官方API不可用，直接返回原始URL
    console.warn('[avatar] SillyTavern.getThumbnailUrl API不可用，返回原始URL');
    thumbnailCache.set(originalUrl, originalUrl);
    return originalUrl;
  } catch (error) {
    console.warn('[avatar] 缩略图URL转换失败:', error);
    thumbnailCache.set(originalUrl, originalUrl);
    return originalUrl;
  }
}

export function resolveAvatar(source?: string): string | undefined {
  if (!source || source === 'undefined' || source === 'null') {
    return undefined;
  }

  // 检查解析缓存
  if (resolveCache.has(source)) {
    console.log('[avatar] 使用缓存的解析结果:', source);
    return resolveCache.get(source);
  }

  const charKey = toCharKey(source);
  let finalUrl: string | undefined;

  if (!charKey) {
    // 如果不是char前缀，也尝试转换为缩略图
    finalUrl = convertToThumbnailUrl(source);
  } else {
    const getter = getCharAvatarGetter();
    if (!getter) {
      resolveCache.set(source, undefined);
      return undefined;
    }

    try {
      const resolved = getter(charKey, true);
      finalUrl = resolved || undefined;

      // 将解析后的URL转换为缩略图
      finalUrl = finalUrl ? convertToThumbnailUrl(finalUrl) : undefined;
    } catch (error) {
      console.warn(`[avatar] 获取角色卡头像失败(${charKey}):`, error);
      finalUrl = undefined;
    }
  }

  // 缓存解析结果
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
  console.log('[avatar] 所有缓存已清理');
}
