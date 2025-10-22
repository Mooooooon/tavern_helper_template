<template>
  <div
    ref="phoneWrapperRef"
    class="phone-wrapper"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <div class="phone-container">
      <div class="phone-frame">
        <div class="phone-notch">
          <span class="phone-notch__speaker"></span>
          <span class="phone-notch__camera"></span>
        </div>

        <div
          class="phone-frame__inner"
          @touchstart.passive="handleTouchStart"
          @touchend="handleRouteTouchEnd"
        >
          <div ref="dragHandleRef" class="drag-handle">
            <PhoneStatusBar />
          </div>
          <div class="phone-screen">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import $ from 'jquery';
import PhoneStatusBar from './PhoneStatusBar.vue';
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const route = useRoute();

// 拖动相关
const phoneWrapperRef = ref<HTMLElement>();
const dragHandleRef = ref<HTMLElement>();

let isDragging = false;
let startX = 0;
let startY = 0;
let initialLeft = 0;
let initialTop = 0;
let isTouchEvent = false;
const dragThreshold = 5;

// 开始拖动
const startDrag = (e: MouseEvent | TouchEvent) => {
  if (!phoneWrapperRef.value || !dragHandleRef.value) return;

  // 只在拖动手柄区域才能拖动
  const target = e.target as HTMLElement;
  if (!dragHandleRef.value.contains(target)) {
    return;
  }

  e.preventDefault();
  isDragging = true;
  isTouchEvent = e.type === 'touchstart';

  // 获取起始坐标
  if (isTouchEvent && 'touches' in e && e.touches.length > 0) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  } else if ('clientX' in e) {
    startX = e.clientX;
    startY = e.clientY;
  }

  initialLeft = phoneWrapperRef.value.offsetLeft;
  initialTop = phoneWrapperRef.value.offsetTop;

  // 绑定全局移动和结束事件
  if (isTouchEvent) {
    $('body').on('touchmove', onDrag as any);
    $('body').on('touchend', stopDrag as any);
  } else {
    $('body').on('mousemove', onDrag as any);
    $('body').on('mouseup', stopDrag as any);
  }
};

// 拖动中
const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging || !phoneWrapperRef.value) return;

  let currentX, currentY;
  if (isTouchEvent && 'touches' in e && e.touches.length > 0) {
    currentX = e.touches[0].clientX;
    currentY = e.touches[0].clientY;
  } else if ('clientX' in e) {
    currentX = e.clientX;
    currentY = e.clientY;
  } else {
    return;
  }

  const dx = currentX - startX;
  const dy = currentY - startY;

  // 超过阈值才移动
  if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
    phoneWrapperRef.value.style.left = `${initialLeft + dx}px`;
    phoneWrapperRef.value.style.top = `${initialTop + dy}px`;
  }

  e.preventDefault();
};

// 停止拖动
const stopDrag = () => {
  isDragging = false;
  $('body').off('mousemove touchmove', onDrag as any);
  $('body').off('mouseup touchend', stopDrag as any);

  // 保存位置到 localStorage
  if (phoneWrapperRef.value) {
    const position = {
      left: phoneWrapperRef.value.offsetLeft,
      top: phoneWrapperRef.value.offsetTop,
    };
    localStorage.setItem('phone-position', JSON.stringify(position));
  }
};

// 初始化位置
onMounted(() => {
  if (phoneWrapperRef.value) {
    // 尝试从 localStorage 读取保存的位置
    const savedPosition = localStorage.getItem('phone-position');
    let left, top;

    if (savedPosition) {
      try {
        const position = JSON.parse(savedPosition);
        left = position.left;
        top = position.top;
      } catch {
        // 解析失败则使用默认位置
        left = Math.max(20, (window.innerWidth - 390) / 2);
        top = 20;
      }
    } else {
      // 没有保存的位置，使用默认居中位置
      left = Math.max(20, (window.innerWidth - 390) / 2);
      top = 20;
    }

    phoneWrapperRef.value.style.left = `${left}px`;
    phoneWrapperRef.value.style.top = `${top}px`;
  }
});

// 路由滑动相关（用于返回主页的手势）
let routeStartX = 0;
let routeStartY = 0;
let touchStartTime = 0;

function handleTouchStart(event: TouchEvent) {
  const touch = event.touches[0];
  routeStartX = touch.clientX;
  routeStartY = touch.clientY;
  touchStartTime = Date.now();
}

function handleRouteTouchEnd(event: TouchEvent) {
  if (route.path === '/') {
    return;
  }

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - routeStartX;
  const deltaY = touch.clientY - routeStartY;
  const duration = Date.now() - touchStartTime;

  if (duration > 600) return;
  if (Math.abs(deltaY) > 80) return;
  if (Math.abs(deltaX) < 70) return;

  router.push('/');
}
</script>

<style lang="scss" scoped>
.phone-wrapper {
  position: fixed;
  background: transparent;
  pointer-events: none; // 允许点击穿透
  z-index: 1000;
  width: min(390px, calc(100vw - 32px));
  max-width: 390px;
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
  pointer-events: auto; // 恢复手机本身的点击交互
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
