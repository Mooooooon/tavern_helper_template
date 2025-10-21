import $ from 'jquery';
import { createApp } from 'vue';
import PhoneApp from './PhoneApp.vue';
import router from './router';

// 样式传送函数
function teleport_style() {
  $(`<div>`)
    .attr('script_id', getScriptId())
    .append($(`head > style`, document).clone())
    .appendTo('head');
}

function deteleport_style() {
  $(`head > div[script_id="${getScriptId()}"]`).remove();
}

// 手机UI状态
let phoneApp: any = null;
let isPhoneVisible = false;

// 初始化手机UI
function initPhoneUI() {
  if (phoneApp) return;

  // 创建挂载容器
  const $container = $('<div>')
    .attr('id', 'phone-container')
    .appendTo('body');

  // 创建并挂载Vue应用
  const app = createApp(PhoneApp);
  app.use(router);
  phoneApp = app.mount($container[0]);

  // 传送样式到主页面
  teleport_style();

  isPhoneVisible = true;
}

// 销毁手机UI
function destroyPhoneUI() {
  if (!phoneApp) return;

  $('#phone-container').remove();
  phoneApp = null;
  deteleport_style();

  isPhoneVisible = false;
}

// 切换手机UI显示状态
function togglePhoneUI() {
  if (isPhoneVisible) {
    destroyPhoneUI();
  } else {
    initPhoneUI();
  }
}

// 加载时注册事件
$(() => {
  // 注册按钮
  replaceScriptButtons([{ name: '召唤手机', visible: true }]);

  // 注册按钮点击事件
  eventOn(getButtonEvent('召唤手机'), () => {
    togglePhoneUI();
  });
});

// 卸载时清理
$(window).on('pagehide', () => {
  destroyPhoneUI();
});
