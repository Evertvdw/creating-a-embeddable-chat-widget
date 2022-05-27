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
          }"
        >
          <div class="message-content">
            {{ message.message }}
            <span class="message-timestamp">
              {{ date.formatDate(message.time, 'hh:mm') }}
            </span>
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
