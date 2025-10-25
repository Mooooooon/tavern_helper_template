import { createApp } from 'vue';
import Phone from './Phone.vue';

export function teleport_style() {
  deteleport_style();

  // 使用原生DOM方法避免jQuery clone()导致的unload事件警告
  const styleContainer = document.createElement('div');
  styleContainer.setAttribute('script_id', getScriptId());

  // 复制所有样式标签
  const styles = document.querySelectorAll('head > style');
  styles.forEach(style => {
    const clonedStyle = style.cloneNode(true);
    styleContainer.appendChild(clonedStyle);
  });

  // 将容器添加到父页面head
  window.parent.document.head.appendChild(styleContainer);
}

export function deteleport_style() {
  // 使用原生DOM方法保持一致性
  const styleContainer = window.parent.document.querySelector(`head > div[script_id="${getScriptId()}"]`);
  if (styleContainer) {
    styleContainer.remove();
  }
}

$(() => {
  replaceScriptButtons([{ name: '召唤手机', visible: true }]);

  setTimeout(() => {
    const $appContainer = $('<div id="mimi-phone-app"></div>');

    (window.parent as any).$(window.parent.document.body).append($appContainer);
    teleport_style();

    const phoneApp = createApp(Phone);
    const phoneInstance = phoneApp.mount($appContainer[0]) as unknown as {
      visible: boolean;
      showPhone: () => Promise<void>;
      hidePhone: () => Promise<void>;
    };

    eventOn(getButtonEvent('召唤手机'), () => {
      if (phoneInstance.visible) {
        phoneInstance.hidePhone();
      } else {
        phoneInstance.showPhone();
      }
    });

    $(window).on('pagehide', () => {
      phoneApp.unmount();
      (window.parent as any).$($appContainer).remove();
      deteleport_style();
    });
  }, 500);
});
