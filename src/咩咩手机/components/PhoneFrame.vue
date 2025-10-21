<template>
  <div class="phone-wrapper">
    <div class="phone-container">
      <!-- 手机边框 -->
      <div class="phone-frame">
        <!-- 顶部状态栏 -->
        <PhoneStatusBar />

        <!-- 手机屏幕内容区域 -->
        <div class="phone-screen">
          <slot />
        </div>

        <!-- 底部Home按钮区域 -->
        <PhoneHomeButton />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PhoneStatusBar from './PhoneStatusBar.vue';
import PhoneHomeButton from './PhoneHomeButton.vue';
</script>

<style lang="scss" scoped>
// 样式将在后续实现
</style>
