<template>
  <div class="phone-status-bar">
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
import { onMounted, onUnmounted, ref } from 'vue';

const currentTime = ref('');

let timeInterval: number | null = null;

function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}`;
}

onMounted(() => {
  updateTime();
  timeInterval = window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style lang="scss" scoped>
.phone-status-bar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px 12px;
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
