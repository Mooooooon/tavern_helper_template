<template>
  <div class="moments-page">
    <header class="moments-header">
      <button @click="$router.back()" class="back-button">&lt;</button>
      <span>动态</span>
    </header>
    <div class="profile-section">
      <img src="https://via.placeholder.com/80" alt="User Avatar" class="profile-avatar">
      <div class="profile-info">
        <div class="profile-id">我的ID</div>
        <div class="profile-bio">这是一段个人简介...</div>
      </div>
    </div>
    <main class="moments-list">
      <div v-for="i in 10" :key="i" class="moment-item">
        <div class="moment-content">这是第 {{ i }} 条动态内容...</div>
        <div class="moment-timestamp">2小时前</div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.moments-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.moments-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  text-align: center;
}

.back-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  left: 15px;
}

.moments-header span {
  flex-grow: 1;
  font-weight: bold;
}

.profile-section {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  margin-right: 15px;
}

.profile-id {
  font-size: 1.2em;
  font-weight: bold;
}

.profile-bio {
  color: #666;
  margin-top: 5px;
}

.moments-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f0f2f5;
}

.moment-item {
  background-color: #fff;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.moment-content {
  font-size: 1em;
}

.moment-timestamp {
  color: #aaa;
  font-size: 0.8em;
  margin-top: 10px;
}
</style>
