<template>
  <DraggableWrapper
    v-show="visible"
    :x="position.left"
    :y="position.top"
    :z="1000"
    drag-handle="mimi-phone-drag-handle"
    class="mimi-phone-wrapper"
    @dragging="handleDrag"
    @dragstop="handleDragStop"
  >
    <div class="mimi-phone-container">
      <div class="mimi-phone-frame">
        <div class="mimi-phone-notch">
          <span class="mimi-phone-notch__speaker"></span>
          <span class="mimi-phone-notch__camera"></span>
        </div>

        <div class="mimi-phone-frame__inner">
          <div ref="dragHandleRef" class="mimi-phone-drag-handle">
            <div class="mimi-phone-status-bar" :style="statusBarStyle" @click="handleStatusBarClick">
              <div class="mimi-phone-status-left">
                <span class="mimi-phone-time">{{ currentTimeText }}</span>
              </div>
              <div class="mimi-phone-status-right">
                <span class="mimi-phone-battery">100%</span>
              </div>
            </div>
          </div>

          <div class="mimi-phone-screen">
            <!-- Home Page -->
            <div v-show="currentView === 'home'" class="mimi-home-page">
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

            <!-- Chat Page -->
            <ChatPage v-show="currentView === 'chat'" ref="chatPageRef" @go-home="goHome" />
          </div>
        </div>
      </div>
    </div>
  </DraggableWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import ChatPage from './ChatPage.vue';
import DraggableWrapper from './DraggableWrapper.vue';

const visible = ref(false);
const currentTime = ref(Date.now());
const currentView = ref<'home' | 'chat'>('home');
const chatPageRef = ref<InstanceType<typeof ChatPage> | null>(null);
const hasLoadedTavernData = ref(false);

// 拖动功能
const DEFAULT_MARGIN = 20;
const MAX_PHONE_WIDTH = 390;

const position = ref({
  left: DEFAULT_MARGIN,
  top: DEFAULT_MARGIN,
});

// 双击返回主页功能
const lastTapTime = ref(0);
const TAP_TIMEOUT = 300; // 双击间隔时间（毫秒）

function getInitialPosition() {
  const width = getEffectivePhoneWidth();
  const viewportWidth = window.innerWidth || width;
  const left = Math.max(DEFAULT_MARGIN, (viewportWidth - width) / 2);
  const top = DEFAULT_MARGIN;
  return { left, top };
}

function getEffectivePhoneWidth(): number {
  const viewportWidth = window.innerWidth;
  const minGap = DEFAULT_MARGIN * 2;
  return Math.min(MAX_PHONE_WIDTH, Math.max(0, viewportWidth - minGap));
}

function applyPosition(next: { left?: number; top?: number }) {
  position.value = {
    left: typeof next.left === 'number' ? next.left : position.value.left,
    top: typeof next.top === 'number' ? next.top : position.value.top,
  };
}

function handleDrag(rect: { left: number; top: number; width: number; height: number }) {
  applyPosition({ left: rect.left, top: rect.top });
}

function handleDragStop(rect: { left: number; top: number; width: number; height: number }) {
  handleDrag(rect);
  localStorage.setItem(
    'mimi-phone-position',
    JSON.stringify({
      left: rect.left,
      top: rect.top,
    }),
  );
}

onMounted(() => {
  const savedPosition = localStorage.getItem('mimi-phone-position');
  let initial = getInitialPosition();

  if (savedPosition) {
    try {
      const parsed = JSON.parse(savedPosition) as { left?: number; top?: number };
      initial = {
        left: typeof parsed.left === 'number' ? parsed.left : initial.left,
        top: typeof parsed.top === 'number' ? parsed.top : initial.top,
      };
    } catch {
      // Ignore malformed data and fall back to the default position
    }
  }

  applyPosition(initial);
});

const showPhone = async () => {
  visible.value = true;
  await nextTick();
};

const hidePhone = async () => {
  visible.value = false;
};

// 暴露方法给父组件使用
defineExpose({
  showPhone,
  hidePhone,
  visible,
});

let cleanup: (() => void) | null = null;
let systemTimer: number | null = null;

onMounted(() => {
  // 启动时间监听器
  cleanup = setupTimeListener();

  // 系统时间定时器 - 只有在没有加载外部数据时才使用系统时间
  systemTimer = setInterval(() => {
    if (!hasLoadedTavernData.value) {
      currentTime.value = Date.now();
    }
  }, 1000);
});

onUnmounted(() => {
  // 在组件卸载时清理所有资源
  cleanup?.();
  if (systemTimer) {
    clearInterval(systemTimer);
    systemTimer = null;
  }
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

// 状态栏颜色计算
const statusBarColor = computed(() => {
  switch (currentView.value) {
    case 'home':
      return 'transparent';
    case 'chat':
      return '#ffffff';
    default:
      return 'transparent';
  }
});

const statusBarTextColor = computed(() => {
  switch (currentView.value) {
    case 'home':
      return '#202432';
    case 'chat':
      return '#222222';
    default:
      return '#202432';
  }
});

// 状态栏样式
const statusBarStyle = computed(() => ({
  backgroundColor: statusBarColor.value,
  color: statusBarTextColor.value,
}));

function goChat() {
  currentView.value = 'chat';
}

function goHome() {
  currentView.value = 'home';
}

// 双击顶部状态栏返回主页
function handleStatusBarClick(event: MouseEvent) {
  // 如果点击的是按钮或其子元素，不触发双击返回
  const target = event.target as HTMLElement;
  if (target.closest('button')) {
    return;
  }

  const currentTimeMs = Date.now();

  if (currentTimeMs - lastTapTime.value < TAP_TIMEOUT) {
    // 双击检测到，返回主页
    if (currentView.value !== 'home') {
      currentView.value = 'home';
    }
  }

  lastTapTime.value = currentTimeMs;
}

function goSettings() {
  // TODO: 实现设置页面
}

// 监听酒馆变量变化并更新时间
const setupTimeListener = () => {
  // 初始化时立即加载一次时间
  loadTimeFromTavern();

  let mvuListenerRemover: (() => void) | null = null;

  // 监听MVU变量变化事件
  if (typeof eventOn === 'function' && typeof Mvu !== 'undefined') {
    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, loadTimeFromTavern);
    // 尝试获取事件移除函数（如果 MVU 提供的话）
    if (typeof eventRemoveListener === 'function') {
      mvuListenerRemover = () => {
        eventRemoveListener(Mvu.events.VARIABLE_UPDATE_ENDED, loadTimeFromTavern);
      };
    }
  }

  // 设置定时检查作为备选方案（降低频率）
  const checkInterval = setInterval(() => {
    if (!hasLoadedTavernData.value) {
      loadTimeFromTavern();
    }
  }, 30000);

  // 清理函数
  return () => {
    clearInterval(checkInterval);
    // 清理 MVU 事件监听器
    mvuListenerRemover?.();
  };
};

// 从酒馆变量加载时间
const loadTimeFromTavern = async () => {
  if (hasLoadedTavernData.value) return;

  try {
    // 等待MVU初始化
    if (typeof waitGlobalInitialized === 'function') {
      await waitGlobalInitialized('Mvu');
    }

    if (typeof Mvu === 'undefined') return;

    const mvuData = Mvu.getMvuData({ type: 'chat' });
    const phoneData = Mvu.getMvuVariable(mvuData, '手机数据', { default_value: {} });

    if (phoneData && typeof phoneData === 'object' && phoneData.当前时间) {
      // 将格式化的时间字符串转换为时间戳
      const formattedTime = phoneData.当前时间;
      const timestamp = new Date(formattedTime).getTime();
      currentTime.value = isNaN(timestamp) ? Date.now() : timestamp;
      hasLoadedTavernData.value = true;
    }
  } catch (error) {
    console.warn('[Phone] 加载时间时出错:', error);
  }
};
</script>

<style lang="scss">
.mimi-phone-wrapper {
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
  overflow: hidden;
  max-width: 100%;
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
  transition: none;
}

.mimi-phone-drag-handle * {
  transition: none;
}

.mimi-phone-status-bar {
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: grab;
  user-select: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.mimi-phone-status-bar:active {
  cursor: grabbing;
}

.mimi-phone-status-bar:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.mimi-phone-status-bar:active {
  background-color: rgba(255, 255, 255, 0.1);
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
  background: linear-gradient(
    180deg,
    rgba(246, 248, 255, 0.82) 0%,
    rgba(240, 242, 255, 0.92) 60%,
    rgba(229, 233, 255, 0.96) 100%
  );
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
