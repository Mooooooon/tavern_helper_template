<template>
  <DraggableWrapper
    class="phone-wrapper"
    :x="currentX"
    :y="currentY"
    :z="1000"
    drag-handle="drag-handle"
    @dragging="handleDrag"
    @dragstop="handleDragStop"
  >
    <div class="phone-container">
      <div class="phone-frame">
        <div class="phone-notch">
          <span class="phone-notch__speaker"></span>
          <span class="phone-notch__camera"></span>
        </div>

        <div
          class="phone-frame__inner"
        >
          <div class="drag-handle">
            <PhoneStatusBar
              :current-page="currentPage"
              :status-bar-color="statusBarColor"
              @navigate="emit('navigate', $event)"
            />
          </div>
          <div class="phone-screen">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </DraggableWrapper>
</template>

<script setup lang="ts">
import DraggableWrapper from './DraggableWrapper.vue';
import PhoneStatusBar from './PhoneStatusBar.vue';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  currentPage?: string
  statusBarColor?: string
}>();

const emit = defineEmits<{
  navigate: [page: string]
}>();

type DragRect = {
  left: number
  top: number
  width: number
  height: number
};

const DEFAULT_MARGIN = 20;
const MAX_PHONE_WIDTH = 390;

const position = ref({
  left: DEFAULT_MARGIN,
  top: DEFAULT_MARGIN,
});

const currentX = computed(() => position.value.left);
const currentY = computed(() => position.value.top);

function getEffectivePhoneWidth(): number {
  const viewportWidth = window.innerWidth;
  const minGap = DEFAULT_MARGIN * 2;
  return Math.min(MAX_PHONE_WIDTH, Math.max(0, viewportWidth - minGap));
}

function getInitialPosition() {
  const width = getEffectivePhoneWidth();
  const viewportWidth = window.innerWidth || width;
  const left = Math.max(DEFAULT_MARGIN, (viewportWidth - width) / 2);
  const top = DEFAULT_MARGIN;
  return { left, top };
}

function applyPosition(next: { left?: number; top?: number }) {
  position.value = {
    left: typeof next.left === 'number' ? next.left : position.value.left,
    top: typeof next.top === 'number' ? next.top : position.value.top,
  };
}

function handleDrag(rect: DragRect) {
  applyPosition({ left: rect.left, top: rect.top });
}

function handleDragStop(rect: DragRect) {
  handleDrag(rect);
  localStorage.setItem('phone-position', JSON.stringify({
    left: rect.left,
    top: rect.top,
  }));
}

onMounted(() => {
  const savedPosition = localStorage.getItem('phone-position');
  let initial = getInitialPosition();

  if (savedPosition) {
    try {
      const parsed = JSON.parse(savedPosition) as { left?: number; top?: number };
      initial = {
        left: typeof parsed.left === 'number' ? parsed.left : initial.left,
        top: typeof parsed.top === 'number' ? parsed.top : initial.top,
      };
    } catch {
      // Ignore malformed data and fall back to the default position
    }
  }

  applyPosition(initial);
});

// 暂时禁用滑动返回主页功能，避免与拖拽冲突
// TODO: 实现更好的手势处理机制
</script>

<style lang="scss" scoped>
.phone-wrapper {
  position: fixed !important;
  background: transparent;
  z-index: 1000;
  width: min(390px, calc(100vw - 32px));
  max-width: 390px;
  pointer-events: auto;
}

.phone-container {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 18.6;
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-shrink: 0;
  filter: drop-shadow(0 24px 38px rgba(12, 20, 38, 0.32));
  pointer-events: auto;
}

.phone-container::before,
.phone-container::after {
  content: '';
  position: absolute;
  background: linear-gradient(90deg, #444954, #1c1f27);
  border-radius: 4px;
  width: 3px;
}

.phone-container::before {
  left: -6px;
  top: 24%;
  height: 60px;
  box-shadow: 0 74px 0 0 rgba(60, 65, 78, 0.85);
}

.phone-container::after {
  right: -6px;
  top: 32%;
  height: 96px;
}

.phone-frame {
  position: relative;
  flex: 1;
  border-radius: 38px;
  padding: 14px;
  background: linear-gradient(145deg, #1f2129 0%, #090a0f 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 0 0 6px rgba(30, 32, 40, 0.9),
    0 18px 45px rgba(3, 6, 12, 0.4);
  display: flex;
  align-items: stretch;
}

.drag-handle {
  cursor: move;
  user-select: none;
  pointer-events: auto;
  opacity: 1 !important;
  filter: none !important;
}

.drag-handle,
.drag-handle * {
  transition: none !important;
  opacity: 1 !important;
  filter: none !important;
}

.phone-notch {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 42%;
  height: 18px;
  background: linear-gradient(180deg, rgba(14, 16, 20, 0.95) 0%, rgba(6, 7, 10, 0.95) 100%);
  border-radius: 0 0 16px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.06);
}

.phone-notch__speaker {
  width: 50%;
  height: 4px;
  border-radius: 99px;
  background: linear-gradient(90deg, rgba(70, 76, 88, 0.9), rgba(110, 118, 130, 0.65));
}

.phone-notch__camera {
  position: relative;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #3fd4ff, #0a1a2e 70%);
  box-shadow: 0 0 6px rgba(63, 212, 255, 0.55);
}

.phone-frame__inner {
  position: relative;
  flex: 1;
  width: 100%;
  border-radius: 28px;
  background: linear-gradient(180deg, #f6f7ff 0%, #f1f3ff 50%, #e8ebff 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
}

.phone-screen {
  flex: 1;
  width: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
}
</style>