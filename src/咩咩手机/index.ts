import $ from 'jquery';
import { createApp, App } from 'vue';
import PhoneApp from './PhoneApp.vue';
import router from './router';
import toastr from 'toastr';

// 辅助函数：创建带script_id的div
function createScriptIdDiv(): JQuery<HTMLDivElement> {
  return $('<div>').attr('script_id', getScriptId()) as JQuery<HTMLDivElement>;
}

// 辅助函数：销毁带script_id的div
function destroyScriptIdDiv(): void {
  try {
    $(`div[script_id="${getScriptId()}"]`).remove();
  } catch {
    console.log('移除div时出现错误');
  }
}

// 样式传送函数
function teleportStyle() {
  try {
    if ($(`head > div[script_id="${getScriptId()}"]`).length > 0) {
      return;
    }
    const $div = $(`<div>`).attr('script_id', getScriptId()).append($(`head > style`, document).clone());
    $('head').append($div);
  } catch {
    console.log('移动css样式时出错');
  }
}

function deteleportStyle() {
  try {
    $(`head > div[script_id="${getScriptId()}"]`).remove();
  } catch {
    console.log('移除样式时出现错误');
  }
}

// 手机UI状态
let vueApp: App | null = null;
let isPhoneVisible = false;

// 初始化手机UI
function initPhoneUI() {
  if (vueApp) {
    console.log('手机UI已存在，跳过初始化');
    return;
  }

  console.log('开始初始化手机UI');

  try {
    // 清理可能存在的旧容器
    deteleportStyle();
    destroyScriptIdDiv();
  } catch {}

  // 创建挂载容器
  const $app = createScriptIdDiv();
  $app.css({
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '9999',
  });
  $('body').append($app);

  console.log('容器已创建');

  // 创建并挂载Vue应用
  vueApp = createApp(PhoneApp);
  vueApp.use(router);
  vueApp.mount($app[0]);

  console.log('Vue应用已挂载');

  // 传送样式到主页面
  teleportStyle();

  isPhoneVisible = true;
  toastr.success('手机UI已打开');
}

// 销毁手机UI
function destroyPhoneUI() {
  if (!vueApp) {
    console.log('手机UI不存在，跳过销毁');
    return;
  }

  console.log('开始销毁手机UI');

  try {
    // 卸载Vue应用
    vueApp.unmount();
    vueApp = null;

    // 移除样式和容器
    deteleportStyle();
    destroyScriptIdDiv();

    isPhoneVisible = false;
    toastr.info('手机UI已关闭');
  } catch (e) {
    console.error('销毁手机UI时出错:', e);
  }
}

// 切换手机UI显示状态
function togglePhoneUI() {
  console.log('togglePhoneUI 被调用，当前状态:', isPhoneVisible);
  if (isPhoneVisible) {
    destroyPhoneUI();
  } else {
    initPhoneUI();
  }
}

// 加载时注册事件
$(() => {
  console.log('脚本加载完成，开始注册按钮');

  // 注册按钮
  replaceScriptButtons([{ name: '召唤手机', visible: true }]);
  console.log('按钮已注册');

  // 注册按钮点击事件
  eventOn(getButtonEvent('召唤手机'), () => {
    console.log('召唤手机按钮被点击');
    togglePhoneUI();
  });
  console.log('按钮事件已绑定');

  toastr.success('咩咩手机脚本已加载');
});

// 卸载时清理
$(window).on('pagehide', () => {
  console.log('页面卸载，清理手机UI');
  try {
    if (vueApp) {
      vueApp.unmount();
      vueApp = null;
    }
    deteleportStyle();
    destroyScriptIdDiv();
  } catch (e) {
    console.error('卸载时清理出错:', e);
  }
});
