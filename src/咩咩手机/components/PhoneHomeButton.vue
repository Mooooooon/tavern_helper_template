<template>
  <div class="phone-home-button">
    <button @click="handleHomeClick" class="home-btn">
      <!-- Home按钮图标将在后续实现 -->
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function handleHomeClick() {
  // 返回主页
  router.push('/');
}
</script>

<style lang="scss" scoped>
// 样式将在后续实现
</style>
