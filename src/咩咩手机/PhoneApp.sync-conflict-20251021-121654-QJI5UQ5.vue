<template>
  <PhoneFrame>
    <router-view />
  </PhoneFrame>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import PhoneFrame from './components/PhoneFrame.vue';

onMounted(() => {
  console.log('手机UI已加载');
});
</script>

<style lang="scss">
// 全局样式将在此定义
</style>
