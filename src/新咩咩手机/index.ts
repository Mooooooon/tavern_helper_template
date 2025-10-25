import { createApp } from 'vue';
import Phone from './Phone.vue';

export function teleport_style() {
  deteleport_style();

  const styles = $(`head > style`, document);
  const targetJQuery = window.parent.$;

  const styleContainer = targetJQuery(`<div>`)
    .attr('script_id', getScriptId());

  styles.each((index, style) => {
    const clonedStyle = targetJQuery(style).clone();
    styleContainer.append(clonedStyle);
  });

  styleContainer.appendTo(window.parent.document.head);
}

export function deteleport_style() {
  window.parent.$(`head > div[script_id="${getScriptId()}"]`).remove();
}

$(() => {
  replaceScriptButtons([{ name: '召唤手机', visible: true }]);

  setTimeout(() => {
    const $appContainer = $('<div id="mimi-phone-app"></div>');

    window.parent.$(window.parent.document.body).append($appContainer);
    teleport_style();

    const phoneApp = createApp(Phone);
    const phoneInstance = phoneApp.mount($appContainer[0]);

    eventOn(getButtonEvent('召唤手机'), () => {
      if (phoneInstance.visible) {
        phoneInstance.hidePhone();
      } else {
        phoneInstance.showPhone();
      }
    });

    $(window).on('pagehide', () => {
      phoneApp.unmount();
      window.parent.$($appContainer).remove();
      deteleport_style();
    });
  }, 500);
});