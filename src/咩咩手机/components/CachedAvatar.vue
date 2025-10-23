<template>
  <img
    :src="displaySrc"
    :alt="alt"
    :class="className"
    @error="handleError"
    @load="handleLoad"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

interface Props {
  src?: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Avatar',
  className: '',
  fallbackSrc: ''
});

const displaySrc = ref(props.src || '');
const isLoading = ref(false);

// 全局头像缓存 - 简化版本
declare global {
  interface Window {
    __phoneAvatarCache?: Map<string, boolean>;
  }
}

// 获取或创建全局缓存
function getGlobalCache(): Map<string, boolean> {
  if (!window.__phoneAvatarCache) {
    window.__phoneAvatarCache = new Map();
    console.log('[CachedAvatar] 创建新的全局头像缓存');
  } else {
    console.log(`[CachedAvatar] 复用现有缓存，当前有 ${window.__phoneAvatarCache.size} 个头像`);
  }
  return window.__phoneAvatarCache;
}

// 预加载头像 - 简化版本
async function preloadAvatar(src: string): Promise<void> {
  const cache = getGlobalCache();

  // 如果已经缓存，直接返回
  if (cache.has(src)) {
    console.log(`[CachedAvatar] 使用缓存头像: ${src}`);
    return;
  }

  console.log(`[CachedAvatar] 开始加载头像: ${src}`);

  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      cache.set(src, true);
      console.log(`[CachedAvatar] 头像加载成功并缓存: ${src}`);
      resolve();
    };
    img.onerror = () => {
      console.warn(`[CachedAvatar] 头像加载失败: ${src}`);
      resolve(); // 即使失败也继续，不阻塞
    };
    img.src = src;
  });
}

// 处理图片加载错误
function handleError(event: Event) {
  const img = event.target as HTMLImageElement;
  if (props.fallbackSrc && img.src !== props.fallbackSrc) {
    img.src = props.fallbackSrc;
  }
}

// 处理图片加载完成
function handleLoad() {
  isLoading.value = false;
}

// 监听src变化
watch(() => props.src, async (newSrc) => {
  if (newSrc && newSrc !== displaySrc.value) {
    isLoading.value = true;
    displaySrc.value = newSrc; // 立即设置src，让浏览器开始加载
    await preloadAvatar(newSrc);
    isLoading.value = false;
  }
}, { immediate: true });

onMounted(async () => {
  if (props.src) {
    console.log(`[CachedAvatar] 组件挂载，处理头像: ${props.src}`);
    isLoading.value = true;
    displaySrc.value = props.src; // 立即设置src，让浏览器开始加载
    await preloadAvatar(props.src);
    isLoading.value = false;
  }
});
</script>

<style scoped>
img {
  transition: opacity 0.2s ease;
}

img[loading] {
  opacity: 0.7;
}
</style>