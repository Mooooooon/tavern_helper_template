<template>
  <div class="settings-page">
    <header class="settings-header">
      <button class="settings-header__back" type="button" aria-label="返回主页" @click="goHome">
        <span class="settings-header__back-icon"></span>
      </button>
      <div>
        <h1 class="settings-header__title">设置</h1>
        <p class="settings-header__subtitle">系统偏好与设备信息</p>
      </div>
    </header>

    <main class="settings-content">
      <section class="settings-card">
        <h2 class="settings-card__title">常用</h2>
        <div class="settings-list">
          <button class="settings-item" type="button">
            <span class="settings-item__icon settings-item__icon--wifi"></span>
            <div class="settings-item__info">
              <span class="settings-item__label">Wi-Fi</span>
              <span class="settings-item__desc">咩咩的热点</span>
            </div>
            <span class="settings-item__chevron"></span>
          </button>
          <button class="settings-item" type="button">
            <span class="settings-item__icon settings-item__icon--bluetooth"></span>
            <div class="settings-item__info">
              <span class="settings-item__label">蓝牙</span>
              <span class="settings-item__desc">已连接「Mimi AirPods」</span>
            </div>
            <span class="settings-item__chevron"></span>
          </button>
          <label class="settings-item settings-item--toggle">
            <span class="settings-item__icon settings-item__icon--airdrop"></span>
            <div class="settings-item__info">
              <span class="settings-item__label">飞行模式</span>
            </div>
            <input v-model="toggles.airMode" class="settings-toggle__input" type="checkbox" />
            <span class="settings-toggle">
              <span class="settings-toggle__thumb"></span>
            </span>
          </label>
        </div>
      </section>

      <section class="settings-card">
        <h2 class="settings-card__title">个人</h2>
        <div class="settings-list">
          <label class="settings-item settings-item--toggle">
            <span class="settings-item__icon settings-item__icon--notifications"></span>
            <div class="settings-item__info">
              <span class="settings-item__label">通知</span>
              <span class="settings-item__desc">已开启</span>
            </div>
            <input v-model="toggles.notifications" class="settings-toggle__input" type="checkbox" />
            <span class="settings-toggle">
              <span class="settings-toggle__thumb"></span>
            </span>
          </label>
          <label class="settings-item settings-item--toggle">
            <span class="settings-item__icon settings-item__icon--dark"></span>
            <div class="settings-item__info">
              <span class="settings-item__label">深色模式</span>
              <span class="settings-item__desc">跟随系统</span>
            </div>
            <input v-model="toggles.darkMode" class="settings-toggle__input" type="checkbox" />
            <span class="settings-toggle">
              <span class="settings-toggle__thumb"></span>
            </span>
          </label>
          <button class="settings-item" type="button">
            <span class="settings-item__icon settings-item__icon--privacy"></span>
            <div class="settings-item__info">
              <span class="settings-item__label">隐私与安全</span>
              <span class="settings-item__desc">密码、人脸识别、定位</span>
            </div>
            <span class="settings-item__chevron"></span>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const toggles = reactive({
  airMode: false,
  notifications: true,
  darkMode: false,
});

function goHome() {
  router.push('/');
}
</script>

<style lang="scss" scoped>
.settings-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 26px 22px 32px;
  box-sizing: border-box;
  gap: 22px;
  background: linear-gradient(180deg, rgba(246, 248, 255, 0.86) 0%, rgba(240, 243, 255, 0.94) 100%);
  color: #1e2332;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.settings-header__back {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 8px 18px rgba(92, 104, 141, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
}

.settings-header__back-icon {
  width: 10px;
  height: 10px;
  border-left: 2px solid rgba(31, 35, 50, 0.8);
  border-bottom: 2px solid rgba(31, 35, 50, 0.8);
  transform: rotate(45deg);
  margin-left: 2px;
}

.settings-header__title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.settings-header__subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: rgba(30, 35, 50, 0.6);
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 6px;
  scrollbar-width: none;
}

.settings-content::-webkit-scrollbar {
  display: none;
}

.settings-card {
  background: rgba(255, 255, 255, 0.88);
  border-radius: 22px;
  padding: 18px 16px 14px;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.65),
    0 16px 30px rgba(106, 122, 170, 0.16);
}

.settings-card__title {
  margin: 0 0 14px;
  font-size: 15px;
  letter-spacing: 0.5px;
  color: rgba(30, 35, 50, 0.6);
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.settings-item {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(243, 246, 255, 0.9);
  border: none;
  box-shadow: 0 12px 22px rgba(124, 141, 187, 0.16);
  cursor: pointer;
}

.settings-item--toggle {
  cursor: default;
}

.settings-item__icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.settings-item__icon::before {
  content: '';
  width: 18px;
  height: 18px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.settings-item__icon--wifi {
  background: linear-gradient(150deg, #59b5ff 0%, #296dff 100%);
}

.settings-item__icon--wifi::before {
  mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 18.5a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 12 18.5Zm5.26-2.24a9.11 9.11 0 0 0-10.52 0 1 1 0 0 0 1.16 1.64 7.11 7.11 0 0 1 8.2 0 1 1 0 1 0 1.16-1.64Zm3.39-3.7a13.49 13.49 0 0 0-17.3 0A1 1 0 0 0 4.9 14a11.5 11.5 0 0 1 14.2 0A1 1 0 1 0 20.65 12.56ZM24 9.11A18 18 0 0 0 0 9.11a1 1 0 0 0 1.32 1.51 16 16 0 0 1 21.36 0A1 1 0 1 0 24 9.11Z' fill='white'/%3E%3C/svg%3E") center/contain no-repeat;
  background: white;
}

.settings-item__icon--bluetooth {
  background: linear-gradient(150deg, #6a80ff 0%, #3b47ff 100%);
}

.settings-item__icon--bluetooth::before {
  mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.71 12 16.36 8.35a1 1 0 0 0-.25-1.62l-5-2.5A1 1 0 0 0 10 5.15v5.29l-2.12-2.12-1.41 1.41L11 14l-4.54 4.54 1.41 1.41L10 17.83v5.32a1 1 0 0 0 1.12 1l5-1a1 1 0 0 0 .26-1.8Z' fill='white'/%3E%3C/svg%3E") center/contain no-repeat;
  background: white;
}

.settings-item__icon--airdrop {
  background: linear-gradient(150deg, #ffa563 0%, #ff7a3b 100%);
}

.settings-item__icon--airdrop::before {
  mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 21a2 2 0 1 0-2-2 2 2 0 0 0 2 2Zm0-8a6 6 0 1 0 6 6 6 6 0 0 0-6-6ZM2 11.87A10 10 0 0 1 12 2a10 10 0 0 1 10 9.87 1 1 0 0 1-2 .06 8 8 0 0 0-16 0 1 1 0 0 1-2-.07Z' fill='white'/%3E%3C/svg%3E") center/contain no-repeat;
  background: white;
}

.settings-item__icon--notifications {
  background: linear-gradient(150deg, #ee6b88 0%, #d83b6a 100%);
}

.settings-item__icon--notifications::before {
  mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm9-6a1 1 0 0 1-1 1H4a1 1 0 0 1-.86-1.49C3.89 13.81 5 11.88 5 9V8a7 7 0 0 1 14 0v1c0 2.88 1.11 4.81 1.86 7.51A1 1 0 0 1 21 16Z' fill='white'/%3E%3C/svg%3E") center/contain no-repeat;
  background: white;
}

.settings-item__icon--dark {
  background: linear-gradient(150deg, #4f64ff 0%, #2e3aff 100%);
}

.settings-item__icon--dark::before {
  mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20.39 13A8.38 8.38 0 0 1 12 21.4a8.49 8.49 0 0 1-4.32-1.17A9 9 0 1 1 19.63 4.76 7 7 0 0 0 20.39 13Z' fill='white'/%3E%3C/svg%3E") center/contain no-repeat;
  background: white;
}

.settings-item__icon--privacy {
  background: linear-gradient(150deg, #63d7ff 0%, #3080ff 100%);
}

.settings-item__icon--privacy::before {
  mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v3h6V7a3 3 0 0 0-3-3Z' fill='white'/%3E%3C/svg%3E") center/contain no-repeat;
  background: white;
}

.settings-item__info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.settings-item__label {
  font-size: 15px;
  color: rgba(30, 35, 50, 0.88);
}

.settings-item__desc {
  font-size: 12px;
  color: rgba(30, 35, 50, 0.55);
}

.settings-item__chevron {
  margin-left: auto;
  width: 8px;
  height: 8px;
  border-right: 2px solid rgba(31, 35, 50, 0.35);
  border-top: 2px solid rgba(31, 35, 50, 0.35);
  transform: rotate(45deg);
}

.settings-toggle__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.settings-toggle {
  margin-left: auto;
  width: 48px;
  height: 24px;
  background: rgba(198, 204, 224, 0.7);
  border-radius: 999px;
  position: relative;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  padding: 2px;
  box-sizing: border-box;
}

.settings-toggle__thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 6px 14px rgba(107, 125, 167, 0.25);
  transition: transform 0.2s ease;
}

.settings-toggle__input:checked + .settings-toggle {
  background: linear-gradient(120deg, #5daef6 0%, #5078ff 100%);
}

.settings-toggle__input:checked + .settings-toggle .settings-toggle__thumb {
  transform: translateX(24px);
}

.settings-header__back:focus-visible,
.settings-item:focus-visible {
  outline: 2px solid rgba(92, 114, 255, 0.35);
  outline-offset: 4px;
}
</style>
