const DEFAULT_SIZE = 50;
const PLACEHOLDER_CACHE = new Map<string, string>();
const CHAR_AVATAR_CACHE = new Map<string, string>();

function normalizeDimension(value: number): number {
  return Math.max(1, Math.round(value));
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // 保持 32 位整数
  }
  return Math.abs(hash);
}

function mixComponent(component: number): number {
  return Math.round((component + 255) / 2);
}

function componentToHex(component: number): string {
  return component.toString(16).padStart(2, '0');
}

function getPlaceholderColor(seed: string): string {
  const hash = hashSeed(seed);
  const r = mixComponent((hash >> 16) & 0xff);
  const g = mixComponent((hash >> 8) & 0xff);
  const b = mixComponent(hash & 0xff);
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function getLabel(seed: string): string {
  const trimmed = seed.trim();
  if (!trimmed) {
    return '';
  }
  const match = trimmed.match(/[A-Za-z0-9\u4e00-\u9fa5]/);
  if (!match) {
    return '';
  }
  return match[0].toUpperCase();
}

function buildPlaceholder(seed: string, width: number, height: number): string {
  const key = `${seed}:${width}x${height}`;
  const cached = PLACEHOLDER_CACHE.get(key);
  if (cached) {
    return cached;
  }

  const normalizedSeed = seed || 'default';
  const safeWidth = normalizeDimension(width);
  const safeHeight = normalizeDimension(height);
  const minSize = Math.min(safeWidth, safeHeight);
  const background = getPlaceholderColor(normalizedSeed);
  const label = getLabel(normalizedSeed);
  const fontSize = Math.round(minSize * 0.42);
  const rx = Math.round(minSize * 0.18);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${safeWidth}" height="${safeHeight}" viewBox="0 0 ${safeWidth} ${safeHeight}" preserveAspectRatio="xMidYMid slice"><rect width="${safeWidth}" height="${safeHeight}" rx="${rx}" ry="${rx}" fill="${background}"/>${label ? `<text x="50%" y="50%" dy="0.35em" text-anchor="middle" fill="#ffffff" font-size="${fontSize}" font-family="system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">${label}</text>` : ''}</svg>`;
  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  PLACEHOLDER_CACHE.set(key, dataUri);
  return dataUri;
}

export function getAvatarSrc(
  customSrc?: string,
  seed: string | number = 'default',
  width = DEFAULT_SIZE,
  height = width,
): string {
  if (customSrc && customSrc.trim().length > 0) {
    return customSrc;
  }
  return buildPlaceholder(String(seed), width, height);
}

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

export function resolveAvatar(source?: string): string | undefined {
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

  const cached = CHAR_AVATAR_CACHE.get(charKey);
  if (cached) {
    return cached;
  }

  const getter = getCharAvatarGetter();
  if (!getter) {
    return undefined;
  }

  try {
    const resolved = getter(charKey, true);
    if (resolved) {
      CHAR_AVATAR_CACHE.set(charKey, resolved);
      return resolved;
    }
  } catch (error) {
    console.warn(`[avatarPlaceholder] 获取角色卡头像失败(${charKey}):`, error);
  }

  return undefined;
}
