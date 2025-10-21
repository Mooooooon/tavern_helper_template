<template>
  <div class="phone-wrapper">
    <div class="phone-container">
      <div class="phone-frame">
        <div class="phone-notch">
          <span class="phone-notch__speaker"></span>
          <span class="phone-notch__camera"></span>
        </div>

        <div
          class="phone-frame__inner"
          @touchstart.passive="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <PhoneStatusBar />
          <div class="phone-screen">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PhoneStatusBar from './PhoneStatusBar.vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

let startX = 0;
let startY = 0;
let touchStartTime = 0;

function handleTouchStart(event: TouchEvent) {
  const touch = event.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  touchStartTime = Date.now();
}

function handleTouchEnd(event: TouchEvent) {
  if (route.path === '/') {
    return;
  }

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;
  const duration = Date.now() - touchStartTime;

  if (duration > 600) return;
  if (Math.abs(deltaY) > 80) return;
  if (Math.abs(deltaX) < 70) return;

  router.push('/');
}
</script>

<style lang="scss" scoped>
.phone-wrapper {
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 20px 0;
  box-sizing: border-box;
}

.phone-container {
  position: relative;
  width: min(320px, calc(100vw - 32px));
  max-width: 320px;
  aspect-ratio: 9 / 19.5;
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-shrink: 0;
  filter: drop-shadow(0 24px 38px rgba(12, 20, 38, 0.32));
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
  padding-bottom: 18px;
}

.phone-screen > * {
  width: 100%;
  min-height: 0;
  flex: 1 1 auto;
}
</style>
