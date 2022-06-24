<template>
  <div class="chat-messages">
    <div class="chat-messages-top"></div>
    <div class="chat-messages-content">
      <div ref="chatContainer" class="chat-messages-container">
        <div
          v-for="(message, index) in socketStore.messages"
          :key="index"
          :class="{
            'message-send': message.type === MessageType.Client,
            'message-received': message.type === MessageType.Admin,
            'message-first': firstMessage(index, message),
          }"
        >
          <q-avatar
            v-if="
              message.type === MessageType.Admin && firstMessage(index, message)
            "
            size="32px"
            class="q-mr-md message-avatar"
          >
            <img :src="adminAvatar(message)" />
          </q-avatar>
          <div class="message-content">
            {{ message.message }}
            <span class="message-timestamp">
              {{ date.formatDate(message.time, 'hh:mm') }}
            </span>
          </div>
        </div>
        <div v-if="socketStore.adminTyping" class="message-received">
          <div class="message-content">
            <IsTyping />
          </div>
        </div>
      </div>
    </div>
    <div
      class="chat-messages-bottom row q-px-lg q-py-sm items-start justify-between"
    >
      <q-input
        v-model="text"
        borderless
        dense
        placeholder="Write a reply..."
        autogrow
        class="fit"
        @keydown.enter.prevent.exact="sendMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Socket } from 'socket.io-client';
import { Message, MessageType } from 'types';
import { inject, nextTick, ref, watch } from 'vue';
import { useSocketStore } from '../stores/socket';
import { date } from 'quasar';
import IsTyping from './IsTyping.vue';

const text = ref('');
const socket = inject('socket') as Socket;
const socketStore = useSocketStore();
const chatContainer = ref<HTMLDivElement | null>(null);

function scrollToBottom() {
  nextTick(() => {
    chatContainer.value?.scrollIntoView({ block: 'end' });
  });
}

watch(
  socketStore.messages,
  () => {
    scrollToBottom();
  },
  {
    immediate: true,
  }
);

watch(text, (val) => {
  socket.emit('client:typing', val);
});

watch(
  () => socketStore.adminTyping,
  () => {
    scrollToBottom();
  }
);

function firstMessage(index: number, message: Message) {
  if (index > 0) {
    return (
      socketStore.messages[index - 1].type !== message.type ||
      socketStore.messages[index - 1].adminName !== message.adminName
    );
  }
  return true;
}

function adminAvatar(message: Message) {
  const admin = socketStore.adminList.find(
    (admin) => admin.name === message.adminName
  );
  if (admin) return admin.image;
  else return '';
}

function sendMessage() {
  const message: Message = {
    time: Date.now(),
    message: text.value,
    type: MessageType.Client,
  };
  socket.emit('client:message', message);
  text.value = '';
}
</script>
