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

export function resolveAvatar(source?: string): string | undefined {
  if (!source || source === 'undefined' || source === 'null') {
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
    return resolved || undefined;
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

export function clearAvatarCache(): void {
  avatarCache.clear();
}
