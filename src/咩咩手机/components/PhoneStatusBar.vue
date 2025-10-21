<template>
  <div class="phone-status-bar">
    <div class="status-left">
      <span class="time">{{ currentTime }}</span>
    </div>

    <div class="status-right" aria-hidden="true">
      <span class="status-icon status-icon--signal"></span>
      <span class="status-icon status-icon--wifi"></span>
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
  position: relative;
}

.status-icon--signal::before,
.status-icon--signal::after {
  content: '';
  position: absolute;
  bottom: 0;
  border-radius: 1px;
  background: linear-gradient(180deg, #546073 0%, #303748 100%);
}

.status-icon--signal::before {
  left: 0;
  width: 12px;
  height: 10px;
  clip-path: polygon(0 100%, 0 20%, 25% 35%, 50% 55%, 75% 70%, 100% 20%, 100% 100%);
}

.status-icon--signal::after {
  right: 0;
  width: 3px;
  height: 12px;
}

.status-icon--wifi {
  width: 18px;
  height: 12px;
  background: conic-gradient(from 210deg, rgba(84, 96, 115, 0) 0deg, rgba(84, 96, 115, 0) 110deg, #546073 120deg, #546073 240deg, rgba(84, 96, 115, 0) 250deg);
  mask: radial-gradient(circle at 50% 150%, black 0%, black 55%, transparent 56%);
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
