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
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup lang="ts">
import io from 'socket.io-client';
import { AddClient, Message, MessageType } from 'types';
import { onUnmounted, ref, watch } from 'vue';
import { useSocketStore } from './stores/socket';

const props = defineProps<{
  name: string;
}>();

const URL = import.meta.env.VITE_SOCKET_URL;
const socketStore = useSocketStore();
const socket = io(URL, {
  auth: {
    clientID: socketStore.id,
  },
});

watch(
  () => socketStore.id,
  (val) => {
    socket.auth = {
      clientID: val,
    };
  }
);

const text = ref('');

const addClient: AddClient = {
  name: props.name,
};

// This will be called on the initial connection and also on reconnects
socket.on('connect', () => {
  socket.emit('client:add', addClient);
});

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
@import url('quasar/dist/quasar.prod.css');

.chat-widget {
  --q-primary: #1976d2;
  --q-secondary: #26a69a;
  --q-accent: #9c27b0;
  --q-positive: #21ba45;
  --q-negative: #c10015;
  --q-info: #31ccec;
  --q-warning: #f2c037;
  --q-dark: #1d1d1d;
  --q-dark-page: #121212;
  --q-transition-duration: 0.3s;
  --animate-duration: 0.3s;
  --animate-delay: 0.3s;
  --animate-repeat: 1;
  --q-size-xs: 0;
  --q-size-sm: 600px;
  --q-size-md: 1024px;
  --q-size-lg: 1440px;
  --q-size-xl: 1920px;

  background-color: #eeeeee;
  color: #111111;
}

.messages {
  padding: 16px;
}
</style>
