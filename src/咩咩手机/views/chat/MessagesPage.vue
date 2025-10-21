<template>
  <div class="messages-page">
    <div v-for="i in 20" :key="i" class="message-item">
      <img src="https://via.placeholder.com/50" alt="avatar">
      <div class="message-details">
        <div class="name">用户 {{ i }}</div>
        <div class="last-message">这是最后一条消息...</div>
      </div>
      <div class="timestamp">10:{{ i.toString().padStart(2, '0') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.messages-page {
  padding: 10px;
}
.message-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.message-item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}
.message-details {
  flex-grow: 1;
}
.name {
  font-weight: bold;
}
.last-message {
  color: #888;
  font-size: 0.9em;
}
.timestamp {
  color: #aaa;
  font-size: 0.8em;
}
</style>
