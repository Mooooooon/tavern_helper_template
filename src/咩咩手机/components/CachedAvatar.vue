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

// 头像缓存
const avatarCache = new Map<string, string>();

// 预加载头像
async function preloadAvatar(src: string): Promise<string> {
  if (avatarCache.has(src)) {
    return avatarCache.get(src)!;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      avatarCache.set(src, src);
      resolve(src);
    };
    img.onerror = () => {
      reject(new Error(`Failed to load avatar: ${src}`));
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
    try {
      const cachedSrc = await preloadAvatar(newSrc);
      displaySrc.value = cachedSrc;
    } catch (error) {
      console.warn('[CachedAvatar] 头像加载失败:', error);
      if (props.fallbackSrc) {
        displaySrc.value = props.fallbackSrc;
      } else {
        displaySrc.value = newSrc;
      }
      isLoading.value = false;
    }
  }
}, { immediate: true });

onMounted(async () => {
  if (props.src) {
    isLoading.value = true;
    try {
      await preloadAvatar(props.src);
      displaySrc.value = props.src;
    } catch (error) {
      console.warn('[CachedAvatar] 初始头像加载失败:', error);
      if (props.fallbackSrc) {
        displaySrc.value = props.fallbackSrc;
      }
    } finally {
      isLoading.value = false;
    }
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