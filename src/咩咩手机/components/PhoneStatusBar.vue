<template>
  <div class="phone-status-bar" :style="{ backgroundColor: statusBarColor }" @click="handleStatusBarTap">
    <div class="status-left">
      <span class="time">{{ currentTime }}</span>
    </div>

    <div class="status-right" aria-hidden="true">
      <svg class="status-icon status-icon--signal" viewBox="0 0 18 12" fill="none">
        <rect x="0" y="8" width="3" height="4" rx="1" fill="#1f2330"/>
        <rect x="5" y="5" width="3" height="7" rx="1" fill="#1f2330"/>
        <rect x="10" y="2" width="3" height="10" rx="1" fill="#1f2330"/>
        <rect x="15" y="0" width="3" height="12" rx="1" fill="#1f2330"/>
      </svg>
      <svg class="status-icon status-icon--wifi" viewBox="0 0 18 14" fill="none">
        <!-- 底部圆点 -->
        <circle cx="9" cy="13" r="1.2" fill="#1f2330"/>
        <!-- 最小弧线 (内层) -->
        <path d="M6.5 10.5C7 10 8 9.5 9 9.5C10 9.5 11 10 11.5 10.5" stroke="#1f2330" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        <!-- 中等弧线 (中层) -->
        <path d="M4.5 8C5.8 6.8 7.3 6 9 6C10.7 6 12.2 6.8 13.5 8" stroke="#1f2330" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        <!-- 最大弧线 (外层) -->
        <path d="M2 5C4 3.2 6.3 2 9 2C11.7 2 14 3.2 16 5" stroke="#1f2330" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      </svg>
      <span class="status-icon status-icon--battery">
        <span class="battery-level"></span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const currentTime = ref('--:--');
const route = useRoute();
const router = useRouter();
const statusBarColor = ref('transparent');

let lastTapTimestamp = 0;
const DOUBLE_TAP_THRESHOLD = 350;

watchEffect(() => {
  statusBarColor.value = (route.meta.statusBarColor as string) || 'transparent';
});

function updateTimeDisplay(timestamp: number) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}`;
}

function navigateHome() {
  if (route.name !== 'home') {
    router.push({ name: 'home' }).catch(() => {});
  }
}

function handleStatusBarTap() {
  const now = Date.now();
  if (now - lastTapTimestamp < DOUBLE_TAP_THRESHOLD) {
    lastTapTimestamp = 0;
    navigateHome();
    return;
  }
  lastTapTimestamp = now;
}

onMounted(() => {
  void loadCurrentTime();
  void setupMvuListener();
});

async function loadCurrentTime() {
  if (typeof waitGlobalInitialized !== 'function') {
    updateTimeDisplay(Date.now());
    return;
  }

  try {
    await waitGlobalInitialized('Mvu');
    const mvuData = Mvu.getMvuData({ type: 'chat' });
    const mvuCurrentTime = Mvu.getMvuVariable(mvuData, '手机数据.当前时间', {
      default_value: Date.now(),
    });
    const timestamp =
      typeof mvuCurrentTime === 'number' ? mvuCurrentTime : Number(mvuCurrentTime);
    if (Number.isFinite(timestamp)) {
      updateTimeDisplay(timestamp);
    } else {
      updateTimeDisplay(Date.now());
    }
  } catch (error) {
    console.warn('[PhoneStatusBar] 获取当前时间失败', error);
    updateTimeDisplay(Date.now());
  }
}

async function setupMvuListener() {
  if (typeof waitGlobalInitialized !== 'function' || typeof eventOn !== 'function') {
    return;
  }

  try {
    await waitGlobalInitialized('Mvu');

    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables: Mvu.MvuData) => {
      try {
        const mvuCurrentTime = Mvu.getMvuVariable(variables, '手机数据.当前时间', {
          default_value: Date.now(),
        });
        const timestamp =
          typeof mvuCurrentTime === 'number' ? mvuCurrentTime : Number(mvuCurrentTime);
        if (Number.isFinite(timestamp)) {
          updateTimeDisplay(timestamp);
        }
      } catch (error) {
        console.warn('[PhoneStatusBar] 监听当前时间失败', error);
      }
    });
  } catch (error) {
    console.warn('[PhoneStatusBar] 设置当前时间监听失败', error);
  }
}
</script>

<style lang="scss" scoped>
.phone-status-bar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px 12px;
  color: #1f2330;
  font-weight: 600;
  letter-spacing: 0.4px;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.time {
  font-size: 18px;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.status-icon--signal {
  width: 18px;
  height: 12px;
}

.status-icon--wifi {
  width: 18px;
  height: 14px;
  transform: translateY(-1px);
}

.status-icon--battery {
  position: relative;
  width: 24px;
  height: 12px;
  border-radius: 3px;
  border: 1.6px solid rgba(47, 54, 70, 0.8);
  display: inline-flex;
  align-items: center;
  padding: 1px;
}

.status-icon--battery::after {
  content: '';
  position: absolute;
  right: -3px;
  top: 50%;
  width: 2.6px;
  height: 6px;
  border-radius: 1px;
  background: rgba(47, 54, 70, 0.8);
  transform: translateY(-50%);
}

.battery-level {
  flex: 1;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #6bd66b 0%, #41b451 100%);
}
</style>
