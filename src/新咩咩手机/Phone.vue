<template>
  <div
    v-show="visible"
    class="mimi-phone-wrapper"
  >
    <div class="mimi-phone-container">
      <div class="mimi-phone-frame">
        <div class="mimi-phone-notch">
          <span class="mimi-phone-notch__speaker"></span>
          <span class="mimi-phone-notch__camera"></span>
        </div>

        <div class="mimi-phone-frame__inner">
          <div class="mimi-phone-drag-handle">
            <div class="mimi-phone-status-bar">
              <div class="mimi-phone-status-left">
                <span class="mimi-phone-time">{{ currentTimeText }}</span>
              </div>
              <div class="mimi-phone-status-right">
                <span class="mimi-phone-battery">100%</span>
              </div>
            </div>
          </div>

          <div class="mimi-phone-screen">
            <div class="mimi-home-page">
              <header class="mimi-home-header">
                <div class="mimi-home-clock">{{ currentTimeText }}</div>
                <div class="mimi-home-date">{{ currentDateText }}</div>
              </header>

              <section class="mimi-home-app-grid">
                <button class="mimi-app-card mimi-app-card--chat" type="button" @click="goChat">
                  <div class="mimi-app-card__icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20,2H4A2,2,0,0,0,2,4V22l4-4H20a2,2,0,0,0,2-2V4A2,2,0,0,0,20,2Z" />
                    </svg>
                  </div>
                  <span class="mimi-app-card__label">Chat</span>
                </button>
                <button class="mimi-app-card mimi-app-card--settings" type="button" @click="goSettings">
                  <div class="mimi-app-card__icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M10.74 3.14a1.6 1.6 0 0 1 2.52 0l.66.93a1.6 1.6 0 0 0 1.61.63l1.11-.2a1.6 1.6 0 0 1 1.79 1.16l.3 1.08a1.6 1.6 0 0 0 .87 1.03l1 .45a1.6 1.6 0 0 1 .87 2.05l-.42 1.05a1.6 1.6 0 0 0 0 1.18l.42 1.05a1.6 1.6 0 0 1-.87 2.05l-1 .45a1.6 1.6 0 0 0-.87 1.03l-.3 1.08a1.6 1.6 0 0 1-1.79 1.16l-1.11-.2a1.6 1.6 0 0 0-1.61.63l-.66.93a1.6 1.6 0 0 1-2.52 0l-.66-.93a1.6 1.6 0 0 0-1.61-.63l-1.11.2a1.6 1.6 0 0 1-1.79-1.16l-.3-1.08a1.6 1.6 0 0 0-.87-1.03l-1-.45a1.6 1.6 0 0 1-.87-2.05l.42-1.05a1.6 1.6 0 0 0 0-1.18l-.42-1.05a1.6 1.6 0 0 1 .87-2.05l1-.45a1.6 1.6 0 0 0 .87-1.03l.3-1.08a1.6 1.6 0 0 1 1.79-1.16l1.11.2a1.6 1.6 0 0 0 1.61-.63zm-.04 8.86a3.3 3.3 0 1 0 3.3-3.3 3.3 3.3 0 0 0-3.3 3.3z"
                      />
                    </svg>
                  </div>
                  <span class="mimi-app-card__label">设置</span>
                </button>
              </section>

              <section class="mimi-home-dock">
                <div class="mimi-home-dock__glass">
                  <button class="mimi-dock-app mimi-dock-app--phone" type="button" aria-label="电话">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M7.21 3.75 8.8 3a1.9 1.9 0 0 1 2.51 1l.82 2.01a1.9 1.9 0 0 1-.51 2.11l-.83.8a11.18 11.18 0 0 0 7.1 7.1l.8-.83a1.9 1.9 0 0 1 2.11-.51l2.01.82a1.9 1.9 0 0 1 1 2.51l-.75 1.59a2.8 2.8 0 0 1-3.02 1.52c-3.9-.63-7.21-2.34-9.92-5.05s-4.42-6-5.05-9.92a2.8 2.8 0 0 1 1.53-3.02z"
                      />
                    </svg>
                  </button>
                  <button class="mimi-dock-app mimi-dock-app--message" type="button" aria-label="短信">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M4.5 4h15A2.5 2.5 0 0 1 22 6.5v8A2.5 2.5 0 0 1 19.5 17H15l-3 3-3-3H4.5A2.5 2.5 0 0 1 2 14.5v-8A2.5 2.5 0 0 1 4.5 4zm0 2A.5.5 0 0 0 4 6.5v8a.5.5 0 0 0 .5.5h5.79L12 17.21 13.71 15h5.79a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5z"
                      />
                      <path d="M5 7h14v2H5zm0 4h9v2H5z" />
                    </svg>
                  </button>
                  <button class="mimi-dock-app mimi-dock-app--gallery" type="button" aria-label="相册">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M5 4h14a2 2 0 0 1 2 2v8.78a2 2 0 0 1-.63 1.46l-3.09 2.93a2 2 0 0 1-1.37.54H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h10.91L19 15.79V6z"
                      />
                      <path d="M8 14.5 10.5 11l2.5 3.5 2-2.5L18 16H8zM15 8a2 2 0 1 1-2-2 2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                  <button class="mimi-dock-app mimi-dock-app--music" type="button" aria-label="音乐">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M19 3v12.26A3.75 3.75 0 1 1 17 12V8.53l-6 1.33V17.26A3.75 3.75 0 1 1 9 12V5.75a1 1 0 0 1 .78-.98l8-1.78A1 1 0 0 1 19 4z"
                      />
                    </svg>
                  </button>
                </div>
                <div class="mimi-home-dock__indicator"></div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';

const visible = ref(false);
const currentTime = ref(Date.now());

const showPhone = async () => {
  visible.value = true;
  await nextTick();
};

const hidePhone = async () => {
  visible.value = false;
  await nextTick();
};

// 暴露方法给父组件使用
defineExpose({
  showPhone,
  hidePhone,
  visible
});

onMounted(() => {
  // 每秒更新时间
  const timer = setInterval(() => {
    currentTime.value = Date.now();
  }, 1000);

  // 清理定时器
  return () => clearInterval(timer);
});

const currentTimeText = computed(() => {
  const date = new Date(currentTime.value);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
});

const currentDateText = computed(() => {
  const date = new Date(currentTime.value);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return `${month}月${day}日 · ${weekdays[date.getDay()]}`;
});

function goChat() {
  // TODO: 实现导航到聊天页面
  console.log('导航到聊天页面');
}

function goSettings() {
  // TODO: 实现导航到设置页面
  console.log('导航到设置页面');
}
</script>

<style lang="scss">
.mimi-phone-wrapper {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  z-index: 999999 !important;
  pointer-events: auto !important;
  width: min(390px, calc(100vw - 32px));
  max-width: 390px;
}

.mimi-phone-container {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 18.6;
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-shrink: 0;
  filter: drop-shadow(0 24px 38px rgba(12, 20, 38, 0.32));
  pointer-events: auto;
}

.mimi-phone-container::before,
.mimi-phone-container::after {
  content: '';
  position: absolute;
  background: linear-gradient(90deg, #444954, #1c1f27);
  border-radius: 4px;
  width: 3px;
}

.mimi-phone-container::before {
  left: -6px;
  top: 24%;
  height: 60px;
  box-shadow: 0 74px 0 0 rgba(60, 65, 78, 0.85);
}

.mimi-phone-container::after {
  right: -6px;
  top: 32%;
  height: 96px;
}

.mimi-phone-frame {
  position: relative;
  flex: 1;
  border-radius: 38px;
  padding: 14px;
  background: linear-gradient(145deg, #1f2129 0%, #090a0f 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 0 0 6px rgba(30, 32, 40, 0.9),
    0 18px 45px rgba(3, 6, 12, 0.4);
  display: flex;
  align-items: stretch;
}

.mimi-phone-notch {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 42%;
  height: 18px;
  background: linear-gradient(180deg, rgba(14, 16, 20, 0.95) 0%, rgba(6, 7, 10, 0.95) 100%);
  border-radius: 0 0 16px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.06);
}

.mimi-phone-notch__speaker {
  width: 50%;
  height: 4px;
  border-radius: 99px;
  background: linear-gradient(90deg, rgba(70, 76, 88, 0.9), rgba(110, 118, 130, 0.65));
}

.mimi-phone-notch__camera {
  position: relative;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #3fd4ff, #0a1a2e 70%);
  box-shadow: 0 0 6px rgba(63, 212, 255, 0.55);
}

.mimi-phone-frame__inner {
  position: relative;
  flex: 1;
  width: 100%;
  border-radius: 28px;
  background: linear-gradient(180deg, #f6f7ff 0%, #f1f3ff 50%, #e8ebff 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
}

.mimi-phone-drag-handle {
  cursor: move;
  user-select: none;
  pointer-events: auto;
  opacity: 1 !important;
  filter: none !important;
}

.mimi-phone-drag-handle,
.mimi-phone-drag-handle * {
  transition: none !important;
  opacity: 1 !important;
  filter: none !important;
}

.mimi-phone-status-bar {
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: #202432;
}

.mimi-phone-screen {
  flex: 1;
  width: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.mimi-home-page {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px 22px 42px;
  box-sizing: border-box;
  color: #202432;
  background: linear-gradient(180deg, rgba(246, 248, 255, 0.82) 0%, rgba(240, 242, 255, 0.92) 60%, rgba(229, 233, 255, 0.96) 100%);
}

.mimi-home-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding-top: 12px;
}

.mimi-home-clock {
  font-size: clamp(52px, 16vw, 64px);
  line-height: 1;
  font-weight: 600;
  letter-spacing: 1px;
}

.mimi-home-date {
  font-size: 16px;
  color: rgba(32, 36, 50, 0.6);
  letter-spacing: 0.4px;
}

.mimi-home-app-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 28px 22px;
  padding-top: 16px;
  flex: 1;
  align-content: flex-start;
}

.mimi-app-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.mimi-app-card__icon {
  width: 74px;
  height: 74px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 30px rgba(49, 55, 82, 0.22);
}

.mimi-app-card__icon svg {
  width: 34px;
  height: 34px;
  fill: #ffffff;
}

.mimi-app-card--chat .mimi-app-card__icon {
  background: linear-gradient(140deg, #5b86e5 0%, #36d1dc 100%);
}

.mimi-app-card--settings .mimi-app-card__icon {
  background: linear-gradient(140deg, #65748b 0%, #434f63 60%, #2d3647 100%);
}

.mimi-app-card__label {
  font-size: 14px;
  letter-spacing: 0.4px;
  color: rgba(32, 36, 50, 0.9);
}

.mimi-home-dock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding-bottom: 6px;
}

.mimi-home-dock__glass {
  width: 100%;
  border-radius: 26px;
  padding: 12px 18px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(238, 242, 255, 0.82) 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.4),
    0 10px 30px rgba(90, 104, 149, 0.18);
}

.mimi-dock-app {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  box-shadow: 0 10px 22px rgba(62, 78, 130, 0.24);
  transition: transform 0.15s ease;
  padding: 0;
}

.mimi-dock-app:active {
  transform: scale(0.94);
}

.mimi-dock-app svg {
  width: 26px;
  height: 26px;
  fill: #ffffff;
}

.mimi-dock-app--phone {
  background: linear-gradient(150deg, #40e19d 0%, #1dbf79 100%) !important;
}

.mimi-dock-app--message {
  background: linear-gradient(150deg, #5aa9ff 0%, #306dff 100%) !important;
}

.mimi-dock-app--gallery {
  background: linear-gradient(150deg, #ff8abb 0%, #ff5f7d 100%) !important;
}

.mimi-dock-app--music {
  background: linear-gradient(150deg, #ffb064 0%, #ff7b45 100%) !important;
}

.mimi-home-dock__indicator {
  width: 110px;
  height: 5px;
  border-radius: 999px;
  background: rgba(35, 40, 55, 0.16);
}

.mimi-app-card:focus-visible,
.mimi-dock-app:focus-visible {
  outline: 2px solid rgba(88, 116, 255, 0.35);
  outline-offset: 4px;
}
</style>