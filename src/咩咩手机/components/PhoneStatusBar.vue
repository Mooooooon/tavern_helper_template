<template>
  <div class="phone-status-bar">
    <!-- 左侧：时间显示 -->
    <div class="status-left">
      <span class="time">{{ currentTime }}</span>
    </div>

    <!-- 右侧：信号、WiFi、电量等图标 -->
    <div class="status-right">
      <!-- 图标将在后续实现 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

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
// 样式将在后续实现
</style>
