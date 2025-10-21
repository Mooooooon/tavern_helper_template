<template>
  <div class="contacts-page">
    <div v-for="i in 30" :key="i" class="contact-item">
      <img src="https://via.placeholder.com/40" alt="avatar">
      <div class="contact-name">联系人 {{ i }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.contacts-page {
  padding: 10px;
}
.contact-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.contact-item img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.contact-name {
  font-weight: bold;
}
</style>
