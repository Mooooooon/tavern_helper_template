<template>
  <div class="chat-layout">
    <header class="chat-header">
      <img src="https://via.placeholder.com/40" alt="Avatar" class="avatar">
      <div class="actions">
        <button class="add-contact">+</button>
      </div>
    </header>
    <main class="chat-content">
      <router-view></router-view>
    </main>
    <footer class="chat-footer">
      <nav>
        <router-link to="/chat/messages" class="nav-item">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
          <span>消息</span>
        </router-link>
        <router-link to="/chat/contacts" class="nav-item">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          <span>联系人</span>
        </router-link>
        <router-link to="/chat/moments" class="nav-item">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          <span>动态</span>
        </router-link>
      </nav>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.chat-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f0f2f5;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.add-contact {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.chat-footer {
  border-top: 1px solid #e0e0e0;
  background-color: #fff;
  padding: 4px 0;
}

nav {
  display: flex;
  justify-content: space-around;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #888;
  font-size: 12px;
  gap: 2px;
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.nav-item.router-link-exact-active {
  color: #1d93ff;
}
</style>
