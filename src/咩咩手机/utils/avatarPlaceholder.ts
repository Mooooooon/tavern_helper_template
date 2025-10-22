const DEFAULT_SIZE = 50;

function buildPicsumUrl(seed: string | number, width: number, height: number): string {
  const safeSeed = encodeURIComponent(String(seed));
  const safeWidth = Math.max(1, Math.round(width));
  const safeHeight = Math.max(1, Math.round(height));
  return `https://picsum.photos/seed/${safeSeed}/${safeWidth}/${safeHeight}`;
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
  return buildPicsumUrl(seed, width, height);
}
