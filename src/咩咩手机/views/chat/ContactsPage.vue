<template>
  <div class="contacts-page" v-if="hasContacts">
    <div class="contacts-list">
      <div
        v-for="section in contactSections"
        :key="section.title"
        class="contact-section"
      >
        <div class="section-title">{{ section.title }}</div>
        <button
          v-for="contact in section.items"
          :key="`${section.keyPrefix}-${contact.id}`"
          class="contact-item"
          type="button"
        >
          <div class="avatar-wrapper">
            <img
              :src="getAvatarSrc(contact.avatar, contact.id, 48)"
              alt="联系人头像"
            >
          </div>
          <div class="contact-details">
            <span class="contact-id">{{ contact.userId }}</span>
            <span class="contact-signature">{{ contact.signature }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>

  <div v-else class="empty-state">
    <svg viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 2a7 7 0 00-7 7v3H4l2.29 2.29 2.3 2.3.7-.72.71-.71L8 12H7V9a5 5 0 0110 0v3h-1l-2 3h6l-2-3h-1V9a7 7 0 00-7-7z"
      />
    </svg>
    <p>未找到匹配的联系人</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getAvatarSrc } from '../../utils/avatarPlaceholder';

interface Contact {
  id: number;
  userId: string;
  signature: string;
  avatar?: string;
}

interface ContactSection {
  title: string;
  keyPrefix: string;
  items: Contact[];
}

const friends = ref<Contact[]>([
  {
    id: 1,
    userId: 'meow_meow',
    signature: '最喜欢和你一起冒险的喵～',
  },
  {
    id: 2,
    userId: 'luna_fox',
    signature: '夜色中总有光亮',
  },
  {
    id: 3,
    userId: 'apollo.dev',
    signature: '代码与宇宙都充满秩序',
  },
  {
    id: 4,
    userId: 'cici.draws',
    signature: '画下每一帧的浪漫',
  },
  {
    id: 5,
    userId: 'stone.gym',
    signature: '坚持和汗水总会发光',
  },
  {
    id: 6,
    userId: 'starry_night',
    signature: '收藏银河碎片的女孩',
  },
  {
    id: 7,
    userId: 'choco.cafe',
    signature: '一杯手冲一段故事',
  },
  {
    id: 8,
    userId: 'paperplane',
    signature: '飞向远方的纸飞机',
  },
  {
    id: 9,
    userId: 'nebula.team',
    signature: '让创意缓缓落地',
  },
  {
    id: 10,
    userId: 'shepherd.mom',
    signature: '要记得按时吃饭呀',
  },
]);

const groups = ref<Contact[]>([
  {
    id: 101,
    userId: '银河探险队',
    signature: '成员 12 | 每周末出发',
  },
  {
    id: 102,
    userId: '咩咩工作室',
    signature: '灵感随时在这里爆发',
  },
  {
    id: 103,
    userId: '星云咖啡角',
    signature: '来杯拿铁，聊聊新点子',
  },
]);

const hasContacts = computed(
  () => friends.value.length > 0 || groups.value.length > 0,
);

const contactSections = computed<ContactSection[]>(() => {
  const sections: ContactSection[] = [];

  if (friends.value.length) {
    sections.push({
      title: '好友',
      keyPrefix: 'friend',
      items: friends.value,
    });
  }

  if (groups.value.length) {
    sections.push({
      title: '群组',
      keyPrefix: 'group',
      items: groups.value,
    });
  }

  return sections;
});
</script>

<style scoped>
.contacts-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 0;
  gap: 16px;
  background: #ffffff;
}

.contacts-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
  scrollbar-width: none;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.contact-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
  letter-spacing: 0.4px;
  padding: 12px 18px 6px;
}

.section-title::before {
  content: '';
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 6px solid #1f1f1f;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.contact-item:focus-visible {
  outline: 2px solid #376afc;
  outline-offset: -2px;
}

.contact-item:hover {
  background: #f8f8f9;
}

.contacts-list:hover {
  scrollbar-width: thin;
}

.contacts-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.contacts-list:hover::-webkit-scrollbar {
  width: 4px;
}

.contacts-list:hover::-webkit-scrollbar-track {
  background: transparent;
}

.contacts-list:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 999px;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar-wrapper img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e5e5e8;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.contact-id {
  font-weight: 600;
  font-size: 15px;
  color: #1f1f1f;
}

.contact-signature {
  font-size: 13px;
  color: #5a5a5f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #9b9b9f;
}

.empty-state svg {
  width: 44px;
  height: 44px;
}
</style>
