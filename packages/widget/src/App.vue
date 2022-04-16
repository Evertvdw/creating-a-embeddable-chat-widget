<template>
  <div class="chat-widget">
    Chat-widget
    <div>Name: {{ name }}</div>
    Messages:
    <div class="messages">
      <div v-for="(message, index) in socketStore.messages" :key="index">
        {{ message.message }}
      </div>
    </div>
    <input v-model="text" type="text" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup lang="ts">
import io from 'socket.io-client';
import { onUnmounted, ref } from 'vue';
import { useSocketStore } from './stores/socket';
import { AddClient, Message, MessageType } from '../../../types';
import { faker } from '@faker-js/faker';

const URL = 'http://localhost:5000';
const socket = io(URL);
const socketStore = useSocketStore();
const name = faker.name.firstName();
const text = ref('');

const addClient: AddClient = {
  name,
};

socket.emit('client:add', addClient);
socket.onAny((event: string, ...args) => {
  if (event.startsWith('client:')) {
    const eventName = event.slice(7);
    if (Object.hasOwn(socketStore, 'SOCKET_' + eventName)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      socketStore['SOCKET_' + eventName](...args);
    }
  }
  console.log(`[DEBUG] ${event}`, args);
});

function sendMessage() {
  const message: Message = {
    time: Date.now(),
    message: text.value,
    type: MessageType.Client,
  };
  socket.emit('client:message', message);
  text.value = '';
}

onUnmounted(() => {
  socket.off('connect_error');
});
</script>

<style lang="scss">
.chat-widget {
  background-color: #eeeeee;
  color: #111111;
}

.messages {
  padding: 16px;
}
</style>
