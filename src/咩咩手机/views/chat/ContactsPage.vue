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
import { computed, onMounted, ref } from 'vue';
import { getAvatarSrc, resolveAvatar } from '../../utils/avatarPlaceholder';

interface Contact {
  id: number;
  userId: string;
  signature: string;
  avatar?: string;
  contactName: string; // 联系人在 MVU 变量中的名称
}

interface ContactSection {
  title: string;
  keyPrefix: string;
  items: Contact[];
}

const friends = ref<Contact[]>([]);
const mvuInitialized = ref(false);
const loadError = ref<string | null>(null);

// 从 MVU 变量加载联系人
async function loadContactsFromMvu() {
  try {
    // 等待 MVU 初始化
    await waitGlobalInitialized('Mvu');
    mvuInitialized.value = true;

    // 从聊天变量中获取 MVU 数据
    const mvuData = Mvu.getMvuData({ type: 'chat' });
    const contactsData = Mvu.getMvuVariable(mvuData, '手机数据.联系人', {
      default_value: {},
    });

    // 将 MVU 数据转换为 Contact 数组
    const contactsList: Contact[] = [];
    let idCounter = 1;

    for (const [name, info] of Object.entries(contactsData)) {
      if (typeof info === 'object' && info !== null) {
        const contactInfo = info as { 昵称?: string; 签名?: string; 头像?: string };

        const avatarUrl = resolveAvatar(contactInfo.头像);

        contactsList.push({
          id: idCounter++,
          userId: contactInfo.昵称 || name,
          signature: contactInfo.签名 || '',
          avatar: avatarUrl,
          contactName: name, // 保存原始联系人名称用于跳转
        });
      }
    }

    friends.value = contactsList;
    loadError.value = null;
  } catch (error) {
    console.error('加载联系人失败:', error);
    loadError.value = '联系人加载失败';
    friends.value = [];
  }
}

// 监听 MVU 变量更新
async function setupMvuListener() {
  try {
    await waitGlobalInitialized('Mvu');

    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables: Mvu.MvuData) => {
      try {
        const contactsData = Mvu.getMvuVariable(variables, '手机数据.联系人', {
          default_value: {},
        });

        const contactsList: Contact[] = [];
        let idCounter = 1;

        for (const [name, info] of Object.entries(contactsData)) {
          if (typeof info === 'object' && info !== null) {
            const contactInfo = info as { 昵称?: string; 签名?: string; 头像?: string };

            const avatarUrl = resolveAvatar(contactInfo.头像);

            contactsList.push({
              id: idCounter++,
              userId: contactInfo.昵称 || name,
              signature: contactInfo.签名 || '',
              avatar: avatarUrl,
              contactName: name, // 保存原始联系人名称用于跳转
            });
          }
        }

        friends.value = contactsList;
      } catch (error) {
        console.error('更新联系人失败:', error);
      }
    });
  } catch (error) {
    console.error('设置 MVU 监听器失败:', error);
  }
}

onMounted(() => {
  loadContactsFromMvu();
  setupMvuListener();
});

const hasContacts = computed(() => friends.value.length > 0);

const contactSections = computed<ContactSection[]>(() => {
  const sections: ContactSection[] = [];

  if (friends.value.length) {
    sections.push({
      title: '联系人',
      keyPrefix: 'friend',
      items: friends.value,
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
