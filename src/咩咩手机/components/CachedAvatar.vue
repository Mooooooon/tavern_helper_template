<template>
  <img
    :src="displaySrc"
    :alt="alt"
    :class="className"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { preloadAvatar } from '../utils/avatar';

interface Props {
  src?: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: 'Avatar',
  className: '',
  fallbackSrc: '',
});

const displaySrc = ref(props.src || '');

// 处理图片加载错误
function handleError(event: Event) {
  const img = event.target as HTMLImageElement;
  if (props.fallbackSrc && img.src !== props.fallbackSrc) {
    img.src = props.fallbackSrc;
  }
}

async function updateDisplaySource(src?: string) {
  if (src) {
    displaySrc.value = src;
    await preloadAvatar(src);
    return;
  }

  displaySrc.value = props.fallbackSrc || '';
}

// 监听src变化
watch(() => props.src, async (newSrc) => {
  await updateDisplaySource(newSrc);
}, { immediate: true });
</script>

<style scoped>
img {
  transition: opacity 0.2s ease;
}

img[loading] {
  opacity: 0.7;
}
</style>
