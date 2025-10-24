<template>
  <div class="home-page">
    <header class="home-header">
      <div class="home-clock">{{ currentTimeText }}</div>
      <div class="home-date">{{ currentDateText }}</div>
    </header>

    <section class="home-app-grid">
      <button class="app-card app-card--chat" type="button" @click="goChat">
        <div class="app-card__icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20,2H4A2,2,0,0,0,2,4V22l4-4H20a2,2,0,0,0,2-2V4A2,2,0,0,0,20,2Z" />
          </svg>
        </div>
        <span class="app-card__label">Chat</span>
      </button>
      <button class="app-card app-card--settings" type="button" @click="goSettings">
        <div class="app-card__icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M10.74 3.14a1.6 1.6 0 0 1 2.52 0l.66.93a1.6 1.6 0 0 0 1.61.63l1.11-.2a1.6 1.6 0 0 1 1.79 1.16l.3 1.08a1.6 1.6 0 0 0 .87 1.03l1 .45a1.6 1.6 0 0 1 .87 2.05l-.42 1.05a1.6 1.6 0 0 0 0 1.18l.42 1.05a1.6 1.6 0 0 1-.87 2.05l-1 .45a1.6 1.6 0 0 0-.87 1.03l-.3 1.08a1.6 1.6 0 0 1-1.79 1.16l-1.11-.2a1.6 1.6 0 0 0-1.61.63l-.66.93a1.6 1.6 0 0 1-2.52 0l-.66-.93a1.6 1.6 0 0 0-1.61-.63l-1.11.2a1.6 1.6 0 0 1-1.79-1.16l-.3-1.08a1.6 1.6 0 0 0-.87-1.03l-1-.45a1.6 1.6 0 0 1-.87-2.05l.42-1.05a1.6 1.6 0 0 0 0-1.18l-.42-1.05a1.6 1.6 0 0 1 .87-2.05l1-.45a1.6 1.6 0 0 0 .87-1.03l.3-1.08a1.6 1.6 0 0 1 1.79-1.16l1.11.2a1.6 1.6 0 0 0 1.61-.63zm-.04 8.86a3.3 3.3 0 1 0 3.3-3.3 3.3 3.3 0 0 0-3.3 3.3z"
            />
          </svg>
        </div>
        <span class="app-card__label">设置</span>
      </button>
    </section>

    <section class="home-dock">
      <div class="home-dock__glass">
        <button class="dock-app dock-app--phone" type="button" aria-label="电话">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7.21 3.75 8.8 3a1.9 1.9 0 0 1 2.51 1l.82 2.01a1.9 1.9 0 0 1-.51 2.11l-.83.8a11.18 11.18 0 0 0 7.1 7.1l.8-.83a1.9 1.9 0 0 1 2.11-.51l2.01.82a1.9 1.9 0 0 1 1 2.51l-.75 1.59a2.8 2.8 0 0 1-3.02 1.52c-3.9-.63-7.21-2.34-9.92-5.05s-4.42-6-5.05-9.92a2.8 2.8 0 0 1 1.53-3.02z"
            />
          </svg>
        </button>
        <button class="dock-app dock-app--message" type="button" aria-label="短信">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4.5 4h15A2.5 2.5 0 0 1 22 6.5v8A2.5 2.5 0 0 1 19.5 17H15l-3 3-3-3H4.5A2.5 2.5 0 0 1 2 14.5v-8A2.5 2.5 0 0 1 4.5 4zm0 2A.5.5 0 0 0 4 6.5v8a.5.5 0 0 0 .5.5h5.79L12 17.21 13.71 15h5.79a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5z"
            />
            <path d="M5 7h14v2H5zm0 4h9v2H5z" />
          </svg>
        </button>
        <button class="dock-app dock-app--gallery" type="button" aria-label="相册">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 4h14a2 2 0 0 1 2 2v8.78a2 2 0 0 1-.63 1.46l-3.09 2.93a2 2 0 0 1-1.37.54H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h10.91L19 15.79V6z"
            />
            <path d="M8 14.5 10.5 11l2.5 3.5 2-2.5L18 16H8zM15 8a2 2 0 1 1-2-2 2 2 0 0 1 2 2z" />
          </svg>
        </button>
        <button class="dock-app dock-app--music" type="button" aria-label="音乐">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M19 3v12.26A3.75 3.75 0 1 1 17 12V8.53l-6 1.33V17.26A3.75 3.75 0 1 1 9 12V5.75a1 1 0 0 1 .78-.98l8-1.78A1 1 0 0 1 19 4z"
            />
          </svg>
        </button>
      </div>
      <div class="home-dock__indicator"></div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '../stores/chatStore';

// 定义发射事件
const emit = defineEmits<{
  navigate: [page: string]
}>();

const chatStore = useChatStore();
const { currentTime: storeCurrentTime } = storeToRefs(chatStore);

onMounted(() => {
  void chatStore.ensureInitialized();
});

function goSettings() {
  emit('navigate', '/settings');
}

function goChat() {
  emit('navigate', '/chat');
}

function resolveTimestamp(): number {
  const value = storeCurrentTime.value;
  return typeof value === 'number' && Number.isFinite(value) ? value : Date.now();
}

const currentTimeText = computed(() => {
  const date = new Date(resolveTimestamp());
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
});

const currentDateText = computed(() => {
  const date = new Date(resolveTimestamp());
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return `${month}月${day}日 · ${weekdays[date.getDay()]}`;
});
</script>

<style lang="scss" scoped>
.home-page {
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

.home-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding-top: 12px;
}

.home-clock {
  font-size: clamp(52px, 16vw, 64px);
  line-height: 1;
  font-weight: 600;
  letter-spacing: 1px;
}

.home-date {
  font-size: 16px;
  color: rgba(32, 36, 50, 0.6);
  letter-spacing: 0.4px;
}

.home-app-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 28px 22px;
  padding-top: 16px;
  flex: 1;
  align-content: flex-start;
}

.app-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.app-card__icon {
  width: 74px;
  height: 74px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 30px rgba(49, 55, 82, 0.22);
}

.app-card__icon svg {
  width: 34px;
  height: 34px;
  fill: #ffffff;
}

.app-card--chat .app-card__icon {
  background: linear-gradient(140deg, #5b86e5 0%, #36d1dc 100%);
}

.app-card--settings .app-card__icon {
  background: linear-gradient(140deg, #65748b 0%, #434f63 60%, #2d3647 100%);
}

.app-card__label {
  font-size: 14px;
  letter-spacing: 0.4px;
  color: rgba(32, 36, 50, 0.9);
}

.home-dock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding-bottom: 6px;
}

.home-dock__glass {
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

.dock-app {
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

.dock-app:active {
  transform: scale(0.94);
}

.dock-app svg {
  width: 26px;
  height: 26px;
  fill: #ffffff;
}

.dock-app--phone {
  background: linear-gradient(150deg, #40e19d 0%, #1dbf79 100%) !important;
}

.dock-app--message {
  background: linear-gradient(150deg, #5aa9ff 0%, #306dff 100%) !important;
}

.dock-app--gallery {
  background: linear-gradient(150deg, #ff8abb 0%, #ff5f7d 100%) !important;
}

.dock-app--music {
  background: linear-gradient(150deg, #ffb064 0%, #ff7b45 100%) !important;
}

.home-dock__indicator {
  width: 110px;
  height: 5px;
  border-radius: 999px;
  background: rgba(35, 40, 55, 0.16);
}

.app-card:focus-visible,
.dock-app:focus-visible {
  outline: 2px solid rgba(88, 116, 255, 0.35);
  outline-offset: 4px;
}
</style>
