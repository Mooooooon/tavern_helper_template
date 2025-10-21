<template>
  <div
    v-if="props.value?.chartype != 'npc'"
    @click="onclick(props.value, props.name)"
    :data-name="props.value.name"
    class="QQ_home_usermsg"
  >
    <div class="QQ_home_head" :style="`background-image: url(${props.value.head || ''})`">
      <svg v-if="'banSend' in props.value && props.value.banSend" viewBox="0 0 1024 1024" width="40" height="40">
        <path
          d="M512 0c282.752 0 512 229.248 512 512S794.752 1024 512 1024 0 794.752 0 512 229.248 0 512 0z"
          fill="#32ABD1"
          p-id="1717"
        ></path>
        <path
          d="M512 192c176.768 0 320 143.232 320 320S688.768 832 512 832 192 688.768 192 512s143.232-320 320-320z"
          fill="#FFFFFF"
          p-id="1718"
        ></path>
        <path
          d="M576 576v-117.376h64V576h-64z m-192 0v-117.376c0-70.656 57.344-128 128-128s128 57.344 128 128h-64c0-35.328-28.672-64-64-64s-64 28.672-64 64V576h-64z"
          fill="#32ABD1"
          p-id="1719"
        ></path>
        <path
          d="M576 693.376H448a106.624 106.624 0 0 1 0-213.248h128a106.624 106.624 0 0 1 0 213.248zM512 544c-23.552 0-42.624 19.072-42.624 42.624s19.072 42.624 42.624 42.624 42.624-19.072 42.624-42.624S535.552 544 512 544z"
          fill="#32ABD1"
          p-id="1720"
        ></path>
      </svg>
    </div>
    <div style="width: 100%; display: grid; grid-template-columns: 1fr 3rem; grid-template-rows: 1fr 1fr; row-gap: 4px">
      <span
        class="QQ_home_name"
        style="color: black; display: block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden"
        ><strong>{{ props.value.name }}</strong></span
      >
      <span class="QQ_home_lasttime" style="color: #626367; justify-self: end">{{ lastTime }}</span>

      <span
        class="QQ_home_lastmsg"
        style="color: #626367; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
        >{{ lastMsg }}
      </span>
      <div class="QQ_home_usermsg_new" v-show="sharedState.QQ.chathistory[props.name]?.unread">
        {{ sharedState.QQ.chathistory[props.name]?.unread || '' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { sharedState } from '../shared-state';
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Object,
  },
  name: {
    type: String,
  },
});

function onclick(value, name) {
  sharedState.QQ.activeChatId = name;
  if (name in sharedState.QQ.chathistory) {
    sharedState.QQ.chathistory[name]['unread'] = 0;
  }
}

const lastTime = computed(() => {
  if (props.name in sharedState.QQ.chathistory === false) {
    return '';
  }

  const length = sharedState.QQ.chathistory[props.name].msgs.length;
  if (length == 0) {
    return '';
  }

  const lastMsg = sharedState.QQ.chathistory[props.name].msgs.slice(-1)[0];
  if ('time' in lastMsg) {
    return lastMsg.time;
  } else {
    return '';
  }
});

const lastMsg = computed(() => {
  if (props.name in sharedState.QQ.chathistory === false) {
    return '';
  }

  const length = sharedState.QQ.chathistory[props.name].msgs.length;
  if (length == 0) {
    return '';
  }

  const last = sharedState.QQ.chathistory[props.name].msgs.slice(-1)[0];
  if ('sender' in last) {
    if (props.value.chartype == 'Group') {
      return `${last.sender}: ${last.content}`;
    } else {
      return last.content;
    }
  } else {
    return '';
  }
});
</script>
