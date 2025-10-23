<template>
  <slot></slot>
</template>

<script setup lang="ts">
// 定义发射事件
const emit = defineEmits<{
  navigate: [page: string]
}>();
</script>
