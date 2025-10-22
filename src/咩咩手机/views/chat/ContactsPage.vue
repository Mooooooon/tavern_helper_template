<template>
  <div class="contacts-page">
    <div class="contacts-toolbar">
      <input
        v-model="searchText"
        class="search-input"
        type="search"
        placeholder="搜索联系人或备注"
      >
      <button class="toolbar-button" type="button" aria-label="添加联系人">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 5v6H6v2h6v6h2v-6h6v-2h-6V5z" />
        </svg>
      </button>
    </div>

    <div v-if="hasContacts" class="contacts-list">
      <section
        v-for="group in filteredGroups"
        :key="group.key"
        v-show="group.contacts.length"
        class="contact-group"
      >
        <header class="group-header">
          <span>{{ group.label }}</span>
        </header>
        <div class="group-content">
          <div
            v-for="contact in group.contacts"
            :key="contact.id"
            class="contact-item"
          >
            <img :src="getAvatarSrc(contact.avatar, contact.id, 42)" alt="avatar">
            <div class="contact-main">
              <span class="contact-name">{{ contact.name }}</span>
              <span v-if="contact.note" class="contact-note">{{ contact.note }}</span>
            </div>
            <span v-if="contact.status" class="contact-status">{{ contact.status }}</span>
          </div>
        </div>
      </section>
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getAvatarSrc } from '../../utils/avatarPlaceholder';

interface Contact {
  id: number;
  name: string;
  note?: string;
  status?: string;
  avatar?: string;
}

interface ContactGroup {
  key: string;
  label: string;
  contacts: Contact[];
}

const searchText = ref('');

const contactGroups = ref<ContactGroup[]>([
  {
    key: 'star',
    label: '星标好友',
    contacts: [
      { id: 1, name: '喵喵', note: '最常联系', status: '在线' },
      { id: 2, name: '小狐狸', note: '游戏搭档', status: '离线' },
    ],
  },
  {
    key: 'a',
    label: 'A',
    contacts: [
      { id: 3, name: '阿波罗', note: '项目负责人' },
      { id: 4, name: '阿狸' },
    ],
  },
  {
    key: 'c',
    label: 'C',
    contacts: [
      { id: 5, name: 'Choco', note: '咖啡店老板', status: '忙碌' },
      { id: 6, name: 'Cici', note: '插画师' },
    ],
  },
  {
    key: 's',
    label: 'S',
    contacts: [
      { id: 7, name: 'Stone', note: '健身伙伴' },
      { id: 8, name: 'Starry', status: '在线' },
    ],
  },
]);

const filteredGroups = computed(() => {
  const keyword = searchText.value.trim().toLowerCase();

  if (!keyword) {
    return contactGroups.value;
  }

  return contactGroups.value
    .map((group) => ({
      ...group,
      contacts: group.contacts.filter((contact) => {
        const text = `${contact.name} ${contact.note ?? ''} ${contact.status ?? ''}`.toLowerCase();
        return text.includes(keyword);
      }),
    }))
    .filter((group) => group.contacts.length > 0);
});

const hasContacts = computed(() =>
  filteredGroups.value.some((group) => group.contacts.length > 0),
);
</script>

<style scoped>
.contacts-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
  gap: 12px;
  background: #f6f6f7;
}

.contacts-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 9px 14px;
  border-radius: 12px;
  border: 1px solid #e0e0e2;
  background-color: #fff;
  font-size: 14px;
  color: #2c2c2e;
  transition: border-color 0.2s ease;
}

.search-input::placeholder {
  color: #9b9b9f;
}

.search-input:focus {
  outline: none;
  border-color: #1f1f1f;
}

.toolbar-button {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid #e0e0e2;
  background: #f8f8f9;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.toolbar-button:hover {
  background: #ededf0;
}

.toolbar-button svg {
  width: 18px;
  height: 18px;
}

.contacts-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scrollbar-width: none;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.contact-group {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #ededf0;
  overflow: hidden;
}

.group-header {
  padding: 10px 16px;
  background: #f5f5f6;
  font-size: 13px;
  color: #5a5a5f;
  font-weight: 600;
}

.group-content {
  display: flex;
  flex-direction: column;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f1f3;
  transition: background 0.2s ease;
}

.contact-item:last-of-type {
  border-bottom: none;
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

.contacts-list:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 999px;
}

.contacts-list:hover::-webkit-scrollbar-track {
  background: transparent;
}

.contact-item img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e5e5e8;
}

.contact-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.contact-name {
  font-weight: 600;
  font-size: 14px;
  color: #1f1f1f;
}

.contact-note {
  font-size: 12px;
  color: #5a5a5f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-status {
  font-size: 12px;
  color: #3d3d40;
  background: #ededf0;
  padding: 4px 8px;
  border-radius: 999px;
  flex-shrink: 0;
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
