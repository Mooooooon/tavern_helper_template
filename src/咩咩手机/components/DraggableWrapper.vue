<template>
  <div
    ref="wrapperRef"
    v-bind="forwardedAttrs"
    :class="['drag-wrapper', attrs.class]"
    :style="[wrapperStyle, attrs.style]"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, useAttrs, watch, onMounted, onBeforeUnmount } from 'vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    x: number
    y: number
    z?: number | string
    dragHandle?: string
    disabled?: boolean
  }>(),
  {
    z: 'auto',
    dragHandle: '',
    disabled: false,
  },
);

const emit = defineEmits<{
  dragging: [{ left: number; top: number; width: number; height: number }]
  dragstop: [{ left: number; top: number; width: number; height: number }]
}>();

const attrs = useAttrs();
const wrapperRef = ref<HTMLElement | null>(null);
const localPosition = reactive({
  left: props.x ?? 0,
  top: props.y ?? 0,
});
const isDragging = ref(false);
let startX = 0;
let startY = 0;
let originalLeft = 0;
let originalTop = 0;

watch(
  () => props.x,
  value => {
    if (typeof value === 'number' && !isDragging.value) {
      localPosition.left = value;
    }
  },
);

watch(
  () => props.y,
  value => {
    if (typeof value === 'number' && !isDragging.value) {
      localPosition.top = value;
    }
  },
);

const wrapperStyle = computed(() => ({
  left: `${localPosition.left}px`,
  top: `${localPosition.top}px`,
  zIndex: props.z ?? 'auto',
}));

const forwardedAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

function handleMouseDown(event: MouseEvent) {
  if (props.disabled) {
    return;
  }

  startX = event.clientX;
  startY = event.clientY;
  originalLeft = localPosition.left;
  originalTop = localPosition.top;
  isDragging.value = true;

  event.preventDefault();
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value) {
    return;
  }

  const dx = event.clientX - startX;
  const dy = event.clientY - startY;

  localPosition.left = originalLeft + dx;
  localPosition.top = originalTop + dy;

  emit('dragging', {
    left: localPosition.left,
    top: localPosition.top,
    width: wrapperRef.value?.offsetWidth || 0,
    height: wrapperRef.value?.offsetHeight || 0,
  });
}

function handleMouseUp(event: MouseEvent) {
  if (!isDragging.value) return;

  isDragging.value = false;

  emit('dragstop', {
    left: localPosition.left,
    top: localPosition.top,
    width: wrapperRef.value?.offsetWidth || 0,
    height: wrapperRef.value?.offsetHeight || 0,
  });
}

</script>

<style scoped>
.drag-wrapper {
  position: fixed;
}
</style>