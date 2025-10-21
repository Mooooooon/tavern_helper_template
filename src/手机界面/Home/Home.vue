<template>
  <div class="home-page">
    <div class="home-status">
      <div class="home-status__top">
        <div class="home-status__time">{{ sharedState.phone.time }}</div>
      </div>
      <div class="home-status__date">{{ dateLabel }}</div>
    </div>

    <div class="home-icons">
      <button class="home-icon home-icon--qq" type="button" @click="openApp('QQ')">
        <div class="home-icon__badge">QQ</div>
        <span class="home-icon__label">QQ</span>
      </button>

      <button class="home-icon home-icon--rednote" type="button" @click="openApp('RedNote')">
        <div class="home-icon__badge">小红书</div>
        <span class="home-icon__label">小红书</span>
      </button>

      <button class="home-icon home-icon--settings" type="button">
        <div class="home-icon__badge">
          <svg class="home-icon__symbol" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M10.325 4.317a1.5 1.5 0 0 1 3.35 0l.095.668a1.5 1.5 0 0 0 2.18 1.135l.6-.347a1.5 1.5 0 0 1 2.052.555l1.252 2.168a1.5 1.5 0 0 1-.555 2.052l-.599.347a1.5 1.5 0 0 0 0 2.27l.599.347a1.5 1.5 0 0 1 .555 2.053l-1.252 2.167a1.5 1.5 0 0 1-2.052.555l-.6-.347a1.5 1.5 0 0 0-2.18 1.135l-.095.668a1.5 1.5 0 0 1-3.35 0l-.095-.668a1.5 1.5 0 0 0-2.18-1.135l-.6.347a1.5 1.5 0 0 1-2.052-.555l-1.252-2.167a1.5 1.5 0 0 1 .555-2.053l.599-.347a1.5 1.5 0 0 0 0-2.27l-.599-.347a1.5 1.5 0 0 1-.555-2.052l1.252-2.168a1.5 1.5 0 0 1 2.052-.555l.6.347a1.5 1.5 0 0 0 2.18-1.135zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
            />
          </svg>
        </div>
        <span class="home-icon__label">设置</span>
      </button>
    </div>

    <div class="home-dock">
      <div class="home-dock__icons">
        <button class="home-dock__app home-dock__app--phone" type="button" aria-label="电话">
          <svg class="home-dock__app-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M18.36 15.7c-.82-.82-1.84-1.2-2.24-.8l-1.01 1.01c-.4.4-1.41.32-2.89-.83-1.21-.92-1.84-1.82-2.02-2.35-.18-.53-.1-.89.12-1.11l.91-.91c.4-.4.02-1.42-.8-2.24l-.69-.69c-.82-.82-1.52-1.14-2.06-.6L6.2 8.46c-.48.48-.76 1.14-.76 1.84 0 1.79 1.3 4.06 3.73 6.49 2.74 2.74 5.06 3.8 6.62 3.8.64 0 1.21-.24 1.62-.65l.47-.47c.54-.54.22-1.24-.6-2.06z"
            />
          </svg>
        </button>
        <button class="home-dock__app home-dock__app--message" type="button" aria-label="短信">
          <svg class="home-dock__app-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M20.5 4h-17A1.5 1.5 0 0 0 2 5.5v9A1.5 1.5 0 0 0 3.5 16h2.6L9 19.33a1 1 0 0 0 1.67-.74V16h9.83A1.5 1.5 0 0 0 22 14.5v-9A1.5 1.5 0 0 0 20.5 4zm-.5 2-8 5-8-5h16zm0 7h-9a1 1 0 0 0-1 1v1.38l-1.9-1.9a1 1 0 0 0-.7-.29H4V6.91l8 4.99 8-4.99V13z"
            />
          </svg>
        </button>
        <button class="home-dock__app home-dock__app--browser" type="button" aria-label="浏览器">
          <svg class="home-dock__app-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm6 10a6.58 6.58 0 0 1-.2 1.5h-3.33a15.574 15.574 0 0 0 .12-3h3.41A6.6 6.6 0 0 1 18 12zm-7.42 0a13.815 13.815 0 0 1 .17-2.49H13.3a13.848 13.848 0 0 1 .17 2.49 13.848 13.848 0 0 1-.17 2.49h-1.55A13.837 13.837 0 0 1 10.58 12zM14.41 7.5h-1.23A21.52 21.52 0 0 0 13 5.44 6.57 6.57 0 0 1 14.41 7.5zM9.78 14.5h1.23a21.52 21.52 0 0 0 .18 2.06A6.57 6.57 0 0 1 9.78 14.5zM8.67 12a15.574 15.574 0 0 0 .12 3H5.46A6.58 6.58 0 0 1 5.25 12a6.6 6.6 0 0 1 .21-1.5h3.41A15.574 15.574 0 0 0 8.67 12zM5.74 14.5h3.64A18.9 18.9 0 0 0 9.25 12a18.9 18.9 0 0 0 .13-2.5H5.74a8 8 0 0 1 0 5zm6.03-7h.46c.12.68.22 1.39.3 2.12h-1.06c.08-.73.18-1.44.3-2.12zm.46 7h-.46c-.12-.68-.22-1.39-.3-2.12h1.06c-.08.73-.18 1.44-.3 2.12zm1.03 2.06a6.57 6.57 0 0 1-1.41 2.06h1.23a21.52 21.52 0 0 0 .18-2.06zM18.26 9.5h-3.64A18.9 18.9 0 0 0 14.75 12a18.9 18.9 0 0 0-.13 2.5h3.64a8 8 0 0 1 0-5zM12 4a7.94 7.94 0 0 1 2.25.32 23.442 23.442 0 0 0-.73 1.68H10.5a23.442 23.442 0 0 0-.73-1.68A7.94 7.94 0 0 1 12 4zM9 4.4a21.52 21.52 0 0 0 .18 2.06H6.94A6.57 6.57 0 0 1 9 4.4zm-2.41 9.1h2.08A21.52 21.52 0 0 0 9 15.56 6.57 6.57 0 0 1 6.59 13.5zM12 20a8 8 0 0 1-2.25-.32 23.442 23.442 0 0 0 .73-1.68h2.62a23.442 23.442 0 0 0 .73 1.68A7.94 7.94 0 0 1 12 20zm3-1.4a21.52 21.52 0 0 0 .18-2.06h2.08A6.57 6.57 0 0 1 15 18.6z"
            />
          </svg>
        </button>
        <button class="home-dock__app home-dock__app--camera" type="button" aria-label="相机">
          <svg class="home-dock__app-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M20 6h-2.17l-.72-1.45A2 2 0 0 0 15.3 3H8.7a2 2 0 0 0-1.81 1.11L6.17 6H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm0 13H4V8h3.05l1.1-2.21a.5.5 0 0 1 .45-.29h6.8a.5.5 0 0 1 .45.29L16.95 8H20z"
            />
            <path d="M12 9.5A4.5 4.5 0 1 0 16.5 14 4.51 4.51 0 0 0 12 9.5zm0 7A2.5 2.5 0 1 1 14.5 14 2.5 2.5 0 0 1 12 16.5z" />
          </svg>
        </button>
      </div>
      <div class="home-dock__indicator"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { sharedState } from '../shared-state';

type AppName = 'QQ' | 'RedNote';

const dateLabel = ref(buildDateLabel());
let timer: number | undefined;

onMounted(() => {
  timer = window.setInterval(() => {
    dateLabel.value = buildDateLabel();
  }, 60 * 1000);
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const openApp = (app: AppName) => {
  sharedState.phone.activeApp = app;
};

function buildDateLabel() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return `${month}月${day}日 · ${weekdays[now.getDay()]}`;
}
</script>

<style scoped>
.home-page {
  width: 100%;
  height: 100%;
  padding: 36px 20px 44px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(180deg, #f5f6ff 0%, #ffffff 60%, #f2f4ff 100%);
}

.home-status {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #1f1f1f;
}

.home-status__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.home-status__time {
  font-size: 60px;
  font-weight: 600;
  letter-spacing: 1px;
}

.home-status__date {
  font-size: 16px;
  color: #6d6d6d;
}

.home-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 32px 24px;
  margin-top: 16px;
  flex: 1;
  justify-content: flex-start;
  align-content: flex-start;
}

.home-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.home-icon:focus-visible {
  outline: 2px solid rgba(24, 144, 255, 0.4);
  outline-offset: 4px;
  border-radius: 20px;
}

.home-icon__badge {
  width: 72px;
  height: 72px;
  min-width: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 1px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.1);
  color: #ffffff;
}

.home-icon__symbol {
  width: 30px;
  height: 30px;
  fill: #ffffff;
}

.home-icon--settings .home-icon__badge {
  background: linear-gradient(150deg, #a9b4c6 0%, #5e6a7a 90%);
}

.home-icon--qq .home-icon__badge {
  background: linear-gradient(150deg, #2eb5ff 0%, #007bea 80%);
}

.home-icon--rednote .home-icon__badge {
  background: linear-gradient(150deg, #ff6178 0%, #f32045 90%);
}

.home-icon__label {
  font-size: 14px;
  color: #353535;
  letter-spacing: 0.5px;
}

.home-dock {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
}

.home-dock__icons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.home-dock__indicator {
  width: 120px;
  height: 5px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.1);
}

.home-dock__app {
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.14);
  transition: transform 0.15s ease;
}

.home-dock__app:active {
  transform: scale(0.96);
}

.home-dock__app-icon {
  width: 26px;
  height: 26px;
  fill: #ffffff;
}

.home-dock__app--phone {
  background: linear-gradient(150deg, #3ddc97 0%, #00a86b 90%);
}

.home-dock__app--message {
  background: linear-gradient(150deg, #4facfe 0%, #00f2fe 90%);
}

.home-dock__app--browser {
  background: linear-gradient(150deg, #7f53ac 0%, #647dee 90%);
}

.home-dock__app--camera {
  background: linear-gradient(150deg, #ff9966 0%, #ff5e62 90%);
}
</style>
