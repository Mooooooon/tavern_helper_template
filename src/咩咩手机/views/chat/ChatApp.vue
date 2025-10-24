<template>
  <div class="chat-app">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// 定义发射事件
const emit = defineEmits<{
  navigate: [page: string]
}>();
</script>

<style scoped>
.chat-app {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>
