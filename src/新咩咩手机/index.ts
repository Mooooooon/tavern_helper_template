import { createApp } from 'vue';
import Phone from './Phone.vue';

export function teleport_style() {
  deteleport_style();

  const styleContainer = document.createElement('div');
  styleContainer.setAttribute('script_id', getScriptId());

  document.querySelectorAll('head > style').forEach(style => {
    styleContainer.appendChild(style.cloneNode(true));
  });

  window.parent.document.head.appendChild(styleContainer);
}

export function deteleport_style() {
  const styleContainer = window.parent.document.querySelector(`head > div[script_id="${getScriptId()}"]`);
  styleContainer?.remove();
}

$(() => {
  replaceScriptButtons([{ name: '召唤手机', visible: true }]);

  setTimeout(() => {
    const $appContainer = $('<div id="mimi-phone-app"></div>');
    (window.parent as any).$(window.parent.document.body).append($appContainer);
    teleport_style();

    const phoneApp = createApp(Phone);
    const phoneInstance = phoneApp.mount($appContainer[0]) as any;

    (window as any).mimiPhoneInstance = phoneInstance;

    eventOn(getButtonEvent('召唤手机'), () => {
      phoneInstance.visible ? phoneInstance.hidePhone() : phoneInstance.showPhone();
    });

    $(window).on('pagehide', () => {
      phoneApp.unmount();
      (window.parent as any).$($appContainer).remove();
      deteleport_style();
      delete (window as any).mimiPhoneInstance;
    });
  }, 500);
});
